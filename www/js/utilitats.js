
/* Devuelve un TimeSpan (string) para ser usado como ID único  
   en formato: yyyymmddhhmissms*/
function Ahora() 
{
    var x = new Date();
    var y = x.getFullYear().toString();
    var m = (x.getMonth() + 1).toString();
    var d = x.getDate().toString(); 
    var h = x.getHours().toString();
    var mi = x.getMinutes().toString();
    var s = x.getSeconds().toString();
    var mil = x.getMilliseconds().toString();
    (d.length == 1) && (d = '0' + d);
    (m.length == 1) && (m = '0' + m);
    (h.length == 1) && (h = '0' + h);
    (mi.length == 1) && (mi = '0' + mi);
    (s.length == 1) && (s = '0' + s);
    var ahora = y + m + d + h + mi + s + mil;
    return ahora;
}

/* Diccionario de mensajes, etiquetas, etc. fijos de la app  */  
function constants(sCual)
{
    var dict = {};
    var sRet = "";
    try
    {
        dict['urlServeiREST'] = "http://a200.ecap.intranet.gencat.cat/REST_1_ICS/api/";
        dict['urlICS'] = "http://ics.gencat.cat/ca/inici";

        dict['ERRORGenerico'] = "S´ha produit un error ";
        dict['ERROREnviant'] = "ERROR enviant les dades ";
        dict['ERRORRevent'] = "ERROR rebent dades ";    
        dict['ERRORFoto'] = "ERROR capturant foto ";
        dict['ERRORConfig'] = "ERROR recuperant l´usuari/sector d´aquest mòvil: ";
        dict['ERRORtimeOut'] = "S'ha excedit el temps d'enviament ";
        dict['ERRORenviantFoto'] = "ERROR enviant la foto ";

        dict['OKEnviant'] = "Les dades s´han enviat correctament ";
        dict['OKRebent'] = "Les dades s´han rebut correctament ";    
        
        dict['WAITRebent'] = "Rebent dades del servidor ";
        dict['WAITEnviant'] = "Enviant dades al servidor ";
        dict['WAITTancant'] = "tancant l'aplicació ";

        dict['NOConfig'] = "ERROR: Dispositiu no configurat. Informi usuari i sector si us plau ";        
        dict["NOpacients"] = "No s'ha trobat cap pacient ";
        dict["INFOcarregarPacients"] = "No existeix cap pacient en aquest dispositiu, obtingui'ls mitjançant el botó 'Descarregar pacients' ";
        
        dict["CAPTIONselPacient"] = "Seleccioni un pacient ";

        sRet = dict[sCual].toString();
    }
    catch(err){
        sRet = "constants: " + err.message; 
    };

    return sRet;
}

/* Muestra un Popup centrado en pantalla que desaparece cuando
   el usuario pulsa su botón de cierre (si esperar = 0) 
   o cuando pasan un número de milisegundos (si esperar > 0) */
function mensajePopup(cual, txtMsg, esperar)
{
    $('#Avis').hide();
    if(cual=='OK')
    {
        $("#AvisEnvioOK").popup();    
        $("#txtOK").html(txtMsg);
        $("#AvisEnvioOK").popup("open");         
        if(esperar > 0) setTimeout(function(){  $("#AvisEnvioOK").popup("close"); }, esperar);
    }
    else
    {
        $("#AvisEnvioKO").popup();    
        $("#txtKO").html(txtMsg);
        $("#AvisEnvioKO").popup("open"); 
        if(esperar > 0) setTimeout(function(){  $("#AvisEnvioKO").popup("close"); }, esperar);
    }
}

/* URL a la que se redirige cuando se pulsa el icono de la app (de la cabecera)  */
function linkWebsiteICS()
{
    location.href=constants("urlICS");
}

/* Mueve el cursor hasta el final de la pantalla  */
function ScrollHastaAbajo()
{
    $('html, body').animate({
        scrollTop: $("#abajo").offset().top
    }, 500);
}

