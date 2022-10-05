const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');
const validateEmail = require('./middlewares/validateEmail');
const validatePassword = require('./middlewares/validatePassword');
const tokenPerson = require('./middlewares/tokenNewPerson');
const nameNewPerson = require('./middlewares/nameNewPerson');
const ageNewPerson = require('./middlewares/ageNewPerson');
const {
  validateTalk,
  validateRate,
  validateWatched,
} = require('./middlewares/talkNewPerson');

const app = express();
app.use(bodyParser.json());
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';
const diretorio = path.resolve(__dirname, './talker.json');

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (_req, res) => {
  try {
    const pathData = path.resolve(__dirname, './talker.json');
    const data = JSON.parse(await fs.readFile(pathData, 'utf-8'));
    const response = data.length > 0 ? data : [];
    res.status(200).json(response);
  } catch (error) {
    console.error(`Erro na leitura do arquivo: ${error}`);
  }
});

app.get('/talker/:id', async (req, res) => {
  const pathData = diretorio;
  const data = JSON.parse(await fs.readFile(pathData, 'utf-8'));
  const idParam = req.params.id;
  const idTalker = data.find(({ id }) => id === Number(idParam));

  if (idTalker) {
    res.status(200).json(idTalker);
  } else {
    res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }
});

app.post('/login', validateEmail, validatePassword, (req, res) => {
  const { email, password } = req.body;
  const token = Math.random().toString(4).substring(2, 18);
  console.log(email);
  if (email && password) {
    res.status(200).json({ token });
  }
});

app.post('/talker',
  tokenPerson, nameNewPerson, ageNewPerson, validateTalk, 
  validateRate, validateWatched, async (req, res) => {
  const newPerson = req.body;
  const data = JSON.parse(await fs.readFile(diretorio, 'utf-8'));
  const dataId = ({ id: data.length + 1, ...newPerson });
  data.push(dataId);
  await fs.writeFile(diretorio, JSON.stringify(data));
  res.status(201).json(dataId);
});

app.listen(PORT, () => {
  console.log('Online');
});
