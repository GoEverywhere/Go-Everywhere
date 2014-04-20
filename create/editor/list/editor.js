//VARIABLES
var zipFile,
project = {},
currentObj = {},
vars;

//PROJECT SAVING!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
function generateObjectJSON(){
    var objName = currentObj.objName;
    var scripts = [];
    //Loop through the #blocks section to find each block stack,
    //then decode each block into the array
    $("#blocks .script").each(function(){
	//Function so we can keep parameter code the same
	function findParameterArray(el) {
	    var miniParams = [];
	    
	    $.each(EditorTools.getBlockData($(el).attr("spec")).parameters, function(index, spec){
		if (($($(el).children("div")[index]).hasClass("reporter") || ($($(el).children("div")[index]).hasClass("boolean") && !$($(el).children("div")[index]).hasClass("empty")))) {
		    var myEmbeddedBlocks = findEmbeddedBlocks($(el).children("div")[index]);
		    for(var e = 0; e < myEmbeddedBlocks.length; e++)
		    {
			miniParams.push(myEmbeddedBlocks[e]);
		    }
		}else{
		    switch(EditorTools.getBlockData($(el).attr("spec")).parameters[index])
		    {
			case "dropdown":
			    //Text value of "select" field
			    miniParams.push($($(el).children("div")[index]).children("select").val());
			    break;
			case "boolean":
			    //If it doesn't have a block inside it, it is false
			    miniParams.push(false);
			    break;
			case "number":
			    //Has to be turned into a float
			    miniParams.push(parseFloat($($(el).children("div")[index]).children("input").val()) | 10);
			    break;
			case "string":
			    //Straight up text
			    miniParams.push($($(el).children("div")[index]).children("input").val());
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
	    $(el).children(".hat,.stack:not(.cstart,.cend,.celse),.cwrap,.reporter,.boolean").each(function(){
		//If it is a stack or hat, just stick it in the array
		if ($(this).hasClass("hat") || $(this).hasClass("stack") || $(this).hasClass("reporter") || $(this).hasClass("boolean")) {
		    var myBlockData = EditorTools.getBlockData($(this).attr("spec"));
		    
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
		    var myBlockData = EditorTools.getBlockData($(this).children(".cstart").attr("spec"));
		    
		    var myTotal = [myBlockData.spec];
		    
		    var myParams = findParameterArray($(this).children(".cstart"));
		    for(var p = 0; p < myParams.length; p++)
		    {
			myTotal.push(myParams[p]);
		    }
		    
		    $(this).children(".cmouth").each(function(){
			myTotal.push(findBlocks($(this)));
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
    
    if (vars['project'] && vars['project'] != "") {
	//load project
	loadProject(vars['project']);
    }else{
	$("#blocks").html("<br /><br /><h3>Please provide a project in ?project=PROJECT_PATH</h3>");
    }
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
	    scratchblocksText += EditorTools.findScratchBlocksFromStack(value[2]) + "\n";
	});
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
    //Dropdown menus
    $.each(params, function(index, value){
	$("#blocks .dropdown:contains('%m." + value.name + "')").each(function(){
	    var mySelf = this;
	    //take out %m.[menuName]
	    var dropDownText = $(mySelf).html().replace('%m.' + value.name, '');
	    //take out the { and }
	    dropDownText = dropDownText.replace(new RegExp('(\\{)',["i"]), '');
	    dropDownText = dropDownText.replace(new RegExp('(\\})',["i"]), '');
	    //Put in the parameter code
	    $(mySelf).html(value.getCode({
		currentObj: currentObj,
		project: project
	    }));
	    $(mySelf).find("option").each(function(){
		if ($(this).val() == dropDownText) {
		    $(this).attr("selected", "true");
		}
	    });
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
	//Specials have a unique block data
	if ($(this).parent().hasClass("cwrap") && $(this).hasClass("cstart")) {
	    if ($(this).parent().children(".stack").length > 2) {
		$(this).parent().children(".stack").not(":first").not(":last").addClass("skip-block-for-conversion");
		$(this).parent().children(".stack").not(":first").not(":last").each(function(){
		    label += "\n" + $(this).justtext();
		});
	    }
	}
	
	if(label != "" && !$(this).hasClass("skip-block-for-conversion")) {
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
	    
	    var blockData = EditorTools.getBlockDataFromScratchblocks(catagory, label);
	    if (blockData.type == undefined) {
		console.error("Block label \"" + label + "\" doesn't have a cooresponding spriteblocks2 >> block data.");
	    }else{
		$(this).attr("spec", blockData.spec);
	    }
	}
    });
    
    //Change all embedded to reporter
    $(".embedded").removeClass("embedded").addClass("reporter");
    
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
    $(".reporter, .boolean:not(.empty)").draggable({
	revert: "invalid",
	helper: "clone",
	start: function(event, ui){
	    $(this).hide();
	    //Hide the new button, Show the garbage bin
	    $("#addNew").hide("fade", 100, function(){
		$("#garbageBin").show("fade", 100).css("opacity", "0.5");
	    });
	    
	    if (!$(this).parent().hasClass("script")) {
		var parentBlockData = EditorTools.getBlockData($(this).parent().attr("spec"));
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
	    $(this).show();
	    $(this).removeAttr("style");
	}
    });
    //Make fields droppable targets for reporters
    function addFieldAcceptors(selec){
	$(selec).droppable({
	    accept: ".reporter, .boolean",
	    greedy: true,
	    over: function(e, ui){
		if (((($(".placeholder").hasClass("string") || $(".placeholder").hasClass("number")) && (ui.draggable.hasClass("reporter")))
		    || ($(".placeholder").hasClass("boolean") && $(ui.draggable).hasClass("boolean")))
		    || ($(ui.draggable).parent().hasClass("script"))) {
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
		//Remove the "dragged-over" class
		$(".dragged-over").removeClass("dragged-over");
		//The block MIGHT have the dragged-over class...
		//If the block was by itself in a script
		var parent = null;
		if (ui.draggable.parent().hasClass("script")) {
		    parent = ui.draggable.parent();
		}
		//Put the block in place of myself
		$(this).replaceWith(ui.draggable);
		//Remove the parent script, if any
		if (parent !== null) {
		    parent.remove();
		}
	    }
	});
    }
    addFieldAcceptors(".number, .string");
    
    //Make the rest of the blocks sortable
    $("#blocks ul").sortable({
	axis: "both",
	placeholder: "block-placeholder",
	items: "li, div:not(.cstart, .cend, .hat, .hat > *, .number, .string, .boolean, .dropdown, .reporter)",
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
	greedy: true,
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


