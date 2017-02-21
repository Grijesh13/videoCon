
// var express = require('express');
// var https = require('https');
// var fs = require('fs');
// var cors = require('cors');

// var privateKey = fs.readFileSync('/etc/letsencrypt/live/www.6path.com/privkey.pem').toString();
// var certificate = fs.readFileSync('/etc/letsencrypt/live/www.6path.com/fullchain.pem').toString();
// // var ca = fs.readFileSync().toString();

// var app = express();
// app.use(cors());

// var httpsServer = https.createServer( {key: privateKey, cert: certificate}, app );
// var io = require('socket.io').listen(httpsServer);

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/test_rtc_multi_2.html');
});

var listOfUsers = [];

function getID() {
    var id = Math.random().toString(36).substring(7);
    listOfUsers.push(id);
    return id;
};

function ifRoomActive() {
    // >1 becoz you dont want to count yourself.
    if (listOfUsers.length > 1) {
        return true;
    }
    return false;
};

function getListOfUsers(myID) {
    var usersWithoutMe = listOfUsers.slice();
    var index = usersWithoutMe.indexOf(myID);
    usersWithoutMe.splice(index, 1);
    return usersWithoutMe;
};

app.get('/getListOfUsers/:myID', function(req, res) {
    res.send(getListOfUsers(req.params.myID));
});

app.get('/getID', function(req, res) {
    res.send(getID());
});

app.get('/ifRoomActive', function(req, res) {
    res.send(ifRoomActive());
});

io.on('connection', function(socket) {
    socket.on('ice message', function(msg) {
		io.emit('ice message', msg);
	});
    socket.on('sdp message', function(msg) {
        console.log(msg);
        io.emit('sdp message', msg);
    });
});

// httpsServer.listen(3000);

http.listen(3000, function() {
	console.log('listening on *:3000');
});
