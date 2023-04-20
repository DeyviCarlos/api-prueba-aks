import {pool} from '../db.js';
import getStream from 'into-stream'
import {getBlobName,blobService,containerName} from '../config.js'

export const listarProductos = async(req, res) =>{
    try{
        const [rows] = await pool.query('CALL sp_listar_prod');

        if(rows[0].length <= 0){
            res.status(404).json({mensaje: 'Lista de productos vacía',data: []});
        }

        return res.status(200).json({mensaje: 'lista de productos',data: rows[0]});

    }catch(error){
        return res.status(500).json({mensaje:'Error al listar productos',error: error});
    }
}

export const buscarProductoxCategoria = async(req, res) =>{
    try{
        
        const {id} = req.params

        console.log(id)
        const [rows] = await pool.query('CALL busca_productoxcateg(?)', [id]);

        if(rows[0].length <= 0){
            return res.status(200).json({mensaje: 'Productos en esta categoría no entontrados', data: []});
        }

        return res.status(200).json({mensaje: 'Productos encontrados',data: rows[0]});

    }catch(error){
        return res.status(500).json({mensaje: 'Error al buscar los productos por categoria'});
    }
}

export const buscarProductoxEnfermedad = async(req, res) =>{
    try{
        const {id} = req.params
        const [rows] = await pool.query('CALL busca_productoxenfermedad(?)', [id]);

        if(rows[0].length <= 0){
            return res.status(200).json({mensaje: 'Productos no entontrados', data: []});
        }

        return res.status(200).json({mensaje: 'Productos encontrados',data: rows[0]});

    }catch(error){
        return res.status(500).json({mensaje: 'Error al buscar los productos por enfermedad'});
    }
}

export const buscarProductoxNombre = async(req, res) =>{
    try{
        const nombre = req.params.cadena
        console.log("Valor: ",nombre)

        const [rows] = await pool.query('CALL busca_productoxnombre(?)', [nombre]);

        if(rows[0].length <= 0){
            return res.status(200).json({mensaje: 'Productos no entontrados', data: []});
        }

        return res.status(200).json({mensaje: 'Productos encontrados',data: rows[0]});

    }catch(error){
        return res.status(500).json({mensaje: 'Error al buscar el producto'});
    }
}

export const obtenerProducto = async(req, res) =>{
    try{
        console.log(req.params)
        const {id} = req.params

        const [rows] = await pool.query('CALL sp_buscarProductoxId(?)', [id]);

        if(rows[0].length <= 0){
            return res.status(404).json({mensaje: 'Producto no entontrado', data: []});
        }

        return res.status(200).json({mensaje: 'Producto encontrado',data: rows[0]});

    }catch(error){
        return res.status(500).json({mensaje: 'Error al buscar al producto'});
    }
}


export const registrarProducto = async(req, res) => {

    const {nombre,descripcion,stock,precio,id_categoria,id_enfermedad} = req.body
    
    try{
        if(!req.file){
            return res.status(404).json({mensaje: "Debe subir la imagen",status: "404"})
        }

        //agregando los valores para insertar en Azure------------------------------------------
        //nombre del archivo a subir
        const blobName = getBlobName(req.file.originalname)
        //obtenemos el stream de ese archivo
        const stream = getStream(req.file.buffer);
        //obtenemos la longuitud de ese stream
        const streamLength = req.file.buffer.length

        blobService.createBlockBlobFromStream(containerName,blobName,stream,streamLength,err => {
            if(err){
                console.log(err);
                return;
            }
            console.log("subido exitosamente a Azure")
        })
        
        let imagendb = "uploads/" + blobName;
        //fin

        //obteniendo la imagen para insertar el nombre en la BD
        //local
        // const imagen = req.file.originalname
        // console.log("nombre de imagen: ",imagen)

        // let imagendb = "uploads/" + imagen;
        //fin

        const [rows] = await pool.query("CALL sp_buscarProducto(?)",[nombre])

        if(rows[0].length > 0){
            return res.status(404).json({mensaje: "El producto ya existe",status: "404"})
        }

        //insertar datos a la BD
        await pool.query("CALL sp_registrarProducto(?,?,?,?,?,?,?)",[nombre,descripcion,parseInt(stock),parseFloat(precio),imagendb,parseInt(id_categoria),parseInt(id_enfermedad)])

        return res.status(201).json({mensaje: "Producto registrado",status: "201"})

    }catch(error){
        return res.status(500).json({mensaje: "Error al registrar producto", error: error})
    }   

}


export const listarProductosStockMinimo = async(req,res) => {
    try{
        const [rows] = await pool.query('CALL sp_listar_prod_stockminimo');

        if(rows[0].length <= 0){
           return res.status(200).json({mensaje: 'Lista de productos vacía',data: []});
        }

        return res.status(200).json({mensaje: 'lista de productos',data: rows[0]});

    }catch(error){
        return res.status(500).json({mensaje:'Error al listar productos',error: error});
    }
}

