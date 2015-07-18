(function () {
  'use strict';

  var yeoman = require('yeoman-generator'),
    chalk = require('chalk'),
    yosay = require('yosay'),
    lodash = require('lodash'),
    underscore = require('underscore.string'),
    wiring = require('html-wiring');


  var fields = [];

  var adicionarAoIndex = function (path) {
    var script = '\t<script src="'.concat(path).concat('"></script>\r\n');
    wiring.appendToFile('index.html', 'html', script);
  };

  module.exports = yeoman.generators.Base.extend({
    prompting: function () {
      var self = this,
        done = self.async();

      self.log(yosay(
        'Bem vindo ao '.concat(chalk.red('Crudis Generator!'))
      ));

      var prompts = [{
        name: 'crudName',
        message: 'Qual o nome do CRUD?'
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

      var askFim = function () {
        self.prompt(promptsFim, function (props) {
          if (props.finalizar) {
            done();
          } else {
            askField();
          }
        }.bind(self));
      };

      var askField = function () {
        self.prompt(promptsField, function (props) {
          var field = {nome: props.nome, tipo: props.tipo};
          fields.push(field);
          console.log(fields);
          if (props.adicionarOutro) {
            askField();
          } else {
            askFim();
          }
        }.bind(self));
      };

      var ask = function () {
        self.prompt(prompts, function (props) {
          self.crudName = props.crudName;

          askField();
        }.bind(self));
      };

      ask();
    },

    renderControllerFiles: function () {
      this.ld = lodash;
      this.uc = underscore;

      this.fields = fields;

      this.nomeConsultaController = 'Consulta'.concat(this.crudName).concat('Controller');
      this.pathConsultaController = this.crudName.toLowerCase().concat('/').concat(this.nomeConsultaController).concat('.js');
      adicionarAoIndex(this.pathConsultaController);
      this.pathConsultaView = this.crudName.toLowerCase().concat('/consulta').concat(this.crudName).concat('.html');

      this.nomeFormularioController = 'Formulario'.concat(this.crudName).concat('Controller');
      this.pathFormularioController = this.crudName.toLowerCase().concat('/').concat(this.nomeFormularioController).concat('.js');
      adicionarAoIndex(this.pathFormularioController);
      this.pathFormularioView = this.crudName.toLowerCase().concat('/formulario').concat(this.crudName).concat('.html');

      this.template('_.consulta.controller.js', this.pathConsultaController);
      this.template('_.consulta.view.html', this.pathConsultaView);

      this.template('_.formulario.controller.js', this.pathFormularioController);

      this.pathService = this.crudName.toLowerCase().concat('/').concat(this.crudName + 'Service.js');
      this.template('_.service.js', this.pathService);
      adicionarAoIndex(this.pathService);

      this.pathRoute = this.crudName.toLowerCase().concat('/').concat(this.crudName + 'Config.js');
      this.template('_.route.config.js', this.pathRoute);
      adicionarAoIndex(this.pathRoute);

      var novoMenu = {
        "nome": "label.".concat(this.crudName.toLowerCase()),
        "href": "home.cadastros.".concat(this.crudName.toLowerCase()),
        "id": "cadastros-".concat(this.crudName.toLowerCase())
      };

      var menus = JSON.parse(wiring.readFileAsString('template/menu.json'));

      menus.menus[0].submenus.push(novoMenu);

      var a = JSON.stringify(menus);

      wiring.writeFileFromString(a, 'template/menu.json');
    }
  });
})();
