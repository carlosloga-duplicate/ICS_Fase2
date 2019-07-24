
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

    var oJSONpacients = JSON.parse(strJSONpacients);
    alert('len: ' + oJSONpacients.length.toString());
    alert(oJSONpacients[0]);
    alert(oJSONpacients[0]["CIP"]);

    var pacients = new Array();
    try {
        for (var i = 0; i < oJSONpacients.length; i++){  
alert(oJSONpacients[i]["CIP"]);                  
            pacients.push(new pacient(oJSONpacients[i]["CIP"],
                                      oJSONpacients[i]["nom"],
                                      oJSONpacients[i]["cg1"],
                                      oJSONpacients[i]["cg2"],
                                      oJSONpacients[i]["dNaix"])
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
        selPac.append('<option value="">No pacients</option>');
    }
    selPac.selectmenu();
    selPac.selectmenu('refresh', true);
}

