let form = document.getElementById('adcArduino');

form.addEventListener('submit', (event) =>
{
    event.preventDefault();
    let getData = new FormData(form);
    let data = {
        lat : parseFloat(getData.get('lat')),
        lng : parseFloat(getData.get('lng')),
        ref: getData.get('ref')
    }

    fetch('/data/Arduinos/Create', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'content-type': 'application/json'
        }
    })
    .then((res) => res.json())
    .then((data) => {
        if(data.error)
        {
            document.getElementById('erro').innerHTML = data.error;
        }
        else
        {
            document.getElementById('erro').innerHTML = "Arduino Inserido com Sucesso";
        }
        form.reset();
        
    });
});