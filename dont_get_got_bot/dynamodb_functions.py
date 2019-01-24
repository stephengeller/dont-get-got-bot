import boto3
import os

TABLE_NAME = 'dont_get_got_scores'
REGION = 'eu-west-2'


def add_player(player):
    table = create_table_session()
    put_item_in_table(player=player, score=0, table=table)
    print(player + " has been added to the table!")


def create_table_session():
    dynamodb = boto3.resource('dynamodb', region_name=REGION)
    table = dynamodb.Table(TABLE_NAME)
    return table


def create_client():
    session = boto3.session.Session(
        region_name=REGION,
        aws_access_key_id=os.environ["AWS_ACCESS_KEY"],
        aws_secret_access_key=os.environ["AWS_SECRET_KEY"],
    )
    return session.client('dynamodb')


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
    score = response['Item']['points']['N']
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
            "points": score
        }
    )


def list_players():
    table = create_table_session()
    items = table.scan()['Items']
    for item in items: print(item)
    return items
