'use strict';

var Alexa = require('alexa-sdk');
var recipes = require('./pokedesc');
var config = require('./config.js');

var SKILL_NAME = config.skillName;
exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = config.appId;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    //Use LaunchRequest, instead of NewSession if you want to use the one-shot model
    //Alexa, ask [my-skill-invocation-name] to (do something)...
    'LaunchRequest': function () {
        this.attributes['speechOutput'] = 'Welcome to ' + SKILL_NAME + '. You can ask a question like, what\'s the' +
            ' description for Pikachu? ... Now, what can I help you with.';
        // If the user either does not reply to the welcome message or says something that is not
        // understood, they will be prompted again with this text.
        this.attributes['repromptSpeech'] = 'For instructions on what you can say, please say help me.';
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech']);
        this.emit('SessionEndedRequest');
    },
    'DescIntent': function () {
        var itemSlot = this.event.request.intent.slots.Item;
        var itemName;
        if (itemSlot && itemSlot.value) {
            itemName = itemSlot.value.toLowerCase();
        }
        var cardTitle = SKILL_NAME + ' - description for ' + itemName;
        var recipe = recipes[itemName];

        console.log("itemName: " + itemName);
        console.log("itemNameDesc:" + recipes[itemName]);

        if (recipe) {
            this.attributes['repromptSpeech'] = 'What else can I help with ?';
            this.attributes['speechOutput'] = recipe + " " + this.attributes['repromptSpeech'];
            console.log("recipe:" + recipe);
            console.log("this.attributes['repromptSpeech']:" + this.attributes['repromptSpeech']);
            console.log("cardTitle:" + JSON.stringify(cardTitle));
            console.log("recipe:" + recipe);
            //askWithCard(speechOutput, repromptSpeech, cardTitle, cardContent),
            this.emit(':askWithCard', this.attributes['speechOutput'], this.attributes['repromptSpeech'], cardTitle, recipe);
        } else {
            var speechOutput = 'I\'m sorry, I currently do not know ';
            var repromptSpeech = 'What else can I help with?';
            if (itemName) {
                speechOutput = 'the description for ' + itemName + ' is not found. Please try again. You can ask questions such as, what\'s the description for fearow, or, you can say exit...';
            } else {
                speechOutput = 'that description is not found. Please try again. You can ask questions such as, what\'s the description for fearow, or, you can say exit...';
            }
            speechOutput += repromptSpeech;

            this.attributes['speechOutput'] = speechOutput;
            this.attributes['repromptSpeech'] = repromptSpeech;

            this.emit(':ask', speechOutput, repromptSpeech);
        }
    },
    'AMAZON.HelpIntent': function () {
        this.attributes['speechOutput'] = 'You can ask questions such as, what\'s the description for fearow, or, you can say exit... ' +
            'Now, what can I help you with?';
        this.attributes['repromptSpeech'] = 'You can say things like, what\'s the description for fearow, or you can say exit...' +
            ' Now, what can I help you with?';
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech'])
    },
    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech'])
    },
    'AMAZON.StopIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'AMAZON.CancelIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'SessionEndedRequest':function () {
        this.emit(':tell', 'Goodbye!');
    }
};