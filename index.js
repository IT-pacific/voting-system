const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const dotenv = require('dotenv');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

// MySQL connection setup
const db = mysql.createConnection({
  host: 'bkygjmgnpeqttueikx0q-mysql.services.clever-cloud.com',
  user: 'u2dgdso2fcf3vvbb',
  password: 'mlyU8LDfN1hBQC8GAIDn', // replace with your MySQL root password
  database: 'bkygjmgnpeqttueikx0q',
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to the database.');
  }
});

// USSD logic
app.post('/ussd', (req, res) => {
  const { sessionId, serviceCode, phoneNumber, text } = req.body;
  const textArray = text.split('*');
  let response = '';

  if (text === '') {
    // Initial menu
    response = `CON Welcome to the voting system
1. English
2. Kinyarwanda`;
  } else if (textArray.length === 1) {
    // Language selection
    if (text === '1') {
      response = `CON Select Candidate`;
      db.query('SELECT * FROM candidates', (err, results) => {
        if (err) {
          console.error(err);
          res.send(`END Error retrieving candidates`);
        } else {
          results.forEach((candidate) => {
            response += `\n${candidate.id}. ${candidate.names}`;
          });
          res.send(response);
        }
      });
      return;
    } else if (text === '2') {
      response = `CON Hitamo Umukandida`;
      db.query('SELECT * FROM candidates', (err, results) => {
        if (err) {
          console.error(err);
          res.send(`END Ikosa ryabaye igihe batoranyaga abakandida`);
        } else {
          results.forEach((candidate) => {
            response += `\n${candidate.id}. ${candidate.names}`;
          });
          res.send(response);
        }
      });
      return;
    } else {
      response = `END Invalid choice. Please try again.`;
    }
  } else if (textArray.length === 2) {
    // Candidate selection
    const candidateId = textArray[1];
    db.query(
      'SELECT * FROM candidates WHERE id = ?',
      [candidateId],
      (err, results) => {
        if (err || results.length === 0) {
          response = `END Invalid candidate selection.`;
          res.send(response);
        } else {
          response = `CON Confirm vote for ${results[0].names}
1. Confirm
2. Cancel`;
          res.send(response);
        }
      }
    );
    return;
  } else if (textArray.length === 3) {
    // Confirm or cancel vote
    const candidateId = textArray[1];
    const confirmation = textArray[2];
    if (confirmation === '1') {
      // Check if the voter has already voted
      db.query(
        'SELECT * FROM votes WHERE voter_phonenumber = ?',
        [phoneNumber],
        (err, results) => {
          if (err) {
            response = `END Voting failed. Please try again.`;
            res.send(response);
          } else if (results.length > 0) {
            response = `END You have already voted.`;
            res.send(response);
          } else {
            // Insert vote into the votes table
            db.query(
              'INSERT INTO votes (cand_id, voter_phonenumber) VALUES (?, ?)',
              [candidateId, phoneNumber],
              (err, result) => {
                if (err) {
                  response = `END Voting failed. Please try again.`;
                } else {
                  response = `END Vote successfully recorded.`;
                }
                res.send(response);
              }
            );
          }
        }
      );
    } else {
      response = `END Voting cancelled.`;
      res.send(response);
    }
  } else {
    response = `END Invalid input.`;
    res.send(response);
  }
});

const PORT = process.env.PORT || 3306;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
