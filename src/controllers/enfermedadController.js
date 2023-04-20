import {pool} from '../db.js';
import getStream from 'into-stream'
import {getBlobName,blobService,containerName} from '../config.js'

export const listarEnfermedades = async(req, res) =>{
    try{
        const [rows] = await pool.query('CALL sp_listar_enfermedades');

        if(rows[0].length <= 0){
            return res.status(404).json({mensaje: 'Lista de enfermedades vacía',data: []});
        }

        return res.status(200).json({mensaje: 'lista de enfermedades',data: rows[0]});

    }catch(error){
        return res.status(500).json({mensaje: 'Error al listar enfermedades',error: error});
    }
}

export const registrarEnfermedad = async(req,res) =>{
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
        // // console.log("nombre de enfermedad: ",nombre)
        // // console.log("descripcion de enfermedad: ",descripcion)
        // // console.log("nombre de imagen: ",imagen)

        // let imagendb = "uploads/" + imagen;


        const [rows] = await pool.query("CALL sp_buscarEnfermedad(?)",[nombre])

        if(rows[0].length > 0){
            return res.status(404).json({mensaje: "La enfermedad ya existe",status: "404"})
        }

        //insertar datos a la BD
        await pool.query("CALL sp_registrarEnfermedad(?,?,?)",[nombre,descripcion,imagendb])

        return res.status(201).json({mensaje: "Enfermedad registrada",status: "201"})
    }catch(error){
        console.log(error)
        return res.status(500).json({mensaje: "No se pudo registrar la enfermedad",error: error})
    }
}