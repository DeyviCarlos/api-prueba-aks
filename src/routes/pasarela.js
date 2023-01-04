import {Router} from 'express'
import {createOrder,capturarOrder,cancelarOrder} from '../controllers/pasarelaController.js'

const router = Router();


router.get('/create-orden',createOrder);
router.get('/capturar-orden',capturarOrder);

router.get('/cancel-order',cancelarOrder);

export default router;