// importando o módulo express
const exp = require('express');
// acessando a função Router do código que importei do módulo e essa função, me retornar um objeto do tipo Router.
// Esse router serve para eu colocar middlewares de forma mais organizada em caminhos especificos quando pedidos especificos forem feitos.
const router = exp.Router();

const authenticate = require('connect-ensure-login');

router.get("/home", authenticate.ensureLoggedIn('/login'), (req, res) => {
    if (req.session.passport && req.session.passport.user) {
        let user = req.session.passport.user;
        res.render("index", {
            user: {
                name: user.nome,
                url: "/users/" + user.id
            }
        })
    }
});

// caso alguém acessar no caminho / por um pedido GET, o meu servidor vai executar essa função anônima
router.get('/', (req, res) => {
    // e essa função anônima, manda como resposta para o pedido feito, um redicionamento para o caminho /home
    res.redirect('/home');
});

// permito exportarem o váriavel router.
// E esse arquivo é importado lá no arquivo app.js
// nessa linha importo app.use('/', require('./routers/home'));
// E como você pode ver, informo que quando um pedido no caminho '/' for feito, esse código será executado
// e nesse código, tem as configurações mais detalhas para tipo de pedido, nesse caso sendo, apenas pedidos do tipo GET
// Se eu tivesse colocado /home lá no app.use, todos os caminhos que coloco no router.get(), tenho que considerar que já teria o /home antes.
/*
O que antes era assim
router.get("/home", (req, res) => {
    res.render("index", { user: {
        name: "Vinicius Viana",
        url: "/users/" + 3
    } });
});

teria que está assim.
router.get("/", (req, res) => {
    res.render("index", { user: {
        name: "Vinicius Viana",
        url: "/users/" + 3
    } });
});
Porque se tivesse do jeito anterior, esse middleware que coloco, seria apenas executado quando alguém acessasse o caminho /home/home.
O que é algo que estaria errado.
*/
// permito importarem desse código apenas a váriavel router.
module.exports = router;