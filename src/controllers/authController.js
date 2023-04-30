import {pool} from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

//web
export const iniciarSesion = async(req, res) =>{

    const {correo, contrasenia} = req.body;

    try{
        const [usuario] = await pool.query("CALL sp_verificarUsuario(?)",[correo])

        if(usuario[0].length <= 0){
            return res.status(400).json('Usuario o contraseña incorrecta');  
        }
        // console.log("usuario correcto: ",usuario[0][0].nombre_cliente)
        const passwordValido = await bcrypt.compare(contrasenia,usuario[0][0].contrasenia_cliente)

        console.log(passwordValido)

        if(!passwordValido){
            return res.status(400).json({msj: 'Contaseña incorrecta'}); 
        }
        const jwtToken = jwt.sign(
            {
                id: usuario[0][0].id_cliente,
                nombre: usuario[0][0].nombre_cliente,
            }, 
            process.env.TOKEN_SECRET,
            {
              expiresIn: '24h',
            }
        );
        
        // res.cookie("jwt", jwtToken, {
        //     httpOnly: true,
        //     maxAge: 24*60*60*1000, //24hrs
        //   }
        // );
        res.json(
            {
                mensaje: "Se inició sesión",
                jwtToken
            }
        );

    }catch(error){
        return res.status(500).json({mensaje: "No se pudo iniciar sesión", error: error})
    }
}

//web
export const registarCliente = async(req, res) =>{
    
    const {nombre,correo,contrasenia} = req.body;

    try{
        console.log(nombre,correo,contrasenia)

        //validar que el correo sea unico
        const [usuario] = await pool.query("CALL sp_verificarUsuario(?)",[correo])

        console.log(usuario)

        if(usuario[0].length > 0){
            return res.status(404).json({mensaje: "El Correo ya existe"})
        }

        const contraseniaEncrip = await bcrypt.hash(contrasenia,10);

        //agregamos al usuario a la BD
        const [rows] = await pool.query("CALL sp_registrarUsuario(?,?,?)",[nombre,correo,contraseniaEncrip])

        console.log("valor devuelto del registro: ",rows)
        //obtenemos los datos del usuario y su id
        const [rowsNew] = await pool.query("CALL sp_verificarUsuario(?)",[correo])

        // console.log("usuario buscado: ",rowsNew[0][0].nombre_cliente)

        const jwtToken = jwt.sign(
            {
                id: rowsNew[0][0].id_cliente,
                nombre: rowsNew[0][0].nombre_cliente,
            }, 
            process.env.TOKEN_SECRET,
            {
              expiresIn: '24h',
            }
        );
        // res.cookie("jwt", jwtToken, {
        //     httpOnly: true,
        //     maxAge: 24*60*60*1000, // 3hrs in ms
        // });

        return res.status(201).json({
            mensaje: 'Usuario registrado correctamente',
            jwtToken
        });

    }catch(error){
        return res.status(500).json({mensaje: "no se pudo registrar",error: error})
    }
}
//Sistema
export const iniciarSesionEmpleado = async(req, res) => {
    const {dni, contrasenia} = req.body;

    try{
        const [usuario] = await pool.query("CALL sp_verificarEmpleado(?)",[dni])

        if(usuario[0].length <= 0){
            return res.status(400).json('Usuario o contraseña incorrecta');  
        }

        // console.log("usuario correcto: ",usuario[0][0].nombre_cliente)
        const passwordValido = await bcrypt.compare(contrasenia,usuario[0][0].contrasenia)

        console.log(passwordValido)

        if(!passwordValido){
            return res.status(400).json({msj: 'Contaseña incorrecta'}); 
        }
        const jwtToken = jwt.sign(
            {
                id: usuario[0][0].id_empleado,
                nombre: usuario[0][0].nombre_empleado,
                rol: usuario[0][0].nombre_rol
            }, 
            process.env.TOKEN_SECRET,
            {
              expiresIn: '24h',
            }
        );

        res.json(
            {
                mensaje: "Se inició sesión",
                jwtToken
            }
        );

    }catch(error){
        return res.status(500).json({mensaje: "No se pudo iniciar sesión", error: error})
    }
}

export const registrarEmpleado = async(req, res) =>{
    
    const {nombre,ap_paterno,ap_materno,dni,id_rol,domicilio,telefono,contrasenia} = req.body;

    try{
        console.log(nombre,dni,contrasenia)

        //validar que el correo sea unico
        const [usuario] = await pool.query("CALL sp_verificarEmpleado(?)",[dni])

        console.log(usuario)

        if(usuario[0].length > 0){
            return res.status(404).json({mensaje: "Empleado ya existe"})
        }

        const contraseniaEncrip = await bcrypt.hash(contrasenia,10);

        //agregamos al usuario a la BD
        const [rows] = await pool.query("CALL sp_registrarEmpleado(?,?,?,?,?,?,?,?)",[nombre,ap_paterno,ap_materno,dni,domicilio,telefono,id_rol,contraseniaEncrip])

        console.log("valor devuelto del registro: ",rows)
        //obtenemos los datos del usuario y su id
        const [rowsNew] = await pool.query("CALL sp_verificarEmpleado(?)",[dni])

        // console.log("usuario buscado: ",rowsNew[0][0].nombre_cliente)

        const jwtToken = jwt.sign(
            {
                id: rowsNew[0][0].id_empleado,
                nombre: rowsNew[0][0].nombre_empleado,
                rol: rowsNew[0][0].nombre_rol
            }, 
            process.env.TOKEN_SECRET,
            {
              expiresIn: '24h',
            }
        );

        res.json({
            mensaje: 'Usuario registrado correctamente',
            jwtToken
        });

    }catch(error){
        return res.status(500).json({mensaje: "no se pudo resgistrar",error: error})
    }
}



