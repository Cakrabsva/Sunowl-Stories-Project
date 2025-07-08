'use strict'

const {app, port} = require("./app")

app.listen(port, () => {
    console.log(`app running in port ${port}`)
})