// const test = (t = 1) => console.log(t)

// setInterval(() => test(), 1000)


async function sendToQueue(userName, url='http://localhost:3010') {
  const response = await axios.post(url, {userName}, { headers: {'Content-Type': 'application/json'} }).catch(() => {console.log('Não funfo')})

  console.log(response.data);
}

const inputMessage = 'Digite um nome de usuário do Instagram: '
const { default: axios } = require('axios');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question(`${inputMessage}`, (userInput) => {
  if (userInput.length && userInput.length <= 30 && userInput === userInput.toLowerCase() && !userInput.endsWith('.')) {
    sendToQueue(userInput);
  }
  rl.close();
});