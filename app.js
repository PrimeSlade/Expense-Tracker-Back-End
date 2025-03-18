require('dotenv').config();  // For the dotenv package, not dotenvx

const PORT = process.env.PORT; 
const express = require('express');
const authRoutes = require('./routes/route');
const cors = require('cors');
const cookie = require('cookie-parser');
const requireAuth = require('./middleware/requireAuth');

//activate express
const app = express();

//for json files
app.use(express.json());

//cors
app.use(cors({
    origin: 'http://localhost:5173',  // Allow frontend from localhost:5173
    credentials: true,  // Allow cookies to be sent with requests
}));

//cookie
app.use(cookie());

//routes
app.use(authRoutes);

//server VERY IMPORTANT need to change !!!
app.get('/',requireAuth ,(req,res)=>{
  res.json('ok');
})

//server
app.listen(PORT, ()=>{
    console.log("server is running on port " + PORT);
})
