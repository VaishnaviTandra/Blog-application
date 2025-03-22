const exp=require('express')
const app=exp()
const cors = require('cors');
app.use(cors())
const userApp=require('./API/userapi')
const authorApp=require('./API/authorapi')
const adminApp=require('./API/adminapi')

require('dotenv').config();
const mongoose=require('mongoose')

const port=process.env.PORT||4000
//db connection
mongoose.connect(process.env.DBURL)
.then(()=>{app.listen(port,()=>console.log(`server on port ${port}`))
console.log("Database connection success")})
.catch(err=>console.log("error in db connection"))
//body parser middleware
app.use(exp.json())

//connect api routes
app.use('/user-api',userApp)
app.use('/author-api',authorApp)
app.use('/admin-api',adminApp)
app.use((err,req,res,next)=>{
    console.log('error object in express errror handler: ',err);
    res.send({message:err.message})
})
