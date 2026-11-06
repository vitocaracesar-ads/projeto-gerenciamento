const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

let client;
let db;

async function conectarBanco() {
    try {
        if (!uri) {
            throw new Error('String de conexão do MongoDB não configurada.');
        }

        client = new MongoClient(uri);

        await client.connect();

        db = client.db(process.env.DB_NAME || 'gerenciamento_projetos');

        console.log('Conectado ao MongoDB com sucesso!');

        return db;

    } catch (error) {
        console.error('Erro ao conectar ao MongoDB:', error.message);
        throw error;
    }
}

function obterBanco() {
    if (!db) {
        throw new Error('Banco de dados não conectado.');
    }

    return db;
}

module.exports = {
    conectarBanco,
    obterBanco
};