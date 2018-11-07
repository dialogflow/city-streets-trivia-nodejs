# City Streets Trivia

## Description
This sample demonstrates how to create and update [developer entities](https://dialogflow.com/docs/entities/developer-entities) using the [Dialogflow Node.js Client](https://github.com/googleapis/nodejs-dialogflow) and the [Dialogflow Fulfillment Library](https://github.com/dialogflow/dialogflow-fulfillment-nodejs). It also demonstrates how to create [session entities](https://dialogflow.com/docs/entities/session-entities) from your fulfillment code.

The sample consists of two parts:

- A Dialogflow agent that asks users trivia about their favorite city
- Scripts that automate the creation and deletion of developer entities.

The following sections describe how to set up use the agent and accompanying scripts.


## Agent Setup
Select **only one** of the options below to set up the Dialogflow agent for this sample.

### Option 1: Add to Dialogflow (Recommended)
To create this agent from our template:

<a href="https://console.dialogflow.com/api-client/oneclick?templateUrl=https://oneclickgithub.appspot.com/dialogflow/city-streets-trivia-nodejs&agentName=CityStreetsTrivia" target="blank">
  <img src="https://dialogflow.com/images/deploy.png">
</a>


### Option 2: Firebase CLI
1. Create a [Dialogflow Agent](https://console.dialogflow.com/).
2. Clone this repo: `git clone https://github.com/dialogflow/city-streets-trivia-nodejs.git`.
3. Go to **Settings** ⚙ > **Export and Import** > **Restore from zip** using the `dialogflow-agent.zip` in this directory.
4. `cd` to the `functions` directory.
5. Run `npm install`.
6. Install the Firebase CLI by running `npm install -g firebase-tools`.
7. Login with your Google account, `firebase login`.
8.  Add your project to the sample with `firebase use <project ID>`.
      + In Dialogflow console under **Settings** ⚙ > **General** tab > copy **Project ID**.
9. Run `firebase deploy --only functions:dialogflowFulfillment`.
10. Back in Dialogflow Console > **Fulfullment** > **Enable** Webhook.
      + Paste the URL from the Firebase Console’s Trigger column under the **Functions > Dashboard** tab into the **URL** field > **Save**.

## Using scripts to create and update entities

### Setup
1. Clone this repo: `git clone https://github.com/dialogflow/city-streets-trivia-nodejs.git`.
1. Run `npm install`.
1. Create a service account and obtain a credentials JSON file, following the instructions in [Setting up authentication](https://dialogflow.com/docs/reference/v2-auth-setup). Choose "Dialogflow API Admin" when selecting the role.
1. Once you have downloaded the JSON file, rename it to `credentials.json` and place it in the root of the repo.
1. Each script assumes you have created a Dialogflow agent and it has a project ID of `city-streets-trivia`. If your project ID is different, you should find and replace the single occurrence of this string in each script with your own ID.

### [create.js](create.js)
This script demonstrates how to create [developer entities](https://dialogflow.com/docs/entities/developer-entities) through code. Running it will result in the creation of `city` and `street` entities in the agent whose name is specified in the script.

Note that if you created your agent using the Add to Dialogflow button in this README.md, your agent will already have these entities. In this case, to run [create.js](create.js) successfully you should delete the "city" and "street" entities from the agent via Dialogflow's UI.

To run the script, use the following command:

`> node create.js`

### [update.js](update.js)
This script demonstrates how to update [developer entities](https://dialogflow.com/docs/entities/developer-entities) through code. Running it will update the `city` developer entity to include values defined in the script. In production, a similar script could be used to keep Dialogflow entities synchronized with data fetched from a datastore.

To run the script, use the following command:

`> node update.js`

## Related Samples

| Name       | Language           |
| ------------- |:-------------:|
| [Fulfillment & Regex Validation](https://github.com/dialogflow/fulfillment-regex-nodejs)      | Node.js |
| [Weather: Fulfillment & WWO API](https://github.com/dialogflow/fulfillment-weather-nodejs)     | Node.js      |  
| [Bike Shop: Fulfillment & Google Calendar API](https://github.com/dialogflow/fulfillment-bike-shop-nodejs)| Node.js |
| [Temperature Trivia: Fulfillment & Actions on Google](https://github.com/dialogflow/fulfillment-temperature-converter-nodejs) | Node.js |
| [Fulfillment & Actions on Google](https://github.com/dialogflow/fulfillment-actions-library-nodejs) | Node.js |
| [Fulfillment & Firestore Database](https://github.com/dialogflow/fulfillment-firestore-nodejs) | Node.js |
| [Multi-language/locale](https://github.com/dialogflow/fulfillment-multi-locale-nodejs) | Node.js |
| [Basic Slot Filling](https://github.com/dialogflow/fulfillment-slot-filling-nodejs) | Node.js |
| [Alexa Importer](https://github.com/dialogflow/fulfillment-importer-nodejs) | Node.js |

For Fulfillment Webhook [JSON Requests & Responses](https://github.com/dialogflow/fulfillment-webhook-json).

## References & Issues
+ Questions? Try [StackOverflow](https://stackoverflow.com/questions/tagged/dialogflow) or [Dialogflow Developer Community](https://plus.google.com/communities/103318168784860581977).
+ For bugs, please report an issue on [Github](https://github.com/dialogflow/dialogflow-fulfillment-nodejs/issues).
+ Dialogflow [Documentation](https://docs.dialogflow.com).
+ Dialogflow [Classes Reference Doc](https://github.com/dialogflow/dialogflow-fulfillment-nodejs/tree/master/docs).
+ For more info about [billing](https://dialogflow.com/docs/concepts/google-projects-faq).

## Make Contributions
Please read and follow the steps in the CONTRIBUTING.md.

## License
See LICENSE.md.

## Terms
Your use of this sample is subject to, and by using or downloading the sample files you agree to comply with, the [Google APIs Terms of Service](https://developers.google.com/terms/).
