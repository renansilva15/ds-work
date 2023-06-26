const express = require('express')
const axios = require('axios')

const port = 3010
const queuePort = 3011
const url = `http://localhost`
const queueUrl = `http://sd-queue`

async function testQueue(url) {
  let response

  try {
    response = await axios.get(url)
    console.log('Fila testada com sucesso')

  } catch (err) {
    console.log('Erro ao testar a fila')
    response = {
      status: 500
    }
  }

  return response.status
}

async function sendToQueue(url, userName) {
  let response

  try {
    // const requestUrl = `${url}?userName=${encodeURIComponent(userName)}`
    const requestUrl = `${url}/${userName}`
    response = await axios.post(requestUrl)
    console.log(`${userName} \tok`)
  } catch (err) {
    console.log(`${userName} \terr`)
    response = {
      status: 500
    }
  }

  return response.status
}

async function run(url) {
  const data = require('fs').readFileSync(`${require('path').join(__dirname, 'assets/data.txt')}`, 'utf8')
  const userNames = data.split('\n')
  let sendToQueueResponse = []

  for (const index of userNames) {
    if (index.length) {
      sendToQueueResponse.push(await sendToQueue(url, index))

    }
  }

  return (await Promise.all(sendToQueueResponse)).includes(500) ? 500 : 200
}

const app = express()

app.use(express.json())

app.get('/', async (req, res) => {
  const testQueueResponse = await testQueue(`${queueUrl}:${queuePort}/test`)
  let runResponse

  if (testQueueResponse !== 500) {
    runResponse = await run(`${queueUrl}:${queuePort}`)

  } else {
    runResponse = 500

  }

  res.status(runResponse).send(runResponse === 500 ? 'Erro ao enviar para a fila' : 'Todos os itens foram enviados para a fila')
})

app.listen(port, () => {
  console.log(`HTTP server running on ${url}:${port}`)
})


/*
const inputMessage = 'Digite um nome de usuário do Instagram: '
const { default: axios } = require('axios')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

rl.question(`${inputMessage}`, (userInput) => {
  if (userInput.length && userInput.length <= 30 && userInput === userInput.toLowerCase() && !userInput.endsWith('.')) {
    sendToQueue(userInput)
  }
  rl.close()
})
*/
