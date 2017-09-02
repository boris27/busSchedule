var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  govno.govno1++;
  res.send(govno);
});

module.exports = router;
