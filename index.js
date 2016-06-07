var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('public'));

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/test_rtc_3.html');
});

// pre-generate list of ids to be alloted to users (as they come !!)
var listOfUsers = { 'id1' : false, 'id2' : false, 'id3' : false };

var getID = function() {
    for (var id in listOfUsers) {
    	if (listOfUsers[id] == false) {
    		listOfUsers[id] = true
    		return id;
    	}
    }
};

app.get('/getID', function(req, res) {
    res.send(getID());
});

io.on('connection', function(socket) {
    socket.on('chat message', function(msg) {
		io.emit('chat message', msg);
	});
});

// io.on('connection', function(socket) {
// 	socket.on('message', function(msg) {
// 		console.log(msg);
// 		io.emit('message', msg);
// 	});
// 	socket.on('new-channel', function(info) {
// 		console.log(info);
// 		io.emit('new-channel', info);
// 	});
// });

http.listen(3000, function() {
	console.log('listening on *:3000');
});
