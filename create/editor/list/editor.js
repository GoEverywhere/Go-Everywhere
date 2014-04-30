//VARIABLES
var zipFile,
project = {},
currentObj = {},
projectName = "",
vars;

//PROJECT SAVING!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
function generateObjectJSON(){
    var objName = currentObj.objName;
    var scripts = [];
    //Loop through the #blocks section to find each block stack,
    //then decode each block into the array
    $("#blocks .script").each(function(){
	//Function so we can keep parameter code the same
	function findParameterArray(el, paramSelectors) {
	    var miniParams = [];
	    
	    $.each(paramSelectors, function(index, value){
		if (($($(el).children("div")[index]).hasClass("reporter") || ($($(el).children("div")[index]).hasClass("boolean") && !$($(el).children("div")[index]).hasClass("empty")))) {
		    var myEmbeddedBlocks = findEmbeddedBlocks($(el).children("div")[index]);
		    for(var e = 0; e < myEmbeddedBlocks.length; e++)
		    {
			miniParams.push(myEmbeddedBlocks[e]);
		    }
		}else{
		    switch(value)
		    {
			case "m":
			    //Text value of "select" field
			    miniParams.push($($(el).children("div")[index]).children("select").val());
			    break;
			case "b":
			    //If it doesn't have a block inside it, it is false
			    miniParams.push(false);
			    break;
			case "n":
			case "d":
			    //Has to be turned into a float
			    miniParams.push(parseFloat($($(el).children("div")[index]).children("input").val()) === null ? 10 : parseFloat($($(el).children("div")[index]).children("input").val()));
			    break;
			case "s":
			    //Straight up text
			    miniParams.push($($(el).children("div")[index]).children("input").val());
			    break;
			case "c":
			    try{
				var tmpColorText = $($(el).children("div")[index]).css("background-color");
				tmpColorText = tmpColorText.replace("rgb(", "");
				tmpColorText = tmpColorText.replace(");", "");
				tmpColorText = tmpColorText.replace(" ", "");
				tmpColorText = tmpColorText.replace(" ", "");
				var tmpColorArray = tmpColorText.split(","); //R: [0], G: [1], B: [2]
				miniParams.push(((65536 * parseInt(tmpColorArray[0])) + (256 * parseInt(tmpColorArray[1]))) + parseInt(tmpColorArray[2]));
			    }catch(e){
			    	console.warn("[findParameterArray:] Trouble reading color values from this block: " + $(el).attr("spec") + ", using black (0) instead.");
				miniParams.push(0);
			    }
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
	    var myBlockData = EditorTools.getBlockData($(el).attr("spec"));
		
	    var myTotal = [myBlockData.spec];
	    if (myBlockData.type === "getParam" || myBlockData.type === "readVariable") {
		myTotal.push($(el).attr("label"));
		if (myBlockData.type === "getParam") {
		    myTotal.push($(el).attr("type"));
		}
	    }
	    
	    var myParamSelectors = [];
	    if (myBlockData.type !== "getParam" && myBlockData.type !== "readVariable") {
		$.each(myBlockData.label.split(""), function(index, value){
		    if (index + 1 < myBlockData.label.split("").length) {
			if (value === "%") {
			    switch(myBlockData.label.split("")[index + 1])
			    {
				case "b":
				case "c":
				case "d":
				case "m":
				case "n":
				case "s":
				    myParamSelectors.push(myBlockData.label.split("")[index + 1]);
				    break;
			    }
			}
		    }
		});
	    }
	    
	    var myParams = findParameterArray(el, myParamSelectors);
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
	    $(el).children(".hat,.define-hat,.stack:not(.cstart,.cend,.celse),.cwrap,.reporter,.boolean").each(function(){
		//If it is a stack or hat, just stick it in the array
		if ($(this).hasClass("hat") || $(this).hasClass("stack") || ($(this).hasClass("reporter")) || $(this).hasClass("boolean")) {
		    var myBlockData = EditorTools.getBlockData($(this).attr("spec"));
		    
		    var myTotal = [myBlockData.spec];
		    if (myBlockData.type === "call" || myBlockData.type === "getParam" || myBlockData.type === "readVariable") {
			myTotal.push($(this).attr("label"));
			if (myBlockData.type === "getParam") {
			    myTotal.push($(this).attr("type"));
			}
		    }
		    
		    var myParamSelectors = [];
		    if (myBlockData.type !== "getParam" && myBlockData.type !== "readVariable") {
			var tmpLabel = myBlockData.label === undefined ? $(this).attr("label") : myBlockData.label;
			$.each(tmpLabel.split(""), function(index, value){
			    if (index + 1 < tmpLabel.split("").length) {
				if (value === "%") {
				    switch(tmpLabel.split("")[index + 1])
				    {
					case "b":
					case "c":
					case "d":
					case "m":
					case "n":
					case "s":
					    myParamSelectors.push(tmpLabel.split("")[index + 1]);
					    break;
				    }
				}
			    }
			});
		    }
		    
		    var myParams = findParameterArray(this, myParamSelectors);
		    for(var p = 0; p < myParams.length; p++)
		    {
			myTotal.push(myParams[p]);
		    }
		    
		    miniStack.push(myTotal);
		}
		//If it is a define block, get the spec, names, and defaults
		else if ($(this).hasClass("define-hat")) {
		    var myCustomLabel = $(this).attr("label");
		    
		    var myParamNames = $(this).attr("varnames").split(",");
		    var myDefaultString = $(this).attr("defaults").split(",");
		    var myDefaults = [];
		    $.each(myDefaultString, function(index, value){
			myDefaults.push((value === "false" ? false : (value === "" ? "" : (parseFloat(value) | value))));
		    });
		    
		    miniStack.push(["procDef", myCustomLabel, myParamNames, myDefaults]);
		}
		//If it is a cwrap, we get data from cstart, and blocks from cmouth
		else if ($(this).hasClass("cwrap")) {
		    var myBlockData = EditorTools.getBlockData($(this).children(".cstart").attr("spec"));
		    
		    var myTotal = [myBlockData.spec];
		    
		    var myParamSelectors = [];
		    var tmpLabel = myBlockData.label;
		    if (myBlockData.type === "special") {
			tmpLabel = myBlockData.label[0];
		    }
		    $.each(tmpLabel.split(""), function(index, value){
			if (index + 1 < tmpLabel.split("").length) {
			    if (value === "%") {
				switch(tmpLabel.split("")[index + 1])
				{
				    case "b":
				    case "c":
				    case "d":
				    case "m":
				    case "n":
				    case "s":
					myParamSelectors.push(tmpLabel.split("")[index + 1]);
					break;
				}
			    }
			}
		    });
		    
		    var myParams = findParameterArray($(this).children(".cstart"), myParamSelectors);
		    for(var p = 0; p < myParams.length; p++)
		    {
			myTotal.push(myParams[p]);
		    }
		    
		    $(this).children(".cmouth").each(function(){
			if ($(this).children().length > 0) {
			    myTotal.push(findBlocks($(this)));
			}else{
			    myTotal.push(null);
			}
		    });
		    
		    miniStack.push(myTotal);
		}
	    });
	    return miniStack;
	}
	
	scripts.push([0, 0, findBlocks(this)]);
    });
    return $.extend(currentObj, {
	objName: objName,
	scripts: scripts
    });
}

function generateAndDownloadZIP(){
    //Make sure that our currentObj is saved
    generateObjectJSON();
    //ONLY SAVES THE JSON!!!!!
    zipFile.file("project.json", JSON.stringify(project));
    
    //Compress the zip and give it to the user!
    saveAs(zipFile.generate({ type: "blob" }), projectName + ".ge");
}
/*********************************************************************/

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
    
    //Add blocks to the palette (all that have a defined label, at least)
    $.each(blocks, function(index, value){
	if (value.label !== undefined) {
	    switch(value.type)
	    {
		case "command":
		case "stack":
		    $("#palette #" + value.group.toLowerCase()).html($("#palette #" + value.group.toLowerCase()).html() + "<div class=\"script\"><div class=\"stack " + value.group.toLowerCase() + (value.cap === undefined ? "" : " cap") + "\" spec=\"" + value.spec + "\">" + value.label + "</div></div>");
		    break;
	    }
	}
	console.log(value);
    });
    
    //Sprite Selection Event
    $("#toolbar #spriteSelect select").change(function(){
	//Save the current sprite, then change to the next
	var tmpJSON = generateObjectJSON();
	if (tmpJSON.objName == "Stage") {
	    project = tmpJSON;
	}else{
	    $.each(project.children, function(index, value){
		if (project.children[index].objName == tmpJSON.objName) {
		    project.children[index] = tmpJSON;
		    return false; //jQuery's way of breaking
		}
	    });
	}
	
	loadCurrentSelectedSprite();
    });
    $("#saveProject").bind("click touchend", function(e){
	generateAndDownloadZIP();
    });
    
    if (vars['project'] && vars['project'] != "") {
	//load project
	loadProject(vars['project']);
    }else{
	$("#blocks").html("<br /><br /><h3>Please provide a project in ?project=PROJECT_PATH</h3>");
    }
});
function loadProject(url) {
    JSZipUtils.getBinaryContent(url, function(err, data){
	if (err) {
	    throw err;
	}
	
	zipFile = new JSZip(data);
	
	//Save the project's filename
	projectName = (url.substring(url.lastIndexOf('/')+1)).replace(/.[^.]+$/g, "");
	
	doneReadingZip(zipFile);
    });
}
function doneReadingZip(zip) {
    //Load the project JSON into the project variable
    $.each(zipFile.files, function(index, value){
	console.log(value);
	if (value.name == "project.json") {
	    project = JSON.parse(value.asText());
	    return true;
	}
	if(value.name.indexOf("png") > -1){
	    var myImageTag = "<img src=\"data:image/png;base64," + EditorTools.base64Encode(value.asUint8Array()) + "\" />";
	    $("#costumes").html($("#costumes").html() + myImageTag);
	    return true;
	}
	if(value.name.indexOf("jpg") > -1){
	    var myImageTag = "<img src=\"data:image/jpeg;base64," + EditorTools.base64Encode(value.asUint8Array()) + "\" />";
	    $("#costumes").html($("#costumes").html() + myImageTag);
	    return true;
	}
	if(value.name.indexOf("wav") > -1){
	    var myAudioTag = "<audio src=\"data:audio/wav;base64," + EditorTools.base64Encode(value.asUint8Array()) + "\" />";
	    $("#sounds").html($("#sounds").html() + myAudioTag);
	    return true;
	}
    });
    
    //Load sprites and stage into selector
    $("#toolbar #spriteSelect select").html("<option name=\"Stage\">Stage</option>");
    for (var i = 0; i < project.children.length; i++) {
	if (project.children[i].objName !== undefined) {
	    var tmpSprite = $("#toolbar #spriteSelect select:last-child").append("<option name=\"" + project.children[i].objName + "\">" + project.children[i].objName + "</option>");
	    if (i == 0) {
		//Is first sprite. This should be loaded first.
		tmpSprite.children(":last").attr("selected", "true");
	    }
	}
    }
    
    loadCurrentSelectedSprite();   
    
}
function loadCurrentSelectedSprite(){
    var blockCode = "";
    
    if ($("#toolbar #spriteSelect select").val() == project.objName) {
	currentObj = project;
    }else{
	for(var spriteI = 0; spriteI < project.children.length; spriteI++)
	{
	    if ($("#toolbar #spriteSelect select").val() == project.children[spriteI].objName) {
		currentObj = project.children[spriteI];
	    }
	}
    }
    if (currentObj.scripts) {
	$.each(currentObj.scripts, function(index, value){
	    blockCode += "<div class=\"script\">\n";
	    blockCode += EditorTools.findBlocksFromStack(value[2], {
		project: project,
		currentObj: currentObj
	    });
	    blockCode += "</div>\n";
	});
    }
    
    $("#blocks").html("<div class=\"sb2\">" + blockCode + "</div>");
    
    //When dragging blocks, they somethings loop themselves into a new line (jQuery bug)
    $("#blocks .stack").each(function(){
	if ($(this).html().split("")[$(this).html().split("").length - 1] === ">") {
	    $(this).html($(this).html() + " ");
	}
    });
    
    //ADD SORTING AND DRAGGING!!!!!!!!!!
    //Add ul and li tags around the existing scratchblocks2 tags
    $("#blocks .script").each(function(){
	//Turn the script into a UL list
	$(this).replaceWith("<ul class=\"" + $(this).attr("class") + "\">" + $(this).html() +  "</ul>");
    });
    //Change all the inner C-shapes to a list, so we can make all blocks INSIDE them sortable
    $("#blocks .script .cmouth").each(function(){
	$(this).replaceWith("<ul class=\"" + $(this).attr("class") + "\">" + $(this).html() + "</ul>");
    });
    
    //Bind the actual events!!!
    //Make hats draggable
    $("#blocks .script > .hat").draggable({
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
    //Make input blocks draggable
    function makeReporterDraggable(selec){
	$(selec).draggable({
	    revert: "invalid",
	    helper: "clone",
	    start: function(event, ui){
		$(this).hide();
		//Hide the new button, Show the garbage bin
		$("#addNew").hide("fade", 100, function(){
		    $("#garbageBin").show("fade", 100).css("opacity", "0.5");
		});
		//Change my Z-index to 1000
		$(this).add(ui.helper).css("z-index", 1000);
		
		if (!$(this).parent().hasClass("script")) {
		    var parentBlockData = EditorTools.getBlockData($(this).parent().attr("spec"));
		    
		    var myParentParams = [];
		    var myParentLabel = parentBlockData.label === undefined ? $(this).parent().attr("label") : parentBlockData.label;
		    $.each(myParentLabel.split(""), function(index, value){
			if (index + 1 < myParentLabel.split("").length) {
			    if (value === "%") {
				switch(myParentLabel.split("")[index + 1])
				{
				    case "b":
				    case "c":
				    case "d":
				    case "m":
				    case "n":
				    case "s":
					myParentParams.push(myParentLabel.split("")[index + 1]);
					break;
				}
			    }
			}
		    });
		    
		    switch (myParentParams[$(this).index()]) {
			case "n":
			    $(this).before("<div class=\"number placeholder\"><input type=\"text\" pattern=\"[0-9.]+\" size=\"4\" style=\"font-size: 10px;height:13px; padding: 0; border: none;\" value=\"10\"></div>");
			    break;
			case "b":
			    $(this).before("<div class=\"boolean empty placeholder\"></div>");
			    break;
			case "s":
			    $(this).before("<div class=\"string placeholder\"><input type=\"text\" size=\"4\" style=\"font-size: 10px;height:13px; padding: 0; border: none;\" value=\"Hello!\"></div>");
			    break;
		    }
		}
	    },
	    stop: function(event, ui){
		//Hide the garbage bin, Show the new button
		$("#garbageBin").hide("fade", 100, function(){
		    $("#addNew").show("fade", 100);
		});
		if (!$(this).hasClass("dragged-over") && !$(this).parent().hasClass("script")) {
		    $(".placeholder").remove();
		}
		$(this).removeAttr("style");
		var $parent = $(this).parent();
		if ($parent.hasClass("script")) {
		    $(this).show().parent().html($(this).parent().html()).children().last().remove();
		    makeReporterDraggable($parent.children());
		}
	    }
	});
    }
    makeReporterDraggable($("#blocks").find(".reporter:not(.custom-arg), .boolean:not(.empty,.custom-arg)"));
    
    //Make fields droppable targets for reporters
    function addFieldAcceptors(selec){
	$(selec).droppable({
	    accept: ".reporter, .boolean",
	    greedy: true,
	    tolerance: "pointer",
	    over: function(e, ui){
		if (($(this).hasClass("empty") && ui.draggable.hasClass("boolean")) ||
		    (($(this).hasClass("string") || $(this).hasClass("number")) && ui.draggable.hasClass("reporter"))){
		    //Filter out accept boxes
		    $(this).css({
			"border": "5px solid yellow",
			"width": ui.draggable.css("width"),
			"height": ui.draggable.css("height")
		    });
		    ui.draggable.addClass("dragged-over");
		}
		
	    },
	    out: function(e, ui){
		$(this).css({
		    "border": "",
		    "width": "",
		    "height": ""
		});
		ui.draggable.removeClass("dragged-over");
	    },
	    drop: function(e, ui){
		$(this).css("border", "");
		//Add droppable to the placeholder
		addFieldAcceptors(".placeholder");
		//Remove placeholder class
		$(".placeholder").removeClass("placeholder");
		//Remove the "dragged-over" class
		$(".dragged-over").removeClass("dragged-over");
		//The block MIGHT have the dragged-over class...
		//If the block was by itself in a script
		var parent = null;
		if (ui.draggable.parent().hasClass("script")) {
		    parent = ui.draggable.parent();
		}
		//Show the draggable
		ui.draggable.removeAttr("style");
		//Put the block in place of myself
		$(this).replaceWith(ui.draggable);
		//Remove the parent script, if any
		if (parent !== null) {
		    parent.remove();
		}
	    }
	});
    }
    addFieldAcceptors($("#blocks").find(".number, .string, .empty"));
    
    //Make the rest of the blocks sortable
    $("#blocks ul").sortable({
	axis: "both",
	placeholder: "block-placeholder",
	items: "li, div:not(.cstart, .cend, .hat, .hat > *, .number, .string, .boolean, .dropdown, .reporter, .outline)",
	connectWith: "#blocks ul",
	start: function(event, ui){
	    //Hide the new button, Show the garbage bin
	    $("#addNew").hide("fade", 100, function(){
		$("#garbageBin").show("fade", 100).css("opacity", "0.5");
	    });
	},
	sort: function(event, ui){
	    //Width changing issues
	    $(this).css("width", "auto");
	},
	stop: function(event, ui){
	    //Hide the garbage bin, Show the new button
	    $("#garbageBin").hide("fade", 100, function(){
		$("#addNew").show("fade", 100);
	    });
	}
    });
    
    //PARAMETER CHANGE EVENTS!!!!!!
    $("#blocks input[type=text]").bind("load ready keypress", function(){
	$(this).attr("size", $(this).val().length);
    });
    $("#blocks input[type=text][pattern]").bind("keydown keyup keypress focus unfocus", function(){
	$(this).val($(this).val().match($(this).attr("pattern")));
    });
    
    //GARBAGE BIN EVENTS!!!!!!
    $("#garbageBin").droppable({
	greedy: true,
	tolerance: "pointer",
	drop: function(event, ui){
	    if (ui.draggable.parent().hasClass("script") && ui.draggable.is(":only-child")) {
		    ui.draggable.parent().remove();
	    } else{
		    ui.helper.remove();
		    ui.draggable.remove();
	    }
	    addFieldAcceptors($(".placeholder").removeClass("placeholder"));
	    
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


