import type {Request, Response, NextFunction} from 'express'
import  jwt  from 'jsonwebtoken'
import User, { IUser } from '../models/User'

declare global {
  namespace Express {
    interface Request {
      user?: IUser
    }
  }
}

export const authenticate = async (req: Request,res: Response,next: NextFunction)=>{
    //obtenemos el JWT solo que viene con la palabra bearer al principio
    const bearer = req.headers.authorization
    //verificamos que el bearer no venga vacio
    if(!bearer){
        const error = new Error('No autorizado')
        return res.status(401).json({error: error.message})
    }
    //esto separa el contenido de bearer por los espacios
    //y en este caso coloca el contenido de la derecha que seria el JWT en la variable token
    const [, token] = bearer.split(' ')
    
    //verificamos si viene el token
    if(!token){
        const error = new Error('No autorizado')
        return res.status(401).json({error: error.message})
    }

    //verifycar el JWT
    try {
        const result = jwt.verify(token,process.env.JWT_SECRET)
        //comprobacion extra para poder acceder al id
        if(typeof result === 'object' && result.id){
            //usamos await porque se va a interactuar con el modelo es decir con la BD
            const user = await User.findById(result.id).select('-password')//este select se trae todos los campos excepto el password
            if(!user){
                const error = new Error('El usuario no existe')
                return res.status(404).json({error: error.message})               
            }
            req.user=user
            next()
        }
    } catch (error) {
        res.status(500).json({error:'Token no valido'})
    }
}