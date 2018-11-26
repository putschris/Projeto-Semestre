const exp = require('express');
const router = exp.Router();

router.get('/', (req, res) => {
    res.json(
        {
            text: "Baryonix é melhor que Barionix"
        }
    )
    // res.render('login');
});

module.exports = router;