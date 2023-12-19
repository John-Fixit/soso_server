const express = require('express');
const app = express();
require('dotenv').config()
const PORT = process.env.PORT
const URI = process.env.URI
const adminRouter = require('./Routes/admin.route')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const {json} = require('express')
app.use(bodyParser.urlencoded({extended: true, limit: '100mb'}))
app.use(json({limit: '100mb'}))
app.use(cors())
mongoose.connect(URI, (err)=>{
    if(err){
        console.log('Mongoose no connect');
    }else{
        console.log('Mongoose connected successfully');
    }
})
app.use('/', adminRouter)

app.listen(PORT || 5000, ()=>{
    console.log(`Server listen on port: ${PORT}`);
})