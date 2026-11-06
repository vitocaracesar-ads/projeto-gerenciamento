const { obterBanco } = require('../config/database');
const { validarProjeto } = require('../models/Projeto');

// Listar todos os projetos ou aplicar filtros
async function listarProjetos(req, res) {
    try {
        const db = obterBanco();
        const colecao = db.collection('projetos');

        const filtro = {};

        if (req.query.nome) {
            filtro.nome = {
                $regex: req.query.nome,
                $options: 'i'
            };
        }

        if (req.query.tarefa) {
            filtro['tarefas.codigo'] = req.query.tarefa;
        }

        const projetos = await colecao.find(filtro).toArray();

        return res.status(200).json(projetos);

    } catch (error) {
        return res.status(500).json({
            erro: 'Erro ao consultar projetos.'
        });
    }
}

// Buscar projeto pelo código
async function buscarProjeto(req, res) {
    try {
        const db = obterBanco();

        const projeto = await db.collection('projetos').findOne({
            codigo: req.params.codigo
        });

        if (!projeto) {
            return res.status(404).json({
                erro: 'Projeto não encontrado.'
            });
        }

        return res.status(200).json(projeto);

    } catch (error) {
        return res.status(500).json({
            erro: 'Erro ao buscar projeto.'
        });
    }
}

// Cadastrar projeto
async function cadastrarProjeto(req, res) {
    console.log('DADOS RECEBIDOS:', req.body);
    try {
        const db = obterBanco();
        const colecao = db.collection('projetos');

        const validacao = validarProjeto(req.body);

        if (!validacao.valido) {
            return res.status(400).json({
                erro: validacao.mensagem
            });
        }

        const existente = await colecao.findOne({
            codigo: req.body.codigo
        });

        if (existente) {
            return res.status(409).json({
                erro: 'Projeto já cadastrado.'
            });
        }

       const novoProjeto = {
    codigo: req.body.codigo,
    nome: req.body.nome,
    tarefas: req.body.tarefas || []
};
    console.log('PROJETO ANTES DE SALVAR:', novoProjeto);
        await colecao.insertOne(novoProjeto);
        const projetoSalvo = await colecao.findOne({
    codigo: novoProjeto.codigo
});

console.log('PROJETO SALVO NO BANCO:', projetoSalvo);

        return res.status(201).json({
            mensagem: 'Projeto cadastrado com sucesso.',
            projeto: novoProjeto
        });

    } catch (error) {
        return res.status(500).json({
            erro: 'Erro ao cadastrar projeto.'
        });
    }
}

// Atualizar nome do projeto
async function atualizarProjeto(req, res) {
    try {
        const db = obterBanco();
        const colecao = db.collection('projetos');

        if (!req.body.nome || !req.body.nome.trim()) {
            return res.status(400).json({
                erro: 'O nome do projeto é obrigatório.'
            });
        }

        const resultado = await colecao.updateOne(
            { codigo: req.params.codigo },
            { $set: { nome: req.body.nome } }
        );

        if (resultado.matchedCount === 0) {
            return res.status(404).json({
                erro: 'Projeto não encontrado.'
            });
        }

        return res.status(200).json({
            mensagem: 'Projeto atualizado com sucesso.'
        });

    } catch (error) {
        return res.status(500).json({
            erro: 'Erro ao atualizar projeto.'
        });
    }
}

// Excluir projeto
async function excluirProjeto(req, res) {
    try {
        const db = obterBanco();

        const resultado = await db.collection('projetos').deleteOne({
            codigo: req.params.codigo
        });

        if (resultado.deletedCount === 0) {
            return res.status(404).json({
                erro: 'Projeto não encontrado.'
            });
        }

        return res.status(204).send();

    } catch (error) {
        return res.status(500).json({
            erro: 'Erro ao excluir projeto.'
        });
    }
}

// Listar tarefas de um projeto
async function listarTarefas(req, res) {
    try {
        const db = obterBanco();

        const projeto = await db.collection('projetos').findOne({
            codigo: req.params.codigo
        });

        if (!projeto) {
            return res.status(404).json({
                erro: 'Projeto não encontrado.'
            });
        }

        return res.status(200).json(projeto.tarefas);

    } catch (error) {
        return res.status(500).json({
            erro: 'Erro ao consultar tarefas.'
        });
    }
}

// Resumo do projeto
async function resumoProjeto(req, res) {
    try {
        const db = obterBanco();

        const projeto = await db.collection('projetos').findOne({
            codigo: req.params.codigo
        });

        if (!projeto) {
            return res.status(404).json({
                erro: 'Projeto não encontrado.'
            });
        }

        const responsaveis = [
            ...new Set(projeto.tarefas.map(tarefa => tarefa.responsavel))
        ];

        return res.status(200).json({
            codigo: projeto.codigo,
            nome: projeto.nome,
            totalTarefas: projeto.tarefas.length,
            responsaveis
        });

    } catch (error) {
        return res.status(500).json({
            erro: 'Erro ao gerar resumo do projeto.'
        });
    }
}

module.exports = {
    listarProjetos,
    buscarProjeto,
    cadastrarProjeto,
    atualizarProjeto,
    excluirProjeto,
    listarTarefas,
    resumoProjeto
};