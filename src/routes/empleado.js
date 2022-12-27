import {Router} from 'express'
import {crearEmpleado,eliminarEmpleado,obtenerEmpleado,obtenerEmpleados} from '../controllers/empleadoController.js'

const router = Router();


router.post('/', crearEmpleado);
router.get('/',obtenerEmpleados);
router.delete('/:id', eliminarEmpleado);
router.get('/:id',obtenerEmpleado);
//router.put('/:id',editarDatosPersonales);
//router.get('/miperfil',miperfil);

export default router;