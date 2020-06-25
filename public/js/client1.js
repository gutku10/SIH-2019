(function () {
    var element = function (id) {
        return document.getElementById(id);

    }
    var status = element('status');
    var messages = element('messages');
    var textarea = element('textarea');
    var username = element('username');
    var clearbtn = element('clear');
    //set default status
    var statusDefault = status.textCount;
    var setStatus = function (s) {
        //set staus
        status.textContent = s;
        if (s != statusDefault) {
            var delay = setTimeout(function () {
                setStatus(statusDefault);
            }, 4080);
        }

    }
    //connect to socket.io
    var socket = io.connect('http://localhost:4080');

    //Check for Connection
    if (socket != undefined) {
        console.log('connected to socket');
    }

    // Handle Output
    socket.on('output', function (data) {
        console.log(data);
        if (data.length) {

            for (var x = 0; x < data.length; x++) {
                //buils out message div
                var message = document.createElement('div');
                message.setAttribute('class', 'chat-message');
                message.textContent = data[x].name + ":" + data[x].message;
                messages.appendChild(message);
                messages.insertBefore(message,
                    messages.firstChild);
            }
        }
    });

    // Get Status From server
    socket.on('status', function (data) {
        // Get Message status
        setStatus((typeof data === 'object') ? data.message : data);

        // If status is clear, clear text
        if (data.clear) {
            textarea.value = '';
        }
    });


    // Handle Input
    textarea.addEventListener('keydown', function (event) {
        if (event.which === 13 && (event.shiftKey == false)) {
            // Emit data to server input 
            socket.emit('input', {
                name: username.value,
                message: textarea.value
            })
            event.preventDefault();
        }
    });

    // Handle Chat Clear
    clearbtn.addEventListener('click', function(){
        socket.emit('clear');
    });

    socket.emit('cleared', function(){
        messages.textContent = '';
    });
})();