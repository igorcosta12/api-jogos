const request = require('supertest');
const app = require('./index');

describe('API de Jogos', () => {
  let jogoIdCriado;

  describe('POST /login', () => {
    it('deve retornar um token para credenciais válidas', async () => {
      const res = await request(app)
        .post('/login')
        .send({ email: 'usuario@esoft.com', password: 'Abc123' });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
    });

    it('deve retornar erro 401 para credenciais inválidas', async () => {
      const res = await request(app)
        .post('/login')
        .send({ email: 'errado@esoft.com', password: '123' });

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('error', 'Credenciais inválidas');
    });
  });

  describe('GET /jogos', () => {
    it('deve retornar a lista de jogos com status 200', async () => {
      const res = await request(app).get('/jogos');
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('POST /jogos', () => {
    it('deve criar um novo jogo e retornar status 201', async () => {
      const novoJogo = {
        nome: 'God of War',
        tipo: 'Ação',
        nota: 9,
        review: 'Muito bom'
      };

      const res = await request(app)
        .post('/jogos')
        .send(novoJogo);

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.nome).toEqual(novoJogo.nome);
      
      jogoIdCriado = res.body.id; // Salvar o id para os próximos testes
    });
  });

  describe('GET /jogos/:id', () => {
    it('deve retornar um jogo existente pelo ID', async () => {
      const res = await request(app).get(`/jogos/${jogoIdCriado}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('id', jogoIdCriado);
    });

    it('deve retornar erro 404 para um jogo inexistente', async () => {
      const res = await request(app).get('/jogos/9999');
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('error', 'Jogo não encontrado');
    });
  });

  describe('PUT /jogos/:id', () => {
    it('deve atualizar um jogo existente e retornar status 200', async () => {
      const jogoAtualizado = {
        nome: 'God of War Ragnarok',
        tipo: 'Ação/Aventura',
        nota: 10,
        review: 'Obra prima'
      };

      const res = await request(app)
        .put(`/jogos/${jogoIdCriado}`)
        .send(jogoAtualizado);

      expect(res.statusCode).toEqual(200);
      expect(res.body.nome).toEqual(jogoAtualizado.nome);
      expect(res.body.nota).toEqual(jogoAtualizado.nota);
    });

    it('deve retornar 400 se faltar campos na atualização', async () => {
      const res = await request(app)
        .put(`/jogos/${jogoIdCriado}`)
        .send({ nome: 'Incompleto' });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error', 'Todos os campos são obrigatórios no request.');
    });

    it('deve retornar erro 404 ao atualizar um jogo inexistente', async () => {
      const res = await request(app)
        .put('/jogos/9999')
        .send({
          nome: 'Teste',
          tipo: 'Teste',
          nota: 5,
          review: 'Teste'
        });

      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('error', 'Jogo não encontrado');
    });
  });

  describe('DELETE /jogos/:id', () => {
    it('deve deletar um jogo existente e retornar status 204', async () => {
      const res = await request(app).delete(`/jogos/${jogoIdCriado}`);
      expect(res.statusCode).toEqual(204);
      // Validar se realmente foi deletado
      const getRes = await request(app).get(`/jogos/${jogoIdCriado}`);
      expect(getRes.statusCode).toEqual(404);
    });

    it('deve retornar 404 ao tentar deletar um jogo inexistente', async () => {
      const res = await request(app).delete('/jogos/9999');
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('error', 'Jogo não encontrado');
    });
  });
});
