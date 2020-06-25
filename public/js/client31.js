(function () {
    var element = function (id) {
        return document.getElementById(id);
    };

    //connect to socket.io
    var socket = io.connect('http://localhost:4070');

    //Check for Connection
    if (socket !== undefined) {
        console.log('connected to socket');
    }

    // Handle Output
    socket.on('output', function (data) {
        console.log(data);
        element('count').innerHTML = '(' + data.length + ')';
        if (data.length > 0) {
            element('count').innerHTML = '(' + data.length + ')';
        }
        else {
            element('count').innerHTML = '';
        }
    });
});

$("#Search").click(function () {
    submitRequest();
    return false;
});

function submitRequest() {

    var element = function (id) {
        return document.getElementById(id);
    }
    var city = element('city').value;
    var status = element('status');
    var messages = element('messages');
    var area= element('area').value;
    //connect to socket.io
    var socket = io.connect('http://localhost:4000');

    //Check for Connection
    if (socket != undefined) {
        console.log('connected to socket');
    }

    // Handle Output
    socket.on('output', function (data) {
        console.log(data);
        if (data.length > 0) {
            var address = '';
            var container1 = document.getElementById('container1');
            container1.innerHTML = '';
            for (var x = 0; x < data.length; x++) {
                if (data[x].city == city && data[x].address == area) {

                    /* Heading for each address */
                    var heading = document.createElement('div');
                    heading.setAttribute('class', 'heading');
                    heading.textContent = data[x].address;
                    var lineBreak = document.createElement('br');
                    container1.appendChild(heading);
                    container1.appendChild(lineBreak);

                    /* Container for each address */
                    var container = document.createElement('div');
                    container.setAttribute('class', 'container2');

                    /* Slot 1 card */
                    var card = document.createElement('div');
                    card.setAttribute('class', 'card');
                    var title = document.createElement('div');
                    var brightnesh=document.createElement('div');
                    var brightnes = document.createElement('div');   
                    var percentage = document.createElement('div');
                    title.setAttribute('class', 'title3');
                    brightnes.setAttribute('class','bri')
                    brightnes.setAttribute('class', 'brightness');
                    title.innerText = data[x].timeslot1;
                    brightnes.innerText = data[x].brightness1;

                    card.appendChild(title);
                    card.appendChild(brightnes);
                    card.appendChild(percentage);
                    container.appendChild(card);

                    /* Slot 2 card */
                    card = document.createElement('div');
                    card.setAttribute('class', 'card');
                    title = document.createElement('div');
                    brightnes = document.createElement('div');
                    percentage = document.createElement('div');
                    title.setAttribute('class', 'title3');
                    brightnes.setAttribute('class', 'brightness');
                    title.innerText = data[x].timeslot2;
                    brightnes.innerText = data[x].brightness2;

                    card.appendChild(title);
                    card.appendChild(brightnes);
                    card.appendChild(percentage);
                    container.appendChild(card);

                    /* Slot 3 card */
                    card = document.createElement('div');
                    card.setAttribute('class', 'card');
                    title = document.createElement('div');
                    brightnes = document.createElement('div');
                    percentage = document.createElement('div');
                    title.setAttribute('class', 'title3');
                    brightnes.setAttribute('class', 'brightness');
                    title.innerText = data[x].timeslot3;
                    brightnes.innerText = data[x].brightness3;

                    card.appendChild(title);
                    card.appendChild(brightnes);
                    card.appendChild(percentage);
                    container.appendChild(card);

                    /* Slot 4 card */
                    card = document.createElement('div');
                    card.setAttribute('class', 'card');
                    title = document.createElement('div');
                    brightnes = document.createElement('div');
                    percentage = document.createElement('div');
                    title.setAttribute('class', 'title3');
                    brightnes.setAttribute('class', 'brightness');
                    title.innerText = data[x].timeslot4;
                    brightnes.innerText = data[x].brightness4;

                    card.appendChild(title);
                    card.appendChild(brightnes);
                    card.appendChild(percentage);
                    container.appendChild(card);

                    /* Slot 5 card */
                    card = document.createElement('div');
                    card.setAttribute('class', 'card');
                    title = document.createElement('div');
                    brightnes = document.createElement('div');
                    percentage = document.createElement('div');
                    title.setAttribute('class', 'title3');
                    brightnes.setAttribute('class', 'brightness');
                    title.innerText = data[x].timeslot5;
                    brightnes.innerText = data[x].brightness5;

                    card.appendChild(title);
                    card.appendChild(brightnes);
                    card.appendChild(percentage);
                    container.appendChild(card);

                    /* Slot 6 card */
                    card = document.createElement('div');
                    card.setAttribute('class', 'card');
                    title = document.createElement('div');
                    brightnes = document.createElement('div');
                    percentage = document.createElement('div');
                    title.setAttribute('class', 'title3');
                    brightnes.setAttribute('class', 'brightness');
                    title.innerText = data[x].timeslot6;
                    brightnes.innerText = data[x].brightness6;

                    card.appendChild(title);
                    card.appendChild(brightnes);
                    card.appendChild(percentage);
                    container.appendChild(card);

                    container1.appendChild(container);
                }
            }
        }
    });
}
