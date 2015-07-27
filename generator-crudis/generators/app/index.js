(function () {
    'use strict';

    var yeoman = require('yeoman-generator'),
            chalk = require('chalk'),
            yosay = require('yosay'),
            lodash = require('lodash'),
            underscore = require('underscore.string'),
            utils = require('./utils.js'),
            promptField = require('./prompts/field.js'),
            promptCrud = require('./prompts/crud.js'),
            promptFim = require('./prompts/finalizar.js'),
            fields = [];

    module.exports = yeoman.generators.Base.extend({
        prompting: function () {
            var self = this,
                    done = self.async();

            self.log(yosay('Bem vindo ao '.concat(chalk.red('Crudis Generator!'))));

            var askFim = function () {
                self.prompt(promptFim.prompts, function (props) {
                    utils.processarRetornoPrompt(props.finalizar, done, askField);
                }.bind(self));
            };

            var askField = function () {
                self.prompt(promptField.prompts, function (props) {
                    fields.push({
                        nome: props.nome, tipo: props.tipo, telas: props.telas,
                        label: props.label, comboboxDataFromService: props.comboboxDataFromService,
                        comboboxService: props.comboboxService, comboboxData: utils.efetuarParseComboboxData(props.comboboxData),
                        comboboxRecursoExistente: props.comboboxRecursoExistente
                    });

                    utils.processarRetornoPrompt(props.adicionarOutro, askField, askFim);
                }.bind(self));
            };

            var ask = function () {
                self.prompt(promptCrud.prompts, function (props) {
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
            var self = this;

            self.ld = lodash;
            self.uc = underscore;
            self.capitalize = utils.capitalize;
            self.obterInputPorTipo = utils.obterInputPorTipo;
            self.fields = fields;

            for (var key in self.fields) {
                if (self.fields[key].comboboxRecursoExistente === false) {
                    self.field = self.fields[key];
                    var pathResource = self.crudName.toLowerCase().concat('/').concat(self.capitalize(self.field.nome)).concat('.js');
                    self.template('_.resource_field.js', pathResource);
                    utils.adicionarScriptAoIndex(pathResource);
                    self.field.comboboxService = self.capitalize(self.field.nome);
                }
            }

            var templateController = function (crudName, tipoController) {
                var nomeController = self.capitalize(tipoController).concat(self.capitalize(crudName)).concat('Controller');
                var pathController = crudName.toLowerCase().concat('/').concat(nomeController).concat('.js');
                var pathView = crudName.toLowerCase().concat('/').concat(tipoController.toLowerCase()).concat(self.capitalize(crudName)).concat('.html');

                self.template('_.'.concat(tipoController).concat('.view.html'), pathView);
                self.template('_.'.concat(tipoController).concat('.controller.js'), pathController);

                utils.adicionarScriptAoIndex(pathController);
                
                return {
                    nomeController: nomeController,
                    pathController: pathController,
                    pathView: pathView
                };
            };

            var consultaController = templateController(self.crudName, 'consulta');
            var formularioController = templateController(self.crudName, 'formulario');
            
            this.pathConsultaView = consultaController.pathView;
            this.nomeConsultaController = consultaController.nomeController;
            this.pathFormularioView = formularioController.pathView;
            this.nomeFormularioController = formularioController.nomeController;

            self.pathService = self.crudName.toLowerCase().concat('/').concat(self.capitalize(self.crudName) + 'Service.js');
            self.template('_.service.js', self.pathService);
            utils.adicionarScriptAoIndex(self.pathService);
            
            self.pathResource = self.crudName.toLowerCase().concat('/').concat(self.capitalize(self.crudName)).concat('.js');
            self.template('_.resource.js', self.pathResource);
            utils.adicionarScriptAoIndex(self.pathResource);

            self.pathRoute = self.crudName.toLowerCase().concat('/').concat(self.capitalize(self.crudName) + 'Config.js');
            self.template('_.route.config.js', self.pathRoute);
            utils.adicionarScriptAoIndex(self.pathRoute);

            utils.adicionarAoMenu(self.crudName, self.menu);
        }
    });
})();
