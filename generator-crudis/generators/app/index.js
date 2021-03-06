(function () {
    'use strict';

    var yeoman = require('yeoman-generator'),
            nxUtils = require('nx-utils'),
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

            this.log(nxUtils.nexxSay("Crudis Generator"));

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
                    self.attrs = props;
                    self.crudName = props.crudName;
                    self.menu = props.menu.toLowerCase();
                    self.servico = props.servico;
                    self.recurso = props.recurso;
                    self.campoGrupo = props.campoGrupo;
                    self.campoGrupoDetalhes = props.campoGrupoDetalhes;
                    self.campoGrupoTotal = props.campoGrupoTotal;

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
            self.getDisplayField = utils.getDisplayField;
            self.fields = fields;
            self.showFormulario = utils.hasFieldFormulario(self.fields);
            self.hasImageField = utils.hasImageField(self.fields);

            for (var key in self.fields) {
                if (self.fields[key].comboboxRecursoExistente === false) {
                    self.field = self.fields[key];
                    var pathResource = self.crudName.toLowerCase().concat('/').concat(self.capitalize(self.field.nome)).concat('.js');
                    self.template('_.resource_field.js', pathResource);
                    utils.adicionarScriptAoIndex(pathResource);
                    self.field.comboboxService = self.capitalize(self.field.nome);
                }
            }

            var gerarTemplatesCrud = function (crudName, tipoController) {
                var nomeController = self.capitalize(tipoController).concat(self.capitalize(crudName)).concat('Controller');
                var pathController = crudName.toLowerCase().concat('/').concat(nomeController).concat('.js');
                var pathControllerTest = '../test/spec/'.concat(crudName.toLowerCase()).concat('/').concat(nomeController).concat('Test.js');
                var pathView = crudName.toLowerCase().concat('/').concat(tipoController.toLowerCase()).concat(self.capitalize(crudName)).concat('.html');

                if (self.attrs.tipoVisualizacao === 'Simples') {
                    self.template('_.'.concat(tipoController).concat('.view.html'), pathView);
                } else {
                    self.template('_.'.concat(tipoController).concat('.agrupada.view.html'), pathView);
                }
                self.template('_.'.concat(tipoController).concat('.controller.js'), pathController);
                self.template('_.'.concat(tipoController).concat('.controller.test.js'), pathControllerTest);

                utils.adicionarScriptAoIndex(pathController);
                
                return {
                    nomeController: nomeController,
                    pathController: pathController,
                    pathView: pathView
                };
            };

            var consultaController = gerarTemplatesCrud(self.crudName, 'consulta');
            self.pathConsultaView = consultaController.pathView;
            self.nomeConsultaController = consultaController.nomeController;
            
            if (self.showFormulario) {
                var formularioController = gerarTemplatesCrud(self.crudName, 'formulario');
                self.pathFormularioView = formularioController.pathView;
                self.nomeFormularioController = formularioController.nomeController;
            }
            
            var gerarTemplateBasico = function (template, crudName, endName) {
                var pathService = crudName.toLowerCase().concat('/').concat(self.capitalize(self.crudName).concat(endName));
                self.template(template, pathService);
                utils.adicionarScriptAoIndex(pathService);
            };
            
            gerarTemplateBasico('_.service.js', self.crudName, 'Service.js');
            gerarTemplateBasico('_.resource.js', self.crudName, '.js');
            gerarTemplateBasico('_.route.config.js', self.crudName, 'Config.js');

            utils.adicionarAoMenu(self.crudName, self.menu);
        }
    });
})();
