// const test = (t = 1) => console.log(t)

// setInterval(() => test(), 1000)


async function sendToQueue(userInput, url='https://api.example.com/post-endpoint') {
  await axios.post(url, userInput).catch(() => {console.log('Não funfo')})
}

const inputMessage = 'Digite um número binário: '
const { default: axios } = require('axios');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question(`${inputMessage}`, (userInput) => {
  sendToQueue(userInput)
  rl.close();
});