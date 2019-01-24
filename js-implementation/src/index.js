const querystring = require("querystring");
const AWS = require("aws-sdk");

if (process.env.ENVIRONMENT !== "prod") {
  require("dotenv").config();
  AWS.config.credentials = new AWS.SharedIniFileCredentials({
    profile: "personal"
  });
}

const { REGION, TABLE_NAME } = process.env;
const docClient = new AWS.DynamoDB.DocumentClient({ region: REGION });

const getScores = () => {
  const params = { TableName: TABLE_NAME };
  return new Promise(async (resolve, reject) => {
    await docClient.scan(params, (err, data) => {
      if (err) {
        reject(Error(err));
      } else {
        const { Items } = data;
        resolve(Items);
      }
    });
  });
};

const handleRequest = async request => {
  switch (request.toLowerCase()) {
    case "scores":
      return await getScores()
        .then(items => {
          return {
            statusCode: 200,
            body: `${prettifyScores(items)}`
          };
        })
        .catch(err => console.log(err));
    default:
      const res = {
        statusCode: 200,
        body: `"${request}" is not a valid action for this bot!`
      };
      console.log(res);
      return res;
  }
};

const prettifyScores = scores => {
  function compare(a, b) {
    if (a.score > b.score) return -1;
    if (a.score < b.score) return 1;
    return 0;
  }

  return scores
    .sort(compare)
    .map(player => `*${player.player}*: ${player.score}\n`)
    .join("");
};

exports.handler = async event => {
  const params = querystring.parse(event.body);
  if (process.env.VERIFICATION_TOKEN !== params.token) {
    console.log(process.env.VERIFICATION_TOKEN, params.token);
    let res = {
      statusCode: 401,
      body: "Unauthorized"
    };
    console.log(res);
    return res;
  } else {
    // return {
    //   statusCode: 200,
    //   body: JSON.stringify(event)
    // };
    res = await handleRequest(params.text);
    console.log(res);
    return res;
  }
};
