const exp = require('express');
const userApp = exp.Router();
const UserAuthor = require('../modals/userAuthorModal'); // fixed typo
const expressAsyncHandler = require('express-async-handler');
const createUserorAuthor = require('./createUserorAuthor');
const Article=require('../modals/articleModal')

// get users (commented out)
// userApp.get('/users', async(req, res) => {
//    let userslist = await UserAuthor.find();
//    res.send({message: "users are", payload: userslist});
// });

// create new user
userApp.post('/user', expressAsyncHandler(createUserorAuthor)); // adjusted the usage of expressAsyncHandler
//add comment to article
userApp.put('/comment/:articleId',expressAsyncHandler(async(req,res)=>{
    //get comment object
    const commentObj=req.body;
    //add comment object to commens arrary of article
    const articlewithComments=await Article.findOneAndUpdate({articleId:req.params.articleId},{$push:{comments:commentObj}},{returnOriginal:false})
    res.send({message:"comment added",payload:articlewithComments})
}))
// userApp.put('/report-comment/:articleId/:username', expressAsyncHandler(async (req, res) => {
//     const { articleId, username } = req.params;

//     try {
//         const updatedComment = await Article.findOneAndUpdate(
//             { articleId, "comments.nameOfUser": username },
//             { 
//                 $set: { "comments.$.reported": true },  // Marks comment as reported
//                 $inc: { "comments.$.reports": 1 }      // Increments report count
//             },
//             { returnOriginal: false  }  // Returns updated document
//         );

        

//         res.send({ message: "Comment reported", payload: updatedComment });

//     } catch (error) {
//         res.status(500).send({ message: "Error reporting comment", error: error.message });
//     }
//     const updatedUser=await UserAuthor.findOneAndUpdate({username:username},{$inc:{reportedCount:1}},{ returnOriginal: false  })
//     res.send({ message: "Report Count Increased", payload: updatedUser });
// }));
// userApp.put('/report-article/:email', expressAsyncHandler(async (req, res) => {
//     const { email } = req.params;
    
//     try {
//         // Find the article and increment report count
//         const updatedUserorAuth = await UserAuthor.findOneAndUpdate(
//             { email },
//             { 
//                  // Marks article as reported
//                 $inc: { reportCount: 1 }     // Increments report count
//             },
//             { returnOriginal:false }  // Returns updated document
//         );



//         // Update the author's reported count
//       res.status(200).send({message:"Article Reported",payload:updatedUserorAuth})

       
//     } catch (error) {
//         res.status(500).send({ message: "Error reporting article", error: error.message });
//     }
// }));
userApp.delete('/comment/:articleId/:commentId',expressAsyncHandler(async(req,res)=>{
    const {articleId,commentId}=req.params;
    try{
        const updatedArticle = await Article.findOneAndUpdate(
            { articleId },
            { $pull: { comments: { _id: commentId } } }, // Remove the comment from the array
            { returnOriginal: false }
        );

        if (!updatedArticle) {
            return res.status(404).send({ message: "Article not found" });
        }

        res.send({ message: "comment deleted", payload: updatedArticle });
    }catch(error){
        res.status(500).send({message:"Error deleting comment",error:error.message})
    }
}))
module.exports = userApp;

