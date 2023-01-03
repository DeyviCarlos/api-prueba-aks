import {Router} from 'express'
import {listarEnfermedades} from '../controllers/enfermedadController.js'

const router = Router();


router.get('/',listarEnfermedades);


export default router;