const exp=require('express');
const authorApp=exp.Router();
const expressAsyncHandler=require('express-async-handler')
const createUserorAuthor=require('./createUserorAuthor')
const Article=require('../modals/articleModal')
const {requireAuth,clerkMiddleware}=require('@clerk/express')
require('dotenv').config()
authorApp.use(clerkMiddleware())
// authorApp.get('/',(req,res)=>{
//     res.send({message:"from author api"})
// })
authorApp.post('/author',expressAsyncHandler(createUserorAuthor))
//create new article
authorApp.post('/article',expressAsyncHandler(async(req,res)=>{
    //get new artical from req
    const newArticleobj=req.body;
    const newArticle=new Article(newArticleobj);
    const articleObj=await newArticle.save();
    res.status(201).send({message:"article published",payload:articleObj})
}))
//read all articles
authorApp.get('/articles/:category', requireAuth({ signInUrl: "unauthorized" }), expressAsyncHandler(async (req, res) => {
    const cat = req.params.category;  // Get category from request params
    let filter = { isArticleActive: true };

    if (cat && cat !== "All") {
        filter.category = new RegExp(`^${cat}$`, "i");  // Case-insensitive match
    }

    try {
        const listofarticles = await Article.find(filter);
        res.status(200).send({ message: 'articles', payload: listofarticles });
    } catch (error) {
        res.status(500).send({ message: "Error retrieving articles", error: error.message });
    }
}));

authorApp.get('/unauthorized',(req,res)=>{
    res.send({message:"unauthorized please login to continue"})
})
//modify an article by article id
authorApp.put('/article/:articleID',requireAuth({signInUrl:"unauthorized"}),expressAsyncHandler(async(req,res)=>{
    //get modified article
    const modifiedArticle=req.body;
    //update article by article id
    //returnOriginal false will not send the old document rather it sends the modified document
    const dbResponse=await Article.findByIdAndUpdate(modifiedArticle._id,{...modifiedArticle},{returnOriginal:false})
    res.status(200).send({message:"article modified",payload:dbResponse})
}))
//delete(soft delete) by article by article ID
authorApp.put('/articles/:articleID',requireAuth({signInUrl:"unauthorized"}),expressAsyncHandler(async(req,res)=>{
    //get modified article
    const modifiedArticle=req.body;
    //update article by article id
    //returnOriginal false will not send the old document rather it sends the modified document
    const dbResponse=await Article.findByIdAndUpdate(modifiedArticle._id,{...modifiedArticle},{returnOriginal:false})
    res.status(200).send({message:"article deleted or restored",payload:dbResponse})
}))
module.exports=authorApp;