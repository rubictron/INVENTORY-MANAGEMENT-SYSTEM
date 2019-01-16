var express = require('express');
var router = express.Router();
var role;


router.get('/', function(req, res, next) {

    role=req.app.get('sessionChecker')(req, res);

    q="SELECT i.inventoryNo,i.availability,it.name,l.name as labname" +
        " from instrument i inner join laboratory l inner join instrumentType it" +
        " on i.laboratory = l.labNo AND i.`type`=it.typeId where l.labno= ? ";


    q2="select MAX(SUBSTRING(i.inventoryNo,2,5)) as id from instrument i";


    q3 = "SELECT * FROM `inventoryms`.`instrumentType` LIMIT 1000;";

    q4 = "select MAX(SUBSTRING(t.typeId,2)) as typeid from instrumentType t";

    q5 = "select d.username from userDetails d";

    var maxid;
    var maxid_t;
    req.app.get('pool').getConnection(function (err, connection) {

        connection.query(q2,function (error, results, fields) {
            if(results[0].id==null)
                maxid=1;
            else
                maxid=parseInt(results[0].id)+1;

            if(maxid<10)maxid="i000"+maxid;
            else if (maxid<100) maxid = "i00"+maxid;
            else if (maxid<1000) maxid ="i0"+maxid;
            else maxid= "i"+maxid;
            if (error) res.redirect('back');
        });

        connection.query(q4,function (error, results, fields) {
            if(results[0].typeid==null)
                maxid_t=1;
            else
                maxid_t=parseInt(results[0].typeid)+1;

            if(maxid_t<9)maxid_t="T000"+maxid_t;
            else if (maxid_t<99) maxid_t = "T00"+maxid_t;
            else if (maxid_t<999) maxid_t ="T0"+maxid_t;
            else maxid_t= "T"+maxid_t;
            if (error) res.redirect('back');
        });



        connection.query(q,[req.query.lab],  function (error, results, fields) {
            connection.query(q3,function (error, results2, fields) {
                var labname="no data";
                // if(!isNaN(results[0].labname))currentd=results[0].labname;

                connection.query(q5,function (error, results3, fields) {
                    var labname="no data";
                    // if(!isNaN(results[0].labname))currentd=results[0].labname;


                    res.render('lab', {
                        layout:"/layout/layout",
                        title: "laboratory" ,
                        currentD:labname,
                        results:results,
                        usernames:results3,
                        maxid:maxid,
                        maxid_t:maxid_t,
                        lab:labname,
                        labNo:req.query.lab,
                        innstrumentType:results2
                    });
                    if (error) res.redirect('back');
                });


            });
            if (error) res.redirect('back');
        });
        if (err) res.redirect('back');
        connection.release();
    });
});


router.post('/additem', function(req, res, next) {

    role=req.app.get('sessionChecker')(req, res);

    var q="INSERT INTO `inventoryms`.`instrument` " +
        "(`inventoryNo`, `availability`, `type`, `laboratory`) " +
        "VALUES (?, '1', ?, ?);";
    req.app.get('pool').getConnection(function (err, connection) {
        if (err) res.redirect('back');
        console.log(q);
        console.log(req.body.inventoryNo+
            req.body.inventoryType+
            req.body.labNo);
        connection.query(q,[req.body.inventoryNo,
                            req.body.inventoryType,
                            req.body.labNo], function (error, results, fields) {
            res.redirect('/inventory?inventoryNo='+req.body.inventoryNo);
            if (error) res.redirect('back');
        });
        connection.release();
    });

});



router.post('/additem', function(req, res, next) {

    role=req.app.get('sessionChecker')(req, res);

    var q="INSERT INTO `inventoryms`.`instrument` " +
        "(`inventoryNo`, `availability`, `type`, `laboratory`) " +
        "VALUES (?, '1', ?, ?);";
    req.app.get('pool').getConnection(function (err, connection) {
        if (err) console.log(err);
        connection.query(q,
            [req.body.inventoryNo,
            req.body.inventoryType,
            req.body.labNo], function (error, results, fields) {
            res.redirect('/inventory?inventoryNo='+req.body.inventoryNo);
            if (error) console.log(error);
        });
        connection.release();
    });

});


router.post('/addItemType', function(req, res, next) {

    role=req.app.get('sessionChecker')(req, res);

    var q="INSERT INTO `inventoryms`.`instrumentType` (`typeId`, `name`) VALUES (?, ?);";
    req.app.get('pool').getConnection(function (err, connection) {
        if (err) console.log(err);
        connection.query(q,[
            req.body.inventoryTypeNo,
            req.body.inventoryType,
            ],
            function (error, results, fields) {


            res.redirect('/lab?lab='+req.body.labNo);
            if (error) console.log(error);
        });
        connection.release();
    });

});

module.exports = router;