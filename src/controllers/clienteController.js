import {pool} from '../db.js';

export const registrarCliente = async(req,res) => {
    try{
        const { correo, contrasena,nombre , apPaterno,apMaterno } = req.body
        
        const [rows] = await pool.query('CALL sp_buscar-cliente(?)',[correo])
        if(rows[0].length >= 0){
            return res.status(404).json({mensaje: 'Cliente ya existe'})
        }

        await pool.query('CALL sp_insertar-cliente(?,?,?,?,?)',[correo,contrasena,nombre, apMaterno,apPaterno])

        return res.status(200).json({mensajes:'Registrado exitosamente'})

    }catch(error){
        return res.status(500).json({mensaje: 'Error al registras cliente', error: error})
    }
}   

export const buscarCliente = async (req,res) => {

    try{
        const {idCliente} = req.params

        const [rows] = await pool.query('CALL sp_buscar-cliente(?)',[idCliente])

        if(rows.length <= 0){
            return res.status(404).json({mensaje: 'No se encontró al cliente'})
        }

        return res.status(200).json({mensaje: 'Cliente encontrado',data: rows[0]});
    }catch(error){
        return res.status(500).json({mensaje: 'Error al buscar cliente', error: error})
    }
}

//login

