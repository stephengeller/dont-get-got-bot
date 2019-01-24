const querystring = require("querystring");

if (process.env.ENVIRONMENT !== "prod") {
  require("dotenv").config();
}

const { REGION } = process.env;

const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient({ region: REGION });

const TABLE_NAME = "dont_get_got_scores";

exports.handler = async event => {
  const params = querystring.parse(event.body);
  let res = {
    statusCode: null,
    body: ""
  };
  if (process.env.VERIFICATION_TOKEN !== params.token) {
    res.statusCode = 401;
    res.body = "Unauthorized!";
    console.log(process.env.VERIFICATION_TOKEN);
    console.log(params.token);
  } else {
    res = {
      statusCode: 200,
      body: JSON.stringify(params.text)
    };
  }
  console.log(res);
  return res;
};
