/**
* Determine whether the file loaded from PhoneGap or not (and if we are on Android!)
*/
var usinggap = false;
if ( vars["gap"] && /android/i.test(navigator.userAgent)) {
    usinggap = true;
    
    //PHONEGAP ANDROID!!
    document.addEventListener("deviceready", function(){
        window.alert("Cordova ready!");
    }, false);
}