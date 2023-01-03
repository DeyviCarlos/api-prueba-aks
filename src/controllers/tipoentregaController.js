import {pool} from '../db.js';

export const listarTipoEntrega = async(req, res) =>{
    try{
        const [rows] = await pool.query('CALL sp_listar_tipo_entrega');

        if(rows[0].length <= 0){
            res.status(404).json({mensaje: 'Lista de tipos de entrega vacía',data: []});
        }

        return res.status(200).json({mensaje: 'lista de tipos de entrega',data: rows[0]});

    }catch(error){
        return res.status(500).json({mensaje:'Error al listar los tipos de entrega',error: error});
    }
}