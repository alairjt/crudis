(function (){
    'use strict';

    app.controller('Formulario<%= capitalize(crudName) %>Controller', ['$scope', '$stateParams', '<%= capitalize(crudName) %>Service', '$base64',
        function ($scope, $stateParams, <%= capitalize(crudName) %>Service, $base64) {
            var id<%= capitalize(crudName) %> = $stateParams.id;

            $scope.<%= crudName.toLowerCase() %>Selecionado = <%= capitalize(crudName) %>Service.buscarParaEdicao(id<%= capitalize(crudName) %>);

            $scope.salvar = function (<%= crudName %>) {
                    return <%= capitalize(crudName) %>Service.salvar(<%= crudName %>, id<%= capitalize(crudName) %>);
            };

            $scope.fileChanged = function (element, field) {
                <%= capitalize(crudName) %>Service.fileChanged(element, function (image, e) {
                    $scope.<%= crudName.toLowerCase() %>Selecionado.nomeImagem = image.name;
                    $scope.<%= crudName.toLowerCase() %>Selecionado[field] = $base64.encode(e.target.result);
                    $scope.$apply();
                });
            };
        }
    ]);
})();
