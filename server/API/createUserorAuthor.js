const userAuthor = require("../modals/userAuthorModal")
async function createUserOrAuthor(req,res){
    //business logic to create user/author
    //get user/author object from req
    const newuserAuthor=req.body;
    // console.log(userAuthor); //undefined use body parser

    //find user by email id
     const userInDb = await userAuthor.findOne({email:newuserAuthor.email})
     //if user/author existed
     if(userInDb!=null){
        //check with role
        if(newuserAuthor.role==userInDb.role){
           res.status(200).send({message:newuserAuthor.role,payload:userInDb})
        }else{
              res.status(200).send({message:"Invalid role"})
        }
     }else{
      //instance of model
        let newUser=new userAuthor(newuserAuthor);
        //save method inserts the new user into the document
        let newUserorAuthorDoc=await newUser.save();
       res.status(201).send({message:newUserorAuthorDoc.role,payload:newUserorAuthorDoc})
     }
}

module.exports=createUserOrAuthor;