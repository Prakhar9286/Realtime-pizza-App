require('dotenv').config()
const express = require('express');
const app = express()
const path = require('path')
const ejs = require('ejs')
const expressLayout = require('express-ejs-layouts')

const PORT = process.env.PORT || 3300
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('express-flash')
const MongoDbStore = require('connect-mongo')

//Database connection
const url = 'mongodb://localhost/pizza';
mongoose.connect(url, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: true});
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('Database connected...');
}).catch(err => {
    console.log('Connection failed')
});

//Session store

//Session config
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store:MongoDbStore.create({
        client: connection.getClient()
    }),
    saveUninitialized: false,
    cookie: { maxAge: 1000*60*60*24 } //24 hours
}))

app.use(flash())

//Assets
app.use(express.static('public'))
app.use(express.json())

//Global middlewares
app.use((req, res, next) => {
    res.locals.session = req.session
    next()
})

//set template engine
app.use(expressLayout)
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')

require('./routes/web')(app)

app.listen(PORT, () => {
    console.log(`listening at ${PORT}`)
})
