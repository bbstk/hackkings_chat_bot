const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const bot = require('./index');

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    console.log('a user %s connected', socket.id);
    //io.emit('chat message' , `User ${socket.id} has joined!`, { for: 'everyone' });

    socket.on('disconnect', function(){
        //io.emit('chat message', `User ${socket.id} has left!` , { for: 'everyone' });
        console.log('user %s disconnected', socket.id);
    });

    socket.on('chat message', function(msg){
        socket.emit('chat message', `[${socket.id}]> ${msg}`);
        return bot.resolve(socket.id, msg, function(err, messages) {
            if(err) {
                return socket.emit('chat message', 'Oops I had a boo boo.');
            }

            return messages.forEach(function(message) {
                return socket.emit('chat message', `[BOT]> ${message.content}`);
            });
        });
    });
});

http.listen(80, function(){
    console.log('listening on *:80');
});