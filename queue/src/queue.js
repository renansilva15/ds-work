const express = require('express');
const app = express();
const port = 3010;

app.use(express.json());

let queue = []

app.post('/', (req, res) => {
  
  queue.push(req.body)
  console.log(queue);
  res.send(queue);
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});