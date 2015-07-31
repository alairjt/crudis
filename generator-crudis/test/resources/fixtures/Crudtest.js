(function () {
    'use strict';

    app.factory("Crudtest", ['nxResource', 'SERVICES', function (nxResource, SERVICES) {

        var resourceBancos = {path: 'bancos/:id'};

        SERVICES.addResource(SERVICES.banco, {resourceBancos: resourceBancos});

        return nxResource(SERVICES.banco.resourceBancos);
    }]);
})();
