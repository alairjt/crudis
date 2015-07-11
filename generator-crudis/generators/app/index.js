'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
  prompting: function () {
	var self = this;
    var done = this.async();
	
	var fieldsConsulta = [];
	var fieldsCadastro = [];

    this.log(yosay(
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
		}, {
			type: 'confirm',
			name: 'finalizar',
			message: 'Finalizar?',
			default: true
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
	
	var askField = function () {
		self.prompt(promptsField, function (props) {			
			fieldsConsulta.push(props.field);

			if (props.adicionarOutro) {
				askField();
			} else {
				console.log(fieldsConsulta);
				done();
			}
		}.bind(this));		
	};
	
	var ask = function () {
		self.prompt(prompts, function (props) {
		console.log('a');
			this.crudName = props.crudName;
			this.parametroId = props.parametroId;
			this.gerarTelaConsulta = props.gerarTelaConsulta;
			
			if (this.gerarTelaConsulta) {
				askField();
			}

			if (props.finalizar) {
				console.log('siim');
				done();
			}
		}.bind(this));
	};
	
	ask();
  },
  
  renderControllerFiles: function() {
		if (this.gerarTelaConsulta) {
			this.template('_.consulta.controller.js', this.crudName + '/Consulta' + this.crudName + 'Controller.js');
		}
		
		if (this.gerarTelaCadastro) {
			this.template('_.formulario.controller.js', this.crudName + '/Formulario' + this.crudName + 'Controller.js');
		}

//		this.template('_.service.js', this.crudName + '/' + this.crudName + 'Service.js');
  }
});
