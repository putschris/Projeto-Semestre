// importando o módulo express
const exp = require('express');
// acessando a função Router do código que importei do módulo e essa função, me retornar um objeto do tipo Router.
// Esse router serve para eu colocar middlewares de forma mais organizada em caminhos especificos quando pedidos especificos forem feitos.
const router = exp.Router();
//importando o módulo joi
// módulo bem interessante que serve para eu fazer validações de dados
// como irei fazer em seguida.
let joi = require("joi");

// importando o código que criei para facilitar a comunicação com o banco
let db = require("../database/db").Users;
// importando o código que criei para facilitar a encriptografia 
let crypto = require('../Encrypt/crypto').Encrypto;
// crio uma 'objeto' ideal, para comparar com os dados que o usuario enviar
// um objeto em javascript é basicamente uma váriavel com váriavel dentro
// se você pensar, todo objeto a sua volta, tem caracteristicas, como: peso,
// densidade, largura, altura, etc...
// alguns objetos tem caracteristicas diferentes e com valores diferentes.
// É a mesma coisa em javascript, é uma váriavel que tem váriaveis dentro
// nesse caso, crio um objeto ideal que tem os campos(que podem ser consideradas caracteristicas): nome, sobrenome,
// rg, cpf, email, usuario, senha
// e através de joi, adiciono valores a essas campos que vão servir para fazer comparações
let idealSignUP = joi.object().keys({
    // no campo nome, falo que ele tem que ser texto, tiro os espacos que podem ter, passa uma expressão regular, algo bem complexo,
    // mas sendo bem basico, é tipo um código para fazer validação ou pesquisas
    // [a-zA-Z]{3,30}, nesse, to falando que ele só pode ter letras de a-z maiuscula ou minuscula
    // e o tamanho minimo é 3 e o máximo 30
    // o required no final, é para dizer que o campo não pode ser nulo
    nome: joi.string().trim().regex(/^[a-zA-Z]{3,30}$/).required(),
    sobrenome: joi.string().trim().regex(/^[a-zA-Z]{3,60}$/).required(),
    rg: joi.string().trim().regex(/^((\d{2}).(\d{3}).(\d{3})-(\d{1}))*$/).required(),
    cpf: joi.string().trim().regex(/^((\d{3}).(\d{3}).(\d{3})-(\d{2}))*$/).required(),
    email: joi.string().trim().required(),//regex(/^([-a-zA-Z0-9_-]*@(gmail|yahoo|ymail|rocketmail|bol|hotmail|live|msn|ig|globomail|oi|pop|inteligweb|r7|folha|zipmail).(com|info|gov|net|org|tv)(.[-a-z]{2})?)*$/).required(),
    usuario: joi.string().trim().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
    senha: joi.string().trim().regex(/^[a-zA-Z0-9]{3,30}$/).required()
});

const authenticate = require('connect-ensure-login');

router.get("/", authenticate.ensureLoggedOut('/'), (req, res) => {
    res.render('sign-up');
});

// middleware que vai ser executado quando acessarem o meu servidor no caminho /signup através de um 
// pedido POST
router.post("/", (req, res) => {
    // valido o corpo do pedido utilizando como comparação o objeto ideal
    let valido = joi.validate(req.body, idealSignUP);
    // caso não tiver nenhum erro, quer dizer que os dados estão corretos
    if(valido.error == null)
    {
        // crio uma váriavel do tipo Date
        let date = new Date();
        // criando um objeto com as informações do corpo do pedido(req.body) +
        // o novo campo date, que é um texto com a hora atual do servidor.
        let user = {
            ...req.body,
            date: date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + " " + date.getDay() +
                "/" + date.getMonth() + ":" + date.getFullYear()
        }
        // faço uma consulta no banco com essas informações para verificar se tem alguém já com essas informações
        db.getUser(user)
            .then((users) => {
                // caso não tiver ninguém
                if(users.length == 0)
                {
                    // faço a encriptografia da senha
                    user.senha = crypto.EncryptoPassword(user.senha);
                    // e insiro o usuário no banco
                    return db.insertUser(user);
                }
                else
                {
                    // caso já existir, renderizo o arquivo sign-up com o erro "Já existe um usuário com esse nome"
                    res.render("sign-up", { error: "Já existe um usuário com esse nome" });
                }
            })
            .then((user) => {
                // essa inserção que eu faço no banco
                // me retorna um array do que foi inserido
                let result;
                // nesse caso, sempre vai ser um array de tamanho 1
                // pega o primeiro elemento do array
                result = user[0];
                // e faço o mesmo processo que faço no login
                let halfpassword = "";
                for(let i = 0; i < result.senha.length; i+= 2)
                {
                    halfpassword += result.senha[i];
                }
                // só que aqui não faço comparação de senha
                // crio na sessão a váriavel user, que é um objeto com as informações id, username e cod
                req.session.user = { id: result.idUsuario, username: result.usuario, cod: halfpassword, nome: result.nome + " " + result.sobrenome }
                // redireciono para o inicio da página.
                res.redirect('/');
            })
            .catch(err => console.log(err));
    }
    else
    {
        // caso existir um erro, renderizo o arquivo sign-up.hbs e envio o valor do erro junto.
        res.render("sign-up", { error: valido.error });
    }
});

module.exports = router;