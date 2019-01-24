#!/usr/bin/env node

const test_data = require("../slack_http_request");
const index = require("./src/index");

index.handler(test_data);
