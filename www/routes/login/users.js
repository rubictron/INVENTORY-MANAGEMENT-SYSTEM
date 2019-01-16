var express = require('express');
var router = express.Router();
var role;


/* GET users listing. */
router.get('/', function (req, res, next) {
    req.app.get('sessionChecker')(req, res);
   var role= req.app.get('sessionChecker')(req, res);
    if(role=='admin'){
        var q ="select ud.username,ud.email,ud.role from userDetails ud";
    }else{
        var q ="select ud.username,ud.email,ud.role from userDetails ud WHERE username= '"+req.session.username+"';";

    }

    req.app.get('pool').getConnection(function (err, connection) {
        if (err) throw err;

        connection.query(q, function (error, results, fields) {
            if (error) throw err;
            console.log(results);
            res.render('login/users', {
                layout: "login/layout.hbs",
                title: 'Users',
                user:results
                });
        });
        connection.release();
    });


});





module.exports = router;
