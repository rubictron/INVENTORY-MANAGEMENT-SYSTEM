var express = require('express');
var router = express.Router();
var passwordHash = require('password-hash');

var myEmail="rubictron.00@gmail.com";
var myEmailPassword="950871784";

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.render('login/register', {layout: "login/layout.hbs", title: 'Register'});
});

router.post('/controller', function (req, res, next) {

    var hashedPassword = passwordHash.generate(req.body.password);
    var r = Math.random().toString(36).substring(2, 7);
    var hashedr = passwordHash.generate(r);

    var q ="INSERT INTO `inventoryms`.`userDetails` (`username`, `email`, `password`) " +
        "VALUES ('"+ req.body.username +
        "', '" +req.body.emailad +
        "', '" + hashedPassword +
        "');";



    var q2 = "INSERT INTO `inventoryms`.`confirm` (`user`, `value`) " +
        "VALUES ('" +req.body.username +
        "', '" + hashedr +
        "');";


    var tc= 'Your Confirmation Code is ' + r + '\n';


    var mailOptions = {
        from: myEmail,
        to: req.body.emailad,
        subject: 'Node Js Confirm Code by Rubictron',


        text: tc
    };

    // console.log(q2);
    req.app.get('pool').getConnection(function (err, connection) {
        if (err) throw err;

        connection.query(q, function (error, results, fields) {
            if (error) connection.rollback();
        });

        connection.query(q2, function (error, results, fields) {
            if (error) throw error;
        });

        connection.release();
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });


        res.redirect('/dboard');
    });

});

router.post('/confirm', function (req, res, next) {

    var q2 = "UPDATE `inventoryms`.`userDetails` SET `role`='level0' WHERE  `username`='"+req.body.username+"';";
    var q = "SELECT  `user`, `value` FROM `inventoryms`.`confirm` where user ='"+req.body.username+"' ;";
        req.app.get('pool').getConnection(function (err, connection) {
            if (err) throw err;
            connection.query(q, function (error, results, fields) {

                if (passwordHash.verify(req.body.confirmcode, results[0].value)) {

                    connection.query(q2, function (error, results, fields) {
                        res.redirect('/dashboard');
                        if (error) throw error;
                    });
                    connection.release();

                }
                else{
                    res.redirect('/');

                }
                if (error) throw error;
            });

        });
});


var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: myEmail,
        pass: myEmailPassword
    }
});


module.exports = router;
