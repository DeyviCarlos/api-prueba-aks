import {pool} from '../db.js';
import getStream from 'into-stream'
import {getBlobName,blobService,containerName} from '../config.js'

//pagina y sistema
export const listarCategorias = async(req, res) =>{
    try{
        const [rows] = await pool.query('CALL sp_listar_categorias');

        if(rows[0].length <= 0){
            return res.status(404).json({mensaje: 'Lista de categorias vacía',data: []});
        }

        return res.status(200).json({mensaje: 'lista de categorias',data: rows[0]});

    }catch(error){
        return res.status(500).json({mensaje:'Error al listar categorias',error: error});
    }
}

//sistema
export const registrarCategoria = async(req, res) => {
    
    // console.log(req.file)
    const {nombre,descripcion} = req.body;
    
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

        // const imagen = req.file.originalname
        // // console.log("nombre de categoria: ",nombre)
        // // console.log("descripcion de categoria: ",descripcion)
        // // console.log("nombre de imagen: ",imagen)
    
        // let imagendb = "uploads/" + imagen;

        const [rows] = await pool.query("CALL sp_buscarCategoria(?)",[nombre])

        if(rows[0].length > 0){
            return res.status(404).json({mensaje: "La categoría ya existe",status: "404"})
        }

        //insertar datos a la BD
        await pool.query("CALL sp_registrarCategoria(?,?,?)",[nombre,descripcion,imagendb])

        return res.status(201).json({mensaje: "Categoría registrada",status: "201"})
    }catch(error){
        console.log(error)
        return res.status(500).json({mensaje: "No se pudo registrar la categoría",error: error})
    }
}