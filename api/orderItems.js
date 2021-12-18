var ObjectId = require('mongodb').ObjectID;
module.exports = {
    getOrderItemsOfOrder: async function (orderId, db) {
        let items = []
        if (ObjectId.isValid(orderId)) {
            items = await db.find('orderItems', { orderId: ObjectId(orderId) })
        }
        return items
    },
    getOrderItemOfUser: async function (orderId, pId, db) {
        let items = []
        if (orderId != null && pId != null) {
            items = await db.find('orderItems', {
                $and: [
                    { orderId: ObjectId(orderId) },
                    { pId: ObjectId(pId) }
                ]
            })
        }
        return items
    },
    addOrderItem: async function (object, db) {
        let item = {
            orderId: object.orderId,
            pId: object.pId,
            qty: object.qty,
            price: object.price
        }
        db.insertOne('orderItems', item)
        return true
    },
    deleteOrderItems: async function (orderId, db) {
        let items = await db.find('orderItems', { orderId: ObjectId(orderId) })
        for (let item of items) {
            db.deleteOne('orderItems', item)
        }
        return true
    }
};