import {Router} from 'express'
import {obtenerCategorias} from '../controllers/categoriaController.js'

const router = Router();


router.get('/',obtenerCategorias);


export default router;