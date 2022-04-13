const express = require('express')
const app = express()
require('dotenv').config()
const logger = require('morgan')
const fs=require('fs')
const mongoose = require('mongoose')

//import the routes here
const mpesaRoutes=require('./routes/mpesa')

app.use(logger('common', {
    stream: fs.createWriteStream("./logs/access.log",
    {flags: 'a'})
  }))
app.use(logger('dev'))

app.use('/api',mpesaRoutes)

mongoose.connect(
    process.env.DB,
    { useNewUrlParser: true },
    ()=>console.log('Connected to DB')
)
app.listen(process.env.PORT)