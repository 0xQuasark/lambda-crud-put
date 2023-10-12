'use strict';

const dynamoose = require('dynamoose');

// Define our schema
const peopleSchema = new dynamoose.Schema({
  'id': Number,
  'name': String,
  'email': String,
});

// Create our Model
let personModel = dynamoose.model('cf-lambda-crud', peopleSchema);

exports.handler = async (event) => {
  console.log('crudPUT 1.0');
  console.log('HERE IS THE EVENT OBJECT', event);

  let results = null;

  if (event.pathParameters && event.pathParameters.id) {
    const id = parseInt(event.pathParameters.id, 10); // Make sure to parse it into the correct type
    let updateData = JSON.parse(event.body); // Assuming the incoming request body is a JSON string

    try {
      // Update the record with the specified ID
      results = await personModel.update({id}, updateData);
    } catch (error) {
      console.log('ERROR: ', error);
      return {
        statusCode: 400,
        body: JSON.stringify('Could not update person'),
      };
    }

  } else {
    return {
      statusCode: 400,
      body: JSON.stringify('ID required to update person'),
    };
  }

  const response = {
    statusCode: 200,
    body: JSON.stringify(results),
  };

  return response;
};
