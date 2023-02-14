'use strict';
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const serverless = require('serverless-http');
const app = express();
var cors = require('cors')
const bodyParser = require('body-parser');
const router = express.Router();

const JWT_SECRET = "3B8MSS$6(N2%%1NDhhdf6D091%7@@7da0jdkjj%*jds*QQJUS9([Ra}"
const connectionUrl = "mongodb+srv://admin:5OqQw0B1zLNvDhYt@cluster0.npypzlq.mongodb.net/?retryWrites=true&w=majority"

app.use(express.json())
app.use(cors())

mongoose.connect(connectionUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

router.get("/", (req, res) => res.status(200).send("wassup doc"))

router.get('/another', (req, res) => res.json({ route: req.originalUrl }));
router.post('/', (req, res) => res.json({ postBody: req.body }));

app.use(bodyParser.json());
app.use('/.netlify/functions/server', router);  // path must route to lambda
app.use('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));

module.exports = app;
module.exports.handler = serverless(app);
