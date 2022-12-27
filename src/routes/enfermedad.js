import {Router} from 'express'
import {obtenerEnfermedades} from '../controllers/enfermedadController.js'

const router = Router();


router.get('/',obtenerEnfermedades);


export default router;