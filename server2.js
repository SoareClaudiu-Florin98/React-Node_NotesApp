const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const port = 2001;
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
require(`${__dirname}/app/routes`)(app)
app.listen(port, () => {
    console.log(`App is listening at ${port}`)
})