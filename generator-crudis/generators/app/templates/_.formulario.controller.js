(function (){
	'use strict';

	app.controller('Formulario<%= capitalize(crudName) %>Controller', ['$scope', '$stateParam', '<%= capitalize(crudName) %>Service',
		function ($scope, $stateParam, <%= capitalize(crudName) %>Service) {
			var id<%= capitalize(crudName) %> = $stateParam.id;

			$scope.salvar = function (<%= crudName %>) {
				return <%= capitalize(crudName) %>Service.salvar(<%= crudName %>, id<%= capitalize(crudName) %>);
			};
		}
	]);
})();
