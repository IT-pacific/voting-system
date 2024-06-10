// Get the client
import mysql from 'mysql2/promise';

// Create the connection to database
const connection = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'voting_schema',
});

export const getCandidates = async () => {
  try {
    const [results, fields] = await connection.query(
      'SELECT * FROM `candidates`'
    );
    console.log(results[0]);
    return results;
  } catch (err) {
    console.log(err);
  }
};

export const addVote = async () => {
  try {
    await connection.query();
    console.log('vote added');
  } catch (err) {
    console.log(err);
  }
};
