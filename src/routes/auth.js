import {Router} from 'express'
import {iniciarSesion,registarCliente} from '../controllers/authController.js'

const router = Router();

router.get('/',iniciarSesion);
// router.post('/',registarCliente);

export default router;