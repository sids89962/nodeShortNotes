const express =  require('express');
const mongoose = require('mongoose')
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path')
const methodOverride = require('method-override')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const exphbs = require('express-handlebars');
const connectDB = require('./config/db');


//Load config
dotenv.config({path:'./config/config.env'})

//Passport config
require('./config/passport')(passport)

connectDB();

const app = express()

//Body parser
app.use(express.urlencoded({extended:false}))
app.use(express.json())

// Method override
app.use(
    methodOverride(function (req, res) {
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        let method = req.body._method
        delete req.body._method
        return method
      }
    })
  )

if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}
//Handlebars helper
const {formatDate , stripTags , truncate, editIcon, select} = require('./helpers/hbs')
//settinh handlebars
app.engine('.hbs',exphbs({helpers:{
    formatDate,
    stripTags,
    truncate,
    editIcon,
    select,
}, 
defaultLayout: 'main', extname:'.hbs'}));
app.set('view engine','.hbs');

//Sessions

app.use(session({
    secret:'keyboard cat',
    resave:false,
    saveUninitialized:false,
    store:  MongoStore.create({mongoUrl: process.env.MONGO_URI})
    
}))

//Passport middleware
app.use(passport.initialize())
app.use(passport.session())

//SEt global variable
app.use(function(req,res,next) {
    res.locals.user = req.user || null
    next()
})

//static folder
app.use(express.static(path.join(__dirname,'public')))

//routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))

const PORT = process.env.PORT  || 5000
app.listen(PORT , console.log(`Server runing in  ${process.env.NODE_ENV} mode on port ${PORT}`)
)