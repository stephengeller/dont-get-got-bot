#!/usr/bin/env node

const test_data = require("../example");
const index = require("./src/index");

index.handler(test_data);
