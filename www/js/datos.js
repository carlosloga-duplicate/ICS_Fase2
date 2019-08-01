
/* Oculta/deshabilita o muestra/habilita el panel de configuración de Usuario y Sector */
function EstadoUSUsector(bVer)
{
    if(bVer)
    {
        $('#txtCampUSU').prop('readonly', false);
        $('#txtCampSECTOR').prop('readonly', false);
        $('#txtCampUSU').prop('style', "background-color:white;"); 
        $('#txtCampSECTOR').prop('style', "background-color:white;"); 

        $('#txtCampOBS').prop('disabled', true);  
        $('#divBotonEnviar').prop('disabled', true);        
        
        $("#trBotonGuardaDatosUSU").show();   
        $("#trbotonGetPacients").show();  
        ScrollHastaAbajo(); 
    }
    else
    {
        $("#trBotonGuardaDatosUSU").hide();
        $("#trbotonGetPacients").hide();
        $('#txtCampUSU').prop('readonly', true);
        $('#txtCampSECTOR').prop('readonly', true);

        $('#txtCampUSU').prop('class', "");
        $('#txtCampUSU').prop('style', "border:none !important;"); 
        $('#txtCampUSU').prop('style', "background-color:silver;");           
        $('#txtCampSECTOR').prop('class', "");                              
        $('#txtCampSECTOR').prop('style', "border:none !important;");           
        $('#txtCampSECTOR').prop('style', "background-color:silver;"); 

        $('#txtCampOBS').prop('disabled', false);  
        $('#divBotonEnviar').prop('disabled', false);       
    }
}

/* Guarda en localStorage el usuario y sector informados en el panel de configuración */
function guardaDatosUSU(sUsu, sSector)
{
    localStorage.setItem('USU', sUsu);
    localStorage.setItem('SECTOR', sSector);
}

/* Recupera y devuelve el usuario y sector guardados en localStorage  */
function recuperaDatosUSU()
{
    try{
        var sUsu = localStorage.getItem('USU');
        var sSector = localStorage.getItem('SECTOR');
        if(sUsu == null || sSector == null || sUsu == undefined || sSector == undefined || sUsu == '' || sSector == '')
            return constants('NOConfig');
        else
            return sUsu + "|" + sSector;
    }
    catch(err)
    {
        return constants('ERRORConfig') + err.message;
    }
}

/* Recoge el usuario y sector informados en el panel de configuración,  
   llama a guardaDatosUSU y oculta/deshabilita el panel de configuración */
function guardaUsuSector()
{
    var sUsu = $("#txtCampUSU").val();
    var sSector = $("#txtCampSECTOR").val();
    guardaDatosUSU(sUsu,sSector);
    EstadoUSUsector(false);
}

/* Llama a EstadoUSUsector para Ocultar/deshabilitar el panel de configuración */
function cancelaUsuSector()
{
    EstadoUSUsector(false);
}

/* Decide si se oculta o muestra el panel de configuración de Usuario y Sector */
function configuracio()
{
    if($("#trBotonGuardaDatosUSU").is(':visible') )  
    {          
        EstadoUSUsector(false);                 
    }
    else
    {
        EstadoUSUsector(true); 
    }
}

/* Guarda la lista de pacients (como string JSON) en LocalStorage */
function guardaPacientsLS(strJSONpacients)
{
    localStorage.setItem('llistaPacients',strJSONpacients);
}

/* Recupera la llista de pacients (como string JSON) guardada en LocalStorage */
function recuperaPacientsLS()
{
    var aPacients = null;
    try
    {
        aPacients = localStorage.getItem('llistaPacients');
        if(aPacients == undefined) aPacients = null;
    }
    catch(e)
    {
        aPacients = null;
    }

    return aPacients;
}


/* ************************************************************************** */
/* NO SE UTILIZA */
function historicoUsuSector()
{
    $('#pTxtAvis').html(constants("WAITRebent"));
    $('#Avis').show();

/*  var datosUsu = recuperaDatosUSU();
    var sUsu = datosUsu.split("|")[0]; 
    var sSector = datosUsu.split("|")[1];  */

    var sUsu = $('#txtCampUSU').val(); 
    var sSector = $('#txtCampSECTOR').val(); 

    $.ajax({
        url: constants("urlServeiREST") + "Foto",
        data: {"usu": escape(sUsu), "sector": escape(sSector) },
        type: "GET",
        dataType: "json",
        headers: {"Accept": "application/json"},
        success: function(response, status) {
            response = JSON.stringify(response); 
            $('#pTxtAvis').html("");    //ocultar mensaje Descargando
            $('#Avis').hide();          //ocultar mensaje Descargando
            //mensajePopup('OK', constants('OKRebent'), 4000);
            var sResp = "";
            alert(response);
            var aRegistros = response.split("#");
            alert("length: " + aRegistros.lenght.toString());
            for(var x=0; x<aRegistros.lenght; x++)
            {
                sResp += aRegistros[x].replace("|"," / ") + "<br/>";
            }
            alert(sResp);
            $('#txtCampOBS').prop('disabled', false);
            $('#txtCampOBS').css('overflow', 'hidden').autogrow();
            $("#txtCampOBS").val(sResp);
            $('#txtCampOBS').focus();            
        },
            error: function(request, status, error) { 
                $('#pTxtAvis').html("");
                $('#Avis').hide();
                mensajePopup('KO', constants('ERRORRevent') + status + "\n" + request.statusText + "\n" + request.status + "\n" + request.responseText + "\n" + request.getAllResponseHeaders(), 0);
        }
    });

}

