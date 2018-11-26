const exp = require('express');
const router = exp.Router();

router.get('/:id', (req, res) => {
    res.render('graphics', { id: req.params.id });
    // res.json(req.params.id);
});
router.get('/', (req, res) => {
    res.render('graphics');
    // res.json(req.params.id);
});

module.exports = router;