//Initialize the jQT object and style the page
var jQT = new $.jQTouch({
    /*icon: 'jqtouch.png',
    icon4: 'jqtouch4.png',*/
    addGlossToIcon: false,
    /*startupScreen: 'jqt_startup.png',*/
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
                totalHTML += "<li class=\"arrow\"><a ontouchstart=\"\" href=\"#viewproject\">" + title + "</a></li>\n";
            });
            //finish up the ul
            totalHTML += "</ul>\n";
            //inject the HTML into the container
            $("#browseprojects #container").html(totalHTML);
        }
    });
}

$(document).ready(function(){
    //Attach touch events
    $(".reloadAllProjects").bind('touchstart', function(){
        reloadAllProjects();
    });
});