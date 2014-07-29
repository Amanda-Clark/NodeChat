var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mysql = require('mysql');

var conn = mysql.createConnection({
    host: 'localhost',
    user: 'XXXXX',
    password: 'XXXXX',
    database: 'chat'

});
app.get('/', function(req, res){
    res.sendfile('index.html');
});
var conmsg=' has connected';
var dismsg = ' has disconnected';

//Connection disconnected and connected

io.on('connection', function(socket){

    socket.on('nick set', function(nick){
        console.log(nick +' has connected');

        io.emit('con msg',nick+ ' has connected');

    });

    socket.on('disconnect', function(){
        console.log('user disconnected');
        io.emit('dis msg', dismsg);

    });

    socket.on('chat message', function(msg){
        console.log('message: ' + msg);
        var objToday = new Date();
        var post={time: objToday, message: msg.message};

        conn.connect();

        conn.query('INSERT INTO messages SET ?', post, function(err, result) {
            console.log(err);
            console.log(result);
            conn.end();

        });
    io.emit('chat message', msg);

    });

    socket.on('is typing', function(nick){
       io.emit('is typing', nick);

    });
});


http.listen(8000, function(){
    console.log('listening on *:8000');
});