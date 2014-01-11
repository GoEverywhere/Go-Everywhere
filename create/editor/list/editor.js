//VARIABLES
var zipFile,
project,
vars;

function reloadEvents() {
    
    //SCRATCHBLOCKS2 EVENTS!!!!!!
    //Add ul and li tags around the existing scratchblocks2 tags
    $("#blocks .script").each(function(){
		//Turn the script into a UL list
		$(this).replaceWith("<ul class=\"" + $(this).attr("class") + "\">" + $(this).html() +  "</ul>");
	});
	$("#blocks .script > div:not(.hat)").each(function(){
		$(this).replaceWith("<li class=\"" + $(this).attr("class") + "\">" + $(this).html() + "</li>");
	});
	$("#blocks .script > .hat").each(function(){
		$(this).draggable({
			revert: true,
			start: function(event, ui){
				//Hide the new button, Show the garbage bin
				$("#addNew").hide("slide", 50, function(){
					$("#garbageBin").show("slide", 50).css("opacity", "0.5");
				});
			},
			stop: function(event, ui){
				//Hide the garbage bin, Show the new button
				$("#garbageBin").hide("slide", 50, function(){
					$("#addNew").show("slide", 50);
				});
			}
		});
    });
    $("#blocks .script .cmouth").each(function(){
		$(this).replaceWith("<ul class=\"" + $(this).attr("class") + "\">" + $(this).html() + "</ul>");
    });
    /*$("#blocks .script .cmouth > .stack").each(function(){
	$(this).replaceWith("<li class=\"" + $(this).attr("class") + "\">" + $(this).html() + "</li>");
    });*/
    //Bind the actual events
    $("#blocks ul").sortable({
		axis: "both",
		placeholder: "block-placeholder",
		items: "li:not(.hat),.stack:not(.cstart)",
		connectWith: "#blocks ul",
		items: "li, div:not(.cend)",
		start: function(event, ui){
			//Hide the new button, Show the garbage bin
			$("#addNew").hide("fade", 100, function(){
				$("#garbageBin").show("fade", 100).css("opacity", "0.5");
			});
		},
		stop: function(event, ui){
			//Hide the garbage bin, Show the new button
			$("#garbageBin").hide("fade", 100, function(){
				$("#addNew").show("fade", 100);
			});
		}
    });
    
    //PARAMETER CHANGE EVENTS!!!!!!
    $("#blocks input[type=text]").keypress(function(){
		$(this).attr("size", $(this).val().length);
    });
    $("#blocks input[type=text][pattern]").bind("keydown keyup keypress focus unfocus", function(){
		$(this).val($(this).val().match($(this).attr("pattern")));
    });
    
    //GARBAGE BIN EVENTS!!!!!!
    $("#garbageBin").droppable({
		drop: function(event, ui){
			if (ui.draggable.parent().hasClass("script") && ui.draggable.is(":only-child")) {
				//code
			} else{
				ui.helper.remove();
				ui.draggable.remove();
			}
			$(this).children().css("opacity", "0.5");
			$(this).children().css("border-color", "black");
			//Hide the garbage bin, Show the new button
			$("#garbageBin").hide("fade", 100, function(){
				$("#addNew").show("fade", 100);
			});
		},
		over: function(){
			$(this).children().css("opacity", "1.0");
			$(this).children().css("border-color", "yellow");
		},
		out: function(){
			$(this).children().css("opacity", "0.5");
			$(this).children().css("border-color", "black");
		}
    });    
}
$(document).ready(function(){
    //Load GET data
    vars = [];
    var hash;
    var hashes = window.location.search.substr(1).split('&');
    for (var i = 0; i < hashes.length; i++) {
		hash = unescape(hashes[i]).split('=');
		vars[hash[0]] = hash[1];
    }
    
    //Hide the garbage bin
    $("#garbageBin").hide();
    
    //Sprite Selection Event
    $("#toolbar #spriteSelect select").change(function(){
		loadCurrentSelectedSprite();
    });
    
    if (vars['project'] && vars['project'] != "") {
		//load project
		loadProject(vars['project']);
    }else{
		$("#blocks").html("<br /><br /><h3>Please provide a project in ?project=PROJECT_PATH</h3>");
    }
    
    reloadEvents();
});
function loadProject(url) {
    zipFile = new ZipFile(url, doneReadingZip, 1);
    
}
function doneReadingZip(zip) {
    //Load the project JSON into the project variable
    for (var i=0;i<zipFile.entries.length;i++) {
		if (zipFile.entries[i].name == "project.json") {
			project = JSON.parse(zipFile.entries[i].extract(null, true));
		}
    }
    
    //Load sprites and stage into selector
    $("#toolbar #spriteSelect select").html("<option name=\"Stage\">Stage</option>");
    for (var i = 0; i < project.children.length; i++) {
		var tmpSprite = $("#toolbar #spriteSelect select:last-child").append("<option name=\"" + project.children[i].objName + "\">" + project.children[i].objName + "</option>");
		if (i == 0) {
			//Is first sprite. This should be loaded first.
			tmpSprite.children(":last").attr("selected", "true");
		}
    }
    
    loadCurrentSelectedSprite();   
    
}
function loadCurrentSelectedSprite(){
    var scratchblocksText = "";
    
    for(var spriteI = 0; spriteI < project.children.length; spriteI++)
    {
		if ($("#toolbar #spriteSelect select").val() == project.children[spriteI].objName) {
			scratchblocksText += parseSpriteBlocks(project.children[spriteI]);
		}
    }
    
    
    $("#blocks").html("<pre class=\"blockCodeParse\">" + scratchblocksText + "</pre>");
    //Parse blocks
    scratchblocks2.parse("pre.blockCodeParse");
    //Add replace block tags with HTML input tags. PARAMETERS!!!!!!!!!!
    //Number tags
    $("#blocks .number").each(function(){
		$(this).html("<input type=\"text\" pattern=\"[0-9.]+\" size=\"4\" style=\"font-size: 10px;height:13px; padding: 0; border: none;\" value=\"" + $(this).text() + "\" />");
    });
    //String tags
    $("#blocks .string").each(function(){
		$(this).html("<input type=\"text\" size=\"4\" style=\"font-size: 10px;height:13px; padding: 0; border: none;\" value=\"" + $(this).text() + "\" />");
    });
    //Key drop down tags
    $("#blocks .dropdown:contains('%k')").each(function(){
		//Key drop down
		//take out the %k
		var dropDownText = $(this).html().replace('%k', '');
		//take out the { and }
		dropDownText = dropDownText.replace(new RegExp('(\\{)',["i"]), '');
		dropDownText = dropDownText.replace(new RegExp('(\\})',["i"]), '');
		
		$(this).html(getParameterCode("key"));
		$(this).find("option").each(function(){
			if ($(this).val() == dropDownText) {
				$(this).attr("selected", "true");
			}
		});
    });
    //Object drop down tags
    $("#blocks .dropdown:contains('%o')").each(function(){
	//Key drop down
	//take out the %k
	var dropDownText = $(this).html().replace('%o', '');
	//take out the { and }
	dropDownText = dropDownText.replace(new RegExp('(\\{)',["i"]), '');
	dropDownText = dropDownText.replace(new RegExp('(\\})',["i"]), '');
	
	$(this).html(getParameterCode("object"));
		$(this).find("option").each(function(){
			if ($(this).val() == dropDownText) {
			$(this).attr("selected", "true");
			}
		});
    });
    //Math drop down tags
    $("#blocks .dropdown:contains('%m')").each(function(){
	//Key drop down
	//take out the %k
	var dropDownText = $(this).html().replace('%m', '');
	//take out the { and }
	dropDownText = dropDownText.replace(new RegExp('(\\{)',["i"]), '');
	dropDownText = dropDownText.replace(new RegExp('(\\})',["i"]), '');
	
	$(this).html(getParameterCode("math"));
		$(this).find("option").each(function(){
			if ($(this).val() == dropDownText) {
			$(this).attr("selected", "true");
			}
		});
    });
    //Add sorting and dragging
    reloadEvents();
}

function parseSpriteBlocks(sprite) {
    //Put the scripts of the first sprite onto the page
    var tmpScratchblocksText = "";
    if (sprite.scripts) {
        //loop through each script
        for (var i = 0; i < sprite.scripts.length; i++) {
            var _isDefineBlock = false;
	    
            var currentBlock = getBlockData(sprite.scripts[i][2][0][0]);
			if (currentBlock.type == "hat") {
				tmpScratchblocksText += generateBlockTextWithParameters(sprite.scripts[i][2][0]);
				tmpScratchblocksText += "\n";
			}
	    
            for (var j = 1; j < sprite.scripts[i][2].length; j++) {
                //get block info
                currentBlock = getBlockData(sprite.scripts[i][2][j][0]);
		
				//add it to the script
				tmpScratchblocksText += generateBlockTextWithParameters(sprite.scripts[i][2][j]);
				tmpScratchblocksText += "\n";
				
				if (currentBlock.type == "c") {
					//get the label of the blocks and add them to the script
					//Add in the lists for the blocks
					tmpScratchblocksText += generateCShapeBlocks(sprite.scripts[i][2][j]);
					//add an end tag
					tmpScratchblocksText += "end\n";
				}
            }
	    
			if (_isDefineBlock) {
				tmpScratchblocksText += "end\n";
			}
        }
    }
    return tmpScratchblocksText;
}
function generateBlockTextWithParameters(blockToDecodeParameters)
{
    var currentBlockText = getBlockData(blockToDecodeParameters[0]).scratchblocks;
    //Go through each parameter and add blocks
    if (getBlockData(blockToDecodeParameters[0]).parameters > 0) {
		for(var parameterI = 0; parameterI < getBlockData(blockToDecodeParameters[0]).parameters; parameterI++)
		{
			//See if it is a block parameter
			if (getBlockData(blockToDecodeParameters[1 + parameterI][0]).type == undefined) {
				//No. Put it straight in. That was easy ;D
				currentBlockText = currentBlockText.replace("$" + (parameterI + 1), blockToDecodeParameters[1 + parameterI]);
			}else{
				//Yes. Put in the block, and do parameters off of that, too.
				currentBlockText = currentBlockText.replace(new RegExp('((\\<|\\[|\\()\\$' + (1 + parameterI) + '(\\)|\\]|\\>))',["i"]), generateBlockTextWithParameters(blockToDecodeParameters[1 + parameterI]));
			}
		}
    }
    return currentBlockText;
}
function generateCShapeBlocks(blockToDecode) {
    var totalScripts = "";
    //loop through the loop's blocks
    //window.alert(JSON.stringify(blockToDecode[1]));
    var blockTupleOffset = getBlockData(blockToDecode[0]).parameters;
    for (var k = 0; k < blockToDecode[1].length; k++) {
	var currentDecodingBlock = getBlockData(blockToDecode[1 + blockTupleOffset][k][0]);
	//add it to the scripts
	//totalScripts += currentDecodingBlock.scratchblocks;
	totalScripts += generateBlockTextWithParameters(blockToDecode[1 + blockTupleOffset][k]);
	totalScripts += "\n";
	
	if (currentDecodingBlock.type == "c") {
	    //C-block!
	    totalScripts += generateCShapeBlocks(blockToDecode[1 + blockTupleOffset][k]);
	    totalScripts += "end\n";
	}
    }
    return totalScripts;
}

function getBlockData(spec) {
    //Return an object, telling info about the block
    //PLEASE PUT BLOCKS IN THE ORDER THEY ARE IN SCRATCH! Thank you!
    switch (spec) {
        /***EVENT BLOCKS***/
        case "whenGreenFlag":
            return {
                type: "hat",
                spec: "whenGreenFlag",
                label: "when green flag clicked",
		scratchblocks: "when green flag clicked",
		parameters: 0,
                group: "Events"
            };
            break;
        case "whenKeyPressed":
            return {
                type: "hat",
                spec: "whenKeyPressed",
                label: "when %k key pressed",
		scratchblocks: "when [%k{$1} v] key pressed",
		parameters: 1,
                group: "Events"
            };
            break;
        /***CONTROL BLOCKS***/
	case "wait:elapsed:from:":
	    return {
		type: "command",
		spec: "wait:elapsed:from:",
		scratchblocks: "wait ($1) secs",
		parameters: 1,
		group: "Control"
	    }
	    break;
        case "doForever":
            return {
                type: "c",
                spec: "doForever",
                label: "forever",
		scratchblocks: "forever",
		parameters: 0,
                group: "Control"
            };
            break;
	case "doIf":
	    return {
		type: "c",
		spec: "doIf",
		label: "if %b then",
		scratchblocks: "if <$1> then",
		parameters: 1,
		group: "Control"
	    };
	    break;
	case "doWaitUntil":
	    return {
		type: "command",
		spec: "doWaitUntil",
		label: "wait until %b",
		scratchblocks: "wait until <$1>",
		parameters: 1,
		group: "Control"
	    };
	    break;
        /***SENSING BLOCKS***/
	case "touching:":
	    return {
		type: "boolean",
		spec: "touching:",
		label: "touching %o ?",
		scratchblocks: "< touching [%o{$1} v]? >",
		parameters: 1,
		group: "Sensing"
	    }
	    break;
        /***OPERATORS BLOCKS***/
        case "+":
            return {
                type: "number",
                spec: "+",
                label: "%n + %n",
                scratchblocks: "(($1) + ($2))",
                parameters: 2,
                group: "Operators"
            }
            break;
        case "-":
            return {
                type: "number",
                spec: "-",
                label: "%n - %n",
                scratchblocks: "(($1) - ($2))",
                parameters: 2,
                group: "Operators"
            }
            break;
        case "*":
            return {
                type: "number",
                spec: "*",
                label: "%n * %n",
                scratchblocks: "(($1) * ($2))",
                parameters: 2,
                group: "Operators"
            }
            break;
        case "/":
            return {
                type: "number",
                spec: "/",
                label: "%n / %n",
                scratchblocks: "(($1) / ($2))",
                parameters: 2,
                group: "Operators"
            }
            break;
	    
	case "not":
	    return {
		type: "boolean",
		spec: "not",
		label: "not %b",
		scratchblocks: "< not <$1> >",
		parameters: 1,
		group: "Operatores"
	    }
	    break;
    
    
	case "computeFunction:of:":
	    return {
		type: "number",
		spec: "computeFunction:of:",
		label: "%m of (%n)",
		scratchblocks: "([%m{$1} v] of ($2))",
		parameters: 2,
		group: "Operators"
	    }
	    break;
        /***MORE BLOCKS (Scratch Custom Blocks, Scratch Extension Blocks, & GE Add-ons)***/
        /***MOTION BLOCKS***/
	case "pointTowards:":
	    return {
		type: "command",
		spec: "pointTowards:",
		label: "point towards %o",
		scratchblocks: "point towards [%o{$1} v]",
		parameters: 1,
		group: "Motion"
	    }
	    break;
	case "gotoSpriteOrMouse:":
	    return {
		type: "command",
		spec: "gotoSpriteOrMouse:",
		label: "go to %o",
		scratchblocks: "go to [%o{$1} v]",
		parameters: 1,
		group: "Motion"
	    };
	    break;
        /***LOOKS BLOCKS***/
	case "say:":
	    return {
		type: "command",
		spec: "say:",
		label: "say %s",
		scratchblocks: "say [$1]",
		parameters: 1,
		group: "Looks"
	    }
	    break;
        case "nextCostume":
            return {
                type: "command",
                spec: "nextCostume",
                label: "next costume",
		scratchblocks: "next costume",
		parameters: 0,
                group: "Looks"
            };
            break;
	case "setSizeTo:":
	    return {
		type: "command",
		spec: "setSizeTo:",
		label: "set size to %n",
		scratchblocks: "set size to ($1) %",
		parameters: 1,
		group: "Looks"
	    };
	    break;
        /***SOUND BLOCKS***/
        /***PEN BLOCKS***/
        /***DATA BLOCKS***/
        
        default:
            return {
		type: undefined,
		spec: spec,
		label: undefined,
		scratchblocks: undefined,
		parameters: undefined,
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
	case "object":
	    var paramToReturn = "<select>\n" +
		    "<option name=\"mouse-pointer\">mouse-pointer</option>\n";
		$("#toolbar #spriteSelect select option:not([name='Stage'],:selected)").each(function(){
		    paramToReturn += "<option name=\"" + $(this).attr("name") + "\">" + $(this).attr("name") + "</option>\n";
		});
		paramToReturn += "</select>\n";
	    return paramToReturn;
	    break;
	case "math":
	    return "<select>\n" +
		    "<option value=\"abs\">abs</option>\n" +
		    "<option value=\"floor\">floot</option>\n" +
		    "<option value=\"ceiling\">ceiling</option>\n" +
		    "<option value=\"sqrt\">sqrt</option>\n" +
		    "<option value=\"sin\">sin</option>\n" +
		    "<option value=\"cos\">cos</option>\n" +
		    "<option value=\"tan\">tan</option>\n" +
		    "<option value=\"asin\">asin</option>\n" +
		    "<option value=\"acos\">acos</option>\n" +
		    "<option value=\"atan\">atan</option>\n" +
		    "<option value=\"ln\">ln</option>\n" +
		    "<option value=\"log\">log</option>\n" +
		    "<option value=\"e ^\">e ^</option>\n" +
		    "<option value=\"10 ^\">10 ^</option>\n" +
		    "</select>\n";
	    break;
        default:
            return "";
            break;
    }
}
