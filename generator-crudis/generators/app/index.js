'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
  prompting: function () {
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
			when: function (props) {
				console.log(props);
				return props.gerarTelaConsulta;
			},
			type: 'input',
			name: 'fieldConsulta',
			message: 'Nome do campo na consulta'
		}, {
			type: 'confirm',
			name: 'gerarTelaCadastro',
			message: 'Deseja gerar tela de cadastro?',
			default: true,
		}, {
			when: function (props) {
				console.log(props);
				return props.gerarTelaCadastro;
			},
			type: 'input',
			name: 'fieldCadastro',
			message: 'Nome do campo no formulário'
		}, {
			name: 'parametroId',
			message: 'Qual o nome do parâmetro ID?',
			default: 'id'
		}, {
			type: 'confirm',
			name: 'finalizar',
			message: 'Finalizar?',
			default: true
		}
	];

    this.prompt(prompts, function (props) {
		this.crudNaome = props.crudName;
		this.parametroId = props.parametroId;
		
		fieldsConsulta.push(props.fieldConsulta);
		fieldsCadastro.push(props.fieldCadastro);

		console.log(props.finalizar);
		if (props.finalizar) {
			done();
		}
    }.bind(this));
  },
  
  renderControllerFiles: function() {
		if (this.gerarTelaConsulta) {
			this.template('_.consulta.controller.js', this.crudName + '/Consulta' + this.crudName + 'Controller.js');
		}
		
		if (this.gerarTelaCadastro) {
			this.template('_.formulario.controller.js', this.crudName + '/Formulario' + this.crudName + 'Controller.js');
		}

		this.template('_.service.js', this.crudName + '/' + this.crudName + 'Service.js');
  }
});
