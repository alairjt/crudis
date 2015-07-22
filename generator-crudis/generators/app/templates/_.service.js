(function () {
    'use strict';

    app.factory('<%= capitalize(crudName) %>Service', ['<%= capitalize(crudName) %>', function (<%= capitalize(crudName) %>) {
        var buscar = function (filtros, cbSuccess, cbError) {
            return <%= capitalize(crudName) %>.query(filtros, cbSuccess, cbError);
        };

        var salvar = function (<%= crudName.toLowerCase() %>, id, cbSuccess, cbError) {
            if (emEdicao(id)) {
                <%= capitalize(crudName) %>.update({id: id}, <%= crudName.toLowerCase() %>, cbSuccess, cbError);
            } else {
                <%= capitalize(crudName) %>.save(<%= crudName.toLowerCase() %>, cbSuccess, cbError);
            }
        };

        var buscarPorId = function (id, cbSuccess, cbError) {
            return <%= capitalize(crudName) %>.get({id: id}, cbSuccess, cbError);
        };

        var buscarParaEdicao = function (id, cbSuccess, cbError) {
            if (!emEdicao(id)) {
                return;
            }
            
            return buscarPorId(id, cbSuccess, cbError);
        };

        var emEdicao = function (id) {
            return id !== undefined;
        };

        return {
            buscar: buscar,
            salvar: salvar,
            buscarPorId: buscarPorId,
            buscarParaEdicao: buscarParaEdicao,
            emEdicao: emEdicao
        };
    }]);
})();
