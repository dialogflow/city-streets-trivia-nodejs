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

// Loads in our node.js client library which we will use to make API calls
const dialogflow = require('dialogflow');

// Read in credentials from file. To get it, follow instructions here, but
// choose 'API Admin' instead of 'API Client':
// https://dialogflow.com/docs/reference/v2-auth-setup
const credentials = require('./credentials.json');

// Create a new EntityTypesClient, which
// communicates with the EntityTypes API endpoints
const entitiesClient = new dialogflow.EntityTypesClient({
  credentials: credentials,
});

// Create a path string for our agent based
// on its project ID (from first tab of Settings).
const projectId = '<INSERT YOUR PROJECT ID HERE>';
const agentPath = entitiesClient.projectAgentPath(projectId);

// Define an EntityType to represent cities.
const cityEntityType = {
  displayName: 'city',
  kind: 'KIND_MAP',
  // List all of the Entities within this EntityType.
  entities: [
    {value: 'New York', synonyms: ['New York', 'NYC']},
    {value: 'Los Angeles', synonyms: ['Los Angeles', 'LA', 'L.A.']},
  ],
};

// Build a request object in the format the client library expects.
const cityRequest = {
  parent: agentPath,
  entityType: cityEntityType,
};

// Tell client library to call Dialogflow with
// a request to create an EntityType.
entitiesClient
    .createEntityType(cityRequest)
// Dialogflow will respond with details of the newly created EntityType.
    .then((responses) => {
      console.log('Created new entity type:', JSON.stringify(responses[0]));

      // Define and create an EntityType to represent streets.
      const streetEntityType = {
        displayName: 'street',
        kind: 'KIND_MAP',
        // Add a single placeholder Entity that we can use in our
        // training phrases. This will be replaced by our
        // SessionEntityType during fulfillment.
        entities: [
          {value: 'Broadway', synonyms: ['Broadway']},
        ]
      };

      const streetRequest = {
        parent: agentPath,
        entityType: streetEntityType,
      };

      return entitiesClient.createEntityType(streetRequest);
    })
// Dialogflow again responds with details of the newly created EntityType.
    .then((responses) => {
      console.log('Created new entity type:', JSON.stringify(responses[0]));
    })
// Log any errors.
    .catch((err) => {
      console.error('Error creating entity type:', err);
    });
