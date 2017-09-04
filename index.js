var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
var fileServer = "http://192.9.200.70:8080"
/*---*/
var { part} = require('./part.js');
var { serial } = require('./serial.js');
var { aline } = require('./aline_serial.js');
var { part_part } = require('./part_part.js');
var { partarc } = require('./partarc.js');
var { parttools } = require('./parttools.js');
var { tempi } = require('./tempi.js');
var { ext } = require('./ext.js');
var { exttemp } = require('./exttemp.js');
var { proc } = require('./proc.js');
var { locations } = require('./locations.js');
var { spec7 } = require('./spec7.js');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

var port = process.env.PORT || 4001;

var router = express.Router();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Cache-Control', 'no-cache');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

router.route('/inter/:partname')
    .get((req,res) => part(req,res));

router.route('/inter/aline/:serial')
    .get((req,res) => aline_serial(req,res));

router.route('/inter/serial/:serialname')
    .get((req,res) => serial(req,res));

router.route('/inter/part/:part')
    .get((req,res) => part_part(req,res));

router.route('/inter/partarc/:part/:type')
    .get((req,res) => partarc(req,res));

router.route('/inter/parttools/:part/')
    .get((req,res) => parttools(req,res));

router.route('/inter/tempi/:part/')
    .get((req,res) => tempi(req,res));

router.route('/inter/ext/:part/:isqa')
    .get((req,res) => ext(req, res, fileServer));

router.route('/inter/exttemp/:part/')
    .get((req,res) => exttemp(req, res, fileServer));

router.route('/inter/proc/:part/')
    .get((req,res) => proc(req,res, fileServer));

router.route('/inter/locations/:part')
    .get((req,res) => locations(req,res));

router.route('/inter/spec7/:part')
    .get((req,res) => spec7(req,res));

router.get('/', function(req, res) {
    res.json({
        message: 'hooray! welcome to our api!'
    });
});

app.use('/', router);
app.listen(port);
console.log('Magic happens on port ' + port);