(function () {
    "use strict";

    app.config(['$stateProvider', function ($stateProvider) {
        $stateProvider
                .state('home.consulta.crudtest', {
                    url: "crudtest",
                    views: {
                        'content@': {
                            templateUrl: "crudtest/consultaCrudtest.html",
                            controller: "ConsultaCrudtestController"
                        }
                    },
                    data: {
                        displayName: 'Crudtest',
                        operacoes: []
                    }
                })
                
                    .state('home.consulta.crudtest.novo', {
                        url: "novo",
                        transition: "home.consulta.crudtest",
                        views: {
                            'content@': {
                                templateUrl: "crudtest/formularioCrudtest.html",
                                controller: "FormularioCrudtestController"
                            }
                        },
                        data: {
                            displayName: 'Novo',
                            operacoes: []
                        }
                    })
                    .state('home.consulta.crudtest.editar', {
                        url: "editar/:id",
                        transition: "home.consulta.crudtest",
                        views: {
                            'content@': {
                                templateUrl: "crudtest/formularioCrudtest.html",
                                controller: "FormularioCrudtestController"
                            }
                        },
                        data: {
                            displayName: 'Editar',
                            operacoes: []
                        }
                    })
                
                ;
    }]);
})();
