
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
    if(aPacients.length > -1)
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



