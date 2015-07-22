app.factory("<%=capitalize(crudName) %>", ['nxResource', 'SERVICES', function (nxResource, SERVICES) {
    return nxResource(<%=servico%>);
}]);