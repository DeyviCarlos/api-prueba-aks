import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import empleadoRoute from './routes/empleado.js'
import productoRoute from './routes/producto.js'
import authRoute from './routes/auth.js'
import categoriaRoute from './routes/categoria.js'
import enfermedadRoute from './routes/enfermedad.js'
import tipoEntregaRoute from './routes/tipo_entrega.js'
import ventaRoute from './routes/venta.js'

const app = express()

const corsOptions = {
    origin: '*',
}

app.use(express.json())
app.use(cookieParser())
app.use(cors(corsOptions))


app.use('/api/empleados',empleadoRoute)
app.use('/api/productos',productoRoute)
app.use('api/auth',authRoute)
app.use('/api/categorias',categoriaRoute)
app.use('/api/enfermedades',enfermedadRoute)
app.use('/api/tipo-entrega',tipoEntregaRoute)
app.use('api/ventas',ventaRoute)

app.get('/api', (req,res) =>{
    res.json({mensaje: "bienvenido"})
})

export default app;