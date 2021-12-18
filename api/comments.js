var ObjectId = require('mongodb').ObjectID;
module.exports = {
    getAllComment: async function(req, res, db) {
        let comments = await db.find('comments', {})

        if(comments.length == 0)
        {
            return res.json({success:false, message:"Comments not found."})
        }

        res.json(comments)
    },
    getCommentWithpId: async function(req, res, db) {
        var id = req.params.id
        // if (!ObjectId.isValid(id)) {
        //     return res.json({ success: false, message: "Id is invalid" })

        // }
        let comments = await db.find('comments', { pId: id })
        if (comments.length == 0) {
           return res.json({success:false,message:"Comment does not exist."})
        } 

        return res.json(comments[0])
    },
    addComment: async function(req, res, db) {
        if(req.session.email != req.body.email)
        {
            return res.json({success:false, message:"User is not logged in."})
        }

        if (req.body.pId == null || req.body.text == null || req.body.rating == null 
            || req.body.username == null || req.body.email == null|| req.body.image1 == null ||
            req.body.image2 == null || req.body.image3 == null || req.body.image4 == null || 
            req.body.image5 == null) {
            return res.json({ success: false, message: "Parameter(s) are missing" })
        }
        let comment = {
            pId: req.body.pId,
            text: req.body.text,
            rating: req.body.rating,
            username: req.body.username,
            email: req.body.email,
            image1: req.body.image1,
            image2: req.body.image2,
            image3: req.body.image3,
            image4: req.body.image4,
            image5: req.body.image5
        }

        db.insertOne('comments', comment)
        res.json({ success: true, message: "The comment is added successfully." })
    }
};