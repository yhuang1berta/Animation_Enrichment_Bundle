/* server.js - Express server*/
'use strict';
const log = console.log
// log('Express server')

const express = require('express')

const app = express();

app.use(express.static(__dirname + '/pub'))

app.get('/', (req, res) => {
	res.sendFile("./pub/example.html", {root: __dirname})
})

// process.env.PORT or port 5000 for deployment.
const port = process.env.PORT || 5000
app.listen(port, () => {
	log(`Listening on port ${port}...`)
})  // localhost development port 5000  (http://localhost:5000)

