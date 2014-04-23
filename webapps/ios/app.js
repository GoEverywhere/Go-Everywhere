//Initialize the jQT object and style the page
var jQT = new $.jQTouch({
    icon: 'icon.png',
    /*icon4: 'jqtouch4.png',*/
    addGlossToIcon: false,
    startupScreen: 'iphone_splash.png',
    statusBar: 'black-translucent',
    preloadImages: []
});

//AJAX functions
function reloadAllProjects() {
    //send an AJAX request
    $.ajax({
        type: "GET",
        url: "../../explore/index.php?type=xml",
        dataType: "xml",
        success: function(xml){
            //loop through each "project" element
            //and collect HTML based on each one
            var totalHTML = "\n<ul class=\"rounded\">";
            $(xml).find("project").each(function(){
                var id = $(this).attr("id");
                var user = $(this).attr("user");
                var title = $(this).attr("title");
                //generate HTML
                totalHTML += "<li class=\"arrow\"><a ontouchstart=\"loadProject(" + id + ")\" href=\"#viewproject\">" + title + "</a></li>\n";
            });
            //finish up the ul
            totalHTML += "</ul>\n";
            //inject the HTML into the container
            $("#browseprojects #container").html(totalHTML);
        },
        error: function(){
            window.alert("There seems to be a problem with loading this project.\nPlease try again later!");
        }
    });
}

//To load a project into the viewer
function loadProject(id) {
    //We need to send an AJAX request, so that we can get info about a project
    $.ajax({
        type: "GET",
        url: "../../actions/project_info.php?id=" + id.toString(),
        dataType: "xml",
        success: function(xml){
            //we just need to find one "info" element
            $(xml).find("info").each(function(){
                var user = $(this).attr("user");
                var date = $(this).attr("date");
                var title = $(this).attr("title");
                var description = $(this).attr("description");
                //load the actual project
                $("#project_viewer").attr("src", "../../explore/player/sb2.js/player.html?project=../../../../projects/" + user + "/" + id.toString() + ".ge");
                //Update the title
                $("#viewproject h1").text(title);
            });
        }
    });
}

$(document).ready(function(){
    //Initialization
    /*$("#project_viewer").width($(window).width());
    $("#project_viewer").height($(window).width() + 15);*/
    //Attach touch events
    $(".reloadAllProjects").bind('touchstart', function(){
        reloadAllProjects();
    });
});