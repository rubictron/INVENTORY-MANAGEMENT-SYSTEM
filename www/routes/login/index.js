var express = require('express');
var router = express.Router();
var passwordHash = require('password-hash');

/* GET home page. */
router.get('/', function (req, res, next) {

    if (!req.session.user) {
        res.render('login/index', {title: 'Login', layout: "login/layout.hbs"});
    } else {
        res.redirect('/dboard');
    }


});

router.get('/dboard', function (req, res, next) {
    req.app.get('sessionChecker')(req, res);
   res.redirect('/dashboard');
});


router.get('/logout', function (req, res, next) {
    req.session.destroy(function (err) {
    });
    res.redirect('/');
});

router.post('/logincontroller', function (req, res, next) {
    var q = "SELECT id,username,password,role FROM `inventoryms`.`userDetails`  WHERE  username = '"
        + req.body.username + "';";
    req.app.get('pool').getConnection(function (err, connection) {
        if (err) throw err;
        connection.query(q, function (error, results, fields) {
            console.log(results);
            if (passwordHash.verify(req.body.password, results[0].password)) {
                if (results[0].role === null) {

                    res.render('login/confirm', {
                        layout: "login/layout.hbs", title: 'Confirm',username:req.body.username
                    });
                } else {

                    req.session.user = true;
                    req.session.role = results[0].role;
                    req.session.username = results[0].username;
                    req.session.userId = results[0].id;
                    res.redirect('/dashboard');
                }
            }
            else {
                res.render('login/index', {
                    layout: "login/layout.hbs", title: 'Login',
                    msg: "Access denide"
                });
            }
            connection.release();
            if (error) throw error;
        });
    });


});


module.exports = router;
