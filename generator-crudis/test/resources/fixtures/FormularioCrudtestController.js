(function (){
    'use strict';

    app.controller('FormularioCrudtestController', ['$scope', '$stateParams', 'CrudtestService', '$base64',
        
        function ($scope, $stateParams, CrudtestService, $base64
            
            ) {
            var idCrudtest = $stateParams.id;

            $scope.crudtestSelecionado = CrudtestService.buscarParaEdicao(idCrudtest);

            $scope.salvar = function (CrudTest) {
                    return CrudtestService.salvar(CrudTest, idCrudtest);
            };

            $scope.fileChanged = function (element, field) {
                CrudtestService.fileChanged(element, function (image, e) {
                    $scope.crudtestSelecionado.nomeImagem = image.name;
                    $scope.crudtestSelecionado[field] = $base64.encode(e.target.result);
                    $scope.$apply();
                });
            };
            
            
        }
    ]);
})();
