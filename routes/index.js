var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.html');
});
router.post('/login', function(req, res, next) {
    if(req.body.login === 'admin' && req.body.password === 'admin')
        res.send('true');
    else
        res.send('false');
});



module.exports = router;
