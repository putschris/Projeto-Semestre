const exp = require('express');
const router = exp.Router();

const authenticate = require('connect-ensure-login');

// router.get("/", authenticate.ensureLoggedIn('/login'),  (req, res) => {
//     res.render("map");
// });

router.get("/",  (req, res) => {
    res.render("map");
});

module.exports = router;