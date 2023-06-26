const express = require('express')
const axios = require('axios')

const port = 3011
const consumerPort = 3012
const url = `http://localhost`
const consumerUrl = `http://sd-consumer`

let queue = []

const app = express()

async function sendToConsumer(url, userName) {
  let response

  try {
    const requestUrl = `${url}/${userName}`
    response = await axios.get(requestUrl)
    console.log(`${userName} \tok`)
  } catch (err) {
    console.log(`${userName} \terr`)
    response = {
      status: 500
    }
  }

  return response.status
}

async function consumeQueue(url) {
  if (queue.length) {
    const userName = queue[0]
    await sendToConsumer(url, userName)
    console.log('====================Fila Atualizada====================')
    console.log(`${userName} consumido`)
    queue.shift()
    console.log(queue)

  } else {
    console.log('Lista vazia')

  }
}

app.use(express.json())

app.get('/test', (req, res) => {
  console.log('Fila testada com sucesso')
  res.status(200).send('Fila testada com sucesso')
})

app.post('/:userName', (req, res) => {
  if (!('userName' in req.params)) {
    console.log('Não foi possível adicionar o userName na fila')
    res.status(500).send('Não foi possível adicionar o userName na fila')
  } else {
    console.log('====================Fila Atualizada====================')
    queue.push(req.params.userName)
    console.log(`${req.params.userName} adicionado`)
    console.log(queue)
    res.send(queue[queue.length - 1])

    if (queue.length === 1) {
      const intervalId = setInterval(async () => {
        await consumeQueue(`${consumerUrl}:${consumerPort}`)
        if (!queue.length) {
          console.log('Lista vazia')
          clearInterval(intervalId)
        }
      }, 2500)
    }
  }
})

app.listen(port, () => {
  console.log(`HTTP server running on ${url}:${port}`)
})
