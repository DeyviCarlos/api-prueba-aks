// import axios from 'axios'
import mercadopago from 'mercadopago'
import {pool,db} from '../db.js';
import mysql from 'mysql2/promise';
import { ACCESS_TOKEN_MERCADO_PAGO } from '../config.js';

export const createOrder = async(req, res) => {
    mercadopago.configure({
        access_token: ACCESS_TOKEN_MERCADO_PAGO
    });
    
    console.log(req.body)

    const connection = await mysql.createConnection(db);
    
    await connection.beginTransaction();

    const {direccion, telefono,idEntrega,fecha,items} = req.body;
    //falta idFactura
    const idCliente = req.userId;
    let monto = 0.0;

  try{
    
    let [resNumberOrden] = await connection.query("CALL sp_numberOrden")
    
    let idNumber = 0;
    if(!resNumberOrden[0][0].id){
      console.log("id de la BD: ",resNumberOrden[0][0].id)
      idNumber = idNumber + 1
    }else{
        console.log("id de la BD: ",resNumberOrden[0][0].id)
        idNumber = resNumberOrden[0][0].id + 1
    }
    console.log("idAcutal: ",idNumber);
    await pool.query("CALL sp_insertarNumberOrden(?)",[idNumber])
      
    let idOrden = idNumber;

    let ordenes = [];
    
    for(let item of items){
      let orden = {
        id: item.id_prod,
        title:item.nombre_prod,
        quantity: item.cantidad,
        currency_id:"PEN",
        unit_price: parseFloat(item.precio_prod),
        description: item.descripcion_prod
      }
      monto += orden.unit_price*orden.quantity;
      ordenes.push(orden)
    }
    console.log("Monto a pagar:"+monto)
    console.log("ID del cliente :"+idCliente)
    //Registrar Orden en la BD
    await connection.query('CALL sp_registrar_compra(?,?,?,?,?,?,?)',[parseInt(idCliente),idEntrega,fecha,direccion,telefono,monto,idOrden])

    console.log("Ordenes: ",ordenes)
    let preference = {
      items: ordenes,
      notification_url: `https://apimsananatural.azure-api.net/api/pasarela/notificacion/${idOrden}`
      ,
      back_urls: {
        success: 'https://sananatural.azurewebsites.net/mis-compras',
        failure: '',
        pending: ''
      },
      auto_return: 'approved',
      binary_mode: true
    };
    
    for(let orden of ordenes){
      await connection.query('CALL sp_registrar_detalle(?,?,?)',[idOrden,orden.id,orden.quantity])
    }

    const resmercadopago = await mercadopago.preferences.create(preference)

    await connection.commit();

    console.log("Mercado Response:",resmercadopago)
    return res.status(201).json({data: resmercadopago})
    // res.redirect(data.body.init_point)
  }catch(error){
    await connection.rollback();
    console.log("erorr: ",error)
    return res.status(404).json({error: error})
  }
  
}

export const notificacionOrden = async(req, res) => {
  //se obtiene el id de la compra
  // console.log(req.body)
  //Version 1
  // const {
  //   data,
  //   type,
  // } = req.body;

  // try {
  //   if (data.id !== "123456789" && type === "payment") {
  //   //peticion para verificar la compra
  //     const { response } = await axios.get(
  //       `https://api.mercadopago.com/v1/payments/${data.id}`,
  //       {
  //         headers: {
  //           Authorization: "Bearer " + 'TEST-3152002962230757-032817-a6d13add6541ed393d6a8895375cfe7a-1340556514',
  //         },
  //       }
  //     );
  //     if (response.status === "approved" && response.status_detail === "accredited") {

  //       //modificar el estado de la orden a pagado
  //       return res.status(200).json({message: "Compra realizada", data: response})
  //     }
  //   }
  // } catch (error) {
  //   console.log(error);
  //   res.status(404).json({error: error})
  // }
  console.log("********************************************************************")
  //Version 2
  const { query } = req;
  const topic = query.topic || query.type;
  console.log("topic: ",{topic});

  var body;
  var payment;
  switch (topic){
    case "payment":
      const paymentId = query.id || query['data.id'];
      console.log(topic,'getting payment:', paymentId)
      var {body} = await mercadopago.payment.findById(paymentId);
      console.log(body)
      var payment = await mercadopago.merchant_orders.findById(body.order.id);
      console.log("Payment switch: ",payment)
      break;
    case "merchant_order":
      const orderId = query.id;
      console.log(topic, 'getting merchant order', orderId);
      var {body} = await mercadopago.merchant_orders.findById(orderId);
      console.log("Merchant switch: ",body)
      break;
  }
  console.log("Payments :",body);

  let paidAmount = 0;
  // body.payments.forEach(payment => {
  //   if(payment.status === 'approved'){
  //     paidAmount += payment.transaction_amount;
  //   }
  // });
  if(body.status === 'approved'){
        paidAmount += body.transaction_amount;
  }

  console.log({paidAmount})
  if(payment!= null && paidAmount >= payment.body.total_amount){

    console.log('el pago se completó')
    //codigo para mandar mensaje al usuario que su compra a sido registrada y aprovada
    
    //cambio de estado de la orden a pagado
    try{
      //obtenemos el id de la orden de compra que pasa por parametro a traves del
      //endpoint de notificacion
      const idOrden = req.params.id
      const [rows] = await pool.query('CALL sp_pagoRealizado(?)',[parseInt(idOrden)])
      console.log(rows)
      if(rows.affectedRows == 1){
        console.log('El pago se actualizó Correctamente');

        const [orden_compra] = await pool.query('CALL sp_buscarDetalleOrden(?)',[parseInt(idOrden)])

        //actulizamos la cantidades compradas en la BD
        for(let detalle of orden_compra[0]){
          await pool.query('CALL sp_actualizarStock(?,?)',[detalle.id_prod,detalle.cantidad])
        }

      }
    }catch(error){
      console.log('El pago No se completó: ',error);
    }

  }else {
    console.log('El pago No se completó');
  }
  console.log("*************************************************************")

  res.send();
}

// export const capturarOrder = async(req, res) => {
   


// }



// export const cancelarOrder = async(req, res) => {




// }