//***BLOCKS***//
//**//EVENTS
blocks.push({
                type: "hat",
                spec: "whenGreenFlag",
                label: "when green flag clicked",
		scratchblocks: "when green flag clicked",
		renderLabel: "when  clicked",
		parameters: [],
                group: "Events"
            });
blocks.push({
                type: "hat",
                spec: "whenKeyPressed",
                label: "when %k key pressed",
		scratchblocks: "when [%k{$1} v] key pressed",
		renderLabel: "when  key pressed",
		parameters: ["dropdown"],
                group: "Events"
            });
//**//CONTROL
blocks.push({
		type: "command",
		spec: "wait:elapsed:from:",
		scratchblocks: "wait ($1) secs",
		renderLabel: "wait  secs",
		parameters: ["number"],
		group: "Control"
	    });
blocks.push({
                type: "c",
                spec: "doForever",
                label: "forever",
		scratchblocks: "forever",
		renderLabel: "forever",
		parameters: [],
                group: "Control"
            });
blocks.push({
		type: "c",
		spec: "doIf",
		label: "if %b then",
		scratchblocks: "if <$1> then",
		renderLabel: "if  then",
		parameters: ["boolean"],
		group: "Control"
	    });
blocks.push({
		type: "command",
		spec: "doWaitUntil",
		label: "wait until %b",
		scratchblocks: "wait until <$1>",
		renderLabel: "wait until ",
		parameters: ["boolean"],
		group: "Control"
	    });
//**//SENSING
blocks.push({
		type: "boolean",
		spec: "touching:",
		label: "touching %o ?",
		scratchblocks: "< touching [%o{$1} v]? >",
		renderLabel: "touching ?",
		parameters: ["dropdown"],
		group: "Sensing"
	    });
blocks.push({
		type: "reporter",
		spec: "timer",
		label: "timer",
		scratchblocks: "(timer)",
		renderLabel: "timer",
		parameters: [],
		group: "Sensing"
	    });
//**//OPERATORS
blocks.push({
                type: "number",
                spec: "+",
                label: "%n + %n",
                scratchblocks: "(($1) + ($2))",
		renderLabel: " + ",
                parameters: ["number",
			     "number"],
                group: "Operators"
            });
blocks.push({
                type: "number",
                spec: "-",
                label: "%n - %n",
                scratchblocks: "(($1) - ($2))",
		renderLabel: " - ",
                parameters: ["number",
			     "number"],
                group: "Operators"
            });
blocks.push({
                type: "number",
                spec: "*",
                label: "%n * %n",
                scratchblocks: "(($1) * ($2))",
		renderLabel: " * ",
                parameters: ["number",
			     "number"],
                group: "Operators"
            });
blocks.push({
                type: "number",
                spec: "/",
                label: "%n / %n",
                scratchblocks: "(($1) / ($2))",
		renderLabel: " / ",
                parameters: ["number",
			     "number"],
                group: "Operators"
            });
blocks.push({
		type: "boolean",
		spec: "not",
		label: "not %b",
		scratchblocks: "< not <$1> >",
		renderLabel: "not ",
		parameters: ["boolean"],
		group: "Operators"
	    });
blocks.push({
		type: "number",
		spec: "computeFunction:of:",
		label: "%m of (%n)",
		scratchblocks: "([%m{$1} v] of ($2))",
		renderLabel: " of ",
		parameters: ["dropdown",
			     "number"],
		group: "Operators"
	    });
//**//MOTION
blocks.push({
		type: "command",
		spec: "pointTowards:",
		label: "point towards %o",
		scratchblocks: "point towards [%o{$1} v]",
		renderLabel: "point towards ",
		parameters: ["dropdown"],
		group: "Motion"
	    });
blocks.push({
		type: "command",
		spec: "gotoX:y:",
		label: "go to x:(%n) y:(%n)",
		scratchblocks: "go to x:($1) y:($2)",
		renderLabel: "go to x: y:",
		parameters: ["number",
			     "number"],
		group: "Motion"
	    });
blocks.push({
		type: "command",
		spec: "gotoSpriteOrMouse:",
		label: "go to %o",
		scratchblocks: "go to [%o{$1} v]",
		renderLabel: "go to ",
		parameters: ["dropdown"],
		group: "Motion"
	    });
//**//LOOKS
blocks.push({
		type: "command",
		spec: "say:",
		label: "say %s",
		scratchblocks: "say [$1]",
		renderLabel: "say ",
		parameters: ["string"],
		group: "Looks"
	    });
blocks.push({
                type: "command",
                spec: "nextCostume",
                label: "next costume",
		scratchblocks: "next costume",
		renderLabel: "next costume",
		parameters: [],
                group: "Looks"
            });
blocks.push({
		type: "command",
		spec: "setSizeTo:",
		label: "set size to %n",
		scratchblocks: "set size to ($1) %",
		renderLabel: "set size to  %",
		parameters: ["number"],
		group: "Looks"
	    });
//**//SOUND
//**//PEN
//**//DATA

//SMALL JQUERY PLUGIN
jQuery.fn.justtext = function() {
    return $(this).clone().children().remove().end().text();
};

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
    //Change the block after the hat to an LI
    /*$("#blocks .script > div:not(.hat)").each(function(){
	$(this).replaceWith("<li class=\"" + $(this).attr("class") + "\">" + $(this).html() + "</li>");
    });*/
    //Change all the inner C-shapes to a list, so we can make all blocks INSIDE them sortable
    $("#blocks .script .cmouth").each(function(){
	$(this).replaceWith("<ul class=\"" + $(this).attr("class") + "\">" + $(this).html() + "</ul>");
    });
    //Change all .number, .string, .boolean, .dropdown, to SPAN, instead of DIV
    
    /**
     * DIV and LI are dedicated to stack, hat, time, and special blocks.
     * SPAN are dedicated to parameter blocks. If they do not have more then one class, then they are fields.
     **/
    //$()
    
    //Bind the actual events!!!
    //Make hats draggable
    $("#blocks .script > .hat").each(function(){
	$(this).draggable({
	    revert: true,
	    drag: function(event, ui){
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
    //Make input blocks draggable
    $(".reporter, .boolean").draggable({
	revert: "invalid",
	helper: "clone",
	start: function(event, ui){
	    $(this).hide();
	    //Hide the new button, Show the garbage bin
	    $("#addNew").hide("fade", 100, function(){
		    $("#garbageBin").show("fade", 100).css("opacity", "0.5");
	    });
	    
	    var parentBlockData = getBlockData($(this).parent().attr("spec"));
	    switch (parentBlockData.parameters[$(this).index()]) {
		case "number":
		    $(this).before("<div class=\"number placeholder\"><input type=\"text\" pattern=\"[0-9.]+\" size=\"4\" style=\"font-size: 10px;height:13px; padding: 0; border: none;\" value=\"10\"></div>");
		    break;
		case "boolean":
		    $(this).before("<div class=\"boolean empty placeholder\"></div>");
		    break;
		case "string":
		    $(this).before("<div class=\"string placeholder\"><input type=\"text\" size=\"4\" style=\"font-size: 10px;height:13px; padding: 0; border: none;\" value=\"Hello!\"></div>");
		    break;
	    }
	},
	stop: function(event, ui){
	    //Hide the garbage bin, Show the new button
	    $("#garbageBin").hide("fade", 100, function(){
		    $("#addNew").show("fade", 100);
	    });
	    if (!$(this).hasClass("dragged-over")) {
		$(".placeholder").remove();
	    }
	    console.log(event);
	    $(this).show();
	}
    });
    //Make fields droppable targets for reporters
    function addFieldAcceptors(selec){
	$(selec).droppable({
	    accept: ".reporter, .boolean",
	    greedy: true,
	    over: function(e, ui){
		if ((($(".placeholder").hasClass("string") || $(".placeholder").hasClass("number")) && (ui.draggable.hasClass("reporter")))
		    || ($(".placeholder").hasClass("boolean") && $(ui.draggable.hasClass("boolean")))) {
		    //Filter out accept boxes
		    $(this).css("border", "5px solid yellow");
		    ui.draggable.addClass("dragged-over");
		}
		
	    },
	    out: function(e, ui){
		$(this).css("border", "");
		ui.draggable.removeClass("dragged-over");
	    },
	    drop: function(e, ui){
		$(this).css("border", "");
		//Add droppable to the placeholder
		addFieldAcceptors(".placeholder");
		//Remove placeholder class
		$(".placeholder").removeClass("placeholder");
		//Put the block in place of myself
		$(this).replaceWith(ui.draggable);
	    }
	});
    }
    addFieldAcceptors(".number, .string");
    
    //Make the rest of the blocks sortable
    $("#blocks ul").sortable({
		axis: "both",
		placeholder: "block-placeholder",
		items: "li, div:not(.cstart, .cend, .hat, .hat > *, .number, .string, .boolean, .dropdown, .embedded)",
		connectWith: "#blocks ul",
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
	over: function(e, ui){
	    $(this).children().css("opacity", "1.0");
	    $(this).children().css("border-color", "yellow");
	    ui.draggable.addClass("dragged-over");
	    
	},
	out: function(e, ui){
	    $(this).children().css("opacity", "0.5");
	    $(this).children().css("border-color", "black");
	    ui.draggable.removeClass("dragged-over");
	}
    });    
}

//PROJECT SAVING!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
function generateSpriteJSON(){
    var objName = $("#toolbar #spriteSelect select").val();
    var scripts = [];
    //Loop through the #blocks section to find each block stack,
    //then decode each block into the array
    $("#blocks .script").each(function(){
	
	//Function so we can keep parameter code the same
	function findParameterArray(el) {
	    var miniParams = [];
	    
	    $.each(getBlockData($(el).attr("spec")).parameters, function(index, spec){
		console.log("Spec: " + getBlockData($(el).attr("spec")).spec + " at index: " + index);
		if (($($(el).children("div")[index]).hasClass("reporter") || $($(el).children("div")[index]).hasClass("boolean"))) {
		    console.log("This block has an inside! (of course, at " + index + ")");
		    var myEmbeddedBlocks = findEmbeddedBlocks($(el).children("div")[index]);
		    for(var e = 0; e < myEmbeddedBlocks.length; e++)
		    {
			miniParams.push(myEmbeddedBlocks[e]);
		    }
		}else{
		    console.log($($(el).children("div")[index]).attr("class"));
		    switch(getBlockData($(el).attr("spec")).parameters[index])
		    {
			case "dropdown":
			    miniParams.push("");
			    break;
			case "boolean":
			    miniParams.push("[]");
			    break;
			case "number":
			    miniParams.push("10");
			    break;
			case "string":
			    miniParams.push("Hello!");
			    break;
		    }
		}
	    });
	    
	    return miniParams;
	}
	//Function so we can infinitally find embedded blocks
	function findEmbeddedBlocks(el){
	    var miniEmbedded = [];
	    //Embedded blocks are essentially the same format as stack blocks
	    var myBlockData = getBlockData($(el).attr("spec"));
		
	    var myTotal = [myBlockData.spec];
	    
	    var myParams = findParameterArray(el);
	    for(var p = 0; p < myParams.length; p++)
	    {
		myTotal.push(myParams[p]);
	    }
	    
	    miniEmbedded.push(myTotal);
	    return miniEmbedded;
	}
	//Function so we can inifinitally find blocks
	function findBlocks(el){
	    var miniStack = [];
	    //Loop through this parent's
	    $(el).children(".hat,.stack,.cwrap").each(function(){
		//If it is a stack or hat, just stick it in the array
		if ($(this).hasClass("hat") || $(this).hasClass("stack")) {
		    var myBlockData = getBlockData($(this).attr("spec"));
		    
		    var myTotal = [myBlockData.spec];
		    
		    var myParams = findParameterArray(this);
		    for(var p = 0; p < myParams.length; p++)
		    {
			myTotal.push(myParams[p]);
		    }
		    
		    miniStack.push(myTotal);
		}
		//If it is a cwrap, we get data from cstart, and blocks from cmouth
		if ($(this).hasClass("cwrap")) {
		    var myBlockData = getBlockData($(this).children(".cstart").attr("spec"));
		    
		    var myTotal = [myBlockData.spec];
		    
		    var myParams = findParameterArray($(this).children(".cstart"));
		    for(var p = 0; p < myParams.length; p++)
		    {
			myTotal.push(myParams[p]);
		    }
		    
		    myTotal.push(findBlocks($(this).children(".cmouth")));
		    
		    miniStack.push(myTotal);
		}
	    });
	    return miniStack;
	}
	
	scripts.push([0, 0, findBlocks(this)]);
    });
    return {
	objName: objName,
	scripts: scripts
    };
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
    
    $("body").click(function(){
	console.log(generateSpriteJSON());
    });
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
	//Object drop down
	//take out the %o
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
	//Math drop down
	//take out the %m
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
    
    //Fix for the "[math] of (number)" being a sensing block
    $("#blocks .sensing").each(function(){
	//Find the " of " block
	if ($(this).justtext() == " of ") {
	    //See if this block has one dropdown and one number.
	    //If it does, it is supposed to be an Operators block
	    if ($(this).children().first().hasClass("dropdown") && !$(this).children().last().hasClass("dropdown")) {
		$(this).removeClass("sensing").addClass("operators");
	    }
	}
    });
    
    //Add parameter compilation, for project decompilation and analysis
    $($("#blocks .looks,.events,.control,.sensing,.operators,.motion,.looks,.sound,.pen")).each(function(){
	var label = $(this).justtext();
	if(label != "") {
	    //Find the block's catagory
	    var catagory = "looks";
	    if ($(this).hasClass("events")) {
		catagory = "events";
	    }
	    if ($(this).hasClass("control")) {
		catagory = "control";
	    }
	    if ($(this).hasClass("sensing")) {
		catagory = "sensing";
	    }
	    if ($(this).hasClass("operators")) {
		catagory = "operators";
	    }
	    //if ($(this).hasClass("???")) { MORE BLOCKS
		//catagory = "???";
	    //}
	    if ($(this).hasClass("motion")) {
		catagory = "motion";
	    }
	    if ($(this).hasClass("looks")) {
		catagory = "looks";
	    }
	    if ($(this).hasClass("sound")) {
		catagory = "sound";
	    }
	    if ($(this).hasClass("pen")) {
		catagory = "pen";
	    }
	    
	    var blockData = getBlockDataFromScratchblocks(catagory, label);
	    if (blockData.type == undefined) {
		console.error("Block label \"" + label + "\" doesn't have a cooresponding spriteblocks2 >> block data.");
	    }else{
		//var compiledParams = "";
		//for(var i = 0; i < blockData.parameters.length; i++)
		//{
		//    if (i != 0) {
		//	compiledParams += ",";
		//    }
		//    compiledParams += blockData.parameters[i];
		//}
		//$(this).attr("params", compiledParams);
		$(this).attr("spec", blockData.spec);
	    }
	}
    });
    
    //Change all embedded to reporter
    $(".embedded").removeClass("embedded").addClass("reporter");
    
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
    if (getBlockData(blockToDecodeParameters[0]).parameters.length > 0) {
	for(var parameterI = 0; parameterI < getBlockData(blockToDecodeParameters[0]).parameters.length; parameterI++)
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
    var blockTupleOffset = getBlockData(blockToDecode[0]).parameters.length;
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

function getBlockDataFromScratchblocks(cat, label)
{
    for(var i = 0; i < blocks.length; i++)
    {
	if (blocks[i].group.toLowerCase() == cat && blocks[i].renderLabel == label) {
	    return blocks[i];
	}
    }
    return getBlockData("");
}
function getBlockData(spec) {
    for (var i = 0; i < blocks.length; i++) {
	if (blocks[i].spec == spec) {
	    return blocks[i];
	}
    }
    
    return {
	type: undefined,
	spec: spec,
	label: undefined,
	scratchblocks: undefined,
	parameters: undefined,
	group: "Obsolete"
    };
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
