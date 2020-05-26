var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');
var logger = require('morgan');
const helmet = require('helmet');
var compression = require('compression');
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

app.use(express.static(__dirname + 'bower_components'));
app.use(express.static(__dirname + 'node_modules'));
app.use(express.static(__dirname + 'js'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(compression());
app.use(logger('combined', { stream: accessLogStream }));
app.use(helmet());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/validartelefone', function (req, res) {

    var telefone = req.query.telefone;
    var filename = "telefones.txt";

    fs.readFile(filename, 'utf8', function (err, data) {
        if (err) throw err;
        if (data.indexOf(telefone) >= 0) {
            res.send(true);
        }
        else {
            res.send(false);
        }

    });
});

app.get('/salvarurl', function (req, res) {
    
    var url = req.query.url;
    var d = new Date();
    var hora = d.getTime();
    var matricula = req.query.matricula;
    var historico = url + ',' + hora + ',' + matricula + '\n';

    fs.appendFile('historico_urls.txt', historico, function (err) {
        if (err) {
            res.send(false);
        } else {
            res.send(true);
        }
    })
});

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(4444);
