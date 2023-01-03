import {pool} from '../db.js';

//Registrar compra : falta completar
export const registarCompra = async(req, res) =>{

    try{
        const {idCliente, direccion, telefono, detalleCompra,
        fecha, hora, }  = req.body
        
        if(!direccion || !telefono || !fecha || !hora){
            return res.status(400).json({mensaje: 'Digite todos los campos'})
        }


        await pool.query('CALL sp_insertarCompra(?,?,?,?,?,?)')

    }catch(error){
        return res.status(500).json({mensaje: 'Error al registrar la compra',error: error});
    }
}




//listar mis compras
export const misCompras = async(req, res) =>{

    try{
        const {idCliente} = req.params

        const [rows] = await pool.query('CALL sp_misCompras(?)',[idCliente])

        if(rows[0].length <= 0){
            return res.status(404).json({mensaje: 'La lista no tiene elementos', data: []})
        }

        return res.status(200).json({mensaje: 'Mis compras', data: rows[0]});

    }catch(error){
        return res.status(500).json({mensaje: 'Error al listar mis compra',error: error});
    }
}



//lista de ventas
export const listarVentas = async(req, res) =>{

    try{
        const [rows] = await pool.query('CALL sp_listar-ventas')

        if(rows[0].length <= 0){
            return res.status(404).json({mensaje: 'La lista no tiene elementos', data: []})
        }

        return res.status(200).json({mensaje: 'lista de ventas', data: rows[0]});

    }catch(error){
        return res.status(500).json({mensaje: 'Error al listar las ventas',error: error});
    }
}



//cambiar estado de entrega
export const cambiarEstadoEntrega = async(req, res) =>{

    try{
        const { idCompra } = req.params;

        const [rows] = await pool.query('CALL sp_buscarCompra(?)',[idCompra])

        if(rows.length <= 0){
            return res.status(404).json({mensaje: 'No se encontró la compra',data: []})
        }


        await pool.query('CALL sp_cambiar-estado-entrega',[rows.id,rows.nombre]);

        return res.status(200).json({mensaje: 'estado cambio a finalizado'});

    }catch(error){
        return res.status(500).json({mensaje: 'Error al cambiar de estado de entrega',error: error});
    }
}




