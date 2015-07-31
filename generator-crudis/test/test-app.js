(function () {
    'use strict';

    var path = require('path'),
            assert = require('yeoman-generator').assert,
            helpers = require('yeoman-generator').test,
            wiring = require('html-wiring'),
            sinon = require('sinon'),
            fs = require('fs-extra');

    var mockTemplateMenu = {"aplicacao": {"nome": "label.suporte", "href": "home"}, "menus": [{"url": "cadastros", "nome": "label.cadastros", "href": "#", "id": "menuHive", "submenus": [{"nome": "label.banco", "descricao": "message.descricao_banco", "href": "home.cadastros.banco", "id": "subMenuBanco"}, {"nome": "label.grupo", "descricao": "message.descricao_grupo", "href": "home.cadastros.grupo", "id": "subMenuGrupo"}, {"nome": "label.cliente", "descricao": "message.descricao_cliente", "href": "home.cadastros.empresa", "id": "subMenuEmpresa"}, {"nome": "label.usuario", "descricao": "message.descricao_usuario", "href": "home.cadastros.usuario", "id": "subMenuUsuario"}]}, {"url": "pagamento", "nome": "label.pagamento", "href": "#", "id": "menuPagamento", "submenus": [{"nome": "label.pagador", "descricao": "message.descricao_pagador", "href": "home.pagamento.pagador", "id": "subMenuPagador"}, {"nome": "label.convenio", "descricao": "message.descricao_convenio", "href": "home.pagamento.convenio", "id": "subMenuConvenio"}, {"nome": "label.regras_aprovacao", "descricao": "label.regras_aprovacao", "href": "home.pagamento.regrasAprovacao", "id": "subMenuRegrasAprovacao"}, {"nome": "label.associacao_aprovador", "descricao": "label.associacao_aprovador", "href": "home.pagamento.associacaoAprovador", "id": "subMenuTipoAprovador"}]}, {"url": "implantacao", "nome": "label.implantacao", "href": "#", "id": "menuImplantacao", "submenus": [{"nome": "label.grupo", "descricao": "message.descricao_implantacao_grupo", "href": "home.implantacao.grupo", "id": "subMenuWizard"}]}]};

    describe('crudis:app', function () {
        before(function (done) {
            sinon.stub(wiring, "readFileAsString", function () {
                return JSON.stringify(mockTemplateMenu);
            });

            helpers.run(path.join(__dirname, '../generators/app'))
                    .inTmpDir(function (dir) {
                        fs.copySync(path.join(__dirname, '../generators/app/templates'), dir);
                    })
                    .withOptions({skipInstall: true})
                    .withPrompts({
                        "crudName": "CrudTest",
                        "menu": "Consulta",
                        "servico": "banco",
                        "recurso": "bancos",
                        "tipoVisualizacao": "Simples",
                        "nome": "field",
                        "label": "Field label",
                        "tipo": "String",
                        "telas": ["consulta", "formulario"],
                        "adicionarOutro": false,
                        "finalizar": true
                    })
                    .on('end', done);
        });

        it('deve criar arquivos do CRUD', function () {
            assert.file([
                'crudtest/Crudtest.js',
                'crudtest/CrudtestConfig.js',
                'crudtest/CrudtestService.js',
                'crudtest/ConsultaCrudtestController.js',
                'crudtest/FormularioCrudtestController.js',
                'crudtest/consultaCrudtest.html',
                'crudtest/formularioCrudtest.html'
            ]);
        });
        
        it('deve criar o arquivo resource', function () {
            var fileContent = fs.readFileSync(path.join(__dirname, '/resources/fixtures/Crudtest.js'), 'utf8');

            assert.fileContent('crudtest/Crudtest.js', fileContent);
        });
        
        it('deve criar o arquivo de configuração', function () {
            var fileContent = fs.readFileSync(path.join(__dirname, '/resources/fixtures/CrudtestConfig.js'), 'utf8');

            assert.fileContent('crudtest/CrudtestConfig.js', fileContent);
        });

        it('deve criar o arquivo service', function () {
            var fileContent = fs.readFileSync(path.join(__dirname, '/resources/fixtures/CrudtestService.js'), 'utf8');

            assert.fileContent('crudtest/CrudtestService.js', fileContent);
        });

        it('deve criar o arquivo de controller para a consulta', function () {
            var fileContent = fs.readFileSync(path.join(__dirname, '/resources/fixtures/ConsultaCrudtestController.js'), 'utf8');

            assert.fileContent('crudtest/ConsultaCrudtestController.js', fileContent);
        });

        it('deve criar o arquivo de controller para o formulario', function () {
            var fileContent = fs.readFileSync(path.join(__dirname, '/resources/fixtures/FormularioCrudtestController.js'), 'utf8');

            assert.fileContent('crudtest/FormularioCrudtestController.js', fileContent);
        });

        it('deve criar o arquivo view para a consulta', function () {
            var fileContent = fs.readFileSync(path.join(__dirname, '/resources/fixtures/consultaCrudtest.html'), 'utf8');

            assert.fileContent('crudtest/consultaCrudtest.html', fileContent);
        });

        it('deve criar o arquivo view para o formulario', function () {
            var fileContent = fs.readFileSync(path.join(__dirname, '/resources/fixtures/formularioCrudtest.html'), 'utf8');

            assert.fileContent('crudtest/formularioCrudtest.html', fileContent);
        });
    });
})();