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
            var currentBlock = getBlockData(project.children[0].scripts[i][2][0][0]);
            if (currentBlock.params) {
                //This block has parameters. We must place the parameter in, and position it so that it is in the correct place
                //loop through all the parameters
                for (var j = 0; j < currentBlock.params.length; j++) {
                    //paramHTML += currentBlock(currentBlock.params[j]);
                }
            }
            scriptHTML += "<li class=\"sortable-locked\" spec=\"" + currentBlock.spec + "\" type=\"hat\" group=\"" + currentBlock.group + "\"><img src=\"../blocks.php?type=hat&group=" + currentBlock.group + "&label=" + currentBlock.label + "\" /></li>\n";
            //add in the parameter code
            if (currentBlock.params) {
                //This block has parameters. We must place the parameter in, and position it so that it is in the correct place
                //loop through all the parameters
                for (var j = 0; j < currentBlock.params.length; j++) {
                    //get the code and put it in the script div
                    scriptHTML += "<div class=\"param\" style=\"position:relative;top:-28px;left:" + currentBlock.params[j].positionFromLeft + "px\">\n" + getParameterCode(currentBlock.params[j].type) + "</div>\n";
                }
            }
            scriptHTML += "</ul>\n";
            //loop through all blocks in the stack
            scriptHTML += "<ul class=\"sortable-script\">\n";
            for (var j = 1; j < project.children[0].scripts[i][2].length; j++) {
                //get block info
                currentBlock = getBlockData(project.children[0].scripts[i][2][j][0]);
                //get the label of the blocks and add them to the HTML
                scriptHTML += "<li type=\"command\" spec=\"" + currentBlock.spec + "\" group=\"" + currentBlock.group + "\"><img src=\"../blocks.php?group=" + currentBlock.group + "&label=" + currentBlock.label + "\" /></li>\n";
            }
            scriptHTML += "</ul>\n";
            scriptHTML += "</div>\n";
        }
    }
    $("#blocks").html(scriptHTML);
    reloadEvents();
}
function getBlockData(spec) {
    //Return an object, telling info about the block
    switch (spec) {
        /***EVENT BLOCKS***/
        case "whenGreenFlag":
            return {
                type: "hat",
                spec: "whenGreenFlag",
                label: "when green flag clicked",
                group: "Events"
            };
            break;
        case "whenKeyPressed":
            return {
                type: "hat",
                spec: "whenKeyPressed",
                label: "when %k key pressed",
                group: "Events",
                params: [
                    {
                        type: "key",
                        positionFromLeft: 50
                    }
                ]
            };
            break;
        /***CONTROL BLOCKS***/
        case "doForever":
            return {
                type: "c",
                spec: "doForever",
                label: "forever",
                group: "Control"
            };
            break;
        /***SENSING BLOCKS***/
        /***OPERATORS BLOCKS***/
        /***MORE BLOCKS (Scratch Extension Blocks & GE Add-ons)***/
        /***MOTION BLOCKS***/
        /***LOOKS BLOCKS***/
        case "nextCostume":
            return {
                type: "command",
                spec: "nextCostume",
                label: "next costume",
                group: "Looks"
            };
            break;
        /***SOUND BLOCKS***/
        /***PEN BLOCKS***/
        /***DATA BLOCKS***/
        
        default:
            return {};
            break;
    }
}
function getParameterCode(type) {
    //return HTML for the parameter type
    switch (type) {
        case "key":
            return "<select>\n" +
                    "<option value=\"up\">up arrow</option>\n" +
                    "<option value=\"down\">down arrow</option>\n" +
                    "<option value=\"right\">right arrow</option>\n" +
                    "<option value=\"left\">left arrow</option>\n" +
                    "<option value=\"space\">space</option>\n" +
                    "<option value=\"a\">a</option>\n" +
                    "<option value=\"b\">b</option>\n" +
                    "<option value=\"c\">c</option>\n" +
                    "<option value=\"d\">d</option>\n" +
                    "<option value=\"e\">e</option>\n" +
                    "<option value=\"f\">f</option>\n" +
                    "<option value=\"g\">g</option>\n" +
                    "<option value=\"h\">h</option>\n" +
                    "<option value=\"i\">i</option>\n" +
                    "<option value=\"j\">j</option>\n" +
                    "<option value=\"k\">k</option>\n" +
                    "<option value=\"l\">l</option>\n" +
                    "<option value=\"m\">m</option>\n" +
                    "<option value=\"n\">n</option>\n" +
                    "<option value=\"o\">o</option>\n" +
                    "<option value=\"p\">p</option>\n" +
                    "<option value=\"q\">q</option>\n" +
                    "<option value=\"r\">r</option>\n" +
                    "<option value=\"s\">s</option>\n" +
                    "<option value=\"t\">t</option>\n" +
                    "<option value=\"u\">u</option>\n" +
                    "<option value=\"v\">v</option>\n" +
                    "<option value=\"w\">w</option>\n" +
                    "<option value=\"x\">x</option>\n" +
                    "<option value=\"y\">y</option>\n" +
                    "<option value=\"z\">z</option>\n" +
                    "<option value=\"0\">0</option>\n" +
                    "<option value=\"1\">1</option>\n" +
                    "<option value=\"2\">2</option>\n" +
                    "<option value=\"3\">3</option>\n" +
                    "<option value=\"4\">4</option>\n" +
                    "<option value=\"5\">5</option>\n" +
                    "<option value=\"6\">6</option>\n" +
                    "<option value=\"7\">7</option>\n" +
                    "<option value=\"8\">8</option>\n" +
                    "<option value=\"9\">9</option>\n" +
                    "</select>\n";
            break;
        default:
            return "";
            break;
    }
}
