// importando o módulo express
const exp = require('express');
// acessando a função Router do código que importei do módulo e essa função, me retornar um objeto do tipo Router.
// Esse router serve para eu colocar middlewares de forma mais organizada em caminhos especificos quando pedidos especificos forem feitos.
const router = exp.Router();

// adiciono um middleware para quando acessarem o meu servidor no caminho
// /logout através de um pedido GET
router.get("/", (req, res) => {
    // verifico se tem um usuário ativo
    // se tiver
    // destruo a sessão
    // e assim deslogo ele
    // já que a sessão é onde fica as informações do usuário
    req.logout();
    // e depois redireciono para o caminho /login
    res.redirect('/login');
});

module.exports = router;