import app from './app.js'
import {PORT,HOST} from './config.js'

//puerto y hos
const server = app.listen(PORT,HOST, () => {
    console.log(`El servidor está en el puerto ${PORT}`)
})


// Handling Error
process.on("unhandledRejection", err => {
    console.log(`An error occurred: ${err.message}`)
    server.close(() => process.exit(1))
  })