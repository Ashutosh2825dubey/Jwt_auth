const express = require('express');
const mongoose = require('mongoose');
const cookieParser=require('cookie-parser')
const app = express();
const authRoutes=require('./routes/authroutes.js');
const { requireAuth,checkUser}=require('./middleware/authMiddleware')
require('dotenv').config();

app.use(express.json());//middleware to parse json data into javascriptobject to be attched in the req handler of the controller to be displayed

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = process.env.DBCONNECT;

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));

// routes
app.get('*',checkUser);// apply the middle ware or custom middleware to every get request
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth,(req, res) => res.render('smoothies'));
app.use(authRoutes);
// setting up cookies itis usddd in user signup as sessionsid is stored in browser that is passed with every request to server and validated avoiding the client to enter the credentialss again and again,but it works for specific time period
// //3rd party  package is used to handle cookies cookie parser
// app.get('/set-cookies',(req,res)=>{
//   // res.setHeader('set-Cookie','newUser=true');
//   res.cookie('newUser',false);//does the same thing as done above ,cookie name and value
//   res.cookie('isEmployee',true,{maxAge:1000*60*60*24,secure:true,httpOnly:true});//3rd argumnet an object where maxage is the time uptill which this cookie will be there in the browser
//   //secure make ssure it will only be send on the https connection
//   //another one is httpOnly measn cannot access through javascript 
//   // for auth we must use https
//   res.send('you got the cookies!')

// });
// app.get('/read-cookies',(req,res)=>{
//   const cookies=req.cookies;
//   console.log(cookies);
//   res.json(cookies);

  
// });