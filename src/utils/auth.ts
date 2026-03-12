import bcrypt from 'bcrypt'

export const hashPassword = async (password : string) =>{
    //se colocan 2 await seguitos porque en el segundo 
    //se necesita el valor del primero
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password,salt)
}

export const checkPassword = async (enteredPassword:string , hash:string)=>{
    return await bcrypt.compare(enteredPassword,hash)
}