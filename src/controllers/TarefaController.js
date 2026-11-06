const { obterBanco } = require('../config/database');
const { validarTarefa } = require('../models/Projeto');

// Adicionar uma tarefa ao projeto
async function adicionarTarefa(req, res) {
    try {
        const colecao = obterBanco().collection('projetos');

        const projeto = await colecao.findOne({
            codigo: req.params.codigo
        });

        if (!projeto) {
            return res.status(404).json({
                erro: 'Projeto não encontrado.'
            });
        }

        const validacao = validarTarefa(req.body);

        if (!validacao.valido) {
            return res.status(400).json({
                erro: validacao.mensagem
            });
        }

        const duplicada = projeto.tarefas.some(
            tarefa => tarefa.codigo === req.body.codigo
        );

        if (duplicada) {
            return res.status(409).json({
                erro: 'Tarefa já cadastrada neste projeto.'
            });
        }

        const novaTarefa = {
            codigo: req.body.codigo,
            nome: req.body.nome,
            responsavel: req.body.responsavel
        };

        await colecao.updateOne(
            { codigo: req.params.codigo },
            { $push: { tarefas: novaTarefa } }
        );

        return res.status(201).json({
            mensagem: 'Tarefa cadastrada com sucesso.',
            tarefa: novaTarefa
        });

    } catch (error) {
        return res.status(500).json({
            erro: 'Erro ao cadastrar tarefa.'
        });
    }
}

// Atualizar uma tarefa
async function atualizarTarefa(req, res) {
    try {
        const colecao = obterBanco().collection('projetos');

        const projeto = await colecao.findOne({
            codigo: req.params.codigo
        });

        if (!projeto) {
            return res.status(404).json({
                erro: 'Projeto não encontrado.'
            });
        }

        if (
            typeof req.body.nome !== 'string' ||
            !req.body.nome.trim() ||
            typeof req.body.responsavel !== 'string' ||
            !req.body.responsavel.trim()
        ) {
            return res.status(400).json({
                erro: 'Nome e responsável são obrigatórios.'
            });
        }

        const tarefaExiste = projeto.tarefas.some(
            tarefa => tarefa.codigo === req.params.codigoTarefa
        );

        if (!tarefaExiste) {
            return res.status(404).json({
                erro: 'Tarefa não encontrada.'
            });
        }

        await colecao.updateOne(
            {
                codigo: req.params.codigo,
                'tarefas.codigo': req.params.codigoTarefa
            },
            {
                $set: {
                    'tarefas.$.nome': req.body.nome,
                    'tarefas.$.responsavel': req.body.responsavel
                }
            }
        );

        return res.status(200).json({
            mensagem: 'Tarefa atualizada com sucesso.'
        });

    } catch (error) {
        return res.status(500).json({
            erro: 'Erro ao atualizar tarefa.'
        });
    }
}

// Excluir uma tarefa
async function excluirTarefa(req, res) {
    try {
        const colecao = obterBanco().collection('projetos');

        const projeto = await colecao.findOne({
            codigo: req.params.codigo
        });

        if (!projeto) {
            return res.status(404).json({
                erro: 'Projeto não encontrado.'
            });
        }

        const resultado = await colecao.updateOne(
            {
                codigo: req.params.codigo,
                'tarefas.codigo': req.params.codigoTarefa
            },
            {
                $pull: {
                    tarefas: {
                        codigo: req.params.codigoTarefa
                    }
                }
            }
        );

        if (resultado.modifiedCount === 0) {
            return res.status(404).json({
                erro: 'Tarefa não encontrada.'
            });
        }

        return res.status(204).send();

    } catch (error) {
        return res.status(500).json({
            erro: 'Erro ao excluir tarefa.'
        });
    }
}

module.exports = {
    adicionarTarefa,
    atualizarTarefa,
    excluirTarefa
};