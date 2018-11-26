let myMap;
let canvas;
const mappa = new Mappa('Leaflet');
const options = {
    lat: 0,
    lng: 0,
    zoom: 14,
    style: "http://{s}.tile.osm.org/{z}/{x}/{y}.png"
}
let sensor = document.getElementById('sensor');
sensor.style.display = 'none';
let data;
let imgs = [];
let sizeImgs = 45;
let currentPosition = null;
let canDraw = true;
function preload() {
    imgs.push(loadImage("imgs/ruim.png"));
    imgs.push(loadImage("imgs/neutro.png"));
    imgs.push(loadImage("imgs/feliz.png"));
}

function setup() {
    canvas = createCanvas(window.innerWidth, window.innerHeight * 0.93);
    navigator.geolocation.getCurrentPosition((pos) => {
        fetch('data/Arduinos')
        .then(res => res.json())
        .then((d) => {
            data = d;
            let arduinosSeen = [];
            options.lat = pos.coords.latitude;
            options.lng = pos.coords.longitude;
            myMap = mappa.tileMap(options);
            myMap.overlay(canvas)

            for (let i = 0; i < data.length; i++) {
                data[i].show = false;           
                data[i].i = 0;
                if (IsClose(options, data[i], 3)) {
                    data[i].show = true;            
                }
                arduinosSeen.push(data[i].serieBox);
            }
            return fetch('/data/Measurements/LastOne', {
                method: 'POST',
                body: JSON.stringify(arduinosSeen),
                headers: {
                    'content-type': 'application/json'
                }
            });
        })
        .then(res => {
            return res.json();
        })
        .then((results) => {
            for (let i = 0; i < results.length; i++) {
                if(results[i][0] != null)
                {
                    for (let j = 0; j < data.length; j++) 
                    {
                        if(data[j].serieBox == results[i][0].arduino)
                        {
                            data[j].co2 = results[i][0].co2;
                            data[j].temperatura = results[i][0].temperatura;
                            data[j].umidade = results[i][0].umidade;       
                            break;                 
                        }
                    }
                }
            }
            for (let i = 0; i < data.length; i++) {
                if(data[i].show)
                {
                    data[i].i = ConvertPolution(data[i]);
                }
            }
            myMap.onChange(mapChange);
            mapChange();
            for(let i = 0; i < data.length; i++)
            {
                const position = myMap.latLngToPixel(data[i].lat, data[i].lon);
                if(data[i].show)
                    image(imgs[data[i].i], position.x, position.y, sizeImgs, sizeImgs);
            }
            setInterval(() => {
                let arduinosSeen = [];
                let center = myMap.fromPointToLatLng(width / 2, height / 2);
                for(let i = 0; i < data.length; i++)
                {
                    if (IsClose(center, data[i], 3)) {
                        data[i].show = true;     
                        arduinosSeen.push(data[i].serieBox);
                    }
                    else
                    {
                        data[i].show = false;            
                    }
                }
                fetch('/data/Measurements/LastOne', {
                    method: 'POST',
                    body: JSON.stringify(arduinosSeen),
                    headers: {
                        'content-type': 'application/json'
                    }
                })
                .then(result => 
                {
                    return result.json();
                })
                .then(result => 
                {
                    // console.log(result);
                    for (let i = 0; i < result.length; i++) 
                    {
                        for (let j = 0; j < data.length; j++) 
                        {
                            if(data[j].serieBox == results[i][0].arduino)
                            {
                                data[j].co2 = results[i][0].co2;
                                data[j].temperatura = results[i][0].temperatura;
                                data[j].umidade = results[i][0].umidade;       
                                break;                 
                            }
                        }
                    }
                    for (let i = 0; i < data.length; i++) {
                        if(data[i].show)
                        {
                            data[i].i = ConvertPolution(data[i]);
                        }
                    }

                })
                .catch(err => console.log(err));
            }, 4000);
        })
        .catch(err => {
            console.log(err);
            
        });
    });
}

setInterval(() => {
    canDraw = true;
}, 700);


function mapChange() 
{
    if (data && data.length && data.length > 0)
        DrawArduinos(data);
}

function DrawArduinos(data) {
    clear();
    const positionCenter = myMap.fromPointToLatLng(width / 2, height / 2);
    for (let i = 0; i < data.length; i++) {
        const position = myMap.latLngToPixel(data[i].lat, data[i].lon);

        if (IsClose(positionCenter, data[i], 3)) {
            data[i].show = true;            
            image(imgs[data[i].i], position.x, position.y, sizeImgs, sizeImgs);
        }
        else
        {
            data[i].show = false;            
        }
    }

    // ShowCollider(data);

    if(currentPosition == null || !currentPosition.show)
    {
        return;
    }

    push();

    console.log(currentPosition);
    

    let x = 0, y = 0;
    x = myMap.latLngToPixel(currentPosition.lat, currentPosition.lon).x;
    y = myMap.latLngToPixel(currentPosition.lat, currentPosition.lon).y;
    
    image(imgs[Convert(currentPosition.temperatura, 5, 37)], x, y - (myMap.zoom() * 2), sizeImgs/2, sizeImgs/2);
    image(imgs[Convert(currentPosition.umidade, 20, 80)], x - (myMap.zoom() * 4), y - (myMap.zoom() * 2), sizeImgs/2, sizeImgs/2);
    image(imgs[Convert(currentPosition.co2, 150, 800)], x + (myMap.zoom() * 4), y - (myMap.zoom() * 2), sizeImgs/2, sizeImgs/2);
    textAlign(CENTER);
    textSize(myMap.zoom());
    text("T", x + myMap.zoom()/2, y - (myMap.zoom() + myMap.zoom()));
    text("Co2", x - (myMap.zoom() * 3), y - (myMap.zoom() + myMap.zoom()));
    text("U", x + (myMap.zoom() * 5), y - (myMap.zoom() + myMap.zoom()));
    
    pop();
}

function ShowCollider(dados)
{
    dados.forEach(arduino => {
        const position = myMap.latLngToPixel(arduino.lat, arduino.lon);
        fill(51);
        ellipse(position.x + sizeImgs/2, position.y + sizeImgs/2, sizeImgs);
    });
}

function mousePressed() 
{
    if(currentPosition != null)
    {
        currentPosition = null;
    }
    const precision = myMap.zoom() * 2.7;
    
    for(let i = 0; i < data.length; i++)
    {
        const position = myMap.latLngToPixel(data[i].lat, data[i].lon);
        if(data[i].show && precision >= Math.sqrt( Math.pow( mouseX - (position.x + sizeImgs/2), 2 ) + Math.pow( mouseY - (position.y + sizeImgs/2), 2 ) ) )
        {
            currentPosition = data[i];
            sensor.style.display = '';
            setSensor(currentPosition.serieBox);
            DrawArduinos(data); 
            break;
        }
    }
}

function setSensor(id)
{
   sensor.href = `/sensores/${id}`;
}

function IsClose(a, b, maxDist) {
    let R = 6371e3; // metres
    let φ1 = radians(a.lat);
    let φ2 = radians(b.lat);
    let Δφ = radians(b.lat - a.lat);
    let Δλ = radians(b.lon - a.lng);
    let f = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    let c = 2 * Math.atan2(Math.sqrt(f), Math.sqrt(1 - f));
    let d = R * c;
    d /= 1000;
    if (d <= maxDist)
        return true;
    else
        return false;
}

function Convert(data, begin, end)
{
    let meio = ((end - begin)/2) + begin;
    let divisao = meio/3;
    if(data > meio)
    {
        let verification = meio;
        for (let i = 2; i >= 0; i--) 
        {
            verification += divisao;
            if(verification >= data)
            {
                return i;   
            } 
        }
    }
    else if(data < meio)
    {
        let verification = meio;
        for (let i = 0; i < 3; i++) 
        {
            verification += divisao;
            if(verification >= data)
            {
                return i;
            } 
        }
    }
    else
    {
        return 2;
    }
}

function ConvertPolution(data)
{
    let c = Convert(data.co2, 150, 800);
    let u = Convert(data.umidade, 20, 80);
    let t = Convert(data.temperatura, 5, 37);
    let i = parseInt((c + u + t) / 3);
    console.log(i);
    
    return i;
}