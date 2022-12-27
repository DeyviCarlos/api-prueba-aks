import {pool} from '../db.js';

export const obtenerTipoEntrega = async(req, res) =>{
    try{
        const [rows] = await pool.query('CALL sp_listarTipoEntrega(?)');

        if(rows[0].length <= 0){
            res.status(404).json({mensaje: 'Lista de tipos de entrega vacía'});
        }

        return res.status(200).json({mensaje: 'lista de tipos de entrega',data: rows[0]});

    }catch(error){
        return res.status(500).json('Error al listar los tipos de entrega');
    }
}