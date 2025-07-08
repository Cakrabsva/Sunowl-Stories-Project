'use strict'

require('dotenv').configDotenv()

const expreess = require('express')
const router = require('./routes')

const app = expreess()
const port = 3000

app.use(expreess.urlencoded({extended:true}))
app.use(router)

module.exports = app
