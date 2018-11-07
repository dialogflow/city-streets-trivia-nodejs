/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';
// Used by Cloud Functions for Firebase.
const functions = require('firebase-functions');
// Official Dialogflow fulfillment library.
const {WebhookClient} = require('dialogflow-fulfillment');
// Loads in our node.js client library which we will use to make API calls.
const dialogflow = require('dialogflow');

// Enables debugging statements from the dialogflow-fulfillment library.
process.env.DEBUG = 'dialogflow:debug';

// Create a map of cities and their streets. In a production agent, this
// information could be hosted in a database or via an API, and could contain
// the name of every street in each city (too much to include in this file!).
const cityData = {
  'New York': {
    trivia: {
      question: 'Which street in New York is famous for its musical theater?',
      answer: 'Broadway',
    },
    streets: [
      // The streets are formatted in the Entity data structure so we can
      // send them directly to the Dialogflow API. These will become the
      // Entities within the SessionEntityType we are creating.
      // https://dialogflow.com/docs/reference/api-v2/rest/Shared.Types/BatchUpdateEntityTypesResponse#entity
      {value: 'Wall Street', synonyms: ['Wall Street']},
      {value: 'Fifth Avenue', synonyms: ['Fifth Avenue', '5th Avenue', '5th']},
      {value: 'Broadway', synonyms: ['Broadway']},
    ],
  },
  'Los Angeles': {
    trivia: {
      question: 'What street in Beverly Hills boasts some of '
        + 'the most expensive shops in the world?',
      answer: 'Rodeo Drive',
    },
    streets: [
      {value: 'Rodeo Drive', synonyms: ['Rodeo Drive', 'Rodeo']},
      {value: 'Mulholland Drive', synonyms: ['Mulholland Drive', 'Mulholland']},
      {value: 'Hollywood Boulevard', synonyms: ['Hollywood Boulevard']},
    ],
  },
  'Chicago': {
    trivia: {
      question: `Which fashionable street did Chicago's first mayor live on?`,
      answer: 'Rush Street',
    },
    streets: [
      {value: 'Rush Street', synonyms: ['Rush Street', 'Rush']},
      {value: 'Lake Shore Drive', synonyms: ['Lake Shore Drive']},
      {value: 'Broadway', synonyms: ['Broadway']},
    ],
  },
  'Houston': {
    trivia: {
      question: 'What is the main street at the University of Houston?',
      answer: 'Cullen Boulevard',
    },
    streets: [
      {value: 'Cullen Boulevard', synonyms: ['Cullen Boulevard', 'Cullen']},
      {value: 'Kirby Drive', synonyms: ['Kirby Drive', 'Kirby']},
      {value: 'Westheimer Road', synonyms: ['Westheimer Road', 'Westheimer']},
    ],
  },
};

// Use the Cloud Functions for Firebase library to define a HTTPS endpoint.
exports.dialogflowFirebaseFulfillment =
  functions.https.onRequest((request, response) => {
  // Create a WebhookClient using the Dialogflow fulfillment library.
    const agent = new WebhookClient({request, response});
    console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
    console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

    /** Create a function that will handle our
     * 'City name' intent being matched.
     * @param {agent} agent Passed in by the Dialogflow fulfillment library.
     * @return {null} */
    function askTriviaQuestion(agent) {
    // Grab the name of the city from the parameters.
      const city = agent.parameters['city'];

      // Look up data for this city from our datastore. In a production
      // agent, we could make a database or API call to do this.
      const data = cityData[city];

      // Create a new SessionEntityTypesClient, which communicates
      // with the SessionEntityTypes API endpoints. Note that no
      // authentication credentials are required, since Cloud
      // Functions for Firebase will authenticate us automatically.
      const client = new dialogflow.SessionEntityTypesClient();

      // Combine the session identifier with the name of the EntityType
      // we want to override, which in this case is 'street'. This is
      // according to the template in the docs:
      // https://dialogflow.com/docs/reference/api-v2/rest/v2/projects.agent.sessions.entityTypes#SessionEntityType
      const sessionEntityTypeName = agent.session + '/entityTypes/street';

      // Define our new SessionEntityType.
      const sessionEntityType = {
        name: sessionEntityTypeName,
        // Specify that this SessionEntityType's entities should fully replace
        // any values in the underlying EntityType (street).
        entityOverrideMode: 'ENTITY_OVERRIDE_MODE_OVERRIDE',
        // Add the appropriate streets to this SessionEntityType
        entities: data.streets,
      };

      // Build a request that includes the current session
      // and the SessionEntityType.
      const request = {
        parent: agent.session,
        sessionEntityType: sessionEntityType,
      };

      // Create our new SessionEntityType
      return client
          .createSessionEntityType(request)
          .then((responses) => {
            console.log('Successfully created session entity type:',
                JSON.stringify(request));
            // Respond to the user and ask this city's trivia question
            agent.add(`Great! I love ${city}. Here's a question about its streets!`);
            agent.add(data.trivia.question);
          })
      // Handle any errors by apologizing to the user.
          .catch((err) => {
            console.error('Error creating session entitytype: ', err);
            agent.add(`I'm sorry, I'm having trouble remembering that city.`);
            agent.add(`Is there a different city you'd like to be quizzed on?`);
          });
    }

    /** Create a function that will handle our
     * 'Trivia answer' intent being matched.
     * @param {agent} agent Passed in by the Dialogflow fulfillment library. */
    function checkTriviaAnswer(agent) {
      // Grab the name of the city from the context.
      const context = agent.context.get('cityname-followup');
      const cityName = context.parameters ? context.parameters.city : undefined;

      // If we couldn't find the correct context, log an error and inform the
      // user. This should not happen if the agent is correctly configured.
      if (!context || !cityName) {
        console.error('Expected context or parameter was not present');
        agent.add(`I'm sorry, I forgot which city we're talking about!`);
        agent.add(`Would you like me to ask you about New York, LA, Chicago, or Houston?`);
        return;
      }
      // Grab the name of the street from parameters.
      const streetName = agent.parameters['street'];

      // Look up data for this city from our datastore. In a production
      // agent, we could make a database or API call to do this.
      const data = cityData[cityName];

      // Determine if we got it right!
      if (data.trivia.answer === streetName) {
        agent.add(`Nice work! You got the answer right. You're truly an expert on ${cityName}.`);
        agent.add(`Give me another city and I'll ask you more questions.`);
        // Since they got it right, delete the cityname-followup context
        // so our agent does not expect to hear any more streets.
        agent.context.delete('cityname-followup');
      } else {
        agent.add(`Oops, ${streetName} isn't the right street! Try another street name...`);
      }
    }

    // Run the proper function handler based on the matched Dialogflow intent name.
    const intentMap = new Map();
    intentMap.set('City name', askTriviaQuestion);
    intentMap.set('Trivia answer', checkTriviaAnswer);
    agent.handleRequest(intentMap);
  });
