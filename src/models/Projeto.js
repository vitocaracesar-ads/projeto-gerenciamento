// Valida os dados de um projeto
function validarProjeto(projeto) {
    if (!projeto.codigo || !projeto.nome) {
        return {
            valido: false,
            mensagem: 'Código e nome do projeto são obrigatórios.'
        };
    }

    return {
        valido: true
    };
}

// Valida os dados de uma tarefa
function validarTarefa(tarefa) {
    if (!tarefa.codigo || !tarefa.nome || !tarefa.responsavel) {
        return {
            valido: false,
            mensagem: 'Código, nome e responsável são obrigatórios.'
        };
    }

    return {
        valido: true
    };
}

// Define a coleção utilizada no MongoDB
function obterColecao(db) {
    return db.collection('projetos');
}

module.exports = {
    validarProjeto,
    validarTarefa,
    obterColecao
};