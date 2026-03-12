import mongoose,{Schema, Document} from "mongoose";

export interface IUser extends Document {
    haldle: string
    name: string
    email: string
    password: string
    description:string
    image:string
}

const userSchema =new Schema({
    handle:{
        type: String,
        required :true,
        trim:true, //elimina los espacios en blanco al inicio y al final
        lowercase:true,
        unique:true
    },    
    name:{
        type: String,
        required :true,
        trim:true //elimina los espacios en blanco al inicio y al final
    },
    email:{
        type: String,
        required :true,
        trim:true,
        unique:true,
        lowercase:true        
    },  
    password:{
        type: String,
        required :true,
        trim:true
    },     
    description:{
        type: String,
        default:''
    },       
    image:{
        type: String,
        default:''
    },         

})

const User = mongoose.model('User', userSchema)
export default User