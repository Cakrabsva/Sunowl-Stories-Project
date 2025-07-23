'use strict'

require('dotenv').configDotenv()

const express = require('express')
const router = require('./routes')
const errorHandler = require('./helpers/errorHandler')
const cors = require('cors')

const app = express()
const port = process.env.PORT

app.use(express.urlencoded({extended:true}))
// app.use(express.json());
app.use(cors())
app.use(router)
app.use(errorHandler)

module.exports = {app, port}
