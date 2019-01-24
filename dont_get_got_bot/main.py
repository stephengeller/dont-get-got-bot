from dont_get_got_bot import dynamodb_functions as ddb

class DontGetGotBot:
    def get_scores(self, ):
        return "scores"

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


def lambda_handler(event, context):
    bot = DontGetGotBot()