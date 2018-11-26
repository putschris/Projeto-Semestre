const exp = require('express');
const router = exp.Router();
const db = require('../database/db').Arduino;

router.get('/', (req, res) => {
    res.json("asd");
});

router.get('/Arduinos', (req, res) => {
    db.getAllArduino()
        .then(arduinos => res.json(arduinos))
        .catch(err => console.log(err));
});

router.get('/Arduinos/Create', (req, res) => {
    res.render('create-arduino');
});

router.get('/Measurements/date/:id', (req, res) => {
    db.GetDataMedicao(req.params.id)
        .then(resultado => {
            res.json(resultado);
        });
    //  req.params.id
});

router.post('/Arduinos/Create', (req, res) => {
    let dados = req.body;
    if(dados.lat > 90 || dados.lat < -90 || dados.lng > 180 || dados.lng < -180)
    {
        res.json({error: "Dados Incorretos"});
    }
    else
    {
        db.CreateArduino(dados)
            .then(() => {
                res.json({error: null});
            })
            .catch(err => {
                res.json({error: "Erro"})
            });
    }
});

router.get('/Measurements', (req, res) => {
    db.getAllMeasurement()
        .then(medicoes => res.json(medicoes))
        .catch(err => console.log(err));
});

router.get('/Measurements/All/:id', (req, res) => {
    db.getLastMeasurements(req.params.id)
        .then(medicoes => {
            res.json(medicoes);
        })
        .catch(err => console.log(err));
});

router.get('/Measurements/Last/:id', (req, res) => {
    db.getLastMeasurement(req.params.id)
        .then(medicoes => {
            res.json(medicoes);
        })
        .catch(err => console.log(err));
});

router.post('/Measurements/LastOne', (req, res) => {
    let mensurements = [];
    db.getLastMeasurement(1).then(results => {

        for (let index = 0; index < req.body.length; index++) {
            mensurements.push(db.getLastMeasurement(req.body[index]));
        }
        Promise.all(mensurements)
            .then(results => {
                res.json(results);
            })
            .catch(err => {
               console.log(err);
            });
    });
    // for (let index = 0; index < req.body.arduinos; index++) {
    //     mensurements.push(db.getLastMeasurement(index));
    // }
});

module.exports = router;