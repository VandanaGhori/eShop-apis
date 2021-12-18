var ObjectId = require('mongodb').ObjectID;
const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = {
    getAllUser: async function (req, res, db) {
        let users = await db.find('users', {})
        res.json(users)
    },
    getUserWithEmail: async function (req, res, db) {
        var email = req.params.email
        if (email == null) {
            return res.json({ success: false, message: "Email id not found in request" })
        }

        let users = await db.find('users', { email: email })
        if (users.length > 0) {
            res.json(users[0])
        } else {
            res.json({ success: false, message: "The user does not exist" })
        }
    },
    addUser: async function (req, res, db) {
        if (req.body.email == null || req.body.password == null || req.body.name == null ||
            req.body.shippingAddress == null || req.body.city == null || req.body.province == null |
            req.body.country == null || req.body.gender == null) {
            return res.json({ success: false, message: "Parameter(s) are missing" })
        }

        let users = await db.find('users', { email: req.body.email })
        if (users.length > 0) {
            return res.json({ success: false, message: "The user is aleady exist." })
        }

        let user = {
            email: req.body.email,
            password: req.body.password,
            name: req.body.name,
            shippingAddress: req.body.shippingAddress,
            city: req.body.city,
            province: req.body.province,
            country: req.body.country,
            gender: req.body.gender
        }
        db.insertOne('users', user)

        let token = jwt.sign({ id: user._id }, config.secret, {expiresIn: 86400 });

        res.json({ success: true, email: req.body.email, token: token, message: "The user is registered successfully." })
    },
    updateUser: async function (req, res, db) {
        if (req.body.email == null || req.body.password == null || req.body.name == null ||
            req.body.shippingAddress == null || req.body.city == null || req.body.province == null |
            req.body.country == null || req.body.gender == null) {
            return res.json({ success: false, message: "Parameter(s) are missing" })
        }

        var id = req.params.id
        if (!ObjectId.isValid(id)) {
            return res.json({ success: false, message: "Id is invalid" })
        }

        let users = await db.find('users', { _id: ObjectId(id) })
        let original = null
        if (users.length > 0) {
            original = users[0]
        } else {
            return res.json({ success: false, message: "The user does not exist." })
        }

        let updateduser = {
            email: req.body.email,
            password: req.body.password,
            name: req.body.name,
            shippingAddress: req.body.shippingAddress,
            city: req.body.city,
            province: req.body.province,
            country: req.body.country,
            gender: req.body.gender
        }
        db.updateOne('users', original, updateduser)
        res.json({ success: true, message: "The user is updated successfully." })
    },
    deleteUser: async function (req, res, db) {
        var id = req.params.id
        if (!ObjectId.isValid(id)) {
            return res.json({ success: false, message: "Id is invalid" })
        }

        let users = await db.find('users', { _id: ObjectId(id) })
        let user = null
        if (users.length > 0) {
            user = users[0]
        } else {
            return res.json({ success: true, message: "The user is deleted successfully." })
        }
        db.deleteOne('users', user)
        res.json({ success: true, message: "The user is deleted successfully." })
    },
    checkLoginCredentials: async function (req, res, db) {
        if (req.body.email == null || req.body.password == null) {
            return res.json({ success: false, message: "Parameter(s) are missing" })
        }

        let users = await db.find('users', {
            $and: [
                { email: req.body.email },
                { password: req.body.password }
            ]
        })
        if (users.length == 0) {
            return res.json({ success: false, message: "Incorrect email or password." })
        }
        console.log(users)
        let token = jwt.sign({ id: users[0]._id }, config.secret, {expiresIn: 86400 });

        return res.json({
            success: true, email: req.body.email, token: token, message: "The user is logged in successfully."
        })
    },
    logout: function (req, res, db) {
        req.session.email = null
        return res.json({ success: true, message: "The user is logged out successfully." })
    }
};