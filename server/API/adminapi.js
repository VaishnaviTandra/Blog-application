const exp=require('express');
const adminApp=exp.Router();
const UserAuthor=require('../modals/userAuthorModal')
const Articles=require('../modals/articleModal')
const expressAsyncHandler=require('express-async-handler')
const createUserorAuthor=require('./createUserorAuthor')
adminApp.post('/admin', expressAsyncHandler(createUserorAuthor));

adminApp.get('/users', expressAsyncHandler(async (req, res) => {
    try {
        let userlist = await UserAuthor.find({ role: { $in: ['author', 'user'] } });
        res.status(200).send({ message: "Users retrieved", payload: userlist });
    } catch (error) {
        res.status(500).send({ message: "Error retrieving Users", error: error.message });
    }
}));



adminApp.get('/articles', expressAsyncHandler(async (req, res) => {
    try {
        const listofarticles = await Articles.find({}); // Fixed: Removed 'filter'
        res.status(200).send({ message: 'Articles retrieved', payload: listofarticles });
    } catch (error) {
        res.status(500).send({ message: "Error retrieving articles", error: error.message });
    }
}));
adminApp.put('/block/:email', expressAsyncHandler(async (req, res) => {
    const email = req.params.email;  // Get the email from the params
    try {
        let user = await UserAuthor.findOneAndUpdate(
            { email: email },  // Search by email
            { $set: { isBlocked: true, status: 'blocked' } },  // Update both fields
            { new: true }  // This ensures that the updated document is returned
        );
        res.status(200).send({ message: "User blocked", payload: user });
    } catch (error) {
        res.status(500).send({ message: "Error blocking user", error: error.message });
    }
}));

adminApp.put('/unblock/:email', expressAsyncHandler(async (req, res) => {
    const email = req.params.email;  // Get the email from the params
    try {
        let user = await UserAuthor.findOneAndUpdate(
            { email: email },  // Search by email
            { $set: { isBlocked: false, status: 'active' } },  // Update both fields
            { new: true }  // This ensures that the updated document is returned
        );
        res.status(200).send({ message: "User unblocked", payload: user });
    } catch (error) {
        res.status(500).send({ message: "Error unblocking user", error: error.message });
    }
}));


module.exports=adminApp;