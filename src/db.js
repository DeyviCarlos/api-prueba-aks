import {createPool} from "mysql2/promise";
import {DB_hostname,DB_name,DB_password,DB_port,DB_username} from './config.js'
// import fs from 'fs'

//local
// const serverCa = [fs.readFileSync("D:/ciclo VIII/taller de construccion de sistemas/certificado-ssl/DigiCertGlobalRootCA.crt.pem", "utf8")];
// const serverCa = [fs.readFileSync(BD_SSL.getSSL(), "utf8")];
//pool de conexion
export const pool = createPool({
    host: DB_hostname,
    user: DB_username,
    password: DB_password,
    port: DB_port,
    database: DB_name,
    // ssl: {
    //     rejectUnauthorized: true,
    //     ca: serverCa
    // }

})

//variables para la transaccion
export const db = {
    host: DB_hostname,
    user: DB_username,
    password: DB_password,
    port: DB_port,
    database: DB_name,
    // ssl: {
    //     rejectUnauthorized: true,
    //     ca: serverCa
    // }

}

// export const conn = mysql.createConnection(db);

// export const getConnection = () => {
//     return conn;
// }

