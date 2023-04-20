import {Router} from 'express'
import { listarVentas,misCompras,buscarDetalleOrden,cambiarEstadoEntrega,registarCompra,createCompra } from '../controllers/ventaController.js';
import { verifyToken } from '../middlewars/authMiddlewar.js';

const router = Router();


router.get('/',listarVentas);
router.get('/miscompras',verifyToken,misCompras);
router.get('/:id',buscarDetalleOrden)
router.get('/estadoentrega/:id',cambiarEstadoEntrega);
// router.post('/:id',createCompra);
// router.post('/:id',registarCompra);

export default router;