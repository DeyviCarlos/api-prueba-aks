//import { getConnection } from '../db.js';
import {pool} from '../db.js';
import bcrypt from 'bcrypt'

export const registarEmpleado = async (req,res) =>{
    try{
        const {nombre,email,telefono,direccion,password,rol} = req.body;

        if(!nombre || !email || !password){
            return res.status(400).json({mensaje: 'Digite todos los campos'});
        }
        
        //llamamos a la bd y consultamos el email: consultas en el back
        /*
        const validaremail = await pool.query('SELECT email usuario WHERE email=?',
                                [email]);
        */
        //consultamos usando procedimientos
        const validaremail = await pool.query('CALL sp_validarEmail(?)',[email])

        if(validaremail){
            return res.status(404).json({mensaje: 'Email ya existe'});
        }

        //encriptamos la contraseña
        password = await bcrypt.hash(password,10);
        
        //insertamos los campos a la base de datos
        /*
        const [rows] = await pool.query('INSERT INTO usuario (nombre,email,telefono,direccion,password,rol) VALUES (?,?,?,?,?,?)',
                                [nombre,email,telefono,direccion,password,rol]);
        */
        //insertamos usando procedimientos
        //devuelve un objeto con campos de la BD, solo se identifica el Id
        await pool.query('CALL sp_insertarUsuario(?,?,?,?,?,?)',
            [nombre,email,telefono,direccion,password,rol])

        //se retorna el mensaje exitoso
        return res.staturs(201).json({mensaje: 'Usuario Creado correctamente'});
    }catch(error){
        return res.status(500).json({mensaje: 'Error al guardar usuario'});
    }
}

// export const editarDatosPersonales = async(req, res) =>{
//     try{
//         const {nombre} = req.body;

//         let usuario = await Usuario.findById(req.params.id);
//         if(!usuario){
//             return res.status(404).json({mensaje: 'Usuario no entontrado'});
//         }
//         usuario.nombre = nombre;

//         usuario = await Usuario.findOneAndUpdate({_id: req.params.id},usuario,{new: true});
//         /* 
//         usuario = await Usuario.findOneAndUpdate({_id: req.params.id},{
//             $set: {
//                 nombre: req.body.nombre,
//                 apellido_paterno: req.body.apellido_paterno
//             }
//         },{new: true}); 
//         res.send(usuario);*/
//         //res.json({mensaje: 'Usuario Editado correctamente'});
//         res.json(
//             {
//                 msg: "Editado correctamente",
//                 usuario
//             });
//     }catch(error){
//         console.log(error);
//         return res.status(500).send('Error al editar usuario');
//     }
// }

export const listarEmpleados = async (req, res) =>{
    try{
        console.log("metodo de listar empleados")
        //rows arreglo de objetos
        // const [rows] = await pool.query('SELECT * FROM empleado')
        // console.log(rows)
        const [rows] = await pool.query('CALL sp_listar_empleados')
        console.log(rows)

        if(rows[0].length <= 0){
            return res.status(404).json({mensaje: 'La lista no tiene elementos',data: []})
        }

        return res.status(200).json({mensaje: 'lista de Empleados',data: rows[0]});
    }catch(error){
        return res.status(500).json({mensaje: 'Error al listar Empledos',error: error});
    }
}

export const obtenerEmpleado = async(req, res) =>{
    try{
        const [rows] = await pool.query('CALL sp_obtenerEmpleado(?)', [req.params.id]);

        if(rows.length <= 0){
            res.status(404).json({mensaje: 'Usuario no entontrado'});
        }

        return res.status(200).json({mensaje: 'Usuario encontrado',data: rows[0]});

    }catch(error){
        return res.status(500).json({mensaje: 'Error al buscar usuario'});
    }
}

export const eliminarEmpleado = async(req, res) =>{
    try{
        const [result] = await pool.query('CALL sp_eliminarUsuario(?)',[req.params.id]);

        if(result.affectedRows <= 0){
            return res.status(404).json({mensaje: 'Usuario no se pudo eliminar'});
        }

        return res.status(200).json({mensaje: 'Usuario eliminado'});

    }catch(error){
        return res.status(500).json({mensaje: 'Error al eliminar usuario'});
    }
}
/*
export const miperfil = async (req,res) => {

    try{
        const usuario = await Usuario
        .findById(req.userId,{password: 0})
        .populate('role','nombre -_id');

        if(!usuario){
            res.status(404).json({mensaje: 'Usuario no entontrado'});
        }
        //mongoDB guarda los id con de la siguiente manera _id
        res.json(usuario);

    }catch(error){
        console.log(error);
        res.status(500).send('Usuario no encontrado');
    }
}
*/