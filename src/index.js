const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

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
  const pathData = path.resolve(__dirname, './talker.json');
  const data = JSON.parse(await fs.readFile(pathData, 'utf-8'));
  const idParam = req.params.id;
  console.log(idParam);
  const idTalker = data.find(({ id }) => id === Number(idParam));

  if (idTalker) {
    res.status(200).json(idTalker);
  } else {
    res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }
});

app.listen(PORT, () => {
  console.log('Online');
});
