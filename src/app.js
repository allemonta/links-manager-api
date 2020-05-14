const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser');

const path = require('path')
require('dotenv').config({
    path: path.join(__dirname, '..', '.env')
})

const googleRouter = require('./routers/google')
const itemRouter = require('./routers/item')
const pageRouter = require('./routers/page')
const routerRouter = require('./routers/section')

const app = express()
const port = process.env.LINKS_MANAGER_API_PORT || 3001

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(googleRouter)
app.use(itemRouter)
app.use(pageRouter)
app.use(routerRouter)

app.get('*', (req, res) => {
    res.send({
        title: '404',
        errorMessage: 'Page not found'
    })
})

app.use(function (error, req, res, next) {
    console.log('Errore gestito: ', error.toString())
    res.send({ errore: error.toString() });
});

app.listen(port, () => {
    console.log("Server is up on port " + port + ".")
})