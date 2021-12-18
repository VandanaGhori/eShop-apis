var ObjectId = require('mongodb').ObjectID;
const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = {
    getAllCartItem: async function (req, res, db) {
        jwt.verify(req.headers['jwt'], config.secret, function (err, decoded) {
            if (err) {
                return res.json({ success: false, message: "The user is not logged in." })
            }
        })

        let cartItems = await db.find('cartItems', {})
        res.json(cartItems)
    },
    getCartItemsWithEmail: async function (req, res, db) {
        jwt.verify(req.headers['jwt'], config.secret, function (err, decoded) {
            if (err) {
                return res.json({ success: false, message: "The user is not logged in." })
            }
        })

        var email = req.params.email

        let cartItems = await db.find('cartItems', { email: email })
        return res.json(cartItems)

    },
    addCartItem: async function (req, res, db) {
        jwt.verify(req.headers['jwt'], config.secret, function (err, decoded) {
            if (err) {
                return res.json({ success: false, message: "The user is not logged in." })
            }
        })

        if (req.body.email == null || req.body.pId == null || req.body.qty == null) {
            return res.json({ success: false, message: "Parameter(s) are missing" })
        }

        let products = await db.find('products', { _id: ObjectId(req.body.pId) })
        if (products.length == 0) {
            return res.json({ success: false, message: "Product does not exist." })
        }

        let cartItems = {
            email: req.body.email,
            pId: req.body.pId,
            qty: req.body.qty
        }
        db.insertOne('cartItems', cartItems)
        res.json({ success: true, message: "The product is added successfully into cart." })
    },
    updateCartItem: async function (req, res, db) {
        jwt.verify(req.headers['jwt'], config.secret, function (err, decoded) {
            if (err) {
                return res.json({ success: false, message: "The user is not logged in." })
            }
        })

        if (req.body.email == null || req.body.pId == null || req.body.qty == null) {
            return res.json({ success: false, message: "Parameter(s) are missing" })
        }

        let products = await db.find('products', { _id: ObjectId(req.body.pId) })
        if (products.length == 0) {
            return res.json({ success: false, message: "Product does not exist." })
        }

        let cartItems = await db.find('cartItems', {
            $and: [
                { pId: req.body.pId },
                { email: req.body.email }
            ]
        })
    
        if (cartItems.length == 0) {
            let cartItems = {
                email: req.body.email,
                pId: req.body.pId,
                qty: req.body.qty
            }
            db.insertOne('cartItems', cartItems)
            return res.json({ success: true, message: "The product is added successfully into cart." })
        }

        let original = cartItems[0]
        let newCartItem = {
            email: req.body.email,
            pId: req.body.pId,
            qty: req.body.qty
        }

        db.updateOne('cartItems', original, newCartItem)
        res.json({ success: true, message: "The cart item is updated successfully." })

    },
    clearUserCart: async function (req, res, db) {
        jwt.verify(req.headers['jwt'], config.secret, function (err, decoded) {
            if (err) {
                return res.json({ success: false, message: "The user is not logged in." })
            }
        })

        if (req.params.email == null) {
            return res.json({ success: false, message: "Parameter(s) are missing" })
        }

        let cartItems = await db.find('cartItems', { email: req.params.email })

        if (cartItems.length == 0) {
            return res.json({ success: true, message: "The cart is deleted successfully." })
        }

        for (let item of cartItems) {
            db.deleteOne('cartItems', item)
        }

        res.json({ success: true, message: "The cart is deleted successfully." })

    },
    CleartCartItemWithPId: async function (req, res, db) {
        jwt.verify(req.headers['jwt'], config.secret, function (err, decoded) {
            if (err) {
                return res.json({ success: false, message: "The user is not logged in." })
            }
        })

        if (req.query.pId == null || req.query.email == null) {
            return res.json({ success: false, message: "Parameter(s) are missing...." })
        }

        let cartItems = await db.find('cartItems', { 
            $and: [
                { pId: req.query.pId },
                { email: req.query.email }
            ]
         })

        if (cartItems.length == 0) {
            return res.json({ success: true, message: "The cart item is deleted successfully." })
        }

        let cartItem = cartItems[0]
        db.deleteOne('cartItems', cartItem)

        res.json({ success: true, message: "The cart item is deleted successfully." })
    }
};