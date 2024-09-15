const { Client } = require('pg');

// Criar conexão com o banco de dados
const client = new Client({
  host: 'localhost',    // Host do banco de dados
  user: 'postgres',     // Usuário do banco
  password: 'senha',    // Senha do banco
  database: 'meu_banco' // Nome do banco
});

// Conectar ao banco
client.connect()
  .then(() => console.log('Conectado ao PostgreSQL!'))
  .catch(err => console.error('Erro ao conectar ao banco de dados:', err));

// Função para inserir cliente
const inserirCliente = async (nome, sobrenome, adm, data_nascimento) => {
  const query = 'INSERT INTO cliente (nome, sobrenome, adm, data_nascimento) VALUES ($1, $2, $3, $4) RETURNING cod_cli';
  try {
    const res = await client.query(query, [nome, sobrenome, adm, data_nascimento]);
    return res.rows[0].cod_cli;  // Retorna o cod_cli do cliente recém-inserido
  } catch (err) {
    console.error('Erro ao inserir cliente: ', err);
    throw err;
  }
};

// Função para inserir telefone
const inserirTelefone = async (numero_telefone, ddd, cod_cli) => {
  const query = 'INSERT INTO telefone (numero_telefone, ddd, cod_cli) VALUES ($1, $2, $3)';
  try {
    await client.query(query, [numero_telefone, ddd, cod_cli]);
    console.log('Telefone inserido com sucesso!');
  } catch (err) {
    console.error('Erro ao inserir telefone: ', err);
  }
};

// Função para inserir endereço
const inserirEndereco = async (logradouro, bairro, cidade, cep, uf, complemento, cod_cli) => {
  const query = 'INSERT INTO endereco (logradouro, bairro, cidade, cep, uf, complemento, cod_cli) VALUES ($1, $2, $3, $4, $5, $6, $7)';
  try {
    await client.query(query, [logradouro, bairro, cidade, cep, uf, complemento, cod_cli]);
    console.log('Endereço inserido com sucesso!');
  } catch (err) {
    console.error('Erro ao inserir endereço: ', err);
  }
};

// Função para capturar os dados do formulário HTML e popular as tabelas
const popularTabelas = async () => {
  // Aqui você capturaria os valores do HTML (formulário). Como exemplo, vamos usar valores fixos.
  const nome = document.getElementById('nome').value;
  const sobrenome = document.getElementById('sobrenome').value;
  const adm = document.getElementById('adm').checked;  // Checkbox para admin
  const data_nascimento = document.getElementById('data_nascimento').value;

  const numero_telefone = document.getElementById('numero_telefone').value;
  const ddd = document.getElementById('ddd').value;

  const logradouro = document.getElementById('logradouro').value;
  const bairro = document.getElementById('bairro').value;
  const cidade = document.getElementById('cidade').value;
  const cep = document.getElementById('cep').value;
  const uf = document.getElementById('uf').value;
  const complemento = document.getElementById('complemento').value;

  try {
    // Inserir cliente e obter o cod_cli
    const cod_cli = await inserirCliente(nome, sobrenome, adm, data_nascimento);

    // Inserir telefone relacionado ao cliente
    await inserirTelefone(numero_telefone, ddd, cod_cli);

    // Inserir endereço relacionado ao cliente
    await inserirEndereco(logradouro, bairro, cidade, cep, uf, complemento, cod_cli);

    console.log('Todas as inserções foram realizadas com sucesso!');
  } catch (err) {
    console.error('Erro ao popular as tabelas: ', err);
  } finally {
    client.end();  // Fechar a conexão com o banco de dados após as operações
  }
};

// Exemplo: Chamar a função ao submeter o formulário no HTML
document.getElementById('formulario').addEventListener('submit', (event) => {
  event.preventDefault();  // Impede o envio do formulário padrão
  popularTabelas();  // Chama a função para popular as tabelas
});
