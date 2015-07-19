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
    var script = '\t<script src="'.concat(path.toLowerCase()).concat('"></script>\r\n');
    wiring.appendToFile('index.html', 'html', script);
  };

  var criarMenu = function (crudName, menu) {
    return {
      "nome": capitalize(crudName),
      "href": "home.".concat(menu.toLowerCase()).concat(".").concat(crudName.toLowerCase()),
      "id": menu.toLowerCase().concat("-").concat(crudName.toLowerCase())
    };
  };

  var adicionarAoMenu = function (crudName, nomeMenu) {

    var menu = JSON.parse(wiring.readFileAsString('template/menu.json'));

    for (var i = 0; i < menu.menus.length; i++) {
      if (menu.menus[i].nome === nomeMenu) {
        menu.menus[i].submenus.push(criarMenu(crudName, nomeMenu));

        wiring.writeFileFromString(JSON.stringify(menu), 'template/menu.json');
        break;
      }
    }
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
      }];

      var promptsField = [{
        type: 'input',
        name: 'nome',
        message: 'Nome do campo'
      }, {
        type: "list",
        name: "tipo",
        message: "Tipo do campo",
        default: "String",
        choices: [
          "String",
          "Number",
          "Date",
          "CNPJ / CPF"
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
        var menu = JSON.parse(wiring.readFileAsString('template/menu.json'));
        var menus = [];

        for (var i = 0; i < menu.menus.length; i++) {
          menus.push(menu.menus[i].nome);
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
        self.prompt(promptsField, function (props) {
          fields.push({nome: props.nome, tipo: props.tipo});

          processarRetornoPrompt(props.adicionarOutro, askField, askFim);
        }.bind(self));
      };

      var ask = function () {
        self.prompt(prompts, function (props) {
          self.crudName = props.crudName;
          self.menu = props.menu;

          askField();
        }.bind(self));
      };

      ask();
    },

    renderControllerFiles: function () {
      this.ld = lodash;
      this.uc = underscore;
      this.capitalize = capitalize;

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


      adicionarAoMenu(this.crudName, this.menu);
    }
  });
})();
