'use strict';

var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var fieldsConsulta = [];
var fieldsCadastro = [];

module.exports = yeoman.generators.Base.extend({
  prompting: function () {
	var self = this;
    var done = self.async();
	
    self.log(yosay(
      'Bem vindo ao '.concat(chalk.red('Crudis')).concat(' generator!')
    ));

    var prompts = [{
			name: 'crudName',
			message: 'Qual o nome do CRUD?'
		}, {
			type: 'confirm',
			name: 'gerarTelaConsulta',
			message: 'Deseja gerar tela de consulta?',
			default: true,
		}
	];
	
	var promptsFormulario = [{
			type: 'confirm',
			name: 'gerarTelaFormulario',
			message: 'Deseja gerar tela de formulario?',
			default: true,
		}
	];
	
	var promptsField = [{
			type: 'input',
			name: 'field',
			message: 'Nome do campo'
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
	
	var askFormulario = function () {
		self.prompt(promptsFormulario, function (props) {
			self.gerarTelaFormulario = props.gerarTelaFormulario;
			
			if (self.gerarTelaFormulario) {
				askFieldFormulario();
			}
		}.bind(self));
	};
	
	var askFim = function () {
		self.prompt(promptsFim, function (props) {
			if (props.finalizar) {
				done();
			} else {
				console.log('aaaa');
			}
		}.bind(self));
	};
	
	var askFieldFormulario = function () {
		self.prompt(promptsField, function (props) {			
			fieldsCadastro.push(props.field);

			if (props.adicionarOutro) {
				askFieldFormulario();
			} else {
				askFim();
			}
		}.bind(self));		
	};
	
	var askField = function () {
		self.prompt(promptsField, function (props) {			
			fieldsConsulta.push(props.field);

			if (props.adicionarOutro) {
				askField();
			} else {
				askFormulario();
			}
		}.bind(self));		
	};
	
	var ask = function () {
		self.prompt(prompts, function (props) {
			self.crudName = props.crudName;
			self.gerarTelaConsulta = props.gerarTelaConsulta;
			
			if (self.gerarTelaConsulta) {
				askField();
			}
		}.bind(self));
	};
	
	ask();
  },
  
  renderControllerFiles: function() {
		var self = this;
		
		console.log(fieldsConsulta);
		console.log(fieldsCadastro);

		if (self.gerarTelaConsulta) {
			self.template('_.consulta.controller.js', self.crudName + '/Consulta' + self.crudName + 'Controller.js');
		}
		
		if (self.gerarTelaFormulario) {
			self.template('_.formulario.controller.js', self.crudName + '/Formulario' + self.crudName + 'Controller.js');
		}

		self.template('_.service.js', self.crudName + '/' + self.crudName + 'Service.js');
  }
});
