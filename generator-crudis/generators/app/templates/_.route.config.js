(function () {
    "use strict";

    app.config(['$stateProvider', function ($stateProvider) {
        $stateProvider
                .state('home.cadastros.<%= crudName.toLowerCase() %>', {
                    url: "<%= crudName.toLowerCase() %>",
                    views: {
                        'content@': {
                            templateUrl: "<%= pathConsultaView %>",
                            controller: "<%= nomeConsultaController%>"
                        }
                    },
                    data: {
                        displayName: 'label.<%= crudName.toLowerCase() %>',
                        operacoes: []
                    }
                })
                .state('home.cadastros.<%= crudName.toLowerCase() %>.novo', {
                    url: "novo",
                    transition: "home.cadastros.<%= crudName.toLowerCase() %>",
                    views: {
                        'content@': {
                            templateUrl: "<%= pathFormularioView %>",
                            controller: "<%= nomeFormularioController %>"
                        }
                    },
                    data: {
                        displayName: 'label.novo',
                        operacoes: []
                    }
                })
                .state('home.cadastros.<%= crudName.toLowerCase() %>.editar', {
                    url: "editar/:id",
                    transition: "home.cadastros.<%= crudName.toLowerCase() %>",
                    views: {
                        'content@': {
                            templateUrl: "<%= pathFormularioView %>",
                            controller: "<%= nomeFormularioController %>"
                        }
                    },
                    data: {
                        displayName: 'label.editar',
                        operacoes: []
                    }
                })
                ;
    }]);
})();