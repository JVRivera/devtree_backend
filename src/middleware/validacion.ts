import type {Request, Response, NextFunction} from 'express'
import { validationResult } from 'express-validator'

export const handleInputErrors = (req: Request, res: Response, next:NextFunction) =>{
    //manejar errores de validacion
    console.log('Desde validation.ts....')

    let errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    next()    
}