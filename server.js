require('dotenv').config();
const http = require('http');
const express = require('express');
const websocket = require('ws');
const path = require('path');
const app = express();
const server = http.createServer(app);
const wss = new websocket.Server({server});
const mongoose = require('mongoose');
const userUpload = require('./uploadScore.js');
const port = process.env.PORT || 9000;
const router = require('./router.js');

app.use('/',new router(express,mongoose,wss).router);
app.use(express.static(__dirname))
app.use(express.static(path.join(__dirname,'/designjs')))
app.use(express.static(path.join(__dirname,'/jsFiles')))
app.use(express.static(path.join(__dirname,'/sydneyLib')))

server.listen(port,() =>{
    console.log('server listening at port', port)
})