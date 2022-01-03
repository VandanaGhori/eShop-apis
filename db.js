const MongoClient = require('mongodb').MongoClient;
//const url = 'mongodb://localhost:27017';
const url = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.nwrl7.mongodb.net/${process.env.MONGO_DBNAME}?retryWrites=true&w=majority`;
const dbName = "eshop";
let client;
let db;

module.exports.init = async () => {
    client = new MongoClient(process.env.MONGO_USER && process.env.MONGO_PASS ? url : 'mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect();
        console.log('Connected to Mongodb');
        db = client.db(process.env.MONGO_DBNAME || dbName);
    } catch (err) {
        console.log(err.stack)
    }
};

// Generic method for insert records
module.exports.insertOne = async (collection, object) => {
    return await db
        .collection(collection)
        .insertOne(object);
};

module.exports.updateOne = async (collection, original, change) => {
    return await db
        .collection(collection)
        .updateOne(original, { $set: change });
};

module.exports.deleteOne = async (collection, object) => {
    return await db
        .collection(collection)
        .deleteOne(object);
};

module.exports.find = async (collection, object) => {
    return await db
        .collection(collection)
        .find(object)
        .toArray();
};