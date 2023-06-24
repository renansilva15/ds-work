const express = require('express')
const axios = require('axios')

const port = 3011
const url = `http://localhost`

let queue = []

const app = express()

app.use(express.json())

app.get('/test', (req, res) => {
  console.log('Fila testada com sucesso')
  res.sendStatus(200).send('Fila testada com sucesso')
})

app.get('/', (req, res) => {
  if (!queue.length) {
    console.log('Lista vazia');
    res.status(500).send('Lista vazia')

  } else {
    const consumed = queue.shift()
    console.log('====================Fila Atualizada====================')
    console.log(`${consumed.userName} consumido`)
    console.log(queue)
    res.status(200).send(`${consumed}`)

  }

})

app.post('/:userName', (req, res) => {
  if(!('userName' in req.params)) {
    console.log('Não foi possível adicionar o userName na fila');
    res.status(500).send('Não foi possível adicionar o userName na fila')

  } else {
    console.log('====================Fila Atualizada====================')
    queue.push(req.params.userName)
    console.log(`${req.params.userName} adicionado`)
    console.log(queue)
    res.send(queue[queue.length - 1])

  }

})

app.listen(port, () => {
  console.log(`HTTP server running on ${url}:${port}`)
})