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

            for (var x = 0; x < data.length; x++) {
                if (data[x].city == city) {
                    var trRow = document.createElement('tr');
                    //buils out message div
                    var message = document.createElement('td');
                    var message3 = document.createElement('td');
                    var message1 = document.createElement('td');
                    trRow.setAttribute('class', 'chat-padding');
                    message.setAttribute('class', 'chat-message');
                    message3.setAttribute('class', 'chat-message');
                    message.textContent = data[x].address;
                    message3.textContent = data[x].timeslot;
                    message1.setAttribute('class', 'chat-message');
                    message1.textContent = data[x].brightness;
                    trRow.appendChild(message);
                    trRow.appendChild(message3);
                    trRow.appendChild(message1);

                    messages.appendChild(trRow);
                }
            }
        }
    });
}
