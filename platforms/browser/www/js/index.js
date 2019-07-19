/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var pictureSource;   // picture source
var destinationType; // sets the format of returned value

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
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
            cordova.getAppVersion.getVersionNumber(function (version) {
                $("#tdPie").html("v." + version);    
                $("#deviceready").hide();
                $.mobile.changePage('#pagePrincipal', {transition: "flow"}); 
                //$.mobile.changePage('#pagePrincipal', {transition: "flow"});  
            });                   
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

function clearCache() {
    navigator.camera.cleanup();
}

function capturePhoto() { 
    $('#pTxtAvis').html(constants('WAITEnviant'));
    $('#Avis').show();
    navigator.camera.getPicture(onCapturePhoto, onFail, {
        quality: 100,
        destinationType: destinationType.FILE_URI
    });
}

var retries = 0;
function onCapturePhoto(fileURI) {
    var win = function (r) {
        clearCache();
        retries = 0;
        //alert('Done!');
    }
 
    var fail = function (error) {
        if (retries == 0) {
            retries ++
            setTimeout(function() {
                onCapturePhoto(fileURI)
            }, 1000)
        } else {
            retries = 0;
            clearCache();
            MensajePopup('KO', constants("ERRORFoto") + error, 0);            
        }
    }
 
    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = "Foto_" + Ahora() + ".jpeg";  
    options.mimeType = "image/jpeg"; 
    var params = {};
    params.p_camp1 = $("#txtCamp1").val();
    params.p_camp2 = $("#txtCamp2").val();
    params.p_camp3 = $("#txtCamp3").val();
    options.params = params;  
    var ft = new FileTransfer();
    ft.upload(fileURI, encodeURI(constants("urlServeiREST")), OKfoto, ERRORfoto, options);
}
 
function onFail(message) {
    MensajePopup('KO', constants("ERROREnviant") + "\n" + message, 0);
}

var OKfoto = function (r) {    
    MensajePopup('OK', constants('OKEnviant'), 4000);
    $("#txtCamp1").val("");
    $("#txtCamp2").val("");
    $("#txtCamp3").val("");
    // alert('Foto pujada: ' + r.response + '  \nbytes enviats:' + r.bytesSent);
}

var ERRORfoto = function (error) {
    MensajePopup('KO', 'ERROR: ' + error.code + ' desant en: ' + error.target, 0);
    //alert("ERROR enviant dades: \nCODE: " + error.code + ' \nSOURCE: ' + error.source + ' \nTARGET: ' + error.target);
}

function MensajePopup(cual, txtMsg, esperar)
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


