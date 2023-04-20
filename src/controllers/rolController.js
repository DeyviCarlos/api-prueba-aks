import {pool} from '../db.js';

export const listarRol = async(req, res) =>{
    try{
        
        const [rows] = await pool.query('CALL sp_listar_rol');

        if(rows[0].length <= 0){
            return res.status(404).json({mensaje: 'Lista de rol vacía',data: []});
        }

        return res.status(200).json({mensaje: 'lista de roles',data: rows[0]});

    }catch(error){
        return res.status(500).json({mensaje:'Error al listar los roles',error: error});
    }
}


