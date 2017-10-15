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

    new TrainingDocument('order', 'order'),
    new TrainingDocument('order', 'order food'),

    new TrainingDocument('starter', 'starters'),
    new TrainingDocument('starter', 'starter'),

    new TrainingDocument('main', 'mains'),
    new TrainingDocument('main', 'main'),

    new TrainingDocument('feedback', 'feedback'), 
    new TrainingDocument('feedback', 'Leave us feedback'), 

    new TrainingDocument('help', 'help'),
    new TrainingDocument('help', 'commands'),
    new TrainingDocument('help', 'command help'),
], function () {
    console.log(' BOT> Ready.');
});

const helpSkill = new Skill('my_help_skill', 'help', function (context, req, res){
    var result = new SingleLineMessage(JSON.parse("{}"));
    if (context.previousMessage === "feedback") {
        result.skill = "thanks";
        context.previousMessage = "thanks";
        return res.send(result);
    }
    result.skill = "help";
    context.previousMessage = "help"
    return res.send(result);
});

const orderSkill = new Skill('my_order_skill', 'order', function (context, req, res){
    var result = new SingleLineMessage(JSON.parse("{}"));
    if (context.previousMessage === "feedback") {
        result.skill = "thanks";
        context.previousMessage = "thanks";
        return res.send(result);
    }
    result.skill = "order";
    context.previousMessage = "order"
    return res.send(result);
});

const initSkill = new Skill('my_unknown_skill', 'undefined', function (context, req, res) {
    var result = new SingleLineMessage(JSON.parse("{}"));
    if (context.previousMessage === "feedback") {
        result.skill = "thanks";
        context.previousMessage = "thanks";
        return res.send(result);
    }
    result.skill = "undefined";
    context.previousMessage = "undefined"
    return res.send(result);
});

const starterSkill = new Skill('my_starter_skill', 'starter', function (context, req, res) {
    var result = new SingleLineMessage(JSON.parse("{}"));
    if (context.previousMessage === "feedback") {
        result.skill = "thanks";
        context.previousMessage = "thanks";
        return res.send(result);
    }
    result.skill = "starter";
    context.previousMessage = "starter"
    return res.send(result);
});

const mainSkill = new Skill('my_main_skill', 'main', function (context, req, res) {
    var result = new SingleLineMessage(JSON.parse("{}"));
    if (context.previousMessage === "feedback") {
        result.skill = "thanks";
        context.previousMessage = "thanks";
        return res.send(result);
    }
    result.skill = "main";
    context.previousMessage = "main"
    return res.send(result);
});

const feedbackSkill = new Skill('my_feedback_skill', 'feedback', function (context, req, res) {
    var result = new SingleLineMessage(JSON.parse("{}"));
    if (context.previousMessage === "feedback") {
        result.skill = "thanks";
        context.previousMessage = "thanks";
        return res.send(result);
    }
    result.skill = "feedback";
    context.previousMessage = "feedback"
    return res.send(result);
});

// Add the skills to the bot
bot.addSkill(helpSkill, 0.8);
bot.addSkill(orderSkill);
bot.addSkill(initSkill);
bot.addSkill(starterSkill);
bot.addSkill(mainSkill);
bot.addSkill(feedbackSkill);

module.exports = bot;