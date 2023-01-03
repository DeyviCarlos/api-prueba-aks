import {Router} from 'express'
import { listarVentas,misCompras,cambiarEstadoEntrega,registarCompra } from '../controllers/ventaController.js';

const router = Router();


router.get('/',listarVentas);
router.get('/miscompras/:id',misCompras);
router.get('/cambiar-estado-entrega/:id',cambiarEstadoEntrega);
router.get('/:id',registarCompra);


export default router;