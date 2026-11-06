const express = require('express');
require('dotenv').config();

const { conectarBanco } = require('./src/config/database');
const projetoRoutes = require('./src/routes/projetoRoutes');

const app = express();

// Permite receber dados em JSON
app.use(express.json());

// Rota inicial
app.get('/', (req, res) => {
    res.status(200).json({
        mensagem: 'API de Gerenciamento de Projetos funcionando!'
    });
});

// Rotas de projetos e tarefas
app.use('/projetos', projetoRoutes);

// Porta do servidor
const PORT = process.env.PORT || 3000;

// Iniciar servidor após conectar ao banco
async function iniciarServidor() {
    try {
        await conectarBanco();

        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });

    } catch (error) {
        console.error('Não foi possível iniciar a API.');
        process.exit(1);
    }
}

iniciarServidor();