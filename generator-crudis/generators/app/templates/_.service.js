(function () {
    'use strict';

    app.factory('<%= capitalize(crudName) %>Service', ['<%= capitalize(crudName) %>', function (<%= capitalize(crudName) %>) {
        var <%= capitalize(crudName) %>Service = {};

        <%= capitalize(crudName) %>Service.buscarPorId = function (id, cbSuccess, cbError) {
            return <%= capitalize(crudName) %>.get({id: id}, cbSuccess, cbError);
        };

        <%= capitalize(crudName) %>Service.buscar = function (filtros, cbSuccess, cbError) {
            return <%= capitalize(crudName) %>.query(filtros, cbSuccess, cbError);
        };

        <%= capitalize(crudName) %>Service.salvar = function (<%= crudName.toLowerCase() %>, id, cbSuccess, cbError) {
            if (<%= capitalize(crudName) %>Service.emEdicao(id)) {
                <%= capitalize(crudName) %>.update({id: id}, <%= crudName.toLowerCase() %>, cbSuccess, cbError);
            } else {
                <%= capitalize(crudName) %>.save(<%= crudName.toLowerCase() %>, cbSuccess, cbError);
            }
        };

        <%= capitalize(crudName) %>Service.emEdicao = function (id) {
            return id !== undefined;
        };

        return <%= capitalize(crudName) %>Service;
    }]);
})();
