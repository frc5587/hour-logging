const express = require("express");
const fs = require('fs');

const app = express();

const obj = JSON.parse(fs.readFileSync(`${__dirname}/credentials.json`, 'utf8'));
console.log(obj);
