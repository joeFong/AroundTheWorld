var express = require('express')
var cors = require('cors')
var app = express()
var port = process.env.PORT || 4000

app.use(cors());
app.options('*', cors());

app.use(express.static(__dirname + '/public'));
app.listen(port);