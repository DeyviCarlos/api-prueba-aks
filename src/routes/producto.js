import {Router} from 'express'
import {obtenerProducto,buscarProductoxNombre,listarProductos,buscarProductoxEnfermedad,buscarProductoxCategoria,
    registrarProducto,listarProductosStockMinimo} from '../controllers/productoController.js'

const router = Router();


router.get('/',listarProductos);
router.get('/stockminimo',listarProductosStockMinimo);
router.post('/',registrarProducto)
router.get('/nombre/:cadena',buscarProductoxNombre);
router.get('/:id',obtenerProducto);
router.get('/enfermedad/:id',buscarProductoxEnfermedad);
router.get('/categoria/:id',buscarProductoxCategoria);




export default router;