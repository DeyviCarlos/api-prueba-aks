import {Router} from 'express'
import {createOrder,notificacionOrden} from '../controllers/pasarelaController.js'
import { verifyToken } from '../middlewars/authMiddlewar.js';

const router = Router();


router.post('/createorden',verifyToken,createOrder);
router.post('/notificacion/:id',notificacionOrden)
// router.get('/capturar-orden',capturarOrder);
// router.get('/cancel-order',cancelarOrder);

export default router;