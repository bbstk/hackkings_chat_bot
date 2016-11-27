const knockKnockJokes = require('knock-knock-jokes');
const cnApi = require('chuck-norris-api');
const nessieSdk = require('nessie-nodejs-sdk')
const talkify = require('talkify');
const request = require('request');


const Bot = talkify.Bot;

const BotTypes = talkify.BotTypes;

const SingleLineMessage = BotTypes.SingleLineMessage;

const TrainingDocument = BotTypes.TrainingDocument;
const Skill = BotTypes.Skill;

const bot = new Bot();

const fbIdToCustomerMap = {
    "1473286519367564": "583a2afd0fa692b34a9b87fe", //VANKO
    "1146248908823171": "583a2af10fa692b34a9b87f7", //KRISI
    "1170318786370648": "583a2afd0fa692b34a9b87fc", //DANI
    "1151558158293039": "583a2af10fa692b34a9b87fa"  //IVCHO
}

const fbIdToAccountMap = {
    "1473286519367564": "583a327a0fa692b34a9b8809", //VANKO
    "1146248908823171": "583a324d0fa692b34a9b8808", //KRISI
    "1170318786370648": "583a324d0fa692b34a9b8806", //DANI
    "1151558158293039": "583a324d0fa692b34a9b8807"  //IVCHO
}

const phoneIdToCustomerMap = {
    "07871611645": "583a2afd0fa692b34a9b87fe"       //VANKO
}

const phoneIdToAccountMap = {
    "07871611645": "583a327a0fa692b34a9b8809"       //VANKO
}

bot.trainAll([

    // Train the bot to be nice and good
    new TrainingDocument('greeting', 'hi'),
    new TrainingDocument('greeting', 'hello'),
    new TrainingDocument('greeting', 'sup'),
    new TrainingDocument('greeting', 'Good Morning'),
    new TrainingDocument('greeting', 'Good Evening'),
    new TrainingDocument('greeting', 'Howdy'),

    new TrainingDocument('sentoff', 'bye'),
    new TrainingDocument('sentoff', 'see ya'),
    new TrainingDocument('sentoff', 'cu'),
    new TrainingDocument('sentoff', 'goodbye'),
    new TrainingDocument('sentoff', 'aufwiedersehen'),

    new TrainingDocument('weather', 'what is the weather like'),
    new TrainingDocument('weather', 'weather'),
    new TrainingDocument('weather', 'is it going to rain'),

    new TrainingDocument('help', 'help'),
    new TrainingDocument('help', 'commands'),
    new TrainingDocument('help', 'command help'),

    // Banking training
    new TrainingDocument('repeat', 'can you repeat'),

    new TrainingDocument('food_spent', 'how much have i spent on food'),

    new TrainingDocument('total_spend', 'how much have i spent'),
    new TrainingDocument('total_spend', 'what have i been spending'),
    new TrainingDocument('total_spend', 'how much spent'),

    new TrainingDocument('category', 'spent on what'),

    new TrainingDocument('balance', 'balance'),

    new TrainingDocument('last_purchase', 'last purchase'),

    new TrainingDocument('best_capital_one', 'best credit card company'),
    new TrainingDocument('best_capital_one', 'awesome company'),
    new TrainingDocument('best_capital_one', 'really nice firm'),

    // Jokes to be removed
    new TrainingDocument('knock_joke', 'knock'),
    new TrainingDocument('knock_joke', 'knock knock'),

    new TrainingDocument('chuck_norris_joke', 'chuck norris'),
    new TrainingDocument('chuck_norris_joke', 'chuck'),
    new TrainingDocument('chuck_norris_joke', 'norris'),
    new TrainingDocument('chuck_norris_joke', 'chuck norris joke'),
], function () {
    console.log(' BOT> Ready.');
});


function userResolver(req, type) {
    let id = req.id;
    if (type === "account"){
        if (id in fbIdToAccountMap) {
            return fbIdToAccountMap[id]; 
        }
        else if (id in phoneIdToAccountMap) {
            return phoneIdToAccountMap[id];
        }
        else {
            return "5839c66c0fa692b34a9b8780";
        }
    }
    else if (type === "customer"){
        if (id in fbIdToCustomerMap) {
            return fbIdToCustomerMap[id];
        }
        else if (id in phoneIdToCustomerMap) {
            return phoneIdToCustomerMap[id];
        }
        else {
            return "5839c5aa0fa692b34a9b8778";
        }
    }
}

// Skills for greetings
const greetingSkill = new Skill('my_greeting_skill', 'greeting', function (context, req, res) {
    return res.send(new SingleLineMessage("Hello. How can I help you?"));
});

const sentoffSkill = new Skill('my_sentoff_skill', 'sentoff', function (context, req, res) {
    return res.send(new SingleLineMessage("I hope I was helpful for you. Goodbye."));
});

const weatherSkill = new Skill('my_weather_skill', 'weather', function (context, req, res){
    return res.send(new SingleLineMessage("It is not in my duties to be a weatherman. You can go ask Siri about that."));
});

const helpSkill = new Skill('my_help_skill', 'help', function (context, req, res){
    var result = new SingleLineMessage(JSON.parse("{}"));
    result.skill = "help";
    return res.send(result);
});

// Skills for banking
const totalSpendSkill = new Skill('my_total_spend_skill', 'total_spend', function (context, req, res)  {
    //context.req[id] = "tok";
    // let id = req.id;
    // context[id] = id;
    // console.log(req.id);
    // console.log(context);
    // let id = req.id;
    // if (id in fbIdToAccountMap) {
    //     let accId = fbIdToAccountMap[id]; 
    // }
    // else if (id in phoneIdToAccountMap) {
    //     let accId = phoneIdToAccountMap[id];
    // }
    // else {
    //     let accId = "5839c66c0fa692b34a9b8780";
    // }
    let accId = userResolver(req, "account");
    var url = "http://api.reimaginebanking.com/accounts/" + accId + "/purchases?key=5e9a7df9497ab60eee4db8db8d16742d";
    context.lastRequest = 'total_spend';
    request.get(url,function(error,response,body){
            if(error){
                    console.log(error);
            }else{
                    let arrayche = (JSON.parse(response.body));
                    let total = 0;
                    arrayche.forEach(function (element, index, array) {
                        total += element.amount;
                    })
                    let msg = total.toFixed(2);
                    console.log(req.skill.current.topic);
                    msg = "You have spent £" + msg + " in total."
                    context.lastMsg = msg;
                    bot.train('total_spend', req.message.content, function () {});
                    return res.send(new SingleLineMessage(msg));
            }
    });
})

const repeatSkill = new Skill('my_repeat_skill', 'repeat', function (context, req, res) {
    let msg = "There is no last message."
    if (context.lastMsg !== undefined && context.lastRequest != undefined)
        msg = "Of course! My last message was \n" + context.lastMsg + " \n About " + context.lastRequest;
    return res.send(new SingleLineMessage(msg));
})

const balanceSkill = new Skill('my_balance_skill', 'balance', function (context, req, res) {
    let accId = userResolver(req, "customer");
    var url = "http://api.reimaginebanking.com/customers/" + accId + "/accounts?key=5e9a7df9497ab60eee4db8db8d16742d";
    request.get(url,function(error,response,body){
            if(error){
                    console.log(error);
            }else{  
                    console.log(JSON.parse(response.body)[0].balance);
                    let msg = JSON.parse(response.body)[0].balance;
                    let num = Math.round(msg*100)/100;
                    return res.send(new SingleLineMessage("You currently have £" + num + " in your account."));
            }
    });
})

const lastPurchaseSkill = new Skill('my_last_purchase_skill', 'last_purchase', function (context, req, res) {
    let accId = userResolver(req, "account");
    var url = "http://api.reimaginebanking.com/accounts/"+ accId + "/purchases?key=5e9a7df9497ab60eee4db8db8d16742d";
    request.get(url,function(error,response,body){
            if(error){
                    console.log(error);
            }else{
                    let arrayche = (JSON.parse(response.body));
                    let purchase = arrayche[arrayche.length-1];
                    let msg = "You spent " + purchase.amount + " on " + purchase.description + " on " + purchase.purchase_date + ".";
                    console.log(msg);
                    return res.send(new SingleLineMessage(msg));
            }
    });
})

const capitalOneJokeSkill = new Skill('my_best_capital_one_skill', 'best_capital_one', function(context, req, res){
    return res.send(new SingleLineMessage("I have heard Capital One are pretty good."));
});

const unknownSkill = new Skill('my_unknown_skill', undefined, function (context, req, res) {
    return res.send(new SingleLineMessage("I'm sorry sir, I do not understand your query. Please try again."));
});

const spendByCategorySkill = new Skill('my_spend_by_category_skill', 'category', function (context, req, res) {
    let accId = userResolver(req, "account");
    var url = "http://api.reimaginebanking.com/accounts/" + accId + "/purchases?key=5e9a7df9497ab60eee4db8db8d16742d";
    request.get(url,function(error,response,body){
        if(error){
                console.log(error);
        }else{
                let purchases = (JSON.parse(response.body));
                let categories = {};
                purchases.forEach(function (element, index, array) {
                    let cat = element.description;
                    if (categories[cat] !== null || categories[cat] !== undefined) {
                        if (categories.cat === undefined) 
                            categories[cat] = element.amount;
                            
                        else 
                            categories[cat] = categories[cat] + element.amount;
                    }
                   // console.log(element);
                })
                console.log(categories);
                let msg = "So far, you have spent \n";
                for (var key in categories) {
                    if (categories.hasOwnProperty(key)) {
                        msg += "\n£" + categories[key] + " on " + key; 
                        //console.log(key + " -> " + p[key]);
                    }
                }
                console.log(msg);
                return res.send(new SingleLineMessage(msg));

            
        }
    });
})

const spendOnFoodSkill = new Skill('my_spend_on_food_skill', 'food_spent', function (context, req, res) {
    let accId = userResolver(req, "account");
    var url = "http://api.reimaginebanking.com/accounts/" + accId + "/purchases?key=5e9a7df9497ab60eee4db8db8d16742d";
    request.get(url,function(error,response,body){
        if(error){
                console.log(error);
        }else{
                let purchases = (JSON.parse(response.body));
                let total = 0;
                purchases.forEach(function (element, index, array) {
                    let cat = element.description;
                    if (cat === 'food') {
                        total += element.amount;
                    }
                   // console.log(element);
                })
                let msg = "So far, you have spent £" + total + " on food.";

                console.log(msg);
                return res.send(new SingleLineMessage(msg));
            }
    });
})


// Joke skills to be removed
const kJokeSkill = new Skill('my_knock_knock_joke_skill', 'knock_joke', function (context, req, res) {
    if (!context.kJokes) {
        context.kJokes = [];
    }

    let newJoke = knockKnockJokes();
    let counter = 0;
    while(counter < 11 && context.kJokes.indexOf(newJoke) !== -1) {
        newJoke = knockKnockJokes();
        counter++;
    }

    if(counter === 11) {
        return res.send(new SingleLineMessage('Sorry I am out of knock knock jokes. :('));
    }

    context.kJokes.push(newJoke);
    return res.send(new SingleLineMessage(newJoke));
});

const cJokeSkill = new Skill('my_chuck_norris_joke_skill', 'chuck_norris_joke', function(context, req, res) {
    return cnApi.getRandom().then(function(data) {
        return res.send(new SingleLineMessage(data.value.joke));
    });
});


// Add the skills to the bot
bot.addSkill(greetingSkill, 0.8);
bot.addSkill(sentoffSkill, 0.8);
bot.addSkill(weatherSkill, 0.8);
bot.addSkill(helpSkill, 0.8);
bot.addSkill(kJokeSkill, 0.8);
bot.addSkill(cJokeSkill, 0.8);
bot.addSkill(balanceSkill, 0.8);
bot.addSkill(lastPurchaseSkill, 0.8);
bot.addSkill(spendByCategorySkill, 0.8);
bot.addSkill(spendOnFoodSkill, 0.8);
bot.addSkill(totalSpendSkill, 0.1);
bot.addSkill(repeatSkill, 0.8);
bot.addSkill(capitalOneJokeSkill);
bot.addSkill(unknownSkill);

module.exports = bot;