
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

function guardaDatosUSU(sUsu, sSector)
{
    localStorage.setItem('USU', sUsu);
    localStorage.setItem('SECTOR', sSector);
}

function recuperaDatosUSU()
{
    try{
        var sUsu = localStorage.getItem('USU');
        var sSector = localStorage.getItem('SECTOR');
        if(sUsu == null || sSector == null)
            return constants('NOConfig');
        else
            return sUsu + "|" + sSector;
    }
    catch(err)
    {
        return constants('ERRORConfig') + err.message;
    }
}

function guardaUsuSector()
{
    var sUsu = $("#txtCampUSU").val();
    var sSector = $("#txtCampSECTOR").val();
    guardaDatosUSU(sUsu,sSector);
    EstadoUSUsector(false);
}

function cancelaUsuSector()
{
    EstadoUSUsector(false);
}

function configuracio()
{
    if($("#trBotonGuardaDatosUSU").is(':visible') )  
    {          
        EstadoUSUsector(false);                 
    }
    else
    {
        EstadoUSUsector(true); 
        ScrollHastaAbajo();
    }
}

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

function getLlistaPacients()
{
    $('#pTxtAvis').html(constants("WAITRebent"));
    $('#Avis').show();

    EstadoUSUsector(false); /* cierra el div de configuración */

    /*  Recuperar los datos guardados en LocalStorage o ...
        var datosUsu = recuperaDatosUSU();
        var sUsu = datosUsu.split("|")[0]; 
        var sSector = datosUsu.split("|")[1];  */
    /* ... o Recuperar los datos de los campos de texto  */
    var sUsu = $('#txtCampUSU').val(); 
    var sSector = $('#txtCampSECTOR').val(); 

    $.ajax({
        url: constants("urlServeiREST") + "pacients/" + sUsu + "/" + sSector,   
        type: "GET",
        dataType: "json",
        headers: {"Accept": "application/json"},  
        success:function(response){  
            $('#pTxtAvis').html("");
            $('#Avis').hide();       
            guardaPacientsLS(response);  
            var aPacients = JSONtoPacients(response); /* convierte string JSON a array de objects JSON */
            CrearLlistaDePacients(aPacients);             
         },
         error: function(request, status, error) { 
            $('#pTxtAvis').html("");
            $('#Avis').hide();
            mensajePopup('KO', constants('ERRORRevent') + status + "\n" + request.statusText + "\n" + request.status + "\n" + request.responseText + "\n" + request.getAllResponseHeaders(), 0);
         }
     });
}

/* Guarda la lista de pacients (string JSON) en LocalStorage */
function guardaPacientsLS(strJSONpacients)
{
    localStorage.setItem('llistaPacients',strJSONpacients);
}

/* Recupera la llista de pacients (string JSON) de LocalStorage */
function recuperaPacientsLS()
{
    var aPacients = null;
    try
    {
        aPacients = localStorage.getItem('llistaPacients');
    }
    catch(e)
    {
        aPacients = null;
    }

    return aPacients;
}
