const express = require('express')
const axios = require('axios')
const { Pool } = require('pg')

const API_KEY='d53bc78f32msh0aa94f439c187b6p15f4ddjsn2ea6f3d3e2fa'
const HOST='instagram-profile1.p.rapidapi.com'

const port = 3012
const dbPort = 5432
const password = 'root'
const tableName = 'instagram_profile'
const url = `http://localhost`

const pool = new Pool({
  user: 'postgres',
  host: 'ds-db',
  database: 'postgres',
  password: password,
  port: dbPort,
})

const insertData = async (values) => {
  return new Promise(async (resolve) => {
    let dbResponse

    try {
      const query = `
        INSERT INTO ${tableName} (user_name, real_name, img)
        VALUES ($1, $2, $3)
        RETURNING *
      `

      const client = await pool.connect()
      const result = await client.query(query, values)
      console.log('Entered data:', result.rows[0])
      client.release()

      dbResponse = 200
    } catch (error) {
      console.error('Error inserting data:', error)

      dbResponse = 500
    }

    resolve(dbResponse)
  })
}

const retryRequest = async (options, maxRetries = 2, retryDelay = 2500) => {
  let retryCount = 0

  while (retryCount < maxRetries) {
    try {
      const response = await axios.request(options)
      return response
    } catch (error) {
      if (error.response && error.response.status === 429) {
        console.log('Too Many Requests. Retrying...')
        retryCount++
        await new Promise(resolve => setTimeout(resolve, retryDelay))
      } else {
        throw error
      }
    }
  }

  throw new Error(`Request failed after ${maxRetries} retries.`)
}

const app = express()

app.use(express.json())

app.get('/:userName', async (req, res) => {
  let insertDataResponse = 200

  const user = req.params.userName
  const options = {
    method: 'GET',
    url: `https://instagram-profile1.p.rapidapi.com/getprofile/${user}`,
    headers: {
      'X-RapidAPI-Key': API_KEY,
      'X-RapidAPI-Host': HOST
    }
  }

  try {
    const response = await retryRequest(options)
    if (response.data.not_found) {
      console.log(`User ${user} not found`)

    } else {
      const data = { 'Name': response.data.full_name, 'IMG': response.data.profile_pic_url }
      insertDataResponse = await insertData([user, data.Name, data.IMG])

    }
  } catch (error) {
    console.log(error)
  }

  res.sendStatus(insertDataResponse)
})

app.listen(port, () => {
  console.log(`HTTP server running on ${url}:${port}`)
})
