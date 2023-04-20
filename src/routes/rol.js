import {Router} from 'express'
import { listarRol } from '../controllers/rolController.js';

const router = Router();

router.get('/',listarRol);

export default router;