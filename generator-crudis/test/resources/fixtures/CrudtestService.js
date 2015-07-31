(function () {
    'use strict';

    app.factory('CrudtestService', ['Crudtest', function (Crudtest) {
        var buscar = Crudtest.query;

        var salvar = function (crudtest, id, cbSuccess, cbError) {
            if (emEdicao(id)) {
                Crudtest.update({id: id}, crudtest, cbSuccess, cbError);
            } else {
                Crudtest.save(crudtest, cbSuccess, cbError);
            }
        };

        var buscarPorId = function (id, cbSuccess, cbError) {
            return Crudtest.get({id: id}, cbSuccess, cbError);
        };

        var buscarParaEdicao = function (id, cbSuccess, cbError) {
            if (!emEdicao(id)) {
                return;
            }
            
            return buscarPorId(id, cbSuccess, cbError);
        };
        
        var fileChanged = function (element, callback) {
            if (element.files[0]) {
                var image = element.files[0];
                var reader = new FileReader();
                reader.onload = function (e) {
                    callback(image, e);
                };
                reader.readAsBinaryString(image);
            }
        };

        var emEdicao = function (id) {
            return id !== undefined;
        };

        return {
            buscar: buscar,
            buscarPorId: buscarPorId,
            buscarParaEdicao: buscarParaEdicao,
            emEdicao: emEdicao,
            fileChanged: fileChanged,
            salvar: salvar
        };
    }]);
})();
