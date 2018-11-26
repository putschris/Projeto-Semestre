let db = require("mssql");
let config = {
    user: "bandtec",
    password: "!Vini123",
    server: "bdtestesvini.database.windows.net",
    database: "TwitterClone",
    options: {
        encrypt: true
    }
}

let g = false;

// db.connect(config)
//             .then(conn => {
//                 global.conn = conn;
//                 g = true;
//             })
//             .catch(err => console.log(err));

function SQLQuery(queryLine)
{
    if(g)
    {
        return global.conn.request().
        query(queryLine).
        then(results => {
            return results.recordset;
        })
        .catch(err => console.log(err, 323232))
    }
    else
    {
        return db.connect(config)
            .then(conn => {
                global.conn = conn;
                g = true;
                return global.conn.request().query(queryLine);
            })
            .then(results => {
                return results.recordset;
            })
            .catch(err => console.log(err, 232932));
    }
}

module.exports.Users = {
    insertUser: (user) =>{
        console.log('asdadasda');
        return SQLQuery(`insert into usuario values('${user.nome}','${user.sobrenome}','${user.rg}','${user.cpf}','${user.email}','${user.usuario}','${user.senha}','${user.date}')`)
            .then(() => {
                return SQLQuery(`select * from usuario where usuario.usuario = '${user.usuario}'`);
            });
    },
    getUser: (user) => 
    {
        return SQLQuery(`select * from usuario where usuario.usuario = '${user.usuario}'`);
    },
    getUserId: (id) => {
        return SQLQuery(`select * from usuario where idUsuario = ${id}`);
    }
}   

module.exports.Arduino = {
    getAllMeasurement: () => 
    {
        return SQLQuery(`select temperatura, umidade, co2, Arduino_SerieBox from Measurements inner join Arduino on Measurements.Arduino_SerieBox = Arduino.serieBox`);
    },
    getAllArduino: () => {
        return SQLQuery("select * from Arduino");
    },
    getLastMeasurements: (arduino) => {
        return SQLQuery(`select top(50) temperatura, umidade, co2, idMeasurements, dataMedicao from Measurements where Arduino_SerieBox = ${arduino} order by dataMedicao desc`);
    },
    getLastMeasurement: (arduino) => {
        return SQLQuery(`select top(1) temperatura, umidade, co2, Arduino_SerieBox as arduino from Measurements where Arduino_SerieBox = ${arduino} order by idMeasurements desc`);
    },
    CreateArduino: (arduino) => {
        return SQLQuery(`insert into Arduino values(${arduino.lat}, ${arduino.lng}, '${arduino.ref}')`);
    },
    GetDataMedicao: (id) => {
        return SQLQuery(`select dataMedicao from Measurements where Arduino_SerieBox = ${id} group by dataMedicao`);
    }
}

