import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import path from 'path'
// import { fileURLToPath } from 'url'
import multer from 'multer'


// import {uuid} from 'uuidv4'

import empleadoRoute from './routes/empleado.js'
import productoRoute from './routes/producto.js'
import authRoute from './routes/auth.js'
import categoriaRoute from './routes/categoria.js'
import enfermedadRoute from './routes/enfermedad.js'
import tipoEntregaRoute from './routes/tipo_entrega.js'
import ventaRoute from './routes/venta.js'
import pasarelaRoute from './routes/pasarela.js'
import clienteRoute from './routes/cliente.js'
import rolRoute from './routes/rol.js'

//config inicial
const corsOptions = {
    origin: '*',
}

//Inicializacion
const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.json())
app.use(cookieParser())
app.use(cors(corsOptions))


//Static files
// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)
// app.use(express.static(path.join(__dirname, '../public')));

//config de multer ------------------------------------------------------------------------
//de manera local genera el public
// const storage = multer.diskStorage({
//     destination: path.join(__dirname,'../public/uploads'),
//     filename: (req,file,cb) => {
//         cb(null,file.originalname);
//     }
// })

//middlewar para la conexión de multer con azure
const inMemoryStorage = multer.memoryStorage();
const uploadStrategy = multer({storage: inMemoryStorage}).single('image');


//modificando el nombre a uno aleatorio
// const storage = multer.diskStorage({
//     destination: path.join(__dirname,'public/uploads'),
//     filename: (req,file,cb) => {
//         cb(null,uuid() + path.extname(file.originalname).toLocaleLowerCase());
//     }
// })


//middleware de multer     ----------------------------------------------------------------------------
//valor: image --> debe de ser la misma variable que
//se ingresa desde el front a traves del formData
//cargar archivo de manera local al public
// const upload = multer( {
//     storage: storage,
//     dest: path.join(__dirname,'../public/uploads'),
//     fileFilter: (req, file, cb) => {
//         const filetypes = /jpeg|jpg|png|gif/;
//         const mimety = filetypes.test(file.mimetype);
//         const extname = filetypes.test(path.extname(file.originalname).toLocaleLowerCase());
//         if(mimety && extname){
//             return cb(null,true);
//         }
//         cb("Error: Archivo debe ser una imagen valida")
//     }
// }).single('image')

//Uso local
// app.use(upload);
//Uso en Azure
app.use(uploadStrategy);

//rutas
app.use('/api/empleados',empleadoRoute)
app.use('/api/clientes',clienteRoute)
app.use('/api/productos',productoRoute)
app.use('/api/auth',authRoute)
app.use('/api/categorias',categoriaRoute)
app.use('/api/enfermedades',enfermedadRoute)
app.use('/api/tipo-entrega',tipoEntregaRoute)
app.use('/api/ventas',ventaRoute)
app.use('/api/pasarela',pasarelaRoute)
app.use('/api/roles',rolRoute)


app.get('/api', (req,res) =>{
    res.json({mensaje: "bienvenido"})
})

export default app;