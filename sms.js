const bodyParser = require('body-parser')
const app = require('express')();
const http = require('http').Server(app);
const bot = require('./index');

const accountSid = "AC0060ba1eddeaa9233750c3579a014da9";
const authToken = process.env.twilioToken;

//require the Twilio module and create a REST client 
const client = require('twilio')(accountSid, authToken); 

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/', function(req, res){
    res.send("Hello!!");
});

app.post('/sms', function(req, res){
    var smsBody = req.body.Body;
    var smsSender = req.body.From;


    bot.resolve(smsSender, smsBody, function(err, messages) {
        if(err) {
            console.log("Bot could not resolve: ", err);
        }

        console.log(messages[0].content);
        
        client.messages.create({ 
            to: smsSender, 
            from: "+447481340035", 
            body: messages[0].content, 
        }, function(err, message) { 
            console.log(message.sid); 
        });
    });

    /*
    console.log("From ", smsSender);
    console.log("Body ", smsBody);

    client.messages.create({ 
        to: smsSender, 
        from: "+447481340035", 
        body: smsBody, 
    }, function(err, message) { 
        console.log(message.sid); 
    });*/

    //res.send("Hello!!");
});

/*io.on('connection', function(socket){
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
});*/

http.listen(80, function(){
    console.log('listening on *:80');
});