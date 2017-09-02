var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
mongoose.connect('localhost:27017/mDb');

var tempPointsArr = ["Kiev","Donetsk","Kharkiv","Kramatorsk","Poltava","Slovyansk",
    "Severodonetsk","Sumi","Boromlya","PetrovkaRom", "Kupyansk","Svatovo", "Bezludovka"
];

var busScheduleSchema = new mongoose.Schema({
    departPoint: String,
    arrivePoint: String,
    departTime: Date,
    arriveTime: Date,
    cost: {type: String, default: 0 },
    freeSits: {type: String, default: 0}
}, {collection:'busSchedule'});

var busScheduleModel = mongoose.model('busScheduleModel', busScheduleSchema);
generateDatabase(1);
/* GET home page. */
router.post('/add', function(req, res, next) {
    new busScheduleModel(req.body).save();
    res.send('successfully add');
});
router.post('/load', function(req, res, next) {
    busScheduleModel.find(req.body).then(function (data) {
        res.send(data);
    });
});
router.post('/update', function(req, res, next) {
    busScheduleModel.findByIdAndUpdate(req.body[0], req.body[1], function (err, data) {
        res.send(data);
    });
});
router.post('/remove', function(req, res, next) {
    busScheduleModel.findByIdAndRemove(req.body.id, function (err, data) {
        res.send(data);
    });
});

module.exports = router;

function generateDatabase(amount) {
    for(var i = 0; i < amount; i++) {
        var item = {
            departPoint: tempPointsArr[Math.floor(Math.random() * 13)],
            arrivePoint: tempPointsArr[Math.floor(Math.random() * 13)],
            departTime: new Date(2017, 9, 1, Math.floor(Math.random() * 24), Math.floor(Math.random()*60), 0),
            arriveTime: new Date(2017, 9, 1, Math.floor(Math.random() * 24), Math.floor(Math.random()*60), 0)
        };
        new busScheduleModel(item).save();
    }
}