import {Router} from 'express'
import {registarEmpleado,eliminarEmpleado,obtenerEmpleado,listarEmpleados} from '../controllers/empleadoController.js'

const router = Router();


// router.post('/', registarEmpleado);
router.get('/',listarEmpleados);
router.delete('/:id', eliminarEmpleado);
router.get('/:id',obtenerEmpleado);
//router.put('/:id',editarDatosPersonales);
//router.get('/miperfil',miperfil);

export default router;