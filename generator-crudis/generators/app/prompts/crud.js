(function () {    
    'use strict';
    
    var utils = require('../utils.js');
    
    var prompts = [{
                    type: "input",
                    name: 'crudName',
                    message: 'Qual o nome do CRUD?'
                }, {
                    type: "list",
                    name: "menu",
                    message: "Adicionar ao menu?",
                    choices: function () {
                        return utils.buscarMenusDisponiveis();
                    }
                }, {
                    type: "list",
                    name: "servico",
                    message: "Qual serviço utilizar?",
                    choices: [
                        "banco",
                        "cliente",
                        "pagamentoCadastro",
                        "pagamentoOperacao",
                        "rbac"
                    ]
                }, {
                    when: function (response) {
                        return !response.novoRecurso;
                    },
                    type: "input",
                    name: "recurso",
                    message: "Qual recurso será utilizado?"
                }];

    module.exports = {
        prompts: prompts
    };
})();