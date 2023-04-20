import {Router} from 'express'
import {listarClientes} from '../controllers/clienteController.js'

const router = Router();


router.get('/',listarClientes);


export default router;