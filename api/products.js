var ObjectId = require('mongodb').ObjectID;
module.exports = {
    getAllProducts: async function (req, res, db) {
        let products = await db.find('products', {})
        res.json(products)
    },
    getProductWithId: async function (req, res, db) {
        var id = req.params.id
        if (!ObjectId.isValid(id)) {
            return res.json({success: false, message: "Id is invalid"})
        }

        let products = await db.find('products', { _id: ObjectId(id) })
        if(products.length > 0) {
            res.json(products[0])
        } else {
            res.json({success: false, message: "The product does not exist"})
        }
    },
    addProduct: async function (req, res, db) {
        if(req.body.title == null || req.body.image == null || req.body.description == null || 
            req.body.features == null || req.body.price == null || req.body.shippingCost == null) {
            return res.json({success: false, message: "Parameter(s) are missing"})
        }
        let product = {
            title: req.body.title,
            image: req.body.image,
            description: req.body.description,
            features: req.body.features,
            price: req.body.price,
            shippingCost: req.body.shippingCost
        }
        db.insertOne('products', product)
        res.json({success: true, message: "The product is added successfully."})
    },
    updateProduct: async function (req, res, db) {
        if(req.params.id == null || req.body.title == null || req.body.image == null || req.body.description == null || 
            req.body.features == null || req.body.price == null || req.body.shippingCost == null) {
            return res.json({success: false, message: "Parameter(s) are missing"})
        }

        var id = req.params.id
        if (!ObjectId.isValid(id)) {
            return res.json({success: false, message: "Id is invalid"})
        }

        let products = await db.find('products', { _id: ObjectId(id) })
        let original = null
        if(products.length > 0) {
            original = products[0]
        } else {
            return res.json({success: false, message: "The product does not exist."})
        } 

        let newProduct = {
            _id: ObjectId(id),
            title: req.body.title,
            image: req.body.image,
            description: req.body.description,
            features: req.body.features,
            price: req.body.price,
            shippingCost: req.body.shippingCost
        }
        db.updateOne('products', original, newProduct)
        res.json({success: true, message: "The product is updated successfully."})
    },
    deleteProduct: async function (req, res, db) {
        var id = req.params.id
        if (!ObjectId.isValid(id)) {
            return res.json({success: false, message: "Id is invalid"})
        }

        let products = await db.find('products', { _id: ObjectId(id) })
        let product = null
        if(products.length > 0) {
            product = products[0]
        } else {
            return res.json({success: true, message: "The product is deleted successfully."})
        } 

        db.deleteOne('products', product)
        res.json({success: true, message: "The product is deleted successfully."})
    }
};
