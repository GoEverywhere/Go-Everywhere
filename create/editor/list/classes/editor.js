//DEPENDANCY: ge.js, tools.js, addons.js blocks.js, params.js
//Provides functions essential for the editor

//Create the editor object
ge.editor = {
    //This holds the current object that we are editing
    currentObj : {}
};
//reloadProject >> Extracts information about the project for editing
ge.editor.reloadProject = function(){
    ge.addons.triggerEvent("ge.editor.reloadProject:before");
    
    //Load stage into selector
    $("#toolbar #spriteSelect select").html("<option name=\"Stage\">Stage</option>");
    //Loop through all the stage's children
    $.each(ge.projectInfo.json.children, function(index, value) {
        //If the object's name isn't defined, it is a watcher (we are looking for sprites)
	if (value.objName !== undefined) {
            //Load the sprite into the selector
	    var tmpSprite = $("#toolbar #spriteSelect select:last-child").append("<option name=\"" + value.objName + "\">" + value.objName + "</option>");
	    if (index == 0) {
		//This is first sprite. This should be loaded first.
		tmpSprite.children(":last").attr("selected", "true");
	    }
	}
    });
    //Sprite Selection Event
    $("#toolbar #spriteSelect select").change(function(){
	//Save the current sprite, then change to the next
	ge.editor.parser.saveCurrentObjectInJSON();
	
	ge.editor.loadCurrentSelectedSprite();
    });
    
    ge.addons.triggerEvent("ge.editor.reloadProject:after");
};
//populatePaletteWithBlocks >> populates the palette with the [blocks] array
ge.editor.populatePaletteWithBlocks = function(extraBlocks){
    ge.addons.triggerEvent("ge.editor.populatePaletteWithBlocks:before");
    
    var processingBlocks = ge.blocks;
    if (extraBlocks !== undefined) {
	processingBlocks = extraBlocks;
    }
    
    $.each(processingBlocks, function(index, value){
	if (value.label !== undefined) {
	    if (value.owner) {
		switch(value.owner.toLowerCase())
		{
		    case "sprite":
			if (ge.editor.currentObj == ge.projectInfo.json) {
			    //This block is only for a sprite, yet we are the stage
			    return true; //continue
			}
			break;
		    case "stage":
			if (ge.editor.currentObj != ge.projectInfo.json) {
			    //This block is only for the Stage, yet we are a sprite
			    return true; //continue
			}
			break;
		    case "all":
		    default:
			//Continue on
			break;
		}
	    }
	    var hasPriority = false;
	    //Create some fake block array
	    var myFakeBlockArray = [value.spec];
	    //If it is a call block (or a variable), the label needs to go next
	    if (value.spec === "call" || value.spec === "readVariable") {
		myFakeBlockArray.push(value.label);
	    }
	    if (value.spec === "readVariable") {
		hasPriority = true;
	    }
	    
	    var tmpCharacters = (typeof value.label !== "string") ? value.label[0].split("") : value.label.split("");
	    $.each(tmpCharacters, function(index, value){
		if (index + 1 < tmpCharacters.length) {
		    if (value === "%") {
			switch(tmpCharacters[index + 1])
			{
			    case "n":
				myFakeBlockArray.push(10);
				break;
			    case "d":
				myFakeBlockArray.push(0);
				break;
			    case "s":
				myFakeBlockArray.push("Hello");
				break;
			    case "b":
				myFakeBlockArray.push(false);
				break;
			    case "c":
				myFakeBlockArray.push(0); //SHOULD BE CHANGED TO A RANDOM NUMBER!!
				break;
			    case "m":
				myFakeBlockArray.push("");
				break;
			}
		    }
		}
	    });
	    //Blank "C" blocks
	    switch(value.type)
	    {
		case "c":
		    myFakeBlockArray.push(null);
		    break;
		case "special":
		    $.each(value.label, function(index, value){
			myFakeBlockArray.push(null);
		    });
		    break;
	    }
	    
	    //Get the code from the fake block data
	    var realGroup = (value.group.toLowerCase() === "variables" || value.group.toLowerCase() === "list") ? "data" : value.group.toLowerCase();
	    $("#palette #" + realGroup).html((hasPriority ? "" : $("#palette #" + realGroup).html()) + "<div class=\"script\">" + ge.editor.parser.findHtmlBlockCodeFromBlockArray(myFakeBlockArray) + "</div>" + (hasPriority ? $("#palette #" + realGroup).html() : ""));
	}
    });
    
    ge.addons.triggerEvent("ge.editor.populatePaletteWithBlocks:after");
};
//loadCurrentSelectedSprite >> Loads everything needed for editing current slected sprite (according to #spriteSelect DOM object)
ge.editor.loadCurrentSelectedSprite = function(){
    ge.addons.triggerEvent("ge.editor.loadCurrentSelectedSprite:before");
    
    /** We'll need to wait **/
    $("#waiting").show();
    
    //Add custom blocks and variables to the block palette
    var blockCode = "";
    
    if ($("#toolbar #spriteSelect select").val() == ge.projectInfo.json.objName) {
	ge.editor.currentObj = ge.projectInfo.json;
    }else{
	for(var spriteI = 0; spriteI < ge.projectInfo.json.children.length; spriteI++)
	{
	    if ($("#toolbar #spriteSelect select").val() == ge.projectInfo.json.children[spriteI].objName) {
		ge.editor.currentObj = ge.projectInfo.json.children[spriteI];
	    }
	}
    }
    if (ge.editor.currentObj.scripts) {
	$.each(ge.editor.currentObj.scripts, function(index, value){
	    blockCode += "<div class=\"script\">\n";
	    blockCode += ge.editor.parser.findHtmlBlockCodeFromStack(value[2]);
	    blockCode += "</div>\n";
	});
    }
    
    $("#blocks").html("<div class=\"sb2\">" + blockCode + "</div>");
    if (blockCode === "") {
	$("#blocks .sb2").height($(window).height()).css("overflow", "visible");
    }
    
    //Add blocks to the palette (all that have a defined label, at least)
    $("#palette .blockPalette").children(":not(input)").remove();
    ge.editor.populatePaletteWithBlocks();
    //Find all the define hats for this sprite, and add blocks accordingly
    var totalCustomBlockArrays = [];
    $("#blocks .define-hat").each(function(){
	totalCustomBlockArrays.push({
	    type: "call",
	    spec: "call",
	    label: $(this).attr("label"),
	    group: "Custom"
	});
    });
    //Find all the variables for this sprite, and add blocks accordingly
    if (ge.projectInfo.json.variables) {
	$.each(ge.projectInfo.json.variables, function(index, value){
	    totalCustomBlockArrays.push({
		type: "readVariable",
		spec: "readVariable",
		label: value.name,
		group: "Variables"
	    });
	});
    }
    if (ge.editor.currentObj.variables && ge.editor.currentObj.name !== "Stage") {
	$.each(ge.editor.currentObj.variables, function(index, value){
	    totalCustomBlockArrays.push({
		type: "readVariable",
		spec: "readVariable",
		label: value.name,
		group: "Variables"
	    });
	});
    }
    ge.editor.populatePaletteWithBlocks(totalCustomBlockArrays);
    
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
    //Make scripts sortable
    var makeScriptSortable = function(el){
	$(el).sortable({
	    items: ".script",
	    handle: ":first",
	    placeholder: "block-placeholder",
	    start: function(e, ui){
		$(".block-placeholder").css("height", $(ui.helper).height());
	    }
	});
    };
    makeScriptSortable($("#blocks .sb2"));
    
    //Make hats draggable
    var makeHatDraggable = function(el){
	return $(el).draggable({
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
	    },
	    zIndex: 1000
	});
    };
    //makeHatDraggable($("#blocks .script").children(".hat, .define-hat"));
    //Make input blocks draggable
    function makeReporterDraggable(selec){
	return $(selec).draggable({
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
		    var parentBlockData = ge.Tools.getBlockData($(this).parent().attr("spec"));
		    
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
    makeReporterDraggable($("#blocks").find(".reporter:not(.template), .boolean:not(.empty,.template)"));
    
    //Make fields droppable targets for reporters
    function addFieldAcceptors(selec){
	return $(selec).droppable({
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
		//If the block was by itself in a script, but if it was a template it needs to stay
		var parent = null;
		if (ui.draggable.parent().hasClass("script") && !ui.draggable.hasClass("template")) {
		    parent = ui.draggable.parent();
		}
		//Show the draggable
		ui.draggable.removeAttr("style");
		//Put the block in place of myself, but not if it is a template. If a template, clone it.
		if (ui.draggable.hasClass("template")) {
		    $(this).replaceWith(makeReporterDraggable(ui.draggable.clone()));
		}else{
		    $(this).replaceWith(ui.draggable);
		}
		//Remove the parent script, if any
		if (parent !== null) {
		    parent.remove();
		}
	    }
	});
    }
    addFieldAcceptors($("#blocks").find(".number, .string, .empty"));
    
    //Make the rest of the blocks sortable
    var makeStacksSortable = function(el){
	return $(el).sortable({
	    axis: "both",
	    placeholder: "block-placeholder",
	    items: "li, div:not(.cstart, .cend, .hat, .hat > *, .define-hat, .define-hat * .number, .string, .boolean, .dropdown, .reporter, .outline)",
	    connectWith: "#blocks ul,.sb2",
	    start: function(event, ui){
		$(".block-placeholder").css("height", $(ui.helper).height());
		//Hide the new button, Show the garbage bin
		$("#addNew").hide("fade", 100, function(){
		    $("#garbageBin").show("fade", 100).css("opacity", "0.5");
		});
	    },
	    change: function(event, ui){
		//Add a placeholder in the C-mouths to place a block inside
		$("#blocks .cmouth").each(function(){
		    if ($(this).children().not(".ui-sortable-helper").length == 0) {
			$(this).prepend("<div class=\"cplaceholder stack\"></li>");
			//makeStacksSortable(this);
		    }
		});
	    },
	    stop: function(event, ui){
		//Hide the garbage bin, Show the new button
		$("#garbageBin").hide("fade", 100, function(){
		    $("#addNew").show("fade", 100);
		});
		//Remove any placeholders that we had in cmouths
		$("#blocks .cplaceholder").remove();
	    }
	});
    }
    makeStacksSortable("#blocks ul");
    
    //BLOCK PALETTE TEMPLATING!!!!!
    $("#palette .blockPalette > div").children().addClass("template").draggable({
	connectToSortable: "#blocks ul,.sb2",
	revert: "invalid",
	revertDuration: 0,
	helper: "clone",
	zIndex: 1000,
	start: function(e, ui){
	    ui.helper.css({
		"white-space": "nowrap"
	    });
	    
	    $(".blockPalette").add("#palette").css("overflow", "visible");
	    $("#palette").css({
		"left": (-($("#palette").width() + 50)) + "px"
	    });
	},
	stop: function(e, ui){
	    ge.setCatsUp(function(){
		$(".blockPalette").css("overflow", "scroll");
		$("#palette").css({
		    "overflow": "hidden",
		    "left": "0px"
		});
		$("#blocks .template").removeClass("template").removeClass("ui-draggable");
	    });
	}
    }).filter(".reporter, .boolean,.hat").draggable("option", "connectToSortable", false);
    //Custom-param templating
    $("#blocks .define-hat .custom-arg").draggable({
	revert: "invalid",
	helper: "clone",
	zIndex: 1000,
	start: function(e, ui){
	    ui.helper.css({
		"white-space": "nowrap"
	    });
	},
	stop: function(e, ui){
	    $("#blocks .template").removeClass("ui-draggable");
	}
    });
    //Templatable hat blocks (should support positioning in the future)
    $("#blocks").droppable({
	accept: ".hat.template",
	tolerance: "pointer",
	drop: function(e, ui){
	    $("#blocks .sb2").prepend("<ul class=\"script\"><div id=\"hatTemplatePlaceholder\"></div></ul>");
	    $("#blocks .sb2 #hatTemplatePlaceholder").replaceWith(ui.draggable.clone()).removeClass("template");
	    makeHatDraggable($("#blocks .script").children(".hat, .define-hat"));
	    makeStacksSortable("#blocks ul");
	}
    });
    
    //PARAMETER CHANGE EVENTS!!!!!!
    $("#blocks input[type=text]").bind("load ready keypress", function(){
	$(this).attr("size", $(this).val().length);
    });
    $("#blocks input[type=text][pattern]").keyup(function(){
	$(this).val($(this).val().replace(new RegExp(/([^0-9.\-])/g), ""));
    });
    
    //NUMBER-DROPDOWN STYLE!!!!!!
    $("#blocks .number-dropdown").children("select").add(".blockPalette .number-dropdown select").css({
	"overflow": "hidden",
	"width": "18px",
	"margin-left": "2px",
	"margin-right": "2px",
	"background": "transparent",
	"color": "black"
    }).change(function(){
	$(this).prev().val($(this).val());
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
    
    /** We're done here **/
    $("#waiting").hide();
    
    ge.addons.triggerEvent("ge.editor.loadCurrentSelectedSprite:after");
};

/***PROJECT PARSER***/
//Holds functions needed to convert scripts in the project JSON into HTML, and vice-verca
ge.editor.parser = function(){
};
//findHtmlBlockCodeFromStack >> returns HTML code mixed with scratchblocks2 css from a array containing a stack of blocks from a project JSON
ge.editor.parser.findHtmlBlockCodeFromStack = function(stackArray) {
    ge.addons.triggerEvent("ge.editor.parser.findHtmlBlockCodeFromStack:before");
    
    //Hold the block code that we will collect
    var totalStackCode = "";
    
    //Loop through the array of the stack of blocks
    $.each(stackArray, function(index, value){
        //For each block in the stack, find the code for it
        totalStackCode += ge.editor.parser.findHtmlBlockCodeFromBlockArray(value);
    });
    
    ge.addons.triggerEvent("ge.editor.parser.findHtmlBlockCodeFromStack:after");
    
    //Return the code in the stack
    return totalStackCode;
};
//findHtmlBlockCodeFromBlockArray >> returns HTML code mixed with scratchblocks2 css from a array of a single block from a project JSOn
ge.editor.parser.findHtmlBlockCodeFromBlockArray = function(singleBlockArray) {
    ge.addons.triggerEvent("ge.editor.parser.findHtmlBlockCodeFromBlockArray:before");
    
    //Hold the block code that we will collect
    var myBlockCode = "";
    //Store the block's data (first item in any block is it's label, except custom blocks?);
    var myBlockData = ge.Tools.getBlockData(singleBlockArray[0]);
    //A block must have a type!!!
    if (myBlockData.type == undefined) {
        console.error("Block with spec: " + singleBlockArray[0] + " doesn't have any block data!");
    }
    //Switch the type of it
    switch(myBlockData.type)
    {
        case "hat":
            //A hat block is as follows:
            //The first item in the blockArray is the label.
            //Then, come the parameters.
            myBlockCode += "<div class=\"hat " + myBlockData.group.toLowerCase() + "\" spec=\"" + myBlockData.spec + "\">";
                myBlockCode += ge.editor.parser.replaceLabelWithHtmlParameterCode(myBlockData, singleBlockArray);
            myBlockCode += "</div>";
            break;
        case "define":
            //The define block. Is like a hat block, except has a block inside it as well.
            myBlockCode += "<div class=\"define-hat " + myBlockData.group.toLowerCase() + "\" spec=\"" + myBlockData.spec + "\" label=\"" + singleBlockArray[1] + "\" varnames=\"" + singleBlockArray[2] + "\" defaults=\"" + singleBlockArray[3] + "\" atomic=\"" + (singleBlockArray.length == 5 && singleBlockArray[4]) + "\">";
                //Replace the parameters in the custom label with custom argument variables
                var tmpCharacters = singleBlockArray[1].split("");
                var parameterOffset = 0;
                $.each(tmpCharacters, function(index, value){
                    if (index + 1 < tmpCharacters.length) {
                        if (value == "%") {
                            switch(tmpCharacters[index + 1])
                            {
                                //A round (reporter) custom-arg
                                case "n":
                                case "s":
                                    tmpCharacters.splice(index + 1, 1);
                                    tmpCharacters[index] = "<div class=\"reporter custom-arg template\">" + singleBlockArray[2][parameterOffset] + "</div>";
                                    parameterOffset++;
                                    break;
                                //A boolean (predicate diamond) custom-arg
                                case "b":
                                    tmpCharacters.splice(index + 1, 1);
                                    tmpCharacters[index] = "<div class=\"boolean custom-arg template\">" + singleBlockArray[2][parameterOffset] + "</div>";
                                    parameterOffset++;
                                    break;
                            }
                        }
                    }
                });
                //Put it back together
                var myCustomBlockLabel = "";
                $.each(tmpCharacters, function(index, value){
                    myCustomBlockLabel += value;
                });
                //Stick it in the define block
                myBlockCode += "<div class=\"outline\">";
                myBlockCode += myCustomBlockLabel;
                myBlockCode += "</div>";
            myBlockCode += "</div>";
            break;
        case "call":
            //A call block is a special stack block.
            //The only difference is that the parameters are
            //offset by 1 in the block array from the JSON.
            myBlockCode += "<div class=\"stack " + myBlockData.group.toLowerCase() + "\" spec=\"" + myBlockData.spec + "\" label=\"" + singleBlockArray[1] + "\">";
                //Since this block is made up on the spot, we need to make some fake block data
                var myFakeBlockData = {
                    type: "call",
                    label: singleBlockArray[1],
                    group: "Custom"
                };
                myBlockCode += ge.editor.parser.replaceLabelWithHtmlParameterCode(myFakeBlockData, singleBlockArray);
            myBlockCode += "</div>";
            break;
        case "command":
        case "stack":
            //A stack block is as follows:
            //The first item in the blockArray is the label.
            //Then, come the parameters.
            myBlockCode += "<div class=\"stack " + myBlockData.group.toLowerCase() + (myBlockData.cap ? " cap" : "") + "\" spec=\"" + myBlockData.spec + "\">";
                myBlockCode += ge.editor.parser.replaceLabelWithHtmlParameterCode(myBlockData, singleBlockArray);
            myBlockCode += "</div>";
            break;
        case "c":
            //A normal C-shape is as follows:
            //The first item in the blockArray is the label.
            //Then, come the parameters.
            //After parameters (parameter-offset) is a stack of blocks inside the C-shape.
            myBlockCode += "<div class=\"cwrap " + (myBlockData.cap ? " cap" : "") + "\">";
                //the top of the c-shape (the label)
                myBlockCode += "<div class=\"stack cstart " + myBlockData.group.toLowerCase() + "\" spec=\"" + myBlockData.spec + "\">";
                    myBlockCode += ge.editor.parser.replaceLabelWithHtmlParameterCode(myBlockData, singleBlockArray);
                myBlockCode += "</div>";
                
                //Count the parameters:
                var myParamCount = 0;
                var tmpCharacters = myBlockData.label.split("");
                $.each(tmpCharacters, function(index, value){
                    if (index + 1 < tmpCharacters.length) {
                        if (value === "%") {
                            switch(tmpCharacters[index + 1])
                            {
                                case "b": //boolean
                                case "c": //color
                                case "d": //number-dropdown
                                case "m": //dropdown
                                case "n": //number
                                case "s": //string
                                    myParamCount++;
                                    break;
                            }
                        }
                    }
                });
                
                //The mouth of the C-shape (holds the blocks)
                myBlockCode += "<div class=\"cmouth " + myBlockData.group.toLowerCase() + "\">";
                    if (singleBlockArray[1 + myParamCount] !== null) {
                        //Loop through the mini-stack
                        myBlockCode += ge.editor.parser.findHtmlBlockCodeFromStack(singleBlockArray[1 + myParamCount]);
                    }
                myBlockCode += "</div>";
                
                //The end of the C-shape (maybe a cap?)
                myBlockCode += "<div class=\"stack cend " + myBlockData.group.toLowerCase() + "\"></div>";
            
            myBlockCode += "</div>";
            break;
        case "special":
            //This is a special block.
            //It is basically a C-block, but has more than one mouth.
            
            //A special block is as follows:
            //The first item in the blockArray is an array of labels.
            //Then, come parameters. Parameters are only supported in the first label so far.
            //Then, come the blocks. For every mouth, there are a stack of blocks, or null if no blocks.
            myBlockCode += "<div class=\"cwrap" + (myBlockData.cap ? " cap" : "") + "\">";
                //The start of the special (the label)
                myBlockCode += "<div class=\"stack cstart " + myBlockData.group.toLowerCase() + "\" spec=\"" + myBlockData.spec + "\">";
                    myBlockCode += ge.editor.parser.replaceLabelWithHtmlParameterCode(myBlockData, singleBlockArray);
                myBlockCode += "</div>";
                
                //Count the parameters:
                var myParamCount = 0;
                var tmpCharacters = myBlockData.label[0].split("");
                $.each(tmpCharacters, function(index, value){
                    if (index + 1 < tmpCharacters.length) {
                        if (value === "%") {
                            switch(tmpCharacters[index + 1])
                            {
                                case "b": //boolean
                                case "c": //color
                                case "d": //number-dropdowm
                                case "m": //menu
                                case "n": //number
                                case "s": //string
                                    myParamCount++;
                                    break;
                            }
                        }
                    }
                });
                
                $.each(myBlockData.label, function(index, value){
                    if (index != 0) {
                        myBlockCode += "<div class=\"stack celse " + myBlockData.group.toLowerCase() + "\">" + value + "</div>";
                    }
                    //If the parameter-offset is null, that means that
                    //there are no blocks in the C-shape.
                    myBlockCode += "<div class=\"cmouth " + myBlockData.group.toLowerCase() + "\">";
                    if (singleBlockArray[1 + myParamCount] !== null) {
                        //Loop through the mini-stack
                        myBlockCode += ge.editor.parser.findScratchBlocksFromStack(singleBlockArray[1 + (index) + myParamCount]);
                    }
                    myBlockCode += "</div>";
                });
                //The end of the special (maybe a cap?)
                myBlockCode += "<div class=\"stack cend " + myBlockData.group.toLowerCase() + "\"></div>";
            
            myBlockCode += "</div>";
            break;
        case "reporter":
        case "boolean":
            //A reporter/boolean is as follows:
            //The first item in the blockArray is the label.
            //Then, come the parameters.
            myBlockCode += "<div class=\"" + myBlockData.type.toLowerCase() + " " + myBlockData.group.toLowerCase() + "\" spec=\"" + myBlockData.spec + "\">";
                myBlockCode += ge.editor.parser.replaceLabelWithHtmlParameterCode(myBlockData, singleBlockArray);
            myBlockCode += "</div>";
            break;
        case "getParam":
            //This is like a variable,
            //but is purple.
            switch(singleBlockArray[2])
            {
                case "r": //round (reporter) custom-arg
                    myBlockCode += "<div class=\"reporter custom-arg\" spec=\"" + myBlockData.spec + "\" label=\"" + singleBlockArray[1] + "\" type=\"" + singleBlockArray[2] + "\">";
                    break;
                case "b": //boolean (predicate diamond) custom-arg
                    myBlockCode += "<div class=\"boolean custom-arg\" spec=\"" + myBlockData.spec + "\" label=\"" + singleBlockArray[1] + "\" type=\"" + singleBlockArray[2] + "\">";
                    break;
            }
                myBlockCode += singleBlockArray[1];
            myBlockCode += "</div>";
            break;
        case "readVariable":
            //This is like a "getParam",
            //just doesn't have the extra selector.
            myBlockCode += "<div class=\"reporter " + myBlockData.group.toLowerCase() + "\" spec=\"" + myBlockData.spec + "\" label=\"" + singleBlockArray[1] + "\">";
                myBlockCode += singleBlockArray[1];
            myBlockCode += "</div>";
            break;
        
    }
    
    ge.addons.triggerEvent("ge.editor.parser.findHtmlBlockCodeFromBlockArray:after");
    
    //Return the block code that we have collected
    return myBlockCode;
};
//replaceLabelWithHtmlParameterCode >> Replaces block label with parameters set to info in block array given with HTML code for rendering
ge.editor.parser.replaceLabelWithHtmlParameterCode = function(blockData, blockArray) {
    ge.addons.triggerEvent("ge.editor.parser.replaceLabelWithHtmlParameterCode:before");
    
    if (blockData.type == "special") {
        //Hold the block code that we will collect
        var myBlockCode = blockData.label[0];
    }else{
        //Hold the block code that we will collect
        var myBlockCode = blockData.label;
    }
    var arrayOffset = 1;
    if (blockData.type == "call") {
        //There is an extra offset to where the parameters are called
        arrayOffset = 2;
    }

    //Loop through every character in the label
    var tmpCharacters = myBlockCode.split("");
    var parameterOffset = 0;
    $.each(tmpCharacters, function(index, value){
        //Make sure we don't get overpass the length of the array
        if (index + 1 < tmpCharacters.length) {
            //The '%' usually marks the start of a parameter
            if (value == "%") {
                switch(tmpCharacters[index + 1])
                {
                    case "n": //number parameter
                        tmpCharacters.splice(index + 1, 1);
                        
                        if (typeof blockArray[parameterOffset + arrayOffset] !== "object") {
                            //Number
                            tmpCharacters[index] = "<div class=\"number\"><input type=\"text\" pattern=\"([^(0-9.\-)])\" size=\"4\" style=\"font-size: 10px;height: 13px;padding: 0;border: none;\" value=\"" + blockArray[parameterOffset + arrayOffset] + "\" /></div>";
                        }else{
                            //Must be a block inside of me
                            tmpCharacters[index] = ge.editor.parser.findHtmlBlockCodeFromBlockArray(blockArray[parameterOffset + arrayOffset]);
                        }
                        parameterOffset++;
                        break;
                    case "s": //string parameter
                        tmpCharacters.splice(index + 1, 1);
                        
                        if (typeof blockArray[parameterOffset + arrayOffset] !== "object") {
                            //String
                            tmpCharacters[index] = "<div class=\"string\"><input type=\"text\" size=\"4\" style=\"font-size: 10px;height:13px; padding: 0; border: none;\" value=\"" + blockArray[parameterOffset + arrayOffset] + "\" /></div>";
                        }else{
                            //Must be a block inside of me
                            tmpCharacters[index] = ge.editor.parser.findHtmlBlockCodeFromBlockArray(blockArray[parameterOffset + arrayOffset]);
                        }
                        parameterOffset++;
                        break;
                    case "b": //boolean parameter
                        tmpCharacters.splice(index + 1, 1);
                        
                        if (blockArray[parameterOffset + arrayOffset] === false) {
                            //Empty
                            tmpCharacters[index] = "<div class=\"boolean empty\"></div>";
                        }else{
                            //Find the block inside of me
                            tmpCharacters[index] = ge.editor.parser.findHtmlBlockCodeFromBlockArray(blockArray[parameterOffset + arrayOffset]);
                        }
                        parameterOffset++;
                        break;
                    case "c": //color parameter
                        tmpCharacters.splice(index + 1, 1);
                        
                        if (typeof blockArray[parameterOffset + arrayOffset] !== "object") {
                            //Color
                            var a = blockArray[parameterOffset + arrayOffset] >> 24 & 0xFF; //"a" value is unused
                            var r = blockArray[parameterOffset + arrayOffset] >> 16 & 0xFF;
                            var g = blockArray[parameterOffset + arrayOffset] >> 8 & 0xFF;
                            var b = blockArray[parameterOffset + arrayOffset] & 0xFF;
                            
                            tmpCharacters[index] = "<div class=\"color\" style=\"background-color: rgb(" + r + ", " + g + ", " + b + ");\"> </div>";
                        }else{
                            //Must be a block inside of me
                            tmpCharacters[index] = ge.editor.parser.findHtmlBlockCodeFromBlockArray(blockArray[parameterOffset + arrayOffset]);
                        }
                        
                        parameterOffset++;
                        break;
                    case "m": //dropdown menu parameter
                        tmpCharacters.splice(index + 1, 2);
                        var lengthToSplice = 0;
                        //We need to make sure we splice the whole parameter statement
                        var menuName = "";
                        for(var myI = index + 1; myI < tmpCharacters.length; myI++)
                        {
                            //If we reach a space, then we have reached the end
                            if (tmpCharacters[myI] === " ") {
                                break;
                            }
                            lengthToSplice++;
                            menuName += tmpCharacters[myI];
                        }
                        tmpCharacters.splice(index + 1, lengthToSplice);
                        
                        //Get the parameter code for our menu
                        var tmpMenuCode = "";
                        $.each(ge.params, function(index, value){
                            if (value.name == menuName) {
                                tmpMenuCode = value.getCode();
                                //break
                                return false;
                            }
                        });
                        //Set the parameter to the value that the block array has
                        tmpMenuCode = tmpMenuCode.replace("value=\"" + blockArray[parameterOffset + arrayOffset] + "\"", "selected=\"true\" value=\"" + blockArray[parameterOffset + arrayOffset] + "\"");
                        
                        //Add it to the label
                        tmpCharacters[index] = "<div class=\"dropdown\">" + tmpMenuCode + "</div>";
                        
                        parameterOffset++;
                        break;
                    case "d": //number-dropdown menu combo parameter
                        tmpCharacters.splice(index + 1, 2);
                        var lengthToSplice = 0;
                        //We need to make sure we splice the whole parameter statement
                        var menuName = "";
                        for(var myI = index + 1; myI < tmpCharacters.length; myI++)
                        {
                            //If we reach a space, then we have reached the end
                            if (tmpCharacters[myI] === " ") {
                                break;
                            }
                            lengthToSplice++;
                            menuName += tmpCharacters[myI];
                        }
                        tmpCharacters.splice(index + 1, lengthToSplice);
                        
                        //Get the parameter code for our menu
                        var tmpMenuCode = "";
                        $.each(ge.params, function(index, value){
                            if (value.name == menuName) {
                                tmpMenuCode = value.getCode();
                                //break
                                return false;
                            }
                        });
                        
                        if (typeof blockArray[parameterOffset + arrayOffset] !== "object") {
                            //Number-dropdown
                            tmpCharacters[index] = "<div class=\"number-dropdown\"><input type=\"text\" pattern=\"([^(0-9.\-)])\" size=\"4\" style=\"font-size: 10px;height: 13px;padding: 0;border: none;\" value=\"" + blockArray[parameterOffset + arrayOffset] + "\" />" + tmpMenuCode + "</div>";
                        }else{
                            //Must be a block inside of me
                            tmpCharacters[index] = ge.editor.parser.findHtmlBlockCodeFromBlockArray(blockArray[parameterOffset + arrayOffset]);
                        }
                        
                        parameterOffset++;
                        break;
                }
            }
        }
    });
    //Put the text back together
    myBlockCode = "";
    $.each(tmpCharacters, function(index, value){
        myBlockCode += value;
    });

    ge.addons.triggerEvent("ge.editor.parser.replaceLabelWithHtmlParameterCode:after");
    
    //Return the new block label (after replacing block label image)
    return ((myBlockCode.replace("@greenFlag", "<span class=\"green-flag\"></span>")).replace("@turnRight", "<span class=\"arrow-cw\"></span>")).replace("@turnLeft", "<span class=\"arrow-ccw\"></span>");
};
//saveCurrentObjectInJSON >> converts scripts in the current selected object to JSON and saves them in the main project.json
ge.editor.parser.saveCurrentObjectInJSON = function(){
    ge.addons.triggerEvent("ge.editor.parser.saveCurrentObjectInJSON:before");
    
    /**This may take a while...**/
    $("#waiting").show();
    
    var objName = ge.editor.currentObj.objName;
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
	    var myBlockData = ge.Tools.getBlockData($(el).attr("spec"));
		
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
		    var myBlockData = ge.Tools.getBlockData($(this).attr("spec"));
		    
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
		    var myBlockData = ge.Tools.getBlockData($(this).children(".cstart").attr("spec"));
		    
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
    if (scripts.length === 0) {
	return ge.editor.currentObj;
    }
    /**We're done here**/
    $("#waiting").hide();
    $.extend(ge.editor.currentObj, {
	objName: objName,
	scripts: scripts
    });
    
    ge.addons.triggerEvent("ge.editor.parser.saveCurrentObjectInJSON:after");
};