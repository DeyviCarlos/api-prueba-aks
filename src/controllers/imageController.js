import multer from 'multer'
import path from 'path'

const storage = multer.diskStorage({
    destination: path.join(__dirname, '../../images'),
    filename: (req, file,cb) => {
        cb(null,`${Date.now()}-${file.originalname}`)
    }
})

const upload = multer({storage: storage})

exports.upload = upload.single("image")

exports.uploadFile = (req, res) => {
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        const tipo = req.file.mimety;
        const nombre = req.file.originalname;

        conn.query('INSERT INTO'+req.params.tabla+' set ?',[(tipo,nombre)],
        (err, rows) => {
            console.log(
                err 
                ? 'Err INSERT INTO'+req.params.tabla+' '+err
                : req.params.tabla+ ': Imagen agregada'
            );
            res.json(
                err 
                ? {err: "Error al cargar la imagen"}
                : {msg: "Imagen cargada correctamente"}
            )
        })
    })
}

export const getImages = async (req, res) => {

}