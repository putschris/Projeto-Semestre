let context = document.getElementById("chart").getContext("2d");
context.canvas.width = 1000;
context.canvas.height = 200;
let context1 = document.getElementById("chart1").getContext("2d");
context1.canvas.width = 1000;
context1.canvas.height = 200;
let context2 = document.getElementById("chart2").getContext("2d");
context2.canvas.width = 1000;
context2.canvas.height = 200;

let select = document.getElementById('abc');

Visible('carregando');
Invisible('container');

let canvas1, canvas2, canvas3;
canvas1 = document.getElementById('Analitico1');
canvas2 = document.getElementById('Analitico2');
canvas3 = document.getElementById('Analitico3');

let id = parseInt(document.getElementById('id').textContent);

let configuration = {
    type: 'line',
    data: {
        datasets: [{
            label: "Temperature",
            type: 'line',
            backgroundColor: ['rgb(249, 197, 222)'],
            fill: false
        }],
    },
    options: {
        scales: {
            xAxes: [{
                distribution: 'series',
                ticks: {
                    beginAtZero: true
                }
            }],
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'medições'
                },
                ticks: {
                    beginAtZero: true
                }
            }]
        },
        animation: {
            duration: 0
        }
    }
};

let configuration1 = {
    type: 'line',
    data: {
        datasets: [{
            label: "Umidade",
            type: 'line',
            backgroundColor: ['rgb(249, 197, 222)'],
            fill: false
        }],
    },
    options: {
        scales: {
            xAxes: [{
                distribution: 'series',
                ticks: {
                    beginAtZero: true
                }
            }],
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'medições'
                },
                ticks: {
                    beginAtZero: true
                }
            }]
        },
        animation: {
            duration: 0
        }
    }
};

let configuration2 = {
    type: 'line',
    data: {
        datasets: [
            {
                label: "CO2",
                type: 'line',
                backgroundColor: ['rgb(249, 197, 222)'],
                fill: false
            }],
    },
    options: {
        scales: {
            xAxes: [{
                distribution: 'series',
                ticks: {
                    beginAtZero: true
                }
            }],
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'medições'
                },
                ticks: {
                    beginAtZero: true
                }
            }]
        },
        animation: {
            duration: 0
        }
    }
};

let chart = new Chart(context, configuration);
let chart1 = new Chart(context1, configuration1);
let chart2 = new Chart(context2, configuration2);
this.time = 0;

function get_data() {
    fetch("/data/Measurements/All/" + id)
        .then(res => res.json())
        .then(medicoes => {
            if (medicoes.length == 0) {
                return;
            }
            medicoes.forEach(data => {
                chart.data.labels.push(this.time);
                chart1.data.labels.push(this.time);
                chart2.data.labels.push(this.time);
                this.time++;
                chart.data.datasets[0].data.push(parseFloat(data.temperatura));
                chart1.data.datasets[0].data.push(parseFloat(data.umidade));
                chart2.data.datasets[0].data.push(parseFloat(data.co2));
                chart.update();
                chart1.update();
                chart2.update();
            });

            return fetch('/data/Measurements/date/' + id);
        })
        .then(resultado => resultado.json())
        .then(resultados => {
            // console.log(resultados);
            setSelectDate(resultados);
            CalcularTudo();
            Invisible('carregando');
            Visible('container');
        })
        .catch(err => console.log(err));
}

get_data();

function setSelectDate(dates) {
    dates.forEach(element => {
        element.dataMedicao = element.dataMedicao.split('T')[0];
        element.dataMedicao = element.dataMedicao.split('-');
        element.dataMedicao = element.dataMedicao[2] + "/" + element.dataMedicao[1] + "/" + element.dataMedicao[0];

        let option = document.createElement('option');
        option.value = element.dataMedicao;
        option.innerText = element.dataMedicao;
        select.appendChild(option);
    });
}

setInterval(() => {
    fetch("/data/Measurements/Last/" + id)
        .then(res => res.json())
        .then(medicoes => {
            if (chart.data.labels.length == 50
                && chart.data.datasets[0].data.length == 50
                && chart1.data.datasets[0].data.length == 50
                && chart2.data.datasets[0].data.length == 50) {
                chart.data.labels.shift();
                chart1.data.labels.shift();
                chart2.data.labels.shift();
                chart.data.datasets[0].data.shift();
                chart1.data.datasets[0].data.shift();
                chart2.data.datasets[0].data.shift();
            }
            medicoes.forEach(data => {
                chart.data.labels.push(this.time);
                chart1.data.labels.push(this.time);
                chart2.data.labels.push(this.time);
                this.time++;
                chart.data.datasets[0].data.push(parseFloat(data.temperatura));
                chart1.data.datasets[0].data.push(parseFloat(data.umidade));
                chart2.data.datasets[0].data.push(parseFloat(data.co2));
                chart.update();
                chart1.update();
                chart2.update();
            });

            CalcularTudo();
        })
        .catch(err => console.log(err));
}, 5000);

function CalcularTudo() {
    CalcularAnalitico(canvas1, chart.data.datasets[0].data);
    CalcularAnalitico(canvas2, chart1.data.datasets[0].data);
    CalcularAnalitico(canvas3, chart2.data.datasets[0].data);
}

function CalcularAnalitico(p, data) {
    let msg = '';
    let mediana = parseInt(data.length * 0.5);
    let q1 = parseInt(data.length * 0.25);
    let q2 = parseInt(data.length * 0.75);
    let soma = 0;
    let media = 0;
    let min = Infinity;
    let max = -Infinity;

    for (let i = 0; i < data.length; i++) {
        if (min > data[i]) {
            min = data[i];
        }

        if (max < data[i]) {
            max = data[i];
        }

        soma += data[i];
    }
    media = parseFloat(soma / data.length).toFixed(2);
    // chartRadar.data = {
    //     labels: ['Media', '1° Quartil', '3° Quartil', 'Mediana', 'Mínimo', 'Máximo'],
    //     datasets: [
    //         {
    //                 "label": "Analytics",
    //                 "data": [media, data[q1], data[q2], data[mediana], min, max],
    //                 "fill": true,
    //                 "backgroundColor": "rgba(255, 99, 132, 0.2)",
    //                 "borderColor": "rgb(255, 99, 132)",
    //                 "pointBackgroundColor": "rgb(255, 99, 132)",
    //         }
    //     ]
    // }
    // msg += "Media: " + media + '<br>';
    // msg += "1° Quartil: " + data[q1] + '<br>';
    // msg += "3° Quartil: " + data[q2] + '<br>';
    // msg += "Mediana: " + data[mediana] + '<br>';
    // msg += "Minimo: " + min + '<br>';
    // msg += "Maximo: " + max;

    // p.innerHTML = msg;
}

function Visible(id) {
    document.getElementById(id).style.display = '';
}

function Invisible(id) {
    document.getElementById(id).style.display = 'none';
}