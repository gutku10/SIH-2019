console.log('Server-side code running');

const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const app = express();
const client = require('socket.io').listen(4000).sockets;
const clientChat = require('socket.io').listen(4080).sockets;
const clientcontrol = require('socket.io').listen(4040).sockets;
const clientfeedback = require('socket.io').listen(4020).sockets;
const clientupdate = require('socket.io').listen(4030).sockets;
const clientfeedbackCount = require('socket.io').listen(4070).sockets;


var fs = require('fs');
var path = require('path');

var nodemailer = require('nodemailer');

// serve files from the public directory
app.use(express.static('public'));

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// connect to the db and start the express server
let db;

// ***Replace the URL below with the URL for your database***
const url = 'mongodb://ThaparUser:Pass#123@ds145926.mlab.com:45926/creativeagency';
// E.g. for option 2) above this will be:
// const url =  'mongodb://localhost:21017/databaseName';

MongoClient.connect(url, (err, database) => {
  if (err) {
    return console.log(err);
  }

  db = database;
  // start the express web server listening on 8080
  app.listen(8080, () => {
    console.log('listening on 8080');
  });

  client.on('connection', function (socket) {
    console.log('Client Socket connected');

    let street = db.collection('street');

    // create function to send status//whenever we want to side something from servere side to client side we use emit to do so to show it in html file
    sendStatus = function (s) {
      socket.emit('status', s);
    };

    //get chats from mongo collection
    street.find().limit(100).sort({ _id: 1, city: 1, address: 1 }).toArray(function (err, res) {
      if (err) {
        throw err;
      }
      // emit the messages
      socket.emit('output', res);
    });

    // handle input events
    socket.on('input', function (data) {
      let address = data.address;
      let time = data.time;
      let status = data.status;

      // handle clear
      socket.on('clear', function (data) {
        //remove all chats from the collection
        street.remove({}, function () {
          socket.emit('cleared');
        });
      });
    });
  });

  clientcontrol.on('connection', function (socket) {
    console.log('Client Control Socket connected');

    let street = db.collection('street');
    let feedback = db.collection('feedback');

    // create function to send status//whenever we want to side something from servere side to client side we use emit to do so to show it in html file
    sendStatus = function (s) {
      socket.emit('status', s);
    };

    feedback.find({ "read": "true" }).toArray(function (err, res) {
      if (err) {
        throw err;
      }
      // emit the messages
      socket.emit('output', res);
    });
    //get chats from mongo collection
    street.find().limit(100).sort({ _id: 1 }).toArray(function (err, res) {
      if (err) {
        throw err;
      }
      // emit the messages
      socket.emit('output', res);
    });
    // handle input events
    socket.on('input', function (data) {
      let address = data.address;
      let timeslot = data.timeslot;
      let brightness = data.brightness;

      // handle clear
      socket.on('clear', function (data) {
        //remove all chats from the collection
        street.remove({}, function () {
          socket.emit('cleared');
        });
      });
    });

  });
  clientfeedbackCount.on('connection', function (socket) {
    console.log('Client Feedback Count Socket connected');

    let feedback = db.collection('feedback');


    // create function to send status//whenever we want to side something from servere side to client side we use emit to do so to show it in html file
    sendStatus = function (s) {
      socket.emit('status', s);
    };
    feedback.find({ "read": "false" }).toArray(function (err, res) {
      if (err) {
        throw err;
      }
      // emit the messages
      socket.emit('output', res);
    });

  });

  clientfeedback.on('connection', function (socket) {
    console.log('Client Feedback Socket connected');

    let feedback = db.collection('feedback');

    // create function to send status//whenever we want to side something from servere side to client side we use emit to do so to show it in html file
    sendStatus = function (s) {
      socket.emit('status', s);
    };

    //get chats from mongo collection
    feedback.find().limit(100).sort({ _id: 1 }).toArray(function (err, res) {
      if (err) {
        throw err;
      }
      for (var x = 0; x < res.length; x++) {
        feedback.find({ "_id": res[x]._id }).toArray(function (err, data) {
          if (err) {
            throw err;
          }
          if (data.length == 1) {
            data[0].read = "true";
            feedback.save(data[0]);
          }
        });
      }
      // emit the messages
      socket.emit('output', res);

    });

    // handle input events
    socket.on('input', function (data) {
      let name = data.name;
      let message = data.message;

      // check for name and message
      if (name == '' || message == '') {
        sendStatus('pls enter name and message');
      }
      else {
        feedback.insert({ name: name, message: message }, function () {
          client.emit('output', [data]);

          //send status object
          sendStatus({
            message: 'Message sent',
            clear: true
          });

        });
      }
    });
    // handle clear
    socket.on('clear', function (data) {
      //remove all chats from the collection
      street.remove({}, function () {
        socket.emit('cleared');
      });
    });
  });
  clientupdate.on('connection', function (socket) {
    console.log('Client Update Socket connected');

    let street = db.collection('street');

    // create function to send status//whenever we want to side something from servere side to client side we use emit to do so to show it in html file
    sendStatus = function (s) {
      socket.emit('status', s);
    };

    //get chats from mongo collection
    // street.find().limit(100).sort({ _id: 1 }).toArray(function (err, res) {
    //   if (err) {
    //     throw err;
    //   }
    //   // emit the messages
    //   socket.emit('output', res);
    // });
    // handle input events
    socket.on('input', function (data) {
      let city = data.city;
      let address = data.address;
      let timeslot = data.timeslot;
      let brightness = data.brightness;

      street.find({ "city": city, "address": address }).toArray(function (err, res) {
        if (res.length > 0) {
          street.update(
            { "city": city, "address": address },
            { $set: { "brightness": brightness, "timeslot": timeslot } });

          //send status object
          sendStatus({
            message: 'Data Saved',
            clear: true
          });
        }
        else {
          //send status object
          sendStatus({
            message: 'No matching record found',
            clear: true
          });
        }
      });
    });
  });
  clientChat.on('connection', function (socket) {
    console.log('chat client socket connected');
    let chat = db.collection('chats');
    // create function to send status//whenever we want to side something from servere side to client side we use emit to do so to show it in html file
    sendStatus = function (s) {
      socket.emit('status', s);
    };

    //get chats from mongo collection
    chat.find().limit(100).sort({ _id: 1 }).toArray(function (err, res) {
      if (err) {
        throw err;
      }
      // emit the messages
      socket.emit('output', res);
    });
    // handle input events
    socket.on('input', function (data) {
      let name = data.name;
      let message = data.message;

      // check for name and message
      if (name == '' || message == '') {
        sendStatus('pls enter a name and message');
      }
      else {
        chat.insert({ name: name, message: message }, function () {
          client.emit('output', [data]);

          //send status object
          sendStatus({
            message: 'Message sent',
            clear: true
          });

        });
      }
    });
    // handle clear
    socket.on('clear', function (data) {
      //remove all chats from the collection
      chat.remove({}, function () {
        socket.emit('cleared');
      });
    });
  });

});
let transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: false,
  port: 25,
  auth: {
    user: 'GBM918211@gmail.com',
    pass: 'Pass#123!'
  },
  tls: {
    rejectUnauthorized: true
  }
});
// serve the homepage
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/status', (req, res) => {
  res.sendFile(__dirname + '/public/status.html');
});


app.get('/chat', (req, res) => {
  res.sendFile(__dirname + '/public/chatting.html');
});
app.get('/key', (req, res) => {
  res.sendFile(__dirname + '/public/key.html');
});

app.get('/adminlogin', (req, res) => {
  res.sendFile(__dirname + '/public/admindetect.html');
});
app.get('/control', (req, res) => {
  res.sendFile(__dirname + '/public/control.html');
});

app.get('/control1', (req, res) => {
  res.sendFile(__dirname + '/public/control1.html');
});
app.get('/madmin', (req, res) => {
  res.sendFile(__dirname + '/public/mainadmindetect.html');
});

app.get('/feedback', (req, res) => {
  res.sendFile(__dirname + '/public/feedback.html');
});
app.get('/feedback1', (req, res) => {
  res.sendFile(__dirname + '/public/feedback1.html');
});
app.get('/updateform', (req, res) => {
  res.sendFile(__dirname + '/public/updateform.html');
});


// get the click data from the database
app.post('/find', (req, res) => {
  console.log(req.body);
  var userDetail = req.body;

  db.collection('repairing').find(
    {
      usercontact: repairing.usercontact,
      search: repairing.search,
      userEmail: repairing.userEmail
    }).toArray((err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
});

app.post('/login', (req, res) => {
  console.log(req.body);
  var admindetails = req.body;
  db.collection('admindetail').find(
    {
      id: admindetails.id,
      password: admindetails.password,
      authorization:admindetails.authorization
    }).toArray((err, result) => {
      // result=admindetails.authorization;
      console.log(err);
      console.log(result);
      if (err) {
        res.send(err);
      }
      else {
        res.send(result);
      }
    });
});

app.post('/', (req, res) => {
  console.log(req.body);
  var repairing = req.body;

  db.collection('repairing').save(repairing, (err, result) => {
    console.log(err);
    console.log(result)
    if (err) {
      res.send([{
        message: 'Some error occurred',
        status: false
      }]);
    }
    else {
      let HelperOptions = {
        from: 'GBM918211@gmail.com',
        to: repairing.userEmail,
        subject: "hello!",
        text: 'wow',

      };
      transporter.sendMail(HelperOptions, (error, info) => {
        if (error) {
          console.log(error);
        }
        else {
          console.log("message sent");
        }
      });

      res.send([{
        message: 'Request successfully logged',
        status: true
      }]);
    }
  });
});

app.post('/message', (req, res) => {
  console.log(req.body);
  var feedback = req.body;

  db.collection('feedback').save(feedback, (err, result) => {
    console.log(err);
    console.log(result)
    if (err) {
      res.send([{
        message: 'Some error occurred',
        status: false
      }]);
    }
    else {
      let HelperOptions = {
        from: 'GBM918211@gmail.com',
        to: feedback.email,
        subject: "hello!",
        text: ' Thanks for your feedback',

      };
      transporter.sendMail(HelperOptions, (error, info) => {
        if (error) {
          console.log(error);
        }
        else {
          console.log("message sent");
        }
      });

      res.send([{
        message: 'Request successfully logged',
        status: true
      }]);
    }
  });
});
app.post('/updateForm', (req, res) => {
  console.log(req.body);

  let street = db.collection('street');

  let city = req.body.city;
  let address = req.body.address;
  let streetlightno= req.body.streetlightno;
  let timeslot = req.body.timeslot;
  let brightness = req.body.brightness;

  

  street.find({ "city": city, "address": address ,"streetlightno":streetlightno}).toArray(function (err, findResult) {
    if (findResult.length > 0) {
     if(timeslot == "12am to 3am")
     {
      street.update(
        { "city": city, "address": address },
        { $set: { "brightness1": brightness } });

      res.send([{
        message: 'Request successfully logged',
        status: true
      }]);
    }
    else if(timeslot == "3am to 5am")
     {
      street.update(
        { "city": city, "address": address },
        { $set: { "brightness2": brightness } });

      res.send([{
        message: 'Request successfully logged',
        status: true
      }]);
    }
    else if(timeslot == "5am to 7am")
     {
      street.update(
        { "city": city, "address": address },
        { $set: { "brightness3": brightness } });

      res.send([{
        message: 'Request successfully logged',
        status: true
      }]);
    }
    else if(timeslot == "6pm to 8pm")
     {
      street.update(
        { "city": city, "address": address },
        { $set: { "brightness4": brightness } });

      res.send([{
        message: 'Request successfully logged',
        status: true
      }]);
    }
    else if(timeslot == "8pm to 10pm")
     {
      street.update(
        { "city": city, "address": address },
        { $set: { "brightness5": brightness } });

      res.send([{
        message: 'Request successfully logged',
        status: true
      }]);
    }
    else if(timeslot == "10pm to 12pm")
     {
      street.update(
        { "city": city, "address": address },
        { $set: { "brightness6": brightness } });

      res.send([{
        message: 'Request successfully logged',
        status: true
      }]);
    }

    }
    else {
      res.send([{
        message: 'No matching record found',
        status: false
      }]);
    }
  });
});
