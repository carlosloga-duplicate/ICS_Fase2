
//objeto pacient
function pacient(sCip,sNom,sCg1,sCg2,sDNaix){
    this.cip=sCip;  
    this.nom=sNom;
    this.cg1=sCg1;
    this.cg2=sCg2;
    this.dNaix=sDNaix;    
};    

/* Devuelve array de objetos 'pacient' a partir del JSON recibido del servicio REST */
function JSONtoPacients(strJSONpacients)
{    
    var oJSONpacients = JSON.parse(strJSONpacients); /* convierto string JASON a objeto JSON */
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

/* Llena el combo de pacients a partir del array de objetos 'pacient' */
function CrearLlistaDePacients(aPacients)
{
    /* vaciar combo */
    $('#selectPacient').empty();

    /* llenar combo */
    var selPac = $("#selectPacient");
    if(aPacients.length > 0)
    {
        selPac.append('<option value="">Seleccioni un pacient</option>');
        for(var i=0; i<aPacients.length; i++){       
            selPac.append('<option value="' + aPacients[i].cip + '">' + aPacients[i].nom + ' ' + aPacients[i].cg1 + ' ' + aPacients[i].cg2 + '</option>');
        }
    }
    else
    {
        selPac.append('<option value="">No hi ha pacients</option>');
    }
    selPac.selectmenu();
    selPac.selectmenu('refresh', true);
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

alert(response); 
            guardaPacientsLS(response);  
           
            var aPacients = JSONtoPacients(response); /* convierte string JSON a array de objects JSON */
            if(aPacients.length > 0)
            {
alert(aPacients[0].toString());                
                if(aPacients[0].toString().indexOf("ERROR") > -1)
                {
                    mensajePopup('KO', constants('ERRORRevent') + aPacients[0].toString() , 0);
                }
                else
                    CrearLlistaDePacients(aPacients); 
            }                        
         },
         error: function(request, status, error) { 
            $('#pTxtAvis').html("");
            $('#Avis').hide();
            mensajePopup('KO', constants('ERRORRevent') + status + "\n" + request.statusText + "\n" + request.status + "\n" + request.responseText + "\n" + request.getAllResponseHeaders(), 0);
         }
     });
}



