import {Router} from 'express'
import {iniciarSesion,registarCliente,iniciarSesionEmpleado,registrarEmpleado} from '../controllers/authController.js'

const router = Router();

router.post('/singin',iniciarSesion);
router.post('/register',registarCliente);
router.post('/singinempleado',iniciarSesionEmpleado)
router.post('/registerempleado',registrarEmpleado)

export default router;