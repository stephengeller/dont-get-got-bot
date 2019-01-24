import boto3
import os

TABLE_NAME = 'dont_get_got_scores'
REGION = 'eu-west-2'

if "ENVIRONMENT" in os.environ:
    env = os.environ["ENVIRONMENT"]
else:
    env = "dev"

boto3.setup_default_session(region_name=REGION)


def add_player(player):
    table = create_table_session()
    put_item_in_table(player=player, score=0, table=table)
    print(player + " has been added to the table!")


def create_table_session():
    session = create_session()
    dynamodb = session.resource('dynamodb', region_name=REGION)
    table = dynamodb.Table(TABLE_NAME)
    return table


def create_client():
    session = create_session()
    return session.client('dynamodb', region_name=REGION)


def create_session():
    if env == "prod":
        print(os.environ)
        session = boto3.session.Session(
            region_name=REGION,
            aws_access_key_id=os.environ["ACCESS_KEY_ID"],
            aws_secret_access_key=os.environ["SECRET_KEY"],
        )
    else:
        session = boto3.session.Session(profile_name="personal")
    return session


def get_score(player):
    client = create_client()
    response = client.get_item(
        TableName=TABLE_NAME,
        Key={
            'player': {
                'S': player
            }
        }
    )
    score = response['Item']['points']['S']
    print("Score for %s is now [%s]" % (player, score))
    return score


def modify_score(player, points):
    table = create_table_session()
    score = get_score(player)
    print("Modifying score %s by %s for player [%s]" % (score, points, player))
    new_score = int(int(score) + int(points))
    put_item_in_table(player, new_score, table)


def put_item_in_table(player, score, table):
    table.put_item(
        Item={
            "player": player,
            "points": str(score)
        }
    )


def list_players():
    table = create_table_session()
    items = table.scan()['Items']
    for item in items: print(item)
    return items
