import {pool,db} from '../db.js';
import mysql from 'mysql2/promise';

import {blobServiceClient,containerReport,DOMINIOFILE} from '../config.js'

import path from 'path'
import { fileURLToPath } from 'url'

import fs from 'fs'
import pdf from 'html-pdf' 

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)



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

export const generarReporte = async(req,res) => {

    try{
        const id_orden = req.params.orden
        console.log("N° orden: ",id_orden)

        //plantilla
        let html = fs.readFileSync(path.join(__dirname, '../tpl/plantilla.html'), 'utf8');
        
        //obtener la venta por su id venta

        //obtener el detalle de la venta

        console.log("HTML: ",html)
        //remplasar valores
        html = html.replace("{{idOrden}}", id_orden);


        const f=new Date()
        var fecha_archivo=f.toLocaleDateString().replaceAll('/','-')
        var archivo_generado="./reportes/orden_"+id_orden+"_"+fecha_archivo+".pdf";
        var archivo_generado_azure="reportes/orden_"+id_orden+"_"+fecha_archivo+".pdf";
        var nombre_archivopdf = "orden_"+id_orden+"_"+fecha_archivo+".pdf"
        console.log("HTML: ",html)
        
        pdf.create(html).toFile(archivo_generado, (error) => {
            if (error) return res.status(500).json({mensaje:"Error al obtener el reporte", status: "500"})
            else
                console.log("PDF creado"); // { filename: '/app/businesscard.pdf' }
        });
        
        setTimeout(()=>{
            let rutaPdf = ""
            azurePdf(archivo_generado_azure).then(response => {
                rutaPdf = response;
                console.log("pdf descargado:: ",rutaPdf)
                res.set({'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename=${nombre_archivopdf}`})
                response.readableStreamBody.pipe(res);
            }).catch( error => {
                return res.status(500).json({mensaje:"Error al obtener el reporte", status: "500"})
            });
        },4000) 
    }catch(error){
        return res.status(500).json({mensaje:"Error al obtener el reporte", status: "500"})
    }
}

 const azurePdf = async (archivo_generado_azure) => {
    try{
            //subiendo pdf a Azure      
            const containerClient = blobServiceClient.getContainerClient(containerReport);

            console.log("container Azure: ",containerClient)

            // Crear el contenedor si no existe
            const createContainerResponse = await containerClient.createIfNotExists();
            if(!createContainerResponse) console.log("ya existe el contenedor")
            
            const filePath = path.join(__dirname, "../../"+archivo_generado_azure);
            console.log("Ruta del archivo: ",filePath)
            // Leer el archivo
            const fileContent = fs.readFileSync(filePath);
            console.log("Contenido del Archivo:  ",fileContent)
            // Obtener el nombre del archivo sin la ruta
            const fileName = path.basename(filePath);
            console.log("Nombre del archivo:  ",fileName)
            // Subir el archivo al contenedor en Azure
            const blockBlobClient = containerClient.getBlockBlobClient(fileName);
            const uploadResponse = await blockBlobClient.upload(fileContent, fileContent.length);
            console.log("Respuesta de subida de archivo:",uploadResponse)
            
            fs.unlink(filePath, (err) => {
                if (err) {
                  console.error(err);
                  return;
                }
              
                console.log('Archivo temporal eliminado correctamente');
            });

            //obtener el PDF del contenedor en Azure para mostrar
            // const blobName = fileName;
            // const blobClient = containerClient.getBlobClient(blobName);

            // const response = await blobClient.download();
            // const buffer = await streamToBuffer(response.readableStreamBody);
            // fs.writeFileSync('./reportes/'+fileName, buffer);
            // console.log("Buffer:",buffer)
            // return "http://localhost:4000/"+fileName;

            //obtener el PDF del contenedor en Azure para mostrar
            const blobName = fileName;
            const blobClient = containerClient.getBlobClient(blobName);

            const response = await blobClient.download();

            return response;
    }catch(err){
        console.log(err)
    }  
}

const streamToBuffer = async (readableStream) => {
    return new Promise((resolve, reject) => {
      const chunks = [];
      readableStream.on("data", (data) => {
        chunks.push(data instanceof Buffer ? data : Buffer.from(data));
      });
      readableStream.on("end", () => {
        resolve(Buffer.concat(chunks));
      });
      readableStream.on("error", reject);
    });
};

export const eliminarReporte = async(req,res) => {

    try{
        const nombreArchivo = req.params.nombre
        console.log("Nombre del pdf: ",nombreArchivo)
        const filePath = path.join(__dirname, "../../reportes/"+nombreArchivo);    
        console.log("ruta de archivo a eliminar", filePath)
        fs.unlink(filePath, (err) => {
            if (err) {
              console.error(err);
              return res.status(400).json({mensaje:"No se encontró el reporte", status: "500"});
            }
            return res.status(200).json({mensaje:'Archivo temporal eliminado correctamente'})
        });
    }catch(error){
        return res.status(500).json({mensaje:"Error al eliminar el reporte", status: "500"})
    }
}

export const infoApi = async(req,res) => {

    const rutaArchivo = path.join(__dirname, '../../ejemplo.json');
    

    fs.readFile(rutaArchivo, 'utf8', (error, data) => {
        if (error) {
            console.error('Error al leer el archivo:', error);
            return;
        }

        try {
            // Convertir el contenido del archivo JSON a un objeto JavaScript
            const jsonData = JSON.parse(data);

            // Hacer algo con los datos
            console.log(jsonData);
            return res.status(201).json({data: jsonData, status:201})
        } catch (error) {
            console.error('Error al parsear el archivo JSON:', error);
            return res.status(500).json({ mensaje: error })
        }
    });


    // const arregloObjetos = jsonDataApellidos.map((valor, indice) => {
    //     return {
    //       Apellidos: valor,
    //       Descrip_multa: Descrip_multa[indice],
    //       Descrip_fijo: Descrip_fijo[indice],
    //       Dif_agua: Dif_agua[indice],
    //       Dif_luz: Dif_luz[indice],
    //     };
    //   });
      
    //   console.log(arregloObjetos);
}
