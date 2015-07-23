app.factory("<%=capitalize(crudName) %>", ['nxResource', 'SERVICES', function (nxResource, SERVICES) {
                
    var <%=recurso.toLowerCase()%> = {path: '<%=recurso.toLowerCase().replace("/","_")%>/:id'};
    
    SERVICES.addResource(SERVICES.<%=servico%>, {<%=recurso.toLowerCase().replace("/","_")%>: <%=recurso.toLowerCase().replace("/","_")%>});
        
    return nxResource(SERVICES.<%=servico%>.<%=recurso.toLowerCase().replace("/","_")%>);
}]);