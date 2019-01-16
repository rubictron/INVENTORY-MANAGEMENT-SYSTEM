var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {


    role = req.app.get('sessionChecker')(req, res);

    // req.app.get('pool').getConnection(function (err, connection) {
    //     if (err) console.log(err);
    //     connection.query(q, function (error, results, fields) {
    //         if (error) console.log(error);
    //     });
    //     connection.release();
    //
    //
    // });

    res.render('shedule',{layout:"/layout/layout",
        title: "Manage Practical" ,
        currentD:"practical Shedule",

    });

});


router.post('/addPractical',function (req,res,next) {

    role=req.app.get('sessionChecker')(req, res);
    var array=req.body.json;
    array=JSON.parse(array);
    console.log(array);
    console.log(req.body);

    var q="INSERT INTO `inventoryms`.`practical` (`practicalNo`, `module`, `labrotoryId`, `name`) VALUES (?,?,?,?);";
    var q2='\n' +
        'INSERT INTO `inventoryms`.`practicalInstrument` (`pracalNo`, `inventoryNo`, `quentity`) VALUES (?,(select t.typeId from instrumentType t where t.name =?),?);';
    req.app.get('pool').getConnection(function (err, connection) {
        if (err) console.log(err);
        connection.query(q,[req.body.pNo,req.body.module,req.body.labNo,req.body.name], function (error, results, fields) {
            if (error) console.log(error);
        });

        for(var i=0;i<array.length;i++) {
            console.log(array[i][0]+'asdfgh'+array[i][1]);

                var ins;
                connection.query(q2,[req.body.pNo,array[i][0],array[i][1]], function (error, results, fields) {
                    if (error) console.log(error);

                });
        }



        connection.release();
    });
    res.redirect('/lab?lab = '+req.body.labNo);

});






module.exports = router;