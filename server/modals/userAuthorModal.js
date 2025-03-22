const mongoose=require('mongoose')
//define user/author schema
const userAuthorSchema=new mongoose.Schema({
role:{
    type:String,
    required:true
},firstName:{
    type:String,
    required:true
},lastName:{
    type:String
},email:{
    type:String,
    required:true,
    unique:true
},profileImageUrl:{
    type:String
},isActive:{
    type:Boolean,
    default:true
},isBlocked:{
    type:Boolean,
    default:false
},status:{
    type:String,
    default:'active'
}
},{"strict":"throw"})
//create model for userAuthorSchema
const UserAuthor=mongoose.model('userauthor',userAuthorSchema)
module.exports=UserAuthor
