const router = require('express').Router();
const passport = require('passport');
const crypto = require('crypto')

router.get('/', (req,res)=>{
    res.render('login') ;
});
router.get('/reqtask', (req,res)=>{
    res.render('reqtask') ;
});
router.get('/reqsignup', (req,res)=>{
    res.render('reqsignup') ;
});

router.get('/reqreset', (req,res)=>{
    res.render('reqreset') ;
});

router.get('/reqresetpassword/:id', (req,res)=>{
    res.render('reqresetpassword') ;
});

router.get('/logout', (req, res) => {
    // req.session.destroy(err => {
    //     if (err) {
    //         return res.send({ error: 'Logout error' })
    //     }
    //     res.clearCookie(SESS_NAME, {path: '/'})
    //     return res.send({ 'clearSession': 'success' })
    // });
    req.logout();
    res.redirect('/') ;

});

router.get('/reqsignup', (req, res) => {
    //res.sendFile(__dirname + "/reqsignup.html") ;
    res.redirect('/reqsignup') ;
});


router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}));

router.get('/google/reqtask',passport.authenticate('google'), (req, res) => {
    //res.sendFile(__dirname + "/reqtask") ;
    res.redirect('/reqtask') ;
});



module.exports = router;