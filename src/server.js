/* eslint-disable no-console */
const express = require("express");
const mysql = require('mysql');
const fs = require('fs');

const app = express();

const config = JSON.parse(fs.readFileSync(`${__dirname}/credentials.json`, 'utf8'));
const database = mysql.createConnection({
  host: 'localhost',
  user: config.username,
  password: config.password,
  database: config.database,
});

database.connect((err) => {
  if (err) {
    throw new Error(`Unable to connect to MySQL with the following credentials: \n${JSON.stringify(config)}`);
  }
  console.log(`Connected to table ${config.table} on database ${config.database}!`);
});

app.get('/students', (_req, res) => {
  const query = `SELECT student_id, student_name, minutes FROM ${config.table}`;
  database.query(query, (err, queryResult) => {
    if (err) {
      throw new Error(`Error in executing query '${query}'`);
    }
    res.send(queryResult);
  });
});

app.listen(config.port, () => {
  console.log(`Hour logging server listening on port ${config.port}...`);
});
