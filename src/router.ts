import { Router } from 'express'
import { body } from 'express-validator'
import { createAccount, getUser, login, updateImage, updateProfile } from './handlers'
import { handleInputErrors } from './middleware/validacion'
import { authenticate } from './middleware/auth'


const router = Router()

//autenticacion y registro
router.post('/auth/register', 
    //aqui obtenemos el handle que se envia por el body y le indicamod que el handle no puede ir vacio
    body('handle')
        .notEmpty()
        .withMessage('El handle no puede ir vacio'),
    //aqui obtenemos el name que se envia por el body y le indicamod que el name no puede ir vacio
    body('name')
        .notEmpty()
        .withMessage('El nombre no puede ir vacio'),    
    //aqui obtenemos el email que se envia por el body y le indicamos que tiene que tener las caracteristicas de un email
    body('email')
        .isEmail()
        .withMessage('Email no valido'),   
    //aqui obtenemos el password que se envia por el body y le indicamos que no puede tener menos de 8 caracteres
    body('password')
        .isLength({ min:8 })
        .withMessage('El password no puede tener menos de 8 caracteres'),  
    handleInputErrors,

    createAccount //funcion creada en handler/index.ts
)

router.post('/auth/login',
    body('email')
        .isEmail()
        .withMessage('Email no valido'),   
    //aqui obtenemos el password que se envia por el body y le indicamos que no puede tener menos de 8 caracteres
    body('password')
        .notEmpty()
        .withMessage('El password es obligatorio'),
    handleInputErrors,    
    
    login //funcion creada en handler/index.ts
)

router.get('/user', authenticate ,getUser)

router.patch('/user', 
    //aqui obtenemos el handle que se envia por el body y le indicamod que el handle no puede ir vacio
    body('handle')
        .notEmpty()
        .withMessage('El handle no puede ir vacio'),
    //aqui obtenemos el name que se envia por el body y le indicamod que el name no puede ir vacio
    body('description')
        .notEmpty()
        .withMessage('La descripcion no puede ir vacia'),  
    handleInputErrors,      
    authenticate ,
    updateProfile
)
//ruta para subir la imagen
router.post('/user/image',authenticate,updateImage)

export default router