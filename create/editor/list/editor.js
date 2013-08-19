//VARIABLES
var zipFile;

function reloadEvents() {
    $("#blocks .sortable-script").sortable({
        axis: "y"
    });
}
$(document).ready(function(){
    reloadEvents();
    loadProject("1.ge");
});
function loadProject(url) {
    zipFile = new ZipFile(url, doneReadingZip, 1);
    
}
function doneReadingZip(zip) {
    var project;
    //Load the project JSON into the project variable
    for (var i=0;i<zipFile.entries.length;i++) {
	if (zipFile.entries[i].name == "project.json") {
	    project = JSON.parse(zipFile.entries[i].extract(null, true));
	}
    }
    //DEBUG!
    /*loopThroughSprite(project);
    //Now, loop through every sprite, and alert its info
    for (var i = 0; i < project.children.length; i++) {
        loopThroughSprite(project.children[i]);
    }*/
    //Put the scripts of the first sprite onto the page
    var scriptHTML = "";
    if (project.children[0].scripts) {
        //loop through each script
        for (var i = 0; i < project.children[0].scripts.length; i++) {
            //HTML div
            scriptHTML += "<div class=\"script\">\n";
            //create a place for the hat block
            scriptHTML += "<ul>\n";
            scriptHTML += "<li class=\"sortable-locked\" spec=\"" + project.children[0].scripts[i][2][0][0] + "\" type=\"hat\"><img src=\"../blocks.php?type=hat&label=" + project.children[0].scripts[i][2][0][0] + "\" /></li>\n";
            scriptHTML += "</ul>\n";
            //loop through all blocks in the stack
            scriptHTML += "<ul class=\"sortable-script\">\n";
            for (var j = 1; j < project.children[0].scripts[i][2].length; j++) {
                //get the label of the blocks and add them to the HTML
                scriptHTML += "<li type=\"command\"><img src=\"../blocks.php?label=" + project.children[0].scripts[i][2][j][0] + "\" /></li>\n";
            }
            scriptHTML += "</ul>\n";
            scriptHTML += "</div>\n";
        }
    }
    $("#blocks").html(scriptHTML);
    reloadEvents();
}
function loopThroughSprite(project) {
    //alert stage name
    window.alert(project.objName);
    //alert the name of each hat block of each script from the stage
    if (project.scripts) {
        for (var i = 0; i < project.scripts.length; i++) {
            window.alert(project.scripts[i][2][0][0]);
        }
    }
    //alert the name of each variable
    if (project.variables) {
        for (var i = 0; i < project.variables.length; i++) {
            window.alert(project.variables[i].name);
        }
    }
    //alert the name of each costume name (for the stage)
    for (var i = 0; i < project.costumes.length; i++) {
        window.alert(project.costumes[i].costumeName);
    }
}