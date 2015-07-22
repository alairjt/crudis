(function (){
	'use strict';

	app.controller('Consulta<%= capitalize(crudName) %>Controller', ['$scope', 'HIVE_COMMON', '$filter', '<%= capitalize(crudName) %>Service',
            function($scope, HIVE_COMMON, $filter, <%= capitalize(crudName) %>Service) {
                $scope.criterio = "";
                $scope.campoOrderBy = "";
                $scope.reverse = false;
                $scope.currentPage = 1;
                $scope.pageSize = HIVE_COMMON.pageSize;
                
                var lista<%= capitalize(crudName) %> = <%= capitalize(crudName) %>Service.buscar(null, function () {
                    $scope.filtered = lista<%= capitalize(crudName) %>;
                });
                
                $scope.$watch('criterio', function () {
                    $scope.filtered = $filter('filter')(lista<%= capitalize(crudName) %>, $scope.criterio);
                });

                $scope.ordenarCamposPor = function (campo) {
                    $scope.campoOrderBy = campo;
                    $scope.reverse = !$scope.reverse;
                };
                
                $scope.ordenarCamposPor = function (campo) {
                    $scope.campoOrderBy = campo;
                    $scope.reverse = !$scope.reverse;
                };

                $scope.selecionarRegistro = function (registro) {
                    $scope.<%= crudName.toLowerCase() %>Selecionado = registro;
                }; 
            }
	]);
})();