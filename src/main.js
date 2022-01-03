const express = require('express')
const path = require('path')
const app = express()
const bodyParser = require('body-parser')
const { nanoid } = require('nanoid')
const fileUpload = require('express-fileupload')
const cors = require("cors");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Added
// for launching front end from the back end server
const history = require('connect-history-api-fallback');

var cookieSession = require('cookie-session')

var products = require('../api/products');
var cartItems = require('../api/cartItems');
var orders = require('../api/orders');
var comments = require('../api/comments');
var users = require('../api/users');

// add reference of dir
//app.use(express.static(path.resolve(__dirname, 'client')))

// conver url parameter to req.params.paramName
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(fileUpload())
app.use(cors());

// Added
// for serving backend api to our front end with single server 
app.use(express.static(path.resolve(__dirname, '../dist'), {maxAge: '1y', etag: false}));
app.use(history());

const db = require('../db.js');
db.init();

app.use(cookieSession({
    name: 'session',
    keys: ['MSD', 'PROG8185']
}))

// root url
// listens at http://localhost:9000/
app.get('/', function(req, res) {
    //  req.query
    //  req.body
    res.send('eShop APIs using node.js')
})


// -------------- Products ----------------

// listens at http://localhost:9000/products
app.get('/products', async function(req, res) {
    setResHeader(res)
    products.getAllProducts(req, res, db)
})

// listens at http://localhost:9000/products
app.get('/products/:id', function (req, res) {
    setResHeader(res)
    products.getProductWithId(req, res, db)
})

// listens at http://localhost:9000/products
app.post('/products', function(req, res) {
    setResHeader(res)
    products.addProduct(req, res, db)
})

// listens at http://localhost:9000/products
app.put('/products/:id', function(req, res) {
    setResHeader(res)
    products.updateProduct(req, res, db)
})

// listens at http://localhost:9000/products
app.delete('/products/:id', function(req, res) {
    setResHeader(res)
    products.deleteProduct(req, res, db)
})



// -------------- Users ----------------

// listens at http://localhost:9000/users
app.get('/users', function(req, res) {
    setResHeader(res)
    users.getAllUser(req, res, db)
})

// listens at http://localhost:9000/users
app.get('/users/:email', function(req, res) {
    setResHeader(res)
    users.getUserWithEmail(req, res, db)
})

// listens at http://localhost:9000/users
app.post('/users', function(req, res) {
    setResHeader(res)
    users.addUser(req, res, db)
})

// listens at http://localhost:9000/users
app.put('/users/:id', function(req, res) {
    setResHeader(res)
    users.updateUser(req, res, db)
})

// listens at http://localhost:9000/users
app.delete('/users/:id', function(req, res) {
    setResHeader(res)
    users.deleteUser(req, res, db)
})

// listens at http://localhost:9000/userlogin
app.post('/userlogin', function(req, res) {
    setResHeader(res)
    users.checkLoginCredentials(req, res, db)
})

// listens at http://localhost:9000/userlogout
app.get('/userlogout', function(req, res) {
    setResHeader(res)
    users.logout(req, res, db)
})

// -------------- Carts ----------------

// listens at http://localhost:9000/carts
app.get('/cartItems', function (req, res) {
    setResHeader(res)
    cartItems.getAllCartItem(req, res, db)
})

// listens at http://localhost:9000/carts
app.get('/cartItems/:email', function (req, res) {
    setResHeader(res)
    cartItems.getCartItemsWithEmail(req, res, db)
})

// listens at http://localhost:9000/carts
app.post('/cartItems', cors(), function (req, res) {
    setResHeader(res)
    cartItems.addCartItem(req, res, db)
})

// listens at http://localhost:9000/carts
app.put('/cartItems/', function (req, res) {
    setResHeader(res)
    cartItems.updateCartItem(req, res, db)
})

// listens at http://localhost:9000/carts
app.delete('/cartItemsUser/:email', function (req, res) {
    setResHeader(res)
    cartItems.clearUserCart(req, res, db)
})

// listens at http://localhost:9000/carts
app.delete('/cartItems', function (req, res) {
    setResHeader(res)
    cartItems.CleartCartItemWithPId(req, res, db)
})


// -------------- Orders ----------------

// listens at http://localhost:9000/orders
app.get('/orders', function(req, res) {
    setResHeader(res)
    orders.getAllOrders(req, res, db)
})

// listens at http://localhost:9000/orders
app.get('/orders/:id', function(req, res) {
    setResHeader(res)
    orders.getOrderWithId(req, res, db)
})

// listens at http://localhost:9000/userOrders
app.get('/userOrders/:email', function(req, res) {
    setResHeader(res)
    orders.getOrdersOfUser(req, res, db)
})

// listens at http://localhost:9000/hasUserOrderedItem
app.get('/hasUserOrderedItem/:email/:pId', function(req, res) {
    setResHeader(res)
    orders.hasUserOrderedItem(req, res, db)
})

// listens at http://localhost:9000/orders
app.post('/orders', function(req, res) {
    setResHeader(res)
    orders.addOrder(req, res, db)
})

// listens at http://localhost:9000/orders
app.delete('/orders/:id', function(req, res) {
    setResHeader(res)
    orders.deleteOrder(req, res, db)
})


// -------------- Comments ----------------

// listens at http://localhost:9000/comments
app.get('/comments', function(req, res) {
    setResHeader(res)
    comments.getAllComment(req, res, db)
})

// listens at http://localhost:9000/comments
app.get('/comments/:id', function(req, res) {
    setResHeader(res)
    comments.getCommentWithpId(req, res, db)
})

// listens at http://localhost:9000/comments
app.post('/comments', function(req, res) {
    setResHeader(res)
    comments.addComment(req, res, db)
})

function setResHeader(res){
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers','Origin,Content-Type,X-Requested-With,Accept,Authorization');
}

// Added
// catch all the routes of the APIs to index.html file of dist folder of vue(front-end) 
// for indexing front-end
app.get('*', (req,res) => {
    console.log("Manage all routes");
    //console.log("Directory Name = " + __dirname + '/dist/index.html');
    res.sendFile(path.join(__dirname, '/dist/index.html'));
    //const fullPath = path.join(__dirname + '/dist/index.html');
    //console.log("Fetching from.." + fullPath);
    //res.sendFile(fullPath);
});


app.listen(process.env.PORT || 9000)

// brew services start mongodb-community@4.4
// Command: node main.js