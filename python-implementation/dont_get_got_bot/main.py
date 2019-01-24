import json
import os

if "ENVIRONMENT" in os.environ:
    env = os.environ["ENVIRONMENT"]
else:
    env = "dev"

if env == "dev":
    from dont_get_got_bot import dynamodb_functions as ddb
else:
    import dynamodb_functions as ddb


class DontGetGotBot:
    def create_player(self, player_name, db=ddb):
        return db.add_player(player_name)

    def get_player_score(self, player_name, db=ddb):
        score = db.get_score(player_name)
        return "Player %s is on %s" % (player_name, score)

    def modify_score(self, player_name, points, db=ddb):
        result = db.modify_score(player_name, points)
        if result:
            return "Score has been modified by %s for %s" % (points, player_name)

    def list_players(self, db=ddb):
        return db.list_players()

    def get_all_scores(self, db=ddb):
        all_players = db.list_players()
        sorted_by_score = list(reversed(sorted(all_players, key=lambda k: k['score'])))
        return ", ".join(list(map(lambda x: "%s: %s" % (x['player'].capitalize(), x['score']), sorted_by_score)))


def lambda_handler(event, context):
    thing_to_parse = event['body']
    print(thing_to_parse)
    try:
        result = json.dumps(DontGetGotBot().get_all_scores())
        status_code = 200
    except:
        result = "Currently broken, try again later"
        status_code = 400
    return {
        "body": result,
        "statusCode": status_code
    }
