const querystring = require("querystring");
const AWS = require("aws-sdk");

if (process.env.ENVIRONMENT !== "prod") {
  require("dotenv").config();
  AWS.config.credentials = new AWS.SharedIniFileCredentials({
    profile: "personal"
  });
}

const { REGION, TABLE_NAME } = process.env;
let params = { TableName: TABLE_NAME };
const docClient = new AWS.DynamoDB.DocumentClient({ region: REGION });

const getAll = () => {
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

const handleRequest = async ({ text, user_name, user_id }) => {
  if (text === "scores") {
    return await getAll()
      .then(items => `${prettifyScores(items)}`)
      .catch(err => console.log(err));
  } else if (text === "add_point") {
    return await givePlayerAPoint(user_name, user_id)
      .then(item => item)
      .catch(err => console.log(err));
  } else if (text.includes("set_score")) {
    const args = text.split(" ");
    const scoreToSet = args[1];
    const playerToGivePointsTo = args[2];
    console.log(scoreToSet);
    let msg;
    if (playerToGivePointsTo) {
      msg = `Trying to set ${playerToGivePointsTo} ${scoreToSet}`;
    } else {
      msg = `<@${user_id}>'s score is now ${scoreToSet}!`;
    }
    return await setScore(user_id, scoreToSet, { name: user_name }).then(
      new_score => msg
    );
  } else {
    const res = `"${text}" is not a valid action for this bot!`;
    console.log(res);
    return res;
  }
};

function setScore(player, new_score, details) {
  params.Item = {
    player: player,
    score: new_score,
    details
  };
  return new Promise(async (resolve, reject) => {
    docClient.put(params, err => {
      if (err) {
        reject(Error(err));
      } else {
        resolve(new_score);
      }
    });
  });
}

function queryDBforPlayer(entries, slackUserName) {
  return entries.filter(score => {
    return (
      score.player.toLowerCase().includes(slackUserName.toLowerCase()) ||
      slackUserName.toLowerCase().includes(score.player.toLowerCase())
    );
  });
}

function givePointIfPlayerExists(
  entries,
  slackUserName,
  resolve,
  reject,
  slackUserID
) {
  const player_obj = queryDBforPlayer(entries, slackUserName);
  if (player_obj.length === 1) {
    const { player, score } = player_obj[0];
    console.log(`Giving ${player} a point!`);
    setScore(player, (parseInt(score) + 1).toString()).then(new_score => {
      return resolve(`<@${slackUserID}>'s score is now ${new_score}!`);
    });
  } else {
    return reject(`<@${slackUserID}>'s score is not changed.`);
  }
}

const givePlayerAPoint = (slackUser, slackUserID) => {
  return new Promise(async (resolve, reject) => {
    getAll()
      .then(entries => {
        givePointIfPlayerExists(
          entries,
          slackUser,
          resolve,
          reject,
          slackUserID
        );
      })
      .catch(err => console.log(err));
  });
};

const prettifyScores = scores => {
  function compare(a, b) {
    if (a.score > b.score) return -1;
    if (a.score < b.score) return 1;
    return 0;
  }

  return scores
    .sort(compare)
    .map(player => `*<@${player.player}>*: ${player.score}\n`)
    .join("");
};

function createResponse(result, statusCode) {
  return {
    statusCode: statusCode,
    body: JSON.stringify({
      response_type: "ephemeral",
      text: result
    })
  };
}

exports.handler = async event => {
  const params = querystring.parse(event.body);
  if (process.env.VERIFICATION_TOKEN !== params.token) {
    const res = createResponse("Unauthorized", 401);
    console.log(res);
    return res;
  } else {
    const result = await handleRequest(params);
    let res = await createResponse(result, 200);
    console.log(res);
    return res;
  }
};
