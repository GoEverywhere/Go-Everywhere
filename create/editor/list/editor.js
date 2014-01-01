//VARIABLES
var zipFile;

function reloadEvents() {
    $(".script").draggable();
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
    //Put the scripts of the first sprite onto the page
    var scratchblocksText = "";
    if (project.children[0].scripts) {
        //loop through each script
        for (var i = 0; i < project.children[0].scripts.length; i++) {
            var _isDefineBlock = false;
	    
            var currentBlock = getBlockData(project.children[0].scripts[i][2][0][0]);
	    if (currentBlock.type == "hat") {
		scratchblocksText += currentBlock.scratchblocks;
		scratchblocksText += "\n";
	    }
	    
            for (var j = 1; j < project.children[0].scripts[i][2].length; j++) {
                //get block info
                currentBlock = getBlockData(project.children[0].scripts[i][2][j][0]);
		//add it to the script
		scratchblocksText += currentBlock.scratchblocks;
		scratchblocksText += "\n";
		
		if (currentBlock.type == "c") {
		    //get the label of the blocks and add them to the script
		    //Add in the lists for the blocks
		    scratchblocksText += generateCShapeBlocks(project.children[0].scripts[i][2][j]);
		    //add an end tag
		    scratchblocksText += "end\n";
		}
            }
	    
	    if (_isDefineBlock) {
		scratchblocksText += "end\n";
	    }
        }
    }
    $("#blocks").html("<pre class=\"blockCodeParse\">" + scratchblocksText + "</pre>");
    //Parse blocks
    scratchblocks2.parse("pre.blockCodeParse");
    //Add sorting and dragging
    reloadEvents();
}
function generateCShapeBlocks(blockToDecode) {
    var totalScripts = "";
    //loop through the loop's blocks
    for (var k = 0; k < blockToDecode.length; k++) {
	var currentDecodingBlock = getBlockData(blockToDecode[1][k][0]);
	
	totalScripts += currentDecodingBlock.scratchblocks;
	totalScripts += "\n";
    }
    return totalScripts;
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
		scratchblocks: "when green flag clicked",
                group: "Events"
            };
            break;
        case "whenKeyPressed":
            return {
                type: "hat",
                spec: "whenKeyPressed",
                label: "when %k key pressed",
		scratchblocks: "when [space v] key pressed",
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
		scratchblocks: "forever",
                group: "Control"
            };
            break;
        /***SENSING BLOCKS***/
        /***OPERATORS BLOCKS***/
        /* Please leave these commented. They are not finished, and may or may not break the GUI up a bit.
        case "+":
            return {
                type: "number",
                spec: "+",
                label: "%n + %n",
                scratchblocks: "((10) + (10))",
                group: "Operators",
                params: [
                    {
                        type: "number",
                        positionFromLeft: 5
                    },
                    {
                        type: "number",
                        positionFromLeft: 60
                    }
                ]
            }
            break;
        case "-":
            return {
                type: "number",
                spec: "-",
                label: "%n - %n",
                scratchblocks: "((10) - (10))"
                group: "Operators",
                params: [
                    {
                        type: "number",
                        positionFromLeft: 5
                    },
                    {
                        type: "number",
                        positionFromLeft: 60
                    }
                ]
            }
            break;
        case "*":
            return {
                type: "number",
                spec: "*",
                label: "%n * %n",
                scratchblocks: "((10) * (10))",
                group: "Operators",
                params: [
                    {
                        type: "number",
                        positionFromLeft: 5
                    },
                    {
                        type: "number",
                        positionFromLeft: 60
                    }
                ]
            }
            break;
        case "/":
            return {
                type: "number",
                spec: "/",
                label: "%n / %n",
                scratchblocks: "((10) / (10))",
                group: "Operators",
                params: [
                    {
                        type: "number",
                        positionFromLeft: 5
                    },
                    {
                        type: "number",
                        positionFromLeft: 60
                    }
                ]
            }
            break;*/
        /***MORE BLOCKS (Scratch Custom Blocks, Scratch Extension Blocks, & GE Add-ons)***/
        /***MOTION BLOCKS***/
        /***LOOKS BLOCKS***/
        case "nextCostume":
            return {
                type: "command",
                spec: "nextCostume",
                label: "next costume",
		scratchblocks: "next costume",
                group: "Looks"
            };
            break;
	case "setSizeTo:":
	    return {
		type: "command",
		spec: "setSizeTo:",
		label: "set size to %n",
		scratchblocks: "set size to (100)",
		group: "Looks"
	    };
	    break;
        /***SOUND BLOCKS***/
        /***PEN BLOCKS***/
        /***DATA BLOCKS***/
        
        default:
            return {
		type: "command",
		spec: spec,
		label: spec,
		scratchblocks: spec,
		group: "Obsolete"
		};
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
