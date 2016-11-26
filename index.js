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
    new TrainingDocument('balance', 'balance'),

    new TrainingDocument('knock_joke', 'knock'),
    new TrainingDocument('knock_joke', 'knock knock'),

    new TrainingDocument('chuck_norris_joke', 'chuck norris'),
    new TrainingDocument('chuck_norris_joke', 'chuck'),
    new TrainingDocument('chuck_norris_joke', 'norris'),
    new TrainingDocument('chuck_norris_joke', 'chuck norris joke'),
], function () {
    console.log(' BOT> Ready.');
});

const kJokeSkill = new Skill('my_knock_knock_joke_skill', 'knock_joke', function (context, req, response) {
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
        return response.send(new SingleLineMessage('Sorry I am out of knock knock jokes. :('));
    }

    context.kJokes.push(newJoke);
    return response.send(new SingleLineMessage(newJoke));
});

const cJokeSkill = new Skill('my_chuck_norris_joke_skill', 'chuck_norris_joke', function(context, req, response) {
    return cnApi.getRandom().then(function(data) {
        return response.send(new SingleLineMessage(data.value.joke));
    });
});

const balanceSkill = new Skill('my_balance_skill', 'balance', function(context, req, response) {
    var url = "http://api.reimaginebanking.com/customers/5839c5aa0fa692b34a9b8778/accounts?key=5e9a7df9497ab60eee4db8db8d16742d";
    request.get(url,function(error,response,body){
            if(error){
                    console.log(error);
            }else{
                    console.log(JSON.parse(response.body)[0].balance);
            }
    });
})

bot.addSkill(kJokeSkill);
bot.addSkill(cJokeSkill);
bot.addSkill(balanceSkill);

module.exports = bot;