var EditorTools = {
    getBlockData : function(spec) {
        for (var i = 0; i < blocks.length; i++) {
            if (blocks[i].spec == spec) {
                return blocks[i];
            }
        }
        
        return {
            type: undefined,
            spec: spec,
            renderLabel: spec,
            scratchblocks: undefined,
            parameters: undefined,
            group: "Obsolete"
        };
    },
    getBlockDataFromScratchblocks : function(cat, label)
    {
        var rightBlock = this.getBlockData("");
        $.each(blocks, function(index, currentBlock){
            if (currentBlock.group == undefined) {
                console.warn("Warning: label: \"" + label + "\" has something wrong");
            }
            if (currentBlock.group.toLowerCase() == cat && currentBlock.renderLabel == label) {
                rightBlock = currentBlock;
                return false;
            }
        });
        return rightBlock;
    },
    /********************************************************************************************************************/
    findScratchBlocksFromStack: function(stackArray) {
	var totalStackText = "";
	
	$.each(stackArray, function(index, value){
	    totalStackText += EditorTools.findScratchBlocksFromBlockArray(value);
	});
	
	return totalStackText;
    },
    findScratchBlocksFromBlockArray: function(singleBlockArray) {
	var myScratchBlocks = "";
	//Store the block's data (first item in any block is it's label, except custom blocks?);
	var myBlockData = this.getBlockData(singleBlockArray[0]);
	if (myBlockData.type == undefined) {
	    console.error("Block with spec: " + myBlockData.spec + " doesn't have any block data!");
	}
	//Switch the type of it
	switch(myBlockData.type)
	{
	    case "hat":
		//A hat block is as follows:
		//The first item in the blockArray is the label.
		//Then, come the parameters.
		myScratchBlocks += this.replaceTextWithParameters(myBlockData, singleBlockArray) + "\n";
		break;
	    case "command":
	    case "stack":
		//A stack block is as follows:
		//The first item in the blockArray is the label.
		//Then, come the parameters.
		myScratchBlocks += this.replaceTextWithParameters(myBlockData, singleBlockArray) + "\n";
		break;
	    case "c":
		//A normal C-shape is as follows:
		//The first item in the blockArray is the label.
		//Then, come the parameters.
		//After parameters (parameter-offset) is a stack of blocks inside the C-shape.
		myScratchBlocks += this.replaceTextWithParameters(myBlockData, singleBlockArray) + "\n";
		//If the parameter-offset is null, that means that
		//there are no blocks in the C-shape.
		if (singleBlockArray[1 + myBlockData.parameters.length] !== null) {
		    //Loop through the mini-stack
		    myScratchBlocks += EditorTools.findScratchBlocksFromStack(singleBlockArray[1 + myBlockData.parameters.length]);
		}
		myScratchBlocks += "end\n";
		break;
	    case "special":
		//This is a special block.
		//It is basically a C-block, but has more than one mouth.
		
		//A special block is as follows:
		//The first item in the blockArray is an array of labels.
		//Then, come parameters. Parameters are only supported in the first label so far.
		//Then, come the blocks. For every mouth, there are a stack of blocks, or null if no blocks.
		myScratchBlocks += this.replaceTextWithParameters(myBlockData, singleBlockArray) + "\n";
		//Loop through all the other mouths
		$.each(myBlockData.scratchblocks, function(index, value){
		    if (index != 0) {
			myScratchBlocks += value + "\n";
		    }
		    //If the parameter-offset is null, that means that
		    //there are no blocks in the C-shape.
		    if (singleBlockArray[1 + myBlockData.parameters.length] !== null) {
		        //Loop through the mini-stack
		        myScratchBlocks += EditorTools.findScratchBlocksFromStack(singleBlockArray[1 + (index) + myBlockData.parameters.length]);
		    }
		});
		myScratchBlocks += "end\n";
		break;
	    case "reporter":
	    case "boolean":
		//A reporter/boolean is as follows:
		//The first item in the blockArray is the label.
		//Then, come the parameters.
		myScratchBlocks += this.replaceTextWithParameters(myBlockData, singleBlockArray);
		break;
	    
	}
	return myScratchBlocks;
    },
    replaceTextWithParameters: function(blockData, blockArray) {
	if (blockData.type == "special") {
	    var myScratchBlocks = blockData.scratchblocks[0];
	}else{
	    var myScratchBlocks = blockData.scratchblocks;
	}
	$.each(blockData.parameters, function(index, value){
	    if (EditorTools.getBlockData(blockArray[1 + index][0]).type === undefined) {
		if (blockArray[1 + index] === false) {
		    //A blank boolean. Just remove the $[i]
		    myScratchBlocks = myScratchBlocks.replace("$" + (index + 1), "");
		}else{
		    //Just the default value. Replace the $i's with their parameter value.
		    myScratchBlocks = myScratchBlocks.replace("$" + (index + 1), blockArray[1 + index]);
		}
	    }else{
		//That's a block in there!
		myScratchBlocks = myScratchBlocks.replace(new RegExp('((\\<|\\[|\\()\\$' + (index + 1) + '(\\)|\\]|\\>))',["i"]), EditorTools.logAndReturn(EditorTools.findScratchBlocksFromBlockArray(blockArray[1 + index])));
	    }
	});
	return myScratchBlocks;
    },
    /********************************************************************************************************************/
    getParameterCode : function(type, project) {
        //return HTML for the parameter type
        switch (type) {
            case "key": //%k
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
            case "object": //%o
                var paramToReturn = "<select>\n" +
                        "<option name=\"mouse-pointer\">mouse-pointer</option>\n";
                    $("#toolbar #spriteSelect select option:not([name='Stage'],:selected)").each(function(){
                        paramToReturn += "<option name=\"" + $(this).attr("name") + "\">" + $(this).attr("name") + "</option>\n";
                    });
                    paramToReturn += "</select>\n";
                return paramToReturn;
                break;
            case "math": //%m
                return "<select>\n" +
                        "<option value=\"abs\">abs</option>\n" +
                        "<option value=\"floor\">floor</option>\n" +
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
            case "backdrops": //%b
                var myTotalSelector = "<select>\n";
                $.each(project.costumes, function(index, value){
                    myTotalSelector += "<option value=\"" + value.costumeName + "\">" + value.costumeName + "</option>\n";
                });
                myTotalSelector += "</select>\n";
                return myTotalSelector;
                break;
            case "sensor": //%s
                return "<select>\n" +
                        "<option value=\"loudness\">loudness</option>\n" +
                        "<option value=\"timer\">timer</option>\n" +
                        "<option value=\"video motion\">video motion</option>\n" +
                        "</select>\n";
                break;
            case "broadcast": //%r
                var myTotalSelector = "<select>\n";
                $.each(broadcasts, function(index, value){
                    myTotalSelector += "<option value=\"" + value + "\">" + value + "</option>\n";
                });
                myTotalSelector += "<option value=\"message1\">message1</option>\n";
                myTotalSelector += "</select>\n";
                return myTotalSelector;
                break;
            case "stopScripts": //%a
                return "<select>\n" +
                        "<option value=\"all\">all</option>\n" +
                        "<option value=\"this script\">this script</option>\n" +
                        "<option value=\"other scripts in sprite\">other scripts in sprite</option>\n" +
                        "</select>\n";
                break;
            case "sprites": //%p
                var paramToReturn = "<select>\n" +
                        "<option name=\"myself\">myself</option>\n";
                    $("#toolbar #spriteSelect select option:not([name='Stage'])").each(function(){
                        paramToReturn += "<option name=\"" + $(this).attr("name") + "\">" + $(this).attr("name") + "</option>\n";
                    });
                    paramToReturn += "</select>\n";
                return paramToReturn;
                break;
        }
        return "";
    },
    /********************************************************************************************************************/
    logAndReturn: function(obj)
    {
        console.log(obj);
        return obj;
    }
}