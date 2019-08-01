var nEnvia;

/* Mostrar mensaje de OK si la foto y los datos se han enviado correctamente  */
var OKfoto = function (r) {    
    clearTimeout(nEnvia); 
    $('#Avis').hide();
    mensajePopup('OK', constants('OKEnviant'), 8000);
    $('#divBotonEnviar').show(); //Mostrar de nuevo el botón de Adjuntar i enviar foto
    $("#txtCampOBS").val("");
}

/* Mostrar mensaje de error si ocurre un error al enviar la foto y los datos */
var ERRORfoto = function (error) {
    clearTimeout(nEnvia); 
    $('#Avis').hide();
    mensajePopup('KO', constants("ERRORenviantFoto") + ' (codi:' + error.code + ' / ' + error.message + ') ',0); // + error.target, 0);
    $('#divBotonEnviar').show(); //Mostrar de nuevo el botón de Adjuntar i enviar foto
    //alert("ERROR enviant dades: \nCODE: " + error.code + ' \nSOURCE: ' + error.source + ' \nTARGET: ' + error.target);
}

function clearCacheCamera() {
    navigator.camera.cleanup();
}

/* Monta y devuelve el nombre con el que se guardará la foto: 
Foto_AñoMesDiaHoraMinutoSegundoMilisegundo_Usuario_Sector_CIP.jpeg */
function creaNomFoto()
{
    var foto = "Foto_" + Ahora() + "_" +  $("#txtCampUSU").val() + "_" + $("#txtCampSECTOR").val() + "_" + $("#selectPacient").val() + ".jpeg";
    return foto;
}

/* Mensaje si falla la captura de la foto */
function onFailCamera(message) {
    $('#Avis').hide();
    mensajePopup('KO', constants("ERROREnviant") + "\n" + message, 0);
    $('#divBotonEnviar').show(); //Mostrar de nuevo el botón de Adjuntar i enviar foto
}

/* Envia los datos (foto, observacions, usuari, sector y CIP) al web service REST 
   (si va bien: OKfoto, si va mal: ERRORfoto)*/
var retries = 0;
function onCapturePhoto(fileURI) {
    var win = function (r) {
        clearCacheCamera();
        retries = 0;        
    }
 
    var fail = function (error) {
        if (retries == 0) {
            retries ++
            setTimeout(function() {
                onCapturePhoto(fileURI)
            }, 1000)
        } else {
            retries = 0;
            clearCacheCamera();
            mensajePopup('KO', constants("ERRORFoto") + error, 0);            
        }
    }
 
    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = creaNomFoto();  
    options.mimeType = "image/jpeg"; 
    options.chunkedMode = false;
    var params = {};
    params.p_camp1 = $("#txtCampUSU").val();
    params.p_camp2 = $("#txtCampSECTOR").val();
    params.p_camp3 = $("textarea#txtCampOBS").val();
    params.p_camp4 = $("#selectPacient").val();
    options.params = params;  

    var ft = new FileTransfer();
    ft.upload(fileURI, encodeURI(constants("urlServeiREST") + "Foto"), OKfoto, ERRORfoto, options);
    
    nEnvia = setTimeout(function() {    
        ft.abort();    
        mensajePopup('KO', constants("ERRORtimeOut") , 0);        
    }, 50000);

}

/* Recoge la foto de la aplicación de la cámara 
   (si va bien: onCapturePhoto, si va mal: onFailCamera) */
function capturePhoto() {  
    var selectedCIPpacient = $("#selectPacient").val(); 
    if($("#selectPacient").size < 2 || selectedCIPpacient == '' || selectedCIPpacient == null || selectedCIPpacient == undefined)
    {
        mensajePopup('KO', constants("CAPTIONselPacient"), 0); // + error.target, 0);
        return;
    }
    $('#divBotonEnviar').hide(); //Ocultar botón de Adjuntar i enviar foto
    $('#pTxtAvis').html(constants('WAITEnviant')); //Mostrar aviso 'enviando...'
    $('#Avis').show();
    EstadoUSUsector(false); 
    navigator.camera.getPicture(onCapturePhoto, onFailCamera, {
        quality: 50,
        destinationType: destinationType.FILE_URI,
        saveToPhotoAlbum: false
    });
}


