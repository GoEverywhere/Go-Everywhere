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
    for (i=0;i<zipFile.entries.length;i++) {
	if (zipFile.entries[i].name == "project.json") {
	    project = JSON.parse(zipFile.entries[i].extract(null, true));
	}
    }
    //DEBUG!
    window.alert(project.objName);
}