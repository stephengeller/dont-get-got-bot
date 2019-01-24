from dont_get_got_bot.main import DontGetGotBot as bot
from mock import MagicMock


def test_create_player():
    m = MagicMock()
    m.add_player.return_value = "Player has been created"
    assert bot().create_player('Stephen', db=m) == "Player has been created"
    m.add_player.assert_called_once()
    m.add_player.assert_called_with("Stephen")


def test_get_player_score():
    m = MagicMock()
    m.get_score.return_value = 42
    assert bot().get_player_score('Stephen', db=m) == "Player Stephen is on 42"
    m.get_score.assert_called_once()
    m.get_score.assert_called_with("Stephen")


def test_modify_score():
    m = MagicMock()
    m.modify_score.return_value = True
    assert bot().modify_score("Stephen", 10, db=m) == "Score has been modified by 10 for Stephen"
    m.modify_score.assert_called_with("Stephen", 10)


def test_list_players():
    m = MagicMock()
    players = [
        {
            "name": "foo",
            "score": 5
        },
        {
            "name": "bar",
            "score": 7
        }
    ]
    m.list_players.return_value = players
    assert bot().list_players(m) == players
    m.list_players.assert_called_once()
