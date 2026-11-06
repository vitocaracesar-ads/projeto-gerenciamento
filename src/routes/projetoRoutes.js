const express = require('express');
const router = express.Router();

const {
    listarProjetos,
    buscarProjeto,
    cadastrarProjeto,
    atualizarProjeto,
    excluirProjeto,
    listarTarefas,
    resumoProjeto
} = require('../controllers/ProjetoController');

const {
    adicionarTarefa,
    atualizarTarefa,
    excluirTarefa
} = require('../controllers/TarefaController');

// Rotas de projetos
router.get('/', listarProjetos);
router.get('/:codigo/tarefas', listarTarefas);
router.get('/:codigo/resumo', resumoProjeto);
router.get('/:codigo', buscarProjeto);

router.post('/', cadastrarProjeto);
router.put('/:codigo', atualizarProjeto);
router.delete('/:codigo', excluirProjeto);

// Rotas de tarefas
router.post('/:codigo/tarefas', adicionarTarefa);
router.put('/:codigo/tarefas/:codigoTarefa', atualizarTarefa);
router.delete('/:codigo/tarefas/:codigoTarefa', excluirTarefa);

module.exports = router;