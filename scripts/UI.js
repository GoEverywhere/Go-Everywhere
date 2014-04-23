var loadContainer = function() {
    //get the container
    container = document.getElementById('container');
    //calculate the height of the container by taking height of window and subtract height of header
    height = window.innerHeight-36;
    //convert the measurment to a string
    height = height.toString();
    //make it into pixel format
    height = height+"px";
    //set it back to the container's style
    container.style.height = height;
}
$(document).ready(function(){
    //resize the container to the correct height
    loadContainer();
    //add effects to login/signup
    $("#loginButton").click(function(){
        $("#loginform").toggle("blind", 500);
    });
    $("#loginform input").focus(function(){
        $("#loginform").show();
        $("#loginform").css({
            position: "absolute",
            right: "0px",
            top: "30px"
        });
    });
});
$(window).resize(loadContainer);