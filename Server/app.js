'use strict'

require('dotenv').configDotenv()

const expreess = require('express')
const router = require('./routes')

const app = expreess()
const port = 3000

app.use(router)

app.listen(port, () => {
    console.log(`app running in port ${port}`)
})
