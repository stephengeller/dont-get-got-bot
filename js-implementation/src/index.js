require("dotenv").config();
const querystring = require("querystring");

const { REGION } = process.env;

const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient({ region: REGION });

const TABLE_NAME = "dont_get_got_scores";

exports.handler = async event => {
  // TODO implement
  const response = {
    statusCode: 200,
    body: JSON.stringify("Hello from Lambda!")
  };
  return response;
};
