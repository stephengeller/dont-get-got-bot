#!/usr/bin/env python3

from dont_get_got_bot.main import *

with open('slack_http_request.json', 'r') as test_request:
    lambda_handler(test_request, None)