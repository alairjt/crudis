(function (){
	'use strict';

	app.controller('ConsultaCrudtestController', ['$scope', 'HIVE_COMMON', '$filter', 'CrudtestService',
            function($scope, HIVE_COMMON, $filter, CrudtestService) {
                var self = this;
                $scope.criterio = "";
                $scope.campoOrderBy = "";
                $scope.reverse = false;
                $scope.currentPage = 1;
                $scope.pageSize = HIVE_COMMON.pageSize;
                
                CrudtestService.buscar(function(data){
                    self.listaCrudtest = $scope.filtered = data;
                });

                self.filtrar = function (lista) {
                    return $filter('filter')(lista, $scope.criterio);
                };
                
                $scope.$watch('criterio', function () {
                    $scope.filtered = self.filtrar(self.listaCrudtest);
                });

                $scope.ordenarCamposPor = function (campo) {
                    $scope.campoOrderBy = campo;
                    $scope.reverse = !$scope.reverse;
                };
                
                $scope.selecionarRegistro = function (registro) {
                    $scope.crudtestSelecionado = registro;
                };
                
                
            }
	]);
})();