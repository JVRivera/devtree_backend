import { Request, Response } from "express"
import { Result, validationResult } from 'express-validator'
import slug from 'slug'
import User from "../models/User"
import { checkPassword, hashPassword } from "../utils/auth"
import { generateJWT } from "../utils/jwt"
import formidable from 'formidable'
import cloudinary from '../config/cloudinary'
import { v4 as uuid } from 'uuid'

//al colocarle export a la funcion ya se puede usar desde otros archivos
export  const createAccount = async (req:Request , res:Response)=>{
    //verificamos si el usuario ya existe
    const {email, password} = req.body
    //aqui interacturamos con la bd por por medio del modelo User por eso usamos await
    const userExists = await User.findOne({email})
    if(userExists){
        const error = new Error('Un usuario con ese email ya esta registrado')
        return res.status(409).json({error : error.message})
    }  

    const handle = slug(req.body.handle,'-')
    const handleExists = await User.findOne({handle})

    if(handleExists){
        const error = new Error('Nombre de usuario no disponible')
        return res.status(409).json({error : error.message})
    }

    const user = new User(req.body)
    //aqui se coloco await para que la funcion hashPassword haga todos sus procesos
    //y hasta entonces retorne el valor y continue las operaciones
    user.password = await hashPassword(password)
    user.handle = handle

    await user.save()

    res.send('Registro creado correctamente')
}

export const login = async (req:Request , res:Response) => {
    //manejar errores de validacion
    let errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

    //verificamos si el usuario ya existe
    const {email, password} = req.body
    //aqui interacturamos con la bd por medio del modelo User por eso usamos await
    const user = await User.findOne({email})
    if(!user){
        const error = new Error('El usuario no existe')
        return res.status(404).json({error : error.message})
    }      

    //comprobar el password
    const isPasswordCorrect = await checkPassword(password,user.password)   
    if(!isPasswordCorrect){
        const error = new Error('Password incorrecto')
        return res.status(401).json({error : error.message})
    }       

    //generar jwt y enviarlo al frontend
    const token = generateJWT({id: user._id})

    res.send(token)
}

export const getUser = async (req:Request, res:Response) => {
    res.json(req.user)
}

export const updateProfile = async (req:Request, res:Response) => {
    try {

        const { description } = req.body
        const handle = slug(req.body.handle,'-')

        //verificamos que el handle exista y que el email sea igual al logueado
        const handleExists = await User.findOne({handle})
        
        if(handleExists && handleExists.email !== req.user.email){
            const error = new Error('Nombre de usuario no disponible')
            return res.status(409).json({error : error.message})
        }

        //actualizar usuario
        req.user.description=description
        req.user.haldle=handle
        await req.user.save()
        res.send('Perfil actualizado correctamente.')

    } catch (e) {
        const error = new Error('Hubo un error')
        return res.status(500).json({error: error.message})
    }
}

export const updateImage = async (req:Request, res:Response) => {
    //em esta parte leemos los datos del formulario
    const form = formidable({multiples:false})

    try {

        form.parse(req,(error,fields,files)=>{
            cloudinary.uploader.upload(files.file[0].filepath,{public_id: uuid()},async function(error, result){
                if(error){
                    const error = new Error('Hubo un error al subir la imagen')
                    return res.status(500).json({error: error.message})                     
                }
                if(result){
                    req.user.image = result.secure_url
                    await req.user.save()
                    res.json({image: result.secure_url})
                }                
            })
        })        

    } catch (e) {
        const error = new Error('Hubo un error')
        return res.status(500).json({error: error.message})        
    }
}


