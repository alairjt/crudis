(function () {
    'use strict';

    app.factory('<%= crudName %>Service', ['<%= crudName %>', function (<%= crudName %>) {
		var <%= crudName %>Service = {};
		
        <%= crudName %>Service.buscarPorId = function (id, cbSuccess, cbError) {
            return <%= crudName %>.get({<%= parametroId %>: id}, cbSuccess, cbError);
        };
        
        <%= crudName %>Service.buscar = function (filtros, cbSuccess, cbError) {
            return <%= crudName %>.query({<%= parametroId %>: id}, cbSuccess, cbError);
        };
        
        <%= crudName %>Service.salvar = function (<%= crudName %>, id, cbSuccess, cbError) {
            if (<%= crudName %>Service.emEdicao(id)) {
				<%= crudName %>.update(<%= crudName %>, {<%= parametroId %>: id}, cbSuccess, cbError);
            } else {
				<%= crudName %>.save(<%= crudName %>, {<%= parametroId %>: id}, cbSuccess, cbError);
            }
        };

        <%= crudName %>Service.emEdicao = function (id) {
            return id !== undefined;
        };

        return <%= crudName %>Service;
    }]);
})();