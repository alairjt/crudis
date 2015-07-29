(function () {
    'use strict';

    var wiring = require('html-wiring'),
        lodash = require('lodash'),
        underscore = require('underscore.string');

    var capitalize = function (string) {
        var string = string || "";
        return underscore.capitalize(string.toLowerCase());
    };

    var adicionarScriptAoIndex = function (path) {
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
            if (menu.menus[i].url && menu.menus[i].url.toLowerCase() === nomeMenu.toLowerCase()) {
                menu.menus[i].submenus.push(criarMenu(crudName, nomeMenu));

                wiring.writeFileFromString(JSON.stringify(menu), 'template/menu.json');
                break;
            }
        }
    };

    var getDisplayField = function (crudName, field) {
        var mask = obterInputType(field.tipo).mask;
        var filter = mask !== '' ? ' | ' + mask : "";

        return crudName.toLowerCase() + "." + field.nome + filter;
    };

    var obterInputType = function (tipo) {
        var type = "text", mask = "";
        switch (tipo) {
            case "Integer":
                type = mask = "number";
                break;
            case "Email":
                type = mask = "email";
                break;
            case "Decimal":
                type = mask = "currency";
                break;
            case "CNPJ / CPF":
                type = mask = "cpfcnpj";
                break;
            default:
                type = "text";
                break;
        }

        return {type: type, mask: mask};
    };

    var obterInputPorTipo = function (crudName, field) {
        var criarInput = function (crudName, field) {
            var specsField = obterInputType(field.tipo);
            return '<input type="' + specsField.type + '" ' + specsField.mask + ' class="form-control"' +
                    ' id="' + field.nome + '" name="' + field.nome + '"' +
                    ' ng-model="' + crudName.toLowerCase() + 'Selecionado.' + field.nome + '"' +
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

    var buscarMenusDisponiveis = function () {
        var menu = parserMenuJson();
        var menus = [];

        for (var i = 0; i < menu.menus.length; i++) {
            if (menu.menus[i].url) {
                menus.push(capitalize(menu.menus[i].url));
            }
        }

        return menus;
    };

    var processarRetornoPrompt = function (check, callbackTrue, callbackFalse) {
        return check ? callbackTrue() : callbackFalse();
    };

    var efetuarParseComboboxData = function (data) {
        if (!data)
            return;

        var retorno = [];
        var dados = data.split(";");
        for (var key in dados) {
            var chaveValor = dados[key].split(":");
            retorno.push({nome: chaveValor[0], valor: chaveValor[1]});
        }

        return JSON.stringify(retorno);
    };

    var hasFieldFormulario = function (fields) {
        var retorno = false;
        for (var key in fields) {
            if (lodash.contains(fields[key].telas, "formulario") === true) {
                retorno = true;
                break;
            }
        }
        
        return retorno;
    };

    module.exports = {
        adicionarAoMenu: adicionarAoMenu,
        adicionarScriptAoIndex: adicionarScriptAoIndex,
        buscarMenusDisponiveis: buscarMenusDisponiveis,
        capitalize: capitalize,
        criarMenu: criarMenu,
        efetuarParseComboboxData: efetuarParseComboboxData,
        getDisplayField: getDisplayField,
        hasFieldFormulario: hasFieldFormulario,
        obterInputPorTipo: obterInputPorTipo,
        obterInputType: obterInputType,
        parserMenuJson: parserMenuJson,
        processarRetornoPrompt: processarRetornoPrompt
    };
})();