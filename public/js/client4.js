(function () {
    var element = function (id) {
        return document.getElementById(id);
    }

    var status = element('status');

    var swiperw = element('swiperw');
    


    //set default status
    var statusDefault = status.textCount;
    var setStatus = function (s) {
        //set staus
        status.textContent = s;
        if (s != statusDefault) {
            var delay = setTimeout(function () {
                setStatus(statusDefault);
            }, 4020);
        }

    }
    //connect to socket.io
    var socket = io.connect('http://localhost:4020');

    //Check for Connection
    if (socket != undefined) {
        console.log('connected to socket');
    }

    // Handle Output
    socket.on('output', function (data) {
        console.log(data);
        if (data.length) {

            for (var x = 0; x < data.length; x++) {
                var divslide= document.createElement('div');
    
                //buils out message div
                var message = document.createElement('div');
              
                var message1 = document.createElement('div');
                divslide.setAttribute('class','swiper-slide');
                message.setAttribute('class', 'name');
                message.textContent = data[x].name;
                message1.setAttribute('class','feed');
                
                message1.textContent = data[x].message;

                divslide.appendChild(message);
                
                divslide.appendChild(message1);
              
                swiperw.appendChild(divslide);
                // messages.insertBefore(message,
                //     messages.firstChild);
                // messages.insertBefore(message1,
                //         messages.firstChild);

            }
        }
    });

    // Get Status From server
    socket.on('status', function (data) {
        // Get Message status0
        setStatus((typeof data === 'object') ? data.message : data);

        // If status is clear, clear text
        if (data.clear) {
            textarea.value = '';
        }
    });


})();