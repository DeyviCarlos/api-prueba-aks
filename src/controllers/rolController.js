import {pool} from '../db.js';
//import {clientRedis} from '../db_redis.js'
import {promisify} from 'util'


// const GET_REDIS_ASYNC = promisify(clientRedis.get).bind(clientRedis)
// const SET_REDIS_ASYNC = promisify(clientRedis.set).bind(clientRedis)


export const listarRol = async(req, res) =>{
    try{
        console.log("ingresando")
        //consulta a redis
        // const getreply = await GET_REDIS_ASYNC("roles")
        // if(getreply) 
        //     return res.status(200).json({mensaje:"lista de roles", data: JSON.parse(getreply)})

        // clientRedis.get('clave', async(error, respuesta) => {
        //     if (respuesta) 
        //         return res.status(200).json({mensaje:"lista de roles", data: JSON.parse(respuesta)})
        //     console.log("aaaa")
        //     //consulta a la BD
        //     const [rows] = await pool.query('CALL sp_listar_rol');

        //     if(rows[0].length <= 0){
        //         return res.status(404).json({mensaje: 'Lista de rol vacía',data: []});
        //     }
            
        //     // await SET_REDIS_ASYNC("roles", JSON.stringify(rows[0]))

        //     clientRedis.set('clave',JSON.stringify(rows[0]) ,async(error, respuesta) => {
        //     if (error) throw error;
        //         return res.status(200).json({mensaje: 'lista de roles',data: rows[0]});
        //     });
        // });

        console.log("aaaa")
        //consulta a la BD
        const [rows] = await pool.query('CALL sp_listar_rol');

        if(rows[0].length <= 0){
            return res.status(404).json({mensaje: 'Lista de rol vacía',data: []});
        }
        
        // await SET_REDIS_ASYNC("roles", JSON.stringify(rows[0]))

        return res.status(200).json({mensaje: 'lista de roles',data: rows[0]});
    }catch(error){
        console.log(error)
        return res.status(500).json({mensaje:'Error al listar los roles',error: error});
    }
}


