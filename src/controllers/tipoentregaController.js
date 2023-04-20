import {pool} from '../db.js';

export const listarTipoEntrega = async(req, res) =>{
    try{
        
        const [rows] = await pool.query('CALL sp_listar_tipo_entrega');

        if(rows[0].length <= 0){
            return res.status(404).json({mensaje: 'Lista de tipos de entrega vacía',data: []});
        }

        return res.status(200).json({mensaje: 'lista de tipos de entrega',data: rows[0]});

    }catch(error){
        return res.status(500).json({mensaje:'Error al listar los tipos de entrega',error: error});
    }
}

export const registrarTipoEntrega = async(req, res) =>{
    const {nombre} = req.body
    console.log("tipo de entrega: ",nombre)
    try{
        const [rows] = await pool.query("CALL sp_buscarTipoEntrega(?)",[nombre])

        if(rows[0].length > 0){
            return res.status(404).json({mensaje: "El tipo de entrega ya existe",status: "404"})
        }

        //insertar datos a la BD
        await pool.query("CALL sp_registrarTipoEntrega(?)",[nombre])

        return res.status(201).json({mensaje: "Tipo de entrega registrado",status: "201"})

    }catch(error){
        return res.status(500).json({mensaje: "Error al registrar tipo de entrega", error: error})
    }  
}

