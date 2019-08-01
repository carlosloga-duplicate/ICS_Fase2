var pictureSource;   // picture source
var destinationType; // sets the format of returned value

var app = {
    // Constructor de la App
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() { 
        app.receivedEvent('deviceready');
        pictureSource = navigator.camera.PictureSourceType;
        destinationType = navigator.camera.DestinationType;
        
        $.doTimeout(2000, function(){ 
            cordova.getAppVersion.getVersionNumber(function (version) {  //coge la vers. del tag 'version' (en la primera línea del config.xml)
                $("#tdPie").html("v." + version);   // Informa la vers. actual de la App en el pie de página 
                $("#deviceready").hide();           // Oculta el panel inicial: 'Carregant l'aplicació' 
                
                EstadoUSUsector(false);             // Poner el panel de configuración en modo oculto/deshabilitado

                $.mobile.changePage('#pagePrincipal', {transition: "flow"});  // Cargar la página principal
                
                /* Intenta recuperar los datos de configuración guardados en LocalStorage (usuari i sector) 
                   y si los obtiene intenta cargar los pacients guardados en LocalStorage */
                if(cargaDatosConfig()) cargaPacients();    

            });                   
        }); 
        
        /* Evento del combo al seleccionar un pacient */
        $("#selectPacient").change(function() {
            var CIPsel = $(this).val(); 
        });

        /* SALIR DE LA APP CUANDO SE PULSE LA TECLA BACK */
        $(window).on("navigate", function (event, data) {
            var direction = data.state.direction;
            if (direction == 'back') {
                setTimeout(function(){ navigator.app.exitApp(); }, 500);                
            }
        });
        
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');        
    }    
};

/* Recuperar los datos de configuración guardados en LocalStorage */
function cargaDatosConfig()
{
    var bOK = false;
    var datosUsu = "";
    try
    {
        datosUsu = recuperaDatosUSU();                                
        if(datosUsu.startsWith('ERROR')) // Si no se encuentran los datos de Usuario y Sector guardados en LocalStorage ... 
        {                       
            mensajePopup("KO", datosUsu, 0);
            EstadoUSUsector(true);      // Poner el panel de configuración en modo edición (visible/habilitado)    
            ScrollHastaAbajo();                     
        }
        else
        {                                 
            EstadoUSUsector(false);         // Poner el panel de configuración en modo oculto/deshabilitado y 
            var sUsu = datosUsu.split("|")[0]; 
            var sSector = datosUsu.split("|")[1];                        
            $("#txtCampUSU").val(sUsu);     // Informar USU y SECTOR
            $("#txtCampSECTOR").val(sSector);   
            bOK = true;                        
        }    
    }
    catch(err)
    {
        /* Si hubo error al acceder a LocalStorage */
        mensajePopup("KO", constants('ERRORConfig') + err.message, 0);
        EstadoUSUsector(true);              // Poner el panel de configuración en modo edición (visible/habilitado)
    } 
    return bOK;
}

/* Recupera los pacients (de LocalStorage) de la última vez que se bajaron a este dispositivo */
function cargaPacients()
{
    var pacients = recuperaPacientsLS();
    if(pacients != null)
    {
        var aPacients = JSONtoPacients(pacients);   // convierte la cadena JSON en array de objects JSON                     
        CrearLlistaDePacients(aPacients);           // y cargar el combo con esos pacients 
    }
    else
    {
        mensajePopup("KO", constants('INFOcarregarPacients'), 0);
        /* Poner el panel de configuración en modo edición (visible/habilitado) para que carguen los pacients */
        EstadoUSUsector(true);   
    }
}




