import {Router} from 'express'
import {obtenerProductos,buscarProductoxEnfermedad,buscarProductoxCategoria} from '../controllers/productoController.js'

const router = Router();


router.get('/',obtenerProductos);
router.get('/enfermedad/:id',buscarProductoxEnfermedad);
router.get('/categoria/:id',buscarProductoxCategoria);



export default router;