import {Router} from 'express'
import { listarTipoEntrega,registrarTipoEntrega } from '../controllers/tipoentregaController.js';

const router = Router();


router.get('/',listarTipoEntrega);
router.post('/',registrarTipoEntrega);

export default router;