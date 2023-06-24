const express = require('express');
const axios = require('axios');
require('dotenv').config();

const port = 3012
const dbPort = 5433
const password = 'root'
const tableName = 'instagram_profile'
const url = `http://localhost`

const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: password,
  port: dbPort,
});

const insertData = async (values) => {
  let dbResponse

  try {
    const query = `
      INSERT INTO ${tableName} (name, img)
      VALUES ($1, $2)
      RETURNING *
    `;

    const client = await pool.connect();
    const result = await client.query(query, values);
    console.log('Entered data:', result.rows[0]);
    client.release();

    dbResponse = 200
  } catch (error) {
    console.error('Error inserting data:', error);

    dbResponse = 500
  }

  return dbResponse
};

const app = express();

app.use(express.json());

app.get('/:username', async (req, res) => {
  let insertDataResponse

  const { api_key, host } = process.env;

  const user = req.params.username;
  const options = {
    method: 'GET',
    url: `https://instagram-profile1.p.rapidapi.com/getprofile/${user}`,
    headers: {
      'X-RapidAPI-Key': api_key,
      'X-RapidAPI-Host': host
    }
  };

  try {
    const response = await axios.request(options);
    if (response.data.status === 'fail') {
      console.log('User not found');
    } else {
      const data = { "Name": response.data.full_name, "IMG": response.data.profile_pic_url };
      console.log(data);
      insertDataResponse = insertData([data.Name, data.IMG])
    }
  } catch (error) {
    console.log(error);
  }

  res.sendStatus(insertDataResponse)
});

app.listen(port, () => {
  console.log(`HTTP server running on ${url}:${port}`)
});