import {Router} from 'express'
import { listarTipoEntrega } from '../controllers/tipoentregaController.js';

const router = Router();


router.get('/',listarTipoEntrega);


export default router;