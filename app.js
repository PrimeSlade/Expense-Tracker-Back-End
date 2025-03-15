require('dotenv').config();  // For the dotenv package, not dotenvx

const PORT = process.env.PORT; 
const express = require('express');
const authRoutes = require('./routes/route');
const cookie = require('cookie-parser');

//activate express
const app = express();

//for json files
app.use(express.json());

//cookie
app.use(cookie());

//routes
app.use(authRoutes);

//server
app.get('/',(req,res)=>{
    res.send("ok");
    const token = req.cookies.jwt;
    console.log(token);
})



//server
app.listen(PORT, ()=>{
    console.log("server is running on port " + PORT);
})