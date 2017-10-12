"use strict";
 
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();
const bot = require('./index');
const path = require('path')
const hbs = require('hbs');
const fs = require('fs');
app.set('port', (process.env.PORT || 80));

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
    res.render("graph",{});
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


                        if(message.skill === "help" || message.skill === "undefined"){
                            return sendInitMessage(sender, message.content);
                        }
                        if(message.skill === "order"){
                        	return sendOrderMessage(sender, message.content);
                        }
                        if(message.skill === "starter"){
                        	return sendStarterMessage(sender, message.content);
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
                        if(message.skill === "help" || message.skill === "undefined"){
                            return sendInitMessage(sender, message.content);
                        }
                        if(message.skill === "order"){
                        	return sendOrderMessage(sender, message.content);
                        }
                        if(message.skill === "starter"){
                        	return sendStarterMessage(sender, message.content);
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
const token = "EAAB84ZB9CZBXEBAH4MQ13ff9vsgc5Htzh0vBTxc9ch3yT8mrmasYUdvM2r2eGjKVbbGUJwH1dHLH0FlNNy2zypZAKKJbTSAGxTveQizZCXX0qM4ZAHIQO3wCKGCJprr5SLZAFkKZCfPSNZCa72kT9tN1tJuyrb6JCfs6bxNgL8NZCxAZDZD";
 
function sendInitMessage(sender, text) {

    var messageData = {
            "attachment":{
              "type":"template",
              "payload":{
                "template_type":"generic",
                "elements":[
                  {
                    "title":"Hello!",
                    //"image_url":"http://7eb260f2.ngrok.io/graph",
                    "subtitle":"Do you want to:",
                    "buttons":[
                      {
                        "type":"postback",
                        "title":"Order food",
                        "payload":"order"
                      },
                        {
                        "type":"postback",
                        "title":"Book a table",
                        "payload":"Last Purchase"
                      }
                      ,
                        {
                        "type":"postback",
                        "title":"Leave us feedback",
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

function sendOrderMessage(sender, text) {

    var messageData = {
            "attachment":{
              "type":"template",
              "payload":{
                "template_type":"generic",
                "elements":[
                  {
                    "title":"Sure thing!",
                    //"image_url":"http://7eb260f2.ngrok.io/graph",
                    "subtitle":"What would you like?",
                    "buttons":[
                      {
                        "type":"postback",
                        "title":"Starters",
                        "payload":"starter"
                      },
                        {
                        "type":"postback",
                        "title":"Mains",
                        "payload":"Last Purchase"
                      }
                      ,
                        {
                        "type":"postback",
                        "title":"Sides",
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

function sendStarterMessage(sender, text) {

    var messageData = {
    		"attachment": {
		      "type": "template",
		      "payload": {
		        "template_type": "list",
		        "top_element_style": "compact",
		        "elements": [
		          {
		            "title": "Chicken Pakora",
		            "subtitle": "Our crispy favourite!",
		            "image_url": "http://betterbutterbucket.s3-website-ap-southeast-1.amazonaws.com/319x319/public/recipe_thumb/medium/1443529872WMASm5WuJf_thumb.jpg",          
		            "buttons": [
		              {
		                "type":"postback",
                        "title":"Order",
                        "payload":"starter"		             
		              },
		             ]
		          },
		          {
		            "title": "Veg Pakora",
		            "subtitle": "You need to try this classic!",
		            "image_url": "http://www.harighotra.co.uk/images/recipes/hero/vegetable-pakora-hero.jpg",
		            //"default_action": {
		              // "type": "web_url",
		              // "url": "https://google.com",
		              // "messenger_extensions": false,
		              // "webview_height_ratio": "tall",
		              // //"fallback_url": "https://peterssendreceiveapp.ngrok.io/"
		            //}
		            "buttons": [
		              {
		                "type":"postback",
                        "title":"Order",
                        "payload":"starter"		             
		              },
		             ]
		          },
		          {
		            "title": "Chilli Paneer",
		            "image_url": "https://i.ytimg.com/vi/Pomwkv-Ou8M/hqdefault.jpg",
		            "subtitle": "Bring some spice to the table!",
		            //"default_action": {
		              // "type": "web_url",
		              // "url": "https://google.com",
		              // "messenger_extensions": false,
		              // "webview_height_ratio": "tall",
		              //"fallback_url": "https://peterssendreceiveapp.ngrok.io/"
		            //},
		            "buttons": [
		              {
		                "type":"postback",
                        "title":"Order",
                        "payload":"starter"		             
		              },
		            ]        
		          }
		        ],
		         "buttons": [
		          {
		            "title": "View More",
		            "type": "postback",
		            "payload": "payload"            
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