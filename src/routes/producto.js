import {Router} from 'express'
import {obtenerProducto,buscarProductoxNombre,listarProductos,buscarProductoxEnfermedad,buscarProductoxCategoria} from '../controllers/productoController.js'

const router = Router();


router.get('/',listarProductos);
router.get('/:id',obtenerProducto);
router.get('/enfermedad/:id',buscarProductoxEnfermedad);
router.get('/categoria/:id',buscarProductoxCategoria);
router.get('/nombre/:id',buscarProductoxNombre);


export default router;