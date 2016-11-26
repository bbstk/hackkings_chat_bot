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

bot.trainAll([
    new TrainingDocument('category', 'spent on what'),

    new TrainingDocument('balance', 'balance'),

    new TrainingDocument('last_purchase', 'last purchase'),

    new TrainingDocument('knock_joke', 'knock'),
    new TrainingDocument('knock_joke', 'knock knock'),

    new TrainingDocument('best_capital_one', 'best credit card company'),
    new TrainingDocument('best_capital_one', 'awesome company'),
    new TrainingDocument('best_capital_one', 'really nice firm'),


    new TrainingDocument('chuck_norris_joke', 'chuck norris'),
    new TrainingDocument('chuck_norris_joke', 'chuck'),
    new TrainingDocument('chuck_norris_joke', 'norris'),
    new TrainingDocument('chuck_norris_joke', 'chuck norris joke'),
], function () {
    console.log(' BOT> Ready.');
});

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

const balanceSkill = new Skill('my_balance_skill', 'balance', function(context, req, res) {
    var url = "http://api.reimaginebanking.com/customers/5839c5aa0fa692b34a9b8778/accounts?key=5e9a7df9497ab60eee4db8db8d16742d";
    request.get(url,function(error,response,body){
            if(error){
                    console.log(error);
            }else{
                    console.log(JSON.parse(response.body)[0].balance);
                    return res.send(new SingleLineMessage(JSON.parse(response.body)[0].balance));
            }
    });
})

const lastPurchaseSkill = new Skill('my_last_purchase_skill', 'last_purchase', function(context, req, res) {
    var url = "http://api.reimaginebanking.com/accounts/5839c66c0fa692b34a9b8780/purchases?key=5e9a7df9497ab60eee4db8db8d16742d";
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
    var url = "http://api.reimaginebanking.com/accounts/5839c66c0fa692b34a9b8780/purchases?key=5e9a7df9497ab60eee4db8db8d16742d";
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
bot.addSkill(kJokeSkill, 0.9);
bot.addSkill(cJokeSkill, 0.9);
bot.addSkill(balanceSkill, 0.9);
bot.addSkill(lastPurchaseSkill, 0.9);
bot.addSkill(spendByCategorySkill, 0.9);
bot.addSkill(capitalOneJokeSkill);
bot.addSkill(unknownSkill);

module.exports = bot;