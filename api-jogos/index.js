const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let jogos = [
  {
    "id": 1,
    "nome": "The Legend of Zelda",
    "tipo": "Aventura",
    "nota": 10,
    "review": "Um clássico absoluto."
  },
  {
    "id": 2,
    "nome": "FIFA 23",
    "tipo": "Esporte",
    "nota": 7,
    "review": "Bom para jogar com amigos."
  }
];

const getNextId = () => {
  if (jogos.length === 0) return 1;
  return Math.max(...jogos.map(j => j.id)) + 1;
};

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (email === "usuario@esoft.com" && password === "Abc123") {
    return res.status(200).json({ token: uuidv4() });
  }
  return res.status(401).json({ error: "Credenciais inválidas" });
});

app.get('/jogos', (req, res) => {
  res.status(200).json(jogos);
});

app.get('/jogos/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const jogo = jogos.find(j => j.id === id);

  if (jogo) {
    res.status(200).json(jogo);
  } else {
    res.status(404).json({ error: "Jogo não encontrado" });
  }
});

app.post('/jogos', (req, res) => {
  const { nome, tipo, nota, review } = req.body;

  const novoJogo = {
    id: getNextId(),
    nome,
    tipo,
    nota,
    review
  };

  jogos.push(novoJogo);
  res.status(201).json(novoJogo);
});

app.put('/jogos/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { nome, tipo, nota, review } = req.body;
  if (!nome || !tipo || nota === undefined || !review) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios no request." });
  }

  const index = jogos.findIndex(j => j.id === id);

  if (index !== -1) {
    jogos[index] = {
      id,
      nome,
      tipo,
      nota,
      review
    };
    res.status(200).json(jogos[index]);
  } else {
    res.status(404).json({ error: "Jogo não encontrado" });
  }
});

app.delete('/jogos/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = jogos.findIndex(j => j.id === id);

  if (index !== -1) {
    jogos.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ error: "Jogo não encontrado" });
  }
});

app.listen(PORT, () => {
  console.log(`API rodando na porta ${PORT}`);
});
