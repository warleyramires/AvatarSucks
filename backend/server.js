const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const oracledb = require('oracledb');

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
app.use(bodyParser.json());

// Conexão com o banco de dados Oracle
async function getConnection() {
    return await oracledb.getConnection({
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        connectionString: process.env.DB_CONNECTION_STRING
    });
}

// Middleware de conexão
app.use(async (req, res, next) => {
    try {
        req.db = await getConnection();
        next();
    } catch (error) {
        console.error('Erro ao conectar ao banco de dados:', error);
        res.status(500).json({ message: 'Erro ao conectar ao banco de dados.' });
    }
});

// Importar rotas
const cientistasRoutes = require('./routes/cientistas');
app.use('/cientistas', cientistasRoutes);

// Fechar conexão após cada request
app.use(async (req, res, next) => {
    if (req.db) {
        try {
            await req.db.close();
        } catch (error) {
            console.error('Erro ao fechar conexão com o banco:', error);
        }
    }
    next();
});

// Iniciar o servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
