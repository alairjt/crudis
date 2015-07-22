app.factory("<%=capitalize(crudName) %>", ['nxResource', 'SERVICES', function (nxResource, SERVICES) {
        
    var <%=crudName.toLowerCase()%> = {path: '<%=crudName.toLowerCase()%>'};
    
    SERVICES.addResource(<%=servico%>, {<%=crudName.toLowerCase()%>: <%=crudName.toLowerCase()%>});

    return nxResource(<%=servico%>.<%=crudName.toLowerCase()%>);
}]);