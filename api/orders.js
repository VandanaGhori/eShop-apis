var orderItems = require('./orderItems');
var ObjectId = require('mongodb').ObjectID;
module.exports = {
    getAllOrders: async function (req, res, db) {
        let orders = await db.find('orders', {})

        for (let order of orders) {
            var items = await orderItems.getOrderItemsOfOrder(order._id, db)
            order.items = items
        }

        res.json(orders)
    },
    getOrderWithId: async function (req, res, db) {
        var id = req.params.id
        if (!ObjectId.isValid(id)) {
            return res.json({ success: false, message: "Id is invalid" })
        }

        let orders = await db.find('orders', { _id: ObjectId(id) })
        if (orders.length > 0) {
            var order = orders[0]
            order.items = await orderItems.getOrderItemsOfOrder(order._id, db)
            res.json(order)
        } else {
            res.json({ success: false, message: "The order does not exist" })
        }
    },
    getOrdersOfUser: async function (req, res, db) {
        var email = req.params.email
        if (email == null) {
            return res.json({ success: false, message: "Parameter(s) are missing" })
        }

        let orders = await db.find('orders', { email: email })
        if (orders.length > 0) {
            for (let order of orders) {
                var items = await orderItems.getOrderItemsOfOrder(order._id, db)
                order.items = items
            }    
            res.json(orders)
        } else {
            res.json({ success: false, message: "No orders exist for the user." })
        }
    },
    hasUserOrderedItem: async function (req, res, db) {
        if (req.params.pId == null || req.params.email == null) {
            return res.json({ success: false, message: "Parameter(s) are missing" })
        }

        var pId = req.params.pId
        if (!ObjectId.isValid(pId)) {
            return res.json({ success: false, message: "Product id is invalid" })
        }

        let orders = await db.find('orders', { email: req.params.email })
        for (let order of orders) {
            var items = await orderItems.getOrderItemOfUser(order._id, pId, db)
            if (items.length > 0) {
                return res.json({ success: true, message: "The order item exists for the user." })
            }
        }
        res.json({ success: false, message: "The order item does not exist for the user." })
    },
    addOrder: async function (req, res, db) {
        if (req.body.email == null || req.body.dateTime == null || req.body.totalPrice == null || req.body.items == null) {
            return res.json({ success: false, message: "Parameter(s) are missing" })
        }

        if(req.body.items.length == 0) {
            return res.json({ success: false, message: "Order items are empty" })
        }

        for (let item of req.body.items) {
            if (item.pId == null || item.qty == null || item.price == null) {
                return res.json({ success: false, message: "Parameter(s) are missing" })
            }
        }

        let order = {
            email: req.body.email,
            dateTime: req.body.dateTime,
            totalPrice: req.body.totalPrice
        }
        db.insertOne('orders', order)

        var items = req.body.items
        for (let item of items) {
            item.orderId = order._id
            if(!(await orderItems.addOrderItem(item, db))) {
                return;
            }
        }

        res.json({ success: true, message: "The order is added successfully." })
    },
    deleteOrder: async function (req, res, db) {
        var id = req.params.id
        if (!ObjectId.isValid(id)) {
            return res.json({success: false, message: "Id is invalid"})
        }

        let orders = await db.find('orders', { _id: ObjectId(id) })
        let order = null
        if(orders.length > 0) {
            order = orders[0]
        } else {
            return res.json({success: true, message: "The order is deleted successfully."})
        } 
        orderItems.deleteOrderItems(order._id, db)
        db.deleteOne('orders', order)
        res.json({success: true, message: "The order is deleted successfully."})
    }
};