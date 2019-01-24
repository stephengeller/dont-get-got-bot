#!/usr/bin/env python3

from dont_get_got_bot.dynamodb_functions import *

players = ['Onome', 'Narayan', 'Stephen', 'Alex W', 'Naveed', 'Rhiannon', 'Charne' ]

for index, player in enumerate(players):
    add_player(player, index)

