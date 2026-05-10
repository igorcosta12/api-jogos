const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// In-memory data store
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

// Helper to find next ID
const getNextId = () => {
  if (jogos.length === 0) return 1;
  return Math.max(...jogos.map(j => j.id)) + 1;
};

// 1. POST /login
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  // Regra: Se email == "usuario@esoft.com" e password == "Abc123", retorne um UUID.
  if (email === "usuario@esoft.com" && password === "Abc123") {
    // Para fins do exemplo, podemos usar o mesmo UUID, ou gerar dinamicamente.
    // O PDF mostra "550e8400-e29b-41d4-a716-446655440000" como exemplo.
    // Retornamos um token uuid.
    return res.status(200).json({ token: uuidv4() });
  }
  return res.status(401).json({ error: "Credenciais inválidas" });
});

// 2. GET /jogos
app.get('/jogos', (req, res) => {
  res.status(200).json(jogos);
});

// 3. GET /jogos/{id}
app.get('/jogos/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const jogo = jogos.find(j => j.id === id);
  
  if (jogo) {
    res.status(200).json(jogo);
  } else {
    res.status(404).json({ error: "Jogo não encontrado" });
  }
});

// 4. POST /jogos
app.post('/jogos', (req, res) => {
  const { nome, tipo, nota, review } = req.body;
  
  // No request body example, there is no ID, we need to create one.
  const novoJogo = {
    id: getNextId(),
    nome,
    tipo,
    nota,
    review
  };

  jogos.push(novoJogo);
  res.status(201).json(novoJogo); // Response (201 Created)
});

// 5. PUT /jogos/{id}
app.put('/jogos/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { nome, tipo, nota, review } = req.body;

  // Obrigatório preencher todos os campos
  if (!nome || !tipo || nota === undefined || !review) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios no request." });
  }

  const index = jogos.findIndex(j => j.id === id);
  
  if (index !== -1) {
    jogos[index] = {
      id, // keeps the original id from params
      nome,
      tipo,
      nota,
      review
    };
    res.status(200).json(jogos[index]); // Response (200 OK)
  } else {
    res.status(404).json({ error: "Jogo não encontrado" });
  }
});

// 6. DELETE /jogos/{id}
app.delete('/jogos/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = jogos.findIndex(j => j.id === id);

  if (index !== -1) {
    jogos.splice(index, 1);
    res.status(204).send(); // Response (204 No Content)
  } else {
    res.status(404).json({ error: "Jogo não encontrado" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`API rodando na porta ${PORT}`);
});
