const LocalStrategy = require('passport-local').Strategy;
let encrypt = require('../Encrypt/crypto').Encrypto;
let db = require('../database/db').Users;

module.exports = function (passport) 
{

    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (usuario, done) {
        // console.log(id);
        db.getUserId(usuario.id)
            .then(user => {
                done(null, user[0]);
            })
            .catch(err => console.log(err));
    });

    passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    },
        (username, password, done) => {
            // console.log(usuario, senha, done);
            db.getUser({ usuario: username})
                .then((user) => 
                {
                    if(user.length == 0)
                    {   
                        return done(null, false);
                    }

                    // caso esse não tiver um tamanho zero
                    let result;
                    // pego o primeiro registro que ele encontrou
                    result = user[0];
                    // comparo essa senha com a senha encriptografada no banco
                    let isEqual = encrypt.ComparePassword(result.senha, password);
                    // caso não for igual
                    if(!isEqual)
                    {
                        return done(null, false);
                    }
                    else
                    {
                        // se for igual.
                        // na sessão atual do servidor, crio uma váriavel e passo as informações do usuario.
                        // e depois redireciono ele para a pagina inicial do servidor.
                        return done(null, { id: result.idUsuario, nome: result.nome + " " + result.sobrenome }); 
                    }
                })
                .catch(err => {
                    return done(null, false);
                })
        }
    ));
}