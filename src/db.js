import {createPool} from "mysql2/promise";
import {DB_hostname,DB_name,DB_password,DB_port,DB_username} from './config.js'
// import fs from 'fs'

// const serverCa = [fs.readFileSync("D:/ciclo VIII/taller de construccion de sistemas/certificado-ssl/DigiCertGlobalRootCA.crt.pem", "utf8")];

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

// const config = {
//     host: DB_hostname,
//     user: DB_username,
//     password: DB_password,
//     port: DB_port,
//     database: DB_name,

// }

// const conn = new mysql.createConnection(config);

// export const getConnection = () => {
//     return conn;
// }

