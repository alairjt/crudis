(function () {
    'use strict';

    var yeoman = require('yeoman-generator'),
            chalk = require('chalk'),
            yosay = require('yosay'),
            lodash = require('lodash'),
            underscore = require('underscore.string'),
            wiring = require('html-wiring'),
            fields = [];

    var capitalize = function (string) {
        return underscore.capitalize(string.toLowerCase());
    };

    var adicionarAoIndex = function (path) {
        var script = '\t<script src="'.concat(path).concat('"></script>\r\n');
        wiring.appendToFile('index.html', 'html', script);
    };

    var criarMenu = function (crudName, menu) {
        return {
            "nome": capitalize(crudName),
            "href": "home.".concat(menu.toLowerCase()).concat(".").concat(crudName.toLowerCase()),
            "id": menu.toLowerCase().concat("-").concat(crudName.toLowerCase())
        };
    };
    
    var parserMenuJson = function () {
        try {
            return JSON.parse(wiring.readFileAsString('template/menu.json'));
        } catch (e) {
            throw new Error("Crudis deve ser executado no diretorio 'src' e conter o arquivo 'template/menu.json'");
        }        
    };

    var adicionarAoMenu = function (crudName, nomeMenu) {
        var menu = parserMenuJson();

        for (var i = 0; i < menu.menus.length; i++) {
            if (menu.menus[i].url.toLowerCase() === nomeMenu.toLowerCase()) {
                menu.menus[i].submenus.push(criarMenu(crudName, nomeMenu));

                wiring.writeFileFromString(JSON.stringify(menu), 'template/menu.json');
                break;
            }
        }
    };
    
    var obterInputPorTipo = function (crudName, field) {
        var criarInput = function (crudName, field) {
            var obterInputType = function (tipo) {
                var type = "text", mask = "";
                switch (tipo) {
                    case "Integer":
                        type = "number";
                        break;
                    case "Email":
                        type = "email";
                        break;                        
                    case "Decimal":
                        mask = "currency";
                        break;
                    case "CNPJ / CPF":
                        mask = "cpfcnpj";
                        break;
                    default:
                        type = "text";
                        break;
                }
                
                return {type: type, mask: mask};
            };

            var specsField = obterInputType(field.tipo);
            return '<input type="' + specsField.type + '" ' + specsField.mask + ' class="form-control"' +
                 ' id="' + field.nome + '" name="' + field.nome + '"' +
                 ' ng-model="' + crudName.toLowerCase() + 'Selecionado.' + field.nome + '"'+
                 ' ng-required="true"/>';
        };
        
        var criarInputImagem = function (crudName, field) {
            return '<input ng-model="image" value="' + crudName.toLowerCase() + 'Selecionado.' + field.nome + '" onchange="angular.element(this).scope().fileChanged(this, \'' + field.nome + '\');" type="file" accept="image/*" />';
        };
        
        var criarInputDate = function (crudName, field) {
            return '<calendar label="Data" model="' + crudName.toLowerCase() + 'Selecionado.' + field.nome + '" format="dd/MM/yyyy"></calendar>';
        };
        
        var criarInputCombobox = function (crudName, field) {
            return '<select class="form-control" name="' + field.nome + '" ng-model="' + crudName.toLowerCase() + 'Selecionado.' + field.nome + '" id="' + field.nome + '"' +
                        'ng-options="data as data.nome for data in lista' + capitalize(field.nome) + '" ng-required="true">' +
                    '</select>';
        };
        
        var input = "";
        
        switch (field.tipo) {
            case "CNPJ / CPF":
            case "Decimal":
            case "Email":
            case "Integer":
            case "String":
                input = criarInput(crudName, field);
                break;
            case "Combobox":
                input = criarInputCombobox(crudName, field);
                break;
            case "Date":
                input = criarInputDate(crudName, field);
                break;
            case "Imagem":
                input = criarInputImagem(crudName, field);
                break;
            default:
                throw new Error("Tipo inexistente");
                break;
        }
         
         return input;
    };

    module.exports = yeoman.generators.Base.extend({
        prompting: function () {
            var self = this,
                    done = self.async();

            self.log(yosay(
                    'Bem vindo ao '.concat(chalk.red('Crudis Generator!'))
                    ));

            var prompts = [{
                    type: "input",
                    name: 'crudName',
                    message: 'Qual o nome do CRUD?'
                }, {
                    type: "list",
                    name: "menu",
                    message: "Adicionar ao menu?",
                    choices: function () {
                        return buscarMenusDisponiveis();
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

            var promptsField = [{
                    type: 'input',
                    name: 'nome',
                    message: 'Nome do campo'
                }, {
                    type: 'input',
                    name: 'label',
                    message: 'Label do campo'
                }, {
                    type: "list",
                    name: "tipo",
                    message: "Tipo do campo",
                    default: "String",
                    choices: [
                        "CNPJ / CPF",
                        "Combobox",
                        "Date",
                        "Decimal",
                        "Email",
                        "Imagem",
                        "Integer",
                        "String"
                    ]
                }, {
                    when: function (data) {
                        return data.tipo === 'Combobox';
                    },
                    type: "confirm",
                    name: "comboboxDataFromService",
                    message: "Os dados da combobox serão carregados a partir de um serviço?",
                    default: true
                }, {
                    when: function (data) {
                        return data.tipo === 'Combobox' && data.comboboxDataFromService;
                    },
                    type: "input",
                    name: "comboboxService",
                    message: "Informe o serviço/recurso a ser utilizado (ex.: SERVICES.banco.bancos)"
                }, {
                    when: function (data) {
                        return data.tipo === 'Combobox' && !data.comboboxDataFromService;
                    },
                    type: "input",
                    name: "comboboxData",
                    message: "Informe os dados da combobox no formato Chave1:Valor1;Chave2:Valor2"
                }, {
                    type: "checkbox",
                    name: "telas",
                    message: "Utilizar o campo nas telas:",
                    choices: [
                        "consulta",
                        "formulario"
                    ]
                }, {
                    type: 'confirm',
                    name: 'adicionarOutro',
                    message: 'Adicionar outro campo?',
                    default: true
                }
            ];

            var promptsFim = [{
                    type: 'confirm',
                    name: 'finalizar',
                    message: 'Finalizar?',
                    default: true
                }
            ];

            var buscarMenusDisponiveis = function () {
                var menu = parserMenuJson();
                var menus = [];

                for (var i = 0; i < menu.menus.length; i++) {
                    menus.push(capitalize(menu.menus[i].url));
                }

                return menus;
            };

            var processarRetornoPrompt = function (check, callbackTrue, callbackFalse) {
                return check ? callbackTrue() : callbackFalse();
            };

            var askFim = function () {
                self.prompt(promptsFim, function (props) {
                    processarRetornoPrompt(props.finalizar, done, askField);
                }.bind(self));
            };

            var askField = function () {
                var efetuarParseComboboxData = function (data) {
                    if (!data) return;

                    var retorno = [];
                    var dados = data.split(";");
                    for (var key in dados) {
                        var chaveValor = dados[key].split(":");
                        retorno.push({nome: chaveValor[0], valor: chaveValor[1]});
                    }
                    
                    return JSON.stringify(retorno);
                };
                
                self.prompt(promptsField, function (props) {
                    fields.push({
                        nome: props.nome, tipo: props.tipo, telas: props.telas, 
                        label: props.label, comboboxDataFromService: props.comboboxDataFromService,
                        comboboxService: props.comboboxService, comboboxData: efetuarParseComboboxData(props.comboboxData)
                    });
                    
                    processarRetornoPrompt(props.adicionarOutro, askField, askFim);
                }.bind(self));
            };

            var ask = function () {
                self.prompt(prompts, function (props) {
                    self.crudName = props.crudName;
                    self.menu = props.menu.toLowerCase();
                    self.servico = props.servico;
                    self.recurso = props.recurso;

                    askField();
                }.bind(self));
            };

            ask();
        },
        renderControllerFiles: function () {
            this.ld = lodash;
            this.uc = underscore;
            this.capitalize = capitalize;
            this.obterInputPorTipo = obterInputPorTipo;
            this.fields = fields;

            this.nomeConsultaController = 'Consulta'.concat(capitalize(this.crudName)).concat('Controller');
            this.pathConsultaController = this.crudName.toLowerCase().concat('/').concat(this.nomeConsultaController).concat('.js');
            adicionarAoIndex(this.pathConsultaController);
            this.pathConsultaView = this.crudName.toLowerCase().concat('/consulta').concat(capitalize(this.crudName)).concat('.html');

            this.nomeFormularioController = 'Formulario'.concat(capitalize(this.crudName)).concat('Controller');
            this.pathFormularioController = this.crudName.toLowerCase().concat('/').concat(this.nomeFormularioController).concat('.js');
            adicionarAoIndex(this.pathFormularioController);
            this.pathFormularioView = this.crudName.toLowerCase().concat('/formulario').concat(capitalize(this.crudName)).concat('.html');

            this.template('_.consulta.controller.js', this.pathConsultaController);
            this.template('_.consulta.view.html', this.pathConsultaView);
            this.template('_.formulario.controller.js', this.pathFormularioController);
            this.template('_.formulario.view.html', this.pathFormularioView);

            this.pathService = this.crudName.toLowerCase().concat('/').concat(capitalize(this.crudName) + 'Service.js');
            this.template('_.service.js', this.pathService);
            adicionarAoIndex(this.pathService);

            this.pathRoute = this.crudName.toLowerCase().concat('/').concat(capitalize(this.crudName) + 'Config.js');
            this.template('_.route.config.js', this.pathRoute);
            adicionarAoIndex(this.pathRoute);

            this.pathResource = this.crudName.toLowerCase().concat('/').concat(capitalize(this.crudName)).concat('.js');
            this.template('_.resource.js', this.pathResource);
            adicionarAoIndex(this.pathResource);

            adicionarAoMenu(this.crudName, this.menu);
        }
    });
})();
