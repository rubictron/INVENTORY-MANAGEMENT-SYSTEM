var express = require('express');
var router = express.Router();
var role;


router.get('/', function(req, res, next) {

    role=req.app.get('sessionChecker')(req, res);

    var q = 'SELECT username,headline,note' +
        ' FROM notice n inner join userDetails u ON n.user= u.id' +
        ' WHERE n.dateTim = (SELECT MAX(dateTim) FROM notice)';
    req.app.get('pool').getConnection(function (err, connection) {
        if (err) res.redirect('back');
        connection.query(q, function (error, results, fields) {
            res.send(results[0]);

            if (error) res.redirect('back');
        });
        connection.release();
    });
});

router.get('/allnotice', function(req, res, next) {

    role=req.app.get('sessionChecker')(req, res);


    var q = 'SELECT DAY(n.dateTim) as d,MONTH(n.dateTim) as m,YEAR(n.dateTim) as yr,username,headline,note ' +
        'FROM notice n inner join userDetails u on n.user=u.id ;';
    req.app.get('pool').getConnection(function (err, connection) {
        if (err) res.redirect('back');
        connection.query(q, function (error, results, fields) {

            res.render('notice',{layout:"/layout/layout",
                title: "Notice Board" ,
                currentD:"notice Board",
                result:results,
                });

            if (error) res.redirect('back');
        });
        connection.release();
    });
});

router.post('/addnotice',function (req,res,next) {

    role=req.app.get('sessionChecker')(req, res);

    var q='INSERT INTO `inventoryms`.`notice` (`user`, `headline`, `note`) VALUES (\'' +req.session.userId+
        '\', \'' +req.body.headLine+
        '\', \'' +req.body.note1+
        '\');';
    req.app.get('pool').getConnection(function (err, connection) {
        if (err) res.redirect('back');
        connection.query(q, function (error, results, fields) {
            res.redirect('allnotice')
            if (error) res.redirect('back');
        });
        connection.release();
    });
    
});




module.exports = router;