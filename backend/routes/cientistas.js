const express = require('express');
const router = express.Router();

// Criar cientista
router.post('/', async (req, res) => {
    const { nome, especializacao, sigla_lab, id_exploracao } = req.body;

    try {
        const query = `
            INSERT INTO CIENTISTA (NOME, ESPECIALIZACAO, SIGLA_LAB, ID_EXPLORACAO)
            VALUES (:nome, :especializacao, :sigla_lab, :id_exploracao)
        `;
        await req.db.execute(query, [nome, especializacao, sigla_lab, id_exploracao], { autoCommit: true });
        res.status(201).json({ message: 'Cientista criado com sucesso!' });
    } catch (error) {
        console.error('Erro ao criar cientista:', error);
        res.status(500).json({ message: 'Erro ao criar cientista.' });
    }
});

// Listar todos os cientistas
router.get('/', async (req, res) => {
    try {
        const result = await req.db.execute(`SELECT * FROM CIENTISTA`);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Erro ao listar cientistas:', error);
        res.status(500).json({ message: 'Erro ao listar cientistas.' });
    }
});

// Atualizar cientista por ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, especializacao, sigla_lab, id_exploracao } = req.body;

    try {
        const query = `
            UPDATE CIENTISTA
            SET NOME = :nome,
                ESPECIALIZACAO = :especializacao,
                SIGLA_LAB = :sigla_lab,
                ID_EXPLORACAO = :id_exploracao
            WHERE ID = :id
        `;
        await req.db.execute(query, [nome, especializacao, sigla_lab, id_exploracao, id], { autoCommit: true });
        res.status(200).json({ message: 'Cientista atualizado com sucesso!' });
    } catch (error) {
        console.error('Erro ao atualizar cientista:', error);
        res.status(500).json({ message: 'Erro ao atualizar cientista.' });
    }
});

// Deletar cientista por ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const query = `DELETE FROM CIENTISTA WHERE ID = :id`;
        await req.db.execute(query, [id], { autoCommit: true });
        res.status(200).json({ message: 'Cientista removido com sucesso!' });
    } catch (error) {
        console.error('Erro ao remover cientista:', error);
        res.status(500).json({ message: 'Erro ao remover cientista.' });
    }
});

module.exports = router;
