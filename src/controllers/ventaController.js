import {pool,db} from '../db.js';
import mysql from 'mysql2/promise';

//Registrar compra : falta completar
export const registarCompra = async(req, res) =>{

    try{
        console.log("body: "+req.body)
        console.log("params: "+req.params)
        const {direccion, telefono,idEntrega ,listaProductos,
        fecha,monto,idFactura}  = req.body;
        const idCliente = req.params;
        
        
        if(!direccion || !telefono || !fecha || !idEntrega){
            return res.status(400).json({mensaje: 'Digite o seleccione todos los campos'})
        }
        //cantidad, idproducto
        //let idfactura = 0;
        await pool.query('CALL sp_registrar_compra(?,?,?,?,?,?,?)',[idCliente,direccion,telefono,idEntrega,fecha,monto,idFactura])

        //if de id_factura
        console.log("primera pasada")
        //detalle
        for(let item of listaProductos){
            await pool.query('CALL sp_registrar_detalle(?,?,?)',[idFactura,item.idProducto,item.cantidad])
        }


        console.log("segunda pasada")
        return res.status(201).json({mensaje: 'Compra realizada'})

    }catch(error){
        return res.status(500).json({mensaje: 'Error al registrar la compra',error: error});
    }
}

//transaccion para la compra
export const createCompra = async (req, res) => {
    console.log("acceso")

    const connection = await mysql.createConnection(db);
    // await connection.execute('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');
    await connection.beginTransaction();

    const {direccion, telefono,idEntrega ,listaProductos,
    fecha,monto,idFactura,idEmpleado}  = req.body;
    const idCliente = req.params.id;
    console.log("Cliente: "+req.params.id)    
    try{

        if(!direccion || !telefono || !fecha || !idEntrega){
            await connection.commit();
            return res.status(400).json({mensaje: 'Digite o seleccione todos los campos'})
        }

        await connection.query('CALL sp_registrar_compra(?,?,?,?,?,?,?,?)',[parseInt(idCliente),idEntrega,fecha,direccion,telefono,monto,idFactura,idEmpleado])
        
        for(let item of listaProductos){
            await connection.query('CALL sp_registrar_detalle(?,?,?)',[idFactura,item.idProducto,item.cantidad])
        }

        await connection.commit();
        return res.status(201).json({mensaje: 'Compra Registrada'});
    }catch(error){
        await connection.rollback();
        return res.status(500).json({mensaje: 'Error al registrar la compra',error: error});
    }
}



//listar mis compras
export const misCompras = async(req, res) =>{

    try{
        const idCliente = req.userId
        console.log(idCliente)

        const [rows] = await pool.query('CALL sp_listar_mis_compras(?)',[parseInt(idCliente)])

        if(rows[0].length <= 0){
            return res.status(404).json({mensaje: 'La lista no tiene elementos', data: []})
        }

        return res.status(200).json({mensaje: 'Mis compras', data: rows[0], status: "200"});

    }catch(error){
        return res.status(500).json({mensaje: 'Error al listar mis compra',error: error});
    }
}



//lista de ventas
export const listarVentas = async(req, res) =>{

    try{
        const [rows] = await pool.query('CALL sp_listar_ventas')

        if(rows[0].length <= 0){
            return res.status(404).json({mensaje: 'La lista no tiene elementos', data: []})
        }

        return res.status(200).json({mensaje: 'lista de ventas', data: rows[0]});

    }catch(error){
        return res.status(500).json({mensaje: 'Error al listar las ventas',error: error});
    }
}

//buscar detalle de la orden de venta
export const buscarDetalleOrden = async(req, res) =>{
    const idOrden = req.params.id
    console.log("id de la orden: ",idOrden)
    try{
        const [rows] = await pool.query('CALL sp_buscarDetalleOrden(?)',[idOrden])

        if(rows[0].length <= 0){
            return res.status(404).json({mensaje: 'La lista no tiene elementos', data: []})
        }
        console.log("detalle: ",rows[0])
        return res.status(200).json({mensaje: 'lista del detalle de venta', data: rows[0]});

    }catch(error){
        return res.status(500).json({mensaje: 'Error al listar el detalle de la venta',error: error});
    }
}


//cambiar estado de entrega
export const cambiarEstadoEntrega = async(req, res) =>{

    try{
        const idCompra  = req.params.id;
        console.log(idCompra)
        const [rows] = await pool.query('CALL sp_buscarCompra(?)',[parseInt(idCompra)])
        if(rows[0].length <= 0){
            return res.status(404).json({mensaje: 'No se encontró la compra',data: []})
        }
        await pool.query('CALL sp_cambiar_estado_entrega(?)',[parseInt(idCompra)]);

        return res.status(200).json({mensaje: 'estado cambio a finalizado'});

    }catch(error){
        return res.status(500).json({mensaje: 'Error al cambiar de estado de entrega',error: error});
    }
}




