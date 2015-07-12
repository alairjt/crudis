(function (){
	'use strict';

	app.controller('Formulario<%= crudName %>Controller', ['$scope', '$stateParam', '<%= crudName %>Service', 
		function ($scope, $stateParam, <%= crudName %>Service) {
			var id<%= crudName %> = $stateParam.id;
			
			$scope.salvar = function (<%= crudName %>) {
				return <%= crudName %>Service.salvar(<%= crudName %>, id<%= crudName %>);
			};
		}
	]);
})();