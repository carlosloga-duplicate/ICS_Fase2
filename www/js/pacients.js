
//objeto pacient
function pacient(sCip,sNom,sCg1,sCg2,sDNaix){
    this.cip=sCip;  
    this.nom=sNom;
    this.cg1=sCg1;
    this.cg2=sCg2;
    this.dNaix=sDNaix;    
};    

/* Llena el combo de pacients a partir del array de objetos 'pacient' */
function CrearLlistaDePacients(aPacients)
{
    /* vaciar combo */
    $('#selectPacient').empty();

    /* llenar combo */
    var selPac = $("#selectPacient");
    if(aPacients.length > 0)
    {
        selPac.append('<option value="">' + constants("CAPTIONselPacient") + '</option>');
        for(var i=0; i<aPacients.length; i++){       
            selPac.append('<option value="' + aPacients[i].cip + '">' + aPacients[i].nom + ' ' + aPacients[i].cg1 + ' ' + aPacients[i].cg2 + '</option>');
        }
    }
    else
    {
        selPac.append('<option value="">' + constants("NOpacients") + '</option>');
    }
    selPac.selectmenu();
    selPac.selectmenu('refresh', true);
}

/* Devuelve array de objetos 'pacient' a partir del string JSON recibido del servicio REST */
function JSONtoPacients(strJSONpacients)
{    
    var oJSONpacients = JSON.parse(strJSONpacients); /* convertir string JSON a objeto JSON */
    var pacients = new Array();
    try {
        for (var i = 0; i < oJSONpacients.length; i++){                    
            pacients.push(new pacient(oJSONpacients[i]["CIP"],
                                      oJSONpacients[i]["nom"],
                                      oJSONpacients[i]["cg1"],
                                      oJSONpacients[i]["cg2"],
                                      oJSONpacients[i]["dNaix"])
            );
        }
        return pacients;
    } catch (e){
        mensajePopup('KO', constants('ERRORRevent') + e.message, 0);
    }    
}

/* Crida al servei REST demanant els pacients */
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
        url: constants("urlServeiREST") + "pacients/" + sSector + "/" + sUsu,   
        type: "GET",
        dataType: "json",
        headers: {"Accept": "application/json"},  
        success:function(response){  
            $('#pTxtAvis').html("");
            $('#Avis').hide();    
           
            var aPacients = JSONtoPacients(response); /* convierte string JSON a array de objects JSON */
            if(aPacients.length > 0)
            {               
                if(response.indexOf("ERROR") > -1)
                {                    
                    $('#selectPacient').empty(); /* vaciar combo */
                    guardaPacientsLS("");
                    mensajePopup('KO', constants('ERRORRevent') + response , 0);
                }
                else
                {
                    guardaPacientsLS(response);
                    CrearLlistaDePacients(aPacients); 
                }
            }                        
         },
         error: function(request, status, error) { 
            $('#pTxtAvis').html("");
            $('#Avis').hide();
            mensajePopup('KO', constants('ERRORRevent') + status + "\n" + request.statusText + "\n" + request.status + "\n" + request.responseText + "\n" + request.getAllResponseHeaders(), 0);
         }
     });
}



