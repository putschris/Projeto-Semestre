//importando express o módulo Express
// a função require serve para eu importar coisas, esse já pesquisa o nome do que to passando na pasta node_modules
// então, como passei o texto "express", então ele vai procurar pelo módulo express na pasta node_modules
// mais a frente, eu utilizo o require, mas passo o texto './routers/home', está vendo que coloco o ./ , 
// faço isso para eu subir uma pasta e sair da pasta node_modules e ao colocar /routers/home, informo que 
// o arquivo que quero importar está na pasta routers e ele se chama home.
let exp = require("express");
//Criando um objeto do tipo express ao executar o código que importei do módulo express
let app = exp();
//importando o módulo path
let path = require('path');
//importando o módulo cors
let cors = require('cors');

let passport = require('passport');

// app.use(passport.initialize());
// app.use(passport.session());

//configurando onde ficará os arquivos que serão renderizados para o cliente
// como arquivos do tipo: hbs, ejs, pug e ate mesmo html.
app.set('views', path.join(__dirname, 'views'));
// configurando que o arquivo que vai ser renderizado para o cliente vai ser do tipo hbs
app.set('view engine', 'hbs');
//permito o meu servidor processar no corpo de pedidos, informações do tipo JSON.
app.use(exp.json());
// importando o módulo express-session
let session = require('express-session');

/*
 nos use, eu passo funções ou códigos que vão ser executados quando pedidos forem feitos ao meu servidor.
 utilizamos isso para processar os pedidos das formas que quisermos, utilizando diversos módulos ou
 próprio código nossos.
 essas funções ou código que vão ser executando quando pedidos forem feitos, o chamamos de middlewares.
 para ter uma boa visão de como isso funciona, é como se os pedidos tivessem que passar por várias salas e cada sala
 faz algo com o pedido.
 Algumas salas são só atendidas por pedidos especificos ou quando os pedidos acessam caminhos especificos.
 se eu só passo o código/função na função use, sem passar mais nada como parâmetro, então esse código/função
 vai ser executado quando qualquer pedido for feito ao meu servidor ou em outras palavras
 todos os pedidos vão passar sempre por essa sala.
 Se eu passo um argumento primeiro
 app.use('/login', require('./routers/login'));
 como nesse caso, que eu passo também o texto '/login'
 estou configurando que o código que está sendo importado do arquivo login vai ser apenas executado quando
 um pedido pro meu servidor for feito no caminho /login
*/

// informando quis middlewares vão ser usados em qualquer pedido que for feito ao servidor.
// o middleware cors(), permite que meu servidor possa fazer pedidos para ele mesmo, sem isso, o navegador não deixa.
app.use(cors());
// esse middleware serve para pegar a informação que vai junto na url
// https://www.google.com.br/search?q=asdas&rlz=1C1CHZL_pt-BRBR749BR749&oq=asdas+&aqs=chrome..69i57j69i60l2j0l3.1838j0j7&sourceid=chrome&ie=UTF-8
// como nesse caso, onde tem informações a partir de https://www.google.com.br/search?
// q=asdas&rlz=1C1CHZL_pt-BRBR749BR749&oq=asdas+&aqs=chrome..69i57j69i60l2j0l3.1838j0j7&sourceid=chrome&ie=UTF-8
// esse middleware permite eu acessar essa informação mais facilmente.
app.use(exp.urlencoded({ extended: false }));

// middleware para criar sessões para quando alguém logar no meu servidor, ele permanecer logando enquanto ele estiver passeando
// pelas paginas do meu servidor.
app.use(session({
  secret: 'my express secret',
  saveUninitialized: true,
  resave: true
}));
app.use(passport.initialize());
app.use(passport.session());

require('./Autorizathion/authrozian')(passport);

// middleware para informar que todo o arquivo estatico, vai esta na pasta public
// arquivo estatico, é os CSS, Imagens, Gifs, etc...
app.use(exp.static(path.join(__dirname, '/public/')));

// middleware para criar sessões para quando alguém logar no meu servidor, ele permanecer logando enquanto ele estiver passeando
// pelas paginas do meu servidor.
// app.use(session({
//   secret: 'my express secret',
//   saveUninitialized: true,
//   resave: true,
//   store: new FileStore()
// }));

// middleware para eu usar em conjunto com o anterior, é para fazer validações.
// app.use(expressValidator());

// agora os middlewares que são vão ser executados em determinados caminhos.

// middleware que vai ser executado na página inicial do meu site.
// o middleware é o código que está no arquivo home.
app.use('/', require('./routers/home'));

// middleware que vai ser executado no caminho /login
// o middleware é o código que está no arquivo home.
app.use('/login', require('./routers/login'));

// middleware que vai ser executado na caminho /logout
// o middleware é o código que está no arquivo home.
app.use('/logout', require('./routers/login'));

// middleware que vai ser executado na caminho /signup
// o middleware é o código que está no arquivo home.
app.use('/signup', require('./routers/signup'));

// middleware que vai ser executado na caminho /about
// o middleware é o código que está no arquivo home.
app.use('/about', require('./routers/about'));

// middleware que vai ser executado na caminho /map
// o middleware é o código que está no arquivo home.
app.use('/map', require('./routers/map'));

// middleware que vai ser executado na caminho /data
// o middleware é o código que está no arquivo home.
app.use('/data', require('./routers/data'));

// middleware que vai ser executado na caminho /sensores
// o middleware é o código que está no arquivo home.
app.use('/sensores', require('./routers/sensor'));

app.use('/logout', require('./routers/logout'));

require('./database/db').Arduino.getAllArduino()
  .then(resultado => {
    // configurando o meu servidor para ser hospedado na porta 5000 do meu pc.
    app.listen(5000);    
  });


// o que eu atribuo ao module.exports, é o que eu posso importar se eu usar require e falar que eu quero importar esse arquivo.
// caso eu faça isso, então terei acesso a váriavel app
module.exports = app;

// vá para o arquivo home.js na pasta routers.