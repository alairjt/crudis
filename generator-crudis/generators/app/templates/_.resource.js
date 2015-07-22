app.factory("<%=capitalize(crudName) %>", ['nxResource', 'SERVICES', function (nxResource, SERVICES) {
                
    var <%=recurso.toLowerCase()%> = {path: '<%=recurso.toLowerCase()%>/:id'};
    
    SERVICES.addResource(SERVICES.<%=servico%>, {<%=recurso.toLowerCase()%>: <%=recurso.toLowerCase()%>});
        
    return nxResource(SERVICES.<%=servico%>.<%=recurso.toLowerCase()%>);
}]);