const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const dotenv = require('dotenv');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

// MySQL connection setup
// const db = mysql.createConnection({
//   host: 'bkygjmgnpeqttueikx0q-mysql.services.clever-cloud.com',
//   user: 'u2dgdso2fcf3vvbb',
//   password: 'mlyU8LDfN1hBQC8GAIDn', // replace with your MySQL root password
//   database: 'bkygjmgnpeqttueikx0q',
// });

// db.connect((err) => {
//   if (err) {
//     console.error('Database connection failed:', err);
//   } else {
//     console.log('Connected to the database.');
//   }
// });

// USSD logic
app.post('/ussd', (req, res) => {
  console.log(req.body);
  const { sessionId, serviceCode, phoneNumber, text } = req.body;
  // const textArray = text.split('*');
  let response = req.body;

  if (text === '') {
    // Initial menu
    response = `CON Welcome to the voting system
1. English
2. Kinyarwanda`;
    res.send(response);
  }
});

const PORT = 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
