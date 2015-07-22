(function (){
	'use strict';

	app.controller('Formulario<%= capitalize(crudName) %>Controller', ['$scope', '$stateParams', '<%= capitalize(crudName) %>Service',
		function ($scope, $stateParams, <%= capitalize(crudName) %>Service) {
			var id<%= capitalize(crudName) %> = $stateParams.id;
                        
                        $scope.<%= crudName.toLowerCase() %>Selecionado = <%= capitalize(crudName) %>Service.buscarPorId(id<%= capitalize(crudName) %>);

			$scope.salvar = function (<%= crudName %>) {
				return <%= capitalize(crudName) %>Service.salvar(<%= crudName %>, id<%= capitalize(crudName) %>);
			};
		}
	]);
})();
