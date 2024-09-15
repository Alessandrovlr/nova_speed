const express = require('express');
const { Client } = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Configura o middleware para tratar JSON no body da requisição
app.use(cors());
app.use(bodyParser.json());

// Conectar ao banco de dados PostgreSQL
const client = new Client({
  host: 'localhost',
  user: 'postgres',
  password: 'postgre0204',
  database: 'primeiroTeste',
});

client.connect()
  .then(() => console.log('Conectado ao PostgreSQL!'))
  .catch(err => console.error('Erro ao conectar ao banco de dados:', err));

// Função para inserir cliente
const inserirCliente = async (nome, sobrenome, data_nascimento) => {
  const query = 'INSERT INTO cliente (nome, sobrenome, data_nascimento) VALUES ($1, $2, $3) RETURNING cod_cli';
  const res = await client.query(query, [nome, sobrenome, data_nascimento]);
  return res.rows[0].cod_cli;
};

// Função para inserir telefone
const inserirTelefone = async (numero_telefone, ddd, cod_cli) => {
  const query = 'INSERT INTO telefone (numero_telefone, ddd, cod_cli) VALUES ($1, $2, $3)';
  await client.query(query, [numero_telefone, ddd, cod_cli]);
};

// Função para inserir endereço
const inserirEndereco = async (logradouro, bairro, cidade, cep, uf, complemento, cod_cli) => {
  const query = 'INSERT INTO endereco (logradouro, bairro, cidade, cep, uf, complemento, cod_cli) VALUES ($1, $2, $3, $4, $5, $6, $7)';
  await client.query(query, [logradouro, bairro, cidade, cep, uf, complemento, cod_cli]);
};

// Rota para tratar o POST vindo do formulário
app.post('/inserir-cliente', async (req, res) => {
  const { nome, sobrenome, data_nascimento, numero_telefone, logradouro, bairro, cidade, cep, uf, complemento } = req.body;
  
  try {
    // Extrai o DDD dos primeiros dois dígitos do número de telefone
    const ddd = numero_telefone.substring(0, 2);
    
    // Inserir cliente e obter o cod_cli
    const cod_cli = await inserirCliente(nome, sobrenome, data_nascimento);
    
    // Inserir telefone e endereço com o cod_cli relacionado
    await inserirTelefone(numero_telefone, ddd, cod_cli);
    await inserirEndereco(logradouro, bairro, cidade, cep, uf, complemento, cod_cli);

    res.status(200).send('Cliente e dados inseridos com sucesso!');
  } catch (err) {
    console.error('Erro ao inserir dados:', err);
    res.status(500).send('Erro ao inserir dados.');
  }
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
