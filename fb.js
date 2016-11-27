"use strict";
 
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();
const bot = require('./index');
const path = require('path')
var hbs = require('hbs');
var fs = require('fs');
app.set('port', (process.env.PORT || 60));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
 
// parse application/json
app.use(bodyParser.json());
app.set('view engine', '.hbs')  
app.set('views', path.join(__dirname, 'views'))  

app.use('/static', express.static(path.join(__dirname)));
 
// index
app.get('/', function (req, res) {
    console.log(req);
    res.send('hello world i am a secret bot')
});

app.get('/graph', function (req, res) {
    res.render("graph.hbs",{})
});
 
// for facebook verification
app.get('/webhook/', function (req, res) {
    console.log(req);
    if (req.query['hub.verify_token'] === '-_TestToken619_-') {
        return res.send(req.query['hub.challenge'])
    }
    return res.send('Error, wrong token')
});
 
// to post data
app.post('/webhook/', function (req, res) {
    //console.log(req);
    //console.log(req);
    var data = req.body;
    //console.log(data)
    if(data.object !== 'page') {
        return;
    }
 
    var pageEntry = data.entry;
    res.send();
    return pageEntry.forEach(function(entry) {
        return entry.messaging.forEach(function(event) {
            //console.log(event);
            //console.log("~~~~~~~ event.postback: ", event.postback);
           
            var sender = event.sender.id;


            //CAN HANDLE POSTBACKS FROM BUTTONS NOW
            if(event.postback != undefined) {
                var text = event.postback.payload;
                return bot.resolve(sender, text, function(err, messages) {
                    return messages.forEach(function(message) {


                        if(message.skill === "help"){
                            return sendMessageWithButtons(sender, message.content);
                        }
                        return sendTextMessage(sender, message.content);
                    });
                });
            }

            
            //console.log(sender);
            if (event.message && event.message.text) {
                var text = event.message.text;
                return bot.resolve(sender, text, function(err, messages) {
                    return messages.forEach(function(message) {
                        console.log(message.skill);
                        if(message.skill === "help"){
                            return sendMessageWithButtons(sender, message.content);
                        }
                        return sendTextMessage(sender, message.content);
                    });
                });
            }
        });
    });
});
 
 
// recommended to inject access tokens as environmental variables, e.g.
// const token = process.env.PAGE_ACCESS_TOKEN
const token = "EAADiB5qMxzgBAL51qWWMZBDdKuKj3IEKDhIbfF9JO5tjhcdvNGeiTMjbEHcq0GHaL1LrEOheKGgQBbRVTrnppqEkrF1YYC7EAwrQfWJh0g15B6Vss33sZBZBYZAYIP3JpHV4jxZAOzVd470tFTW30hFMTIvNZCfv9ZBmA6dZAlZAiTgZDZD";
 
function sendMessageWithButtons(sender, text) {

    var messageData = {
            "attachment":{
              "type":"template",
              "payload":{
                "template_type":"generic",
                "elements":[
                  {
                    "title":"Help command",
                    //"image_url":"http://petersapparel.parseapp.com/img/whiteshirt.png",
                    "subtitle":"Some example commands:",
                    "buttons":[
                      {
                        "type":"postback",
                        "title":"Balance",
                        "payload":"balance"
                      },
                        {
                        "type":"postback",
                        "title":"Last Purchase",
                        "payload":"Last Purchase"
                      }
                    ]
                  }
                ]
              }
            }
          }

    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    });
}

function sendTextMessage(sender, text) {
    var messageData = { text:text };
 
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    });
}
 
function sendGenericMessage(sender) {
    var messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "First card",
                    "subtitle": "Element #1 of an hscroll",
                    "image_url": "http://messengerdemo.parseapp.com/img/rift.png",
                    "buttons": [{
                        "type": "web_url",
                        "url": "https://www.messenger.com",
                        "title": "web url"
                    }, {
                        "type": "postback",
                        "title": "Postback",
                        "payload": "Payload for first element in a generic bubble",
                    }],
                }, {
                    "title": "Second card",
                    "subtitle": "Element #2 of an hscroll",
                    "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
                    "buttons": [{
                        "type": "postback",
                        "title": "Postback",
                        "payload": "Payload for second element in a generic bubble",
                    }],
                }]
            }
        }
    };
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    });
}
 
// spin spin sugar
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
});