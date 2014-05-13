/**
* Determine whether the file loaded from PhoneGap or not (and if we are on Android!)
*/
var usinggap = false;
if ( vars["gap"] && /android/i.test(navigator.userAgent)) {
    usinggap = true;
    
    //PHONEGAP ANDROID!!
    document.addEventListener("deviceready", function(){
        //console.log(JSON.stringify(window));
        //window.alert("Cordova ready!");
        //Hold a copy of the FileSystem (persistant?)
        window.requestFileSystem = window.webkitRequestFileSystem || window.requestFileSystem;
        if (window.requestFileSystem) {
            window.requestFileSystem(1/*PERSISTANT*/, 0, function(fs){
                //SUCCESS!
                window.alert("We have the FileSystem!");
            }, function(evt){
                //FAILURE!
                console.error(evt.target.error.code);
                window.alert("I got further, but still failed :-(");
            });
        }else{
            window.alert("There is no \"requestFileSystem\"!");
        }
    }, false);
}