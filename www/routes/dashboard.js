var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('dashboard', {layout:"/layout/layout",title: 'Dashboard',currentD:"dashboard"});
});

module.exports = router;
