/* 
    TODO: Project
    ? npm i -D nodemon
    ?  enctype="multipart/form-data" in form b/c of image uploading
    ? //* image upload
        * var storage = multer.diskStorage({ router
    ? https://datatables.net/
    ? static files are uploads here
    ? unDraw for svg https://undraw.co/search
    ? svg icon https://icons8.com/icons/set/trash
*/

require('dotenv').config()
require('./db/connect')

const express = require('express')
const path = require('path')
const routers = require('./routers/routers')
const session = require('express-session')
const app = express()

//* static files
const staticPath = path.join(__dirname, '../public')
app.use(express.static(staticPath))

//* middleware
app.use(express.urlencoded({ extended : false }))
app.use(express.json())

app.use(
    session({
        secret: 'my secret key',
        saveUninitialized: true,
        resave: false,
    })
)

app.use((req, res, next) => { //? auth for verifying user
    res.locals.message = req.session.message
    delete req.session.message
    next()
})

//* template engine
const templatePath = path.join(__dirname, '../template/views')
app.set('view engine', 'ejs')
app.set('views', templatePath)

//* router prefix
app.use(routers)

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`http://127.0.0.1:${port}`))