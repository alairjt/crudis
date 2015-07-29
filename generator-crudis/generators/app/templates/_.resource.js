(function () {
    'use strict';

    app.factory("<%=capitalize(crudName) %>", ['nxResource', 'SERVICES', function (nxResource, SERVICES) {

        var resource<%=capitalize(recurso.replace("/","_"))%> = {path: '<%=recurso.toLowerCase()%>/:id'};

        SERVICES.addResource(SERVICES.<%=servico%>, {resource<%=capitalize(recurso.replace("/","_"))%>: resource<%=capitalize(recurso.replace("/","_"))%>});

        return nxResource(SERVICES.<%=servico%>.resource<%=capitalize(recurso.replace("/","_"))%>);
    }]);
})();
