const express = require("express")
const path = require("path")
const mysql = require("mysql")
const dotenv = require("dotenv")
const session = require('express-session')
const MySQLStore = require('express-mysql-session')(session);

dotenv.config({ path: './.env'})

const app = express()

const db = mysql.createConnection({
    host: process.env.database_host,
    user: process.env.database_user,
    password: process.env.database_password,
    database: process.env.database
})

db.connect( (error) => {
    if(error) {
        console.log(error)
    } else {
        console.log("MySQL Connected")
    }
})

const sessionStore = new MySQLStore({}, db);

app.use(session({
    secret: process.env.SESSION_SECRET, // add a SESSION_SECRET in your .env file
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 hours
}));

const publicDirectory = path.join(__dirname, './public')
app.use(express.static(publicDirectory))

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.set('view engine', 'hbs')

//Define Routes
app.use('/', require('./routes/pages'))
app.use('/auth', require('./routes/auth'))

app.listen(5000, () => {
    console.log("Server Started on port 5000")
})


