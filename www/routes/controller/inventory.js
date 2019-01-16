var express = require('express');
var router = express.Router();
var inventoryno;
var role;


router.get('/', function(req, res, next) {

    role=req.app.get('sessionChecker')(req, res);

    try {

        q = "SELECT i.inventoryNo,it.name,i.availability,l.name " +
            "from instrument i inner join laboratory l " +
            "inner join instrumentType it  " +
            "on i.laboratory=l.labNo AND i.`type`=it.typeId " +
            "where i.inventoryNo= ?";
        q2 = "SELECT DAY(id.detailId) as d,MONTH(id.detailId) " +
            "as m,YEAR(id.detailId) as yr,time(id.detailId) " +
            "as t,content FROM  instrumentDetails id where id.inventryNo= ? ";

        inventoryno = req.query.inventoryNo;
        // req.app.get('pool').getConnection(function (err, connection) {
        //     if (err) throw err;
        //     connection.query(q,[req.query.inventoryNo],  function (error, result1, fields) {
        //
        //         connection.query(q2,[req.query.inventoryNo],  function (error, result2, fields) {
        //             console.log(result2);
        //             res.render('inventoryDetails.hbs', {
        //                 layout:"/layout/layout",
        //                 title: "Instrument Details" ,
        //                 results1:result1,
        //                 results2:result2
        //             });
        //
        //             if (error) throw error;
        //
        //         });
        //
        //         if (error) throw error;
        //     });

        /////////////////////////
        req.app.get('pool').getConnection(function (err, connection) {


            if (err) console.log(err);
            connection.query(q, [req.query.inventoryNo], function (error, result1, fields) {

                if (error) console.log(error);
                else {
                    connection.query(q2, [req.query.inventoryNo], function (error, result2, fields) {
                        res.render('inventoryDetails.hbs', {
                            layout: "/layout/layout",
                            title: "Instrument Details",
                            results1: result1,
                            results2: result2,
                            labNo:'lab1'

                        });

                        if (error) console.log(error);

                    });
                }

            });

            connection.release();
        });

    }
    catch  (e){
        console.log(e);
    }
});


router.post('/addDetail',function (req,res,next) {

    role=req.app.get('sessionChecker')(req, res);

    console.log(req.body.detail);

   var q="INSERT INTO `inventoryms`.`instrumentDetails` (`content`, `inventryNo`) VALUES (?,?);";

    req.app.get('pool').getConnection(function (err, connection) {
        if (err) console.log(err);
        connection.query(q,[req.body.detail,inventoryno], function (error, results, fields) {
            console.log(q);
            res.redirect('/inventory?inventoryNo='+inventoryno);
            if (error) console.log(error);
        });
        connection.release();
    });

});


router.post('/getq',function (req,res,next) {

    role=req.app.get('sessionChecker')(req, res);

    var q='select count(i.inventoryNo) as q from instrument i inner join instrumentType t on i.`type`=t.typeId where t.name=? AND i.availability=1;';

    req.app.get('pool').getConnection(function (err, connection) {
        if (err) console.log(err);
        connection.query(q,[req.body.quentity], function (error, results, fields) {
            // console.log(q);
            res.send(results);
            if (error) console.log(error);
        });
        connection.release();
    });

});

router.post('/order',function (req,res,next) {

    role=req.app.get('sessionChecker')(req, res);
    console.log('order');
    var array=req.body.json;
    array=JSON.parse(array);
    console.log(array);

     var q = 'INSERT INTO `inventoryms`.`barrowed` (`userId`, `instrumentId`, `issu_user`) ' +
         'VALUES ((select id  from userDetails ud where username = ?), ?, ?);';

     var q2='select min(i.inventoryNo) as insno from instrumentType t ' +
         'inner join instrument i on t.typeId=i.`type` ' +
         'where t.name = ? and i.availability = 1';

     var q3='UPDATE `inventoryms`.`instrument` SET `availability`="0" WHERE  `inventoryNo`=?;';


    req.app.get('pool').getConnection(function (err, connection) {
        if (err) res.send('there is error');

    for(var i=0;i<array.length;i++) {

        console.log(array[i][1]);

        for (var j = 0; j < parseInt(array[i][1]); j++) {

            console.log(array[i][0]);
            var ins;
            connection.query(q2,[array[i][0]], function (error, results, fields) {

                ins=results[0].insno;
                console.log(ins);
                connection.query(q,[req.body.user_b,ins,req.session.userId], function (error, results, fields) {
                    if (error) console.log(error);
                });
                connection.query(q3,[ins], function (error, results, fields) {
                    if (error) console.log(error);
                });

                if (error) console.log(error);
            });

        }


    }


        connection.release();
    });

    res.send('make order sucssesfully');
});







module.exports = router;