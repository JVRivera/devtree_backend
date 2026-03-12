import express from 'express' //ESM Ecmascrip modules
import cors from 'cors'
import 'dotenv/config'
import router from './router'
import { connectDB } from './config/db'
import { corsConfig } from './config/cors'

connectDB()

const app = express()

//cors
app.use(cors(corsConfig))

//leer datos del formulario
app.use(express.json())//habilitamos el servidor para que lea datos json

app.use('/',router)//aqui ya accedemos a las rutas

export default app
