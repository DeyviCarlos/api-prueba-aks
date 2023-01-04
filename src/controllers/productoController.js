import {pool} from '../db.js';

export const listarProductos = async(req, res) =>{
    try{
        const [rows] = await pool.query('CALL sp_listar_prod');

        if(rows[0].length <= 0){
            res.status(404).json({mensaje: 'Lista de productos vacía'});
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
            res.status(404).json({mensaje: 'Productos no entontrados', data: []});
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
            res.status(404).json({mensaje: 'Productos no entontrados', data: []});
        }

        return res.status(200).json({mensaje: 'Productos encontrados',data: rows[0]});

    }catch(error){
        return res.status(500).json({mensaje: 'Error al buscar los productos por enfermedad'});
    }
}

export const buscarProductoxNombre = async(req, res) =>{
    try{
        const {nombre} = req.body

        const [rows] = await pool.query('CALL sp_buscarProductoxEnfermedad(?,?)', [req.params.id,nombre]);

        if(rows[0].length <= 0){
            res.status(404).json({mensaje: 'Productos no entontrados', data: []});
        }

        return res.status(200).json({mensaje: 'Productos encontrados',data: rows[0]});

    }catch(error){
        return res.status(500).json({mensaje: 'Error al buscar los productos por enfermedad'});
    }
}

export const obtenerProducto = async(req, res) =>{
    try{
        console.log(req.params)
        const {id} = req.params

        const [rows] = await pool.query('CALL sp_buscarProductoxId(?)', [id]);

        if(rows[0].length <= 0){
            res.status(404).json({mensaje: 'Producto no entontrado', data: []});
        }

        return res.status(200).json({mensaje: 'Producto encontrado',data: rows[0]});

    }catch(error){
        return res.status(500).json({mensaje: 'Error al buscar al producto'});
    }
}

