
var pacient = {
    cip: null,  
    nom: null,
    cg1: null,         
    cg2: null,
    dNaix: null
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
            var oUnPac = new pacient();
            oUnPac.cip = strJSONpacients[i]["CIP"];
            oUnPac.nom = strJSONpacients[i]["nom"];
            oUnPac.cg1 = strJSONpacients[i]["cg1"];
            oUnPac.cg2 = strJSONpacients[i]["cg2"];
            oUnPac.dNaix = strJSONpacients[i]["dNaix"];
            pacients.push(oUnPac);
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
            selPac.append('<option value="' + aPacients[i].CIP + '">' + aPacients[i].nom + ' ' + aPacients[i].cg1 + ' ' + aPacients[i].cg2 + '</option>');
        }
    }
    else
    {
        selPac.append('<option value="">No hi ha pacients</option>');
    }
    selPac.selectmenu();
    selPac.selectmenu('refresh', true);
}

