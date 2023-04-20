import {Router} from 'express'
import {listarCategorias,registrarCategoria} from '../controllers/categoriaController.js'

const router = Router();


router.get('/',listarCategorias);
router.post('/',registrarCategoria)

export default router;