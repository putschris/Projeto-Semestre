const exp = require('express');
const router = exp.Router();
const passport = require('passport');
const authenticate = require('connect-ensure-login');

router.get('/', authenticate.ensureLoggedOut('/'), (req, res) => {
    res.render('login');
});

router.post('/', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login'}) , (req, res) => {
    
});

module.exports = router;