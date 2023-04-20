import jwt from 'jsonwebtoken';
import {pool} from '../db.js';

export const verifyToken = async (req,res,next) => {
    try{    
        if(!req.headers.authorization)
            return res.status(404).json({mensaje: "No autorizado",status: "404"})
    
        const token = req.headers.authorization.substr(7);

        if(token !== ''){
            const decoded = jwt.verify(token,process.env.TOKEN_SECRET)
            req.userId= decoded.id;

            const [usuario] = await pool.query("CALL sp_verificarUsuarioId(?)",[req.userId])
        
            if(usuario[0].length <= 0)
                return res.status(404).json({mensaje: "usuario no encontrado"})

            console.log("usuario encontrado: ",usuario[0])
            next();
        }
    }catch(error){
        return res.status(500).json({mensaje: "token no es válido", error: error})
    }
} 

export const verifyTokenEmpleado = async (req,res,next) => {
    try{    
        if(!req.headers.authorization)
            return res.status(404).json({mensaje: "No autorizado",status: "404"})
    
        const token = req.headers.authorization.substr(7);

        if(token !== ''){
            const decoded = jwt.verify(token,process.env.TOKEN_SECRET)
            console.log(decoded)
            req.userId= decoded.id;

            console.log("Codigo Usuario : ",req.userId)
            const [usuario] = await pool.query("CALL sp_verificarEmpleadoId(?)",[req.userId])
        
            if(usuario[0].length <= 0)
                return res.status(404).json({mensaje: "usuario no encontrado"})

            console.log("usuario encontrado: ",usuario[0])
            next();
        }
    }catch(error){
        return res.status(500).json({mensaje: "token no es válido", error: error})
    }
} 




export const rolAdminAuth = async (req,res,next) => {
    console.log('id user: '+req.userId);
    try {
        const [usuario] = await pool.query("CALL sp_verificarEmpleadoId(?)",[req.userId])

        // if(usuario[0][0].nombre_rol === "Administrador" || usuario[0][0].nombre_rol === "Vendedor"){
        if(usuario[0][0].nombre_rol === "Administrador"){
            next() // continuamos
        }else{
            return res.status(400).json({error: 'no cuenta con los permisos suficientes'})
        }   
    } catch (error) {
        return res.status(400).json({error: 'token no es válido'});
    }
}

