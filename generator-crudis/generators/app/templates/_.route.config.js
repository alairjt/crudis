(function () {
    "use strict";

    app.config(['$stateProvider', function ($stateProvider) {
        $stateProvider
                .state('home.<%= menu.toLowerCase() %>.<%= crudName.toLowerCase() %>', {
                    url: "<%= crudName.toLowerCase() %>",
                    views: {
                        'content@': {
                            templateUrl: "<%= pathConsultaView %>",
                            controller: "<%= nomeConsultaController%>"
                        }
                    },
                    data: {
                        displayName: '<%= capitalize(crudName) %>',
                        operacoes: []
                    }
                })
                <% if (showFormulario) { %>
                    .state('home.<%= menu.toLowerCase() %>.<%= crudName.toLowerCase() %>.novo', {
                        url: "novo",
                        transition: "home.<%= menu.toLowerCase() %>.<%= crudName.toLowerCase() %>",
                        views: {
                            'content@': {
                                templateUrl: "<%= pathFormularioView %>",
                                controller: "<%= nomeFormularioController %>"
                            }
                        },
                        data: {
                            displayName: 'Novo',
                            operacoes: []
                        }
                    })
                    .state('home.<%= menu.toLowerCase() %>.<%= crudName.toLowerCase() %>.editar', {
                        url: "editar/:id",
                        transition: "home.<%= menu.toLowerCase() %>.<%= crudName.toLowerCase() %>",
                        views: {
                            'content@': {
                                templateUrl: "<%= pathFormularioView %>",
                                controller: "<%= nomeFormularioController %>"
                            }
                        },
                        data: {
                            displayName: 'Editar',
                            operacoes: []
                        }
                    })
                <% } %>
                ;
    }]);
})();
