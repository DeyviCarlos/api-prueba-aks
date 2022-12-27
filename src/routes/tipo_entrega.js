import {Router} from 'express'
import { obtenerTipoEntrega } from '../controllers/tipoentregaController.js';

const router = Router();


router.get('/',obtenerTipoEntrega);


export default router;