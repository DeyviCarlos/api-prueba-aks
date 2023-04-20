import {Router} from 'express'
import {listarEnfermedades,registrarEnfermedad} from '../controllers/enfermedadController.js'

const router = Router();


router.get('/',listarEnfermedades);
router.post('/', registrarEnfermedad)


export default router;