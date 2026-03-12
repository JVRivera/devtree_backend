import colors from 'colors'
import server from './server'

const port = process.env.PORT || 4000

//inicializa el servidor en el puerto 4000 que es localhost:4000
server.listen(port,()=>{
    console.log(colors.blue.bold(`Servidor funcionando en el puerto ${port}`))
})

