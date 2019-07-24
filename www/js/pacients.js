
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
    /* var oJSONpacients = JSON.parse(strJSONpacients);
    $.each(oJSONpacients, function(index, valor) {         
    }); */

    var pacients = {};
    try {
        for (var i = 0; i < strJSONpacients.length; i++){  
alert(strJSONpacients[i]["CIP"]);                  
            pacients.push(new pacient(strJSONpacients[i]["CIP"],
                                      strJSONpacients[i]["nom"],
                                      strJSONpacients[i]["cg1"],
                                      strJSONpacients[i]["cg2"],
                                      strJSONpacients[i]["dNaix"])
            );
            /*  for (var key in oJSONPac){
                    var value = oJSONPac[key];
                } */
        }
        return pacients;
    } catch (e){
        mensajePopup('KO', constants('ERRORRevent') + e.message, 0);
    }    
}

function CrearLlistaDePacients(aPacients)
{
    var selPac = $("selectPacient");
    if(aPacients.length > -1)
    {
        for(var i=0; i<aPacients.length; i++){
alert(aPacients[i].cip);            
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

