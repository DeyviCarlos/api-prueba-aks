import {pool} from '../db.js';

export const listarCategorias = async(req, res) =>{
    try{
        const [rows] = await pool.query('CALL sp_listar_categorias');

        if(rows[0].length <= 0){
            res.status(404).json({mensaje: 'Lista de categorias vacía',data: []});
        }

        return res.status(200).json({mensaje: 'lista de categorias',data: rows[0]});

    }catch(error){
        return res.status(500).json({mensaje:'Error al listar categorias',error: error});
    }
}