import {pool} from '../db.js';

export const obtenerProductos = async(req, res) =>{
    try{
        const [rows] = await pool.query('CALL sp_listarProductos');

        if(rows[0].length <= 0){
            res.status(404).json({mensaje: 'Lista de productos vacía'});
        }

        return res.status(200).json({mensaje: 'lista de productos',data: rows[0]});

    }catch(error){
        return res.status(500).json({mensaje:'Error al listar productos'});
    }
}

export const buscarProductoxCategoria = async(req, res) =>{
    try{
        const [rows] = await pool.query('CALL sp_buscarProductoxCategoria(?)', [req.params.id]);

        if(rows[0].length <= 0){
            res.status(404).json({mensaje: 'Productos no entontrados', data: []});
        }

        return res.status(200).json({mensaje: 'Productos encontrados',data: rows[0]});

    }catch(error){
        return res.status(500).json({mensaje: 'Error al buscar los productos por categoria'});
    }
}

export const buscarProductoxEnfermedad = async(req, res) =>{
    try{
        const [rows] = await pool.query('CALL sp_buscarProductoxEnfermedad(?)', [req.params.id]);

        if(rows[0].length <= 0){
            res.status(404).json({mensaje: 'Productos no entontrados', data: []});
        }

        return res.status(200).json({mensaje: 'Productos encontrados',data: rows[0]});

    }catch(error){
        return res.status(500).json({mensaje: 'Error al buscar los productos por enfermedad'});
    }
}


