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
	
	return totalStackText + "\n";
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
            case "define":
                //This block is special. It is the define block, which is as follows:
                //The first item is the block spec: always "procDef"
                //The second item is the spec (following http://goo.gl/mjFG1s).
                //Currently, only %n, %b, and %s are supported (number, boolean, and string)
                //The third item is going to hold an array, naming each of the inputs.
                //The inputs will need to be changed accordingly, then set the their names.
                myScratchBlocks += "define ";
                var myCustomBlockSpec = singleBlockArray[1];
                var myCustomBlockSpecArray = myCustomBlockSpec.split('');
                var myParameterIndex = 0;
                $.each(myCustomBlockSpecArray, function(index, value){
                    if (index + 1 < myCustomBlockSpecArray.length) {
                        if (value == "%") {
                            switch(myCustomBlockSpecArray[index + 1]){
                                case "n":
                                case "s":
                                    myCustomBlockSpecArray.splice(index + 1, 1);
                                    myCustomBlockSpecArray[index] = "( $" + myParameterIndex + " )";
                                    break;
                                case "b":
                                    myCustomBlockSpecArray.splice(index + 1, 1);
                                    myCustomBlockSpecArray[index] = "< $" + myParameterIndex + " >";
                                    break;
                            }
                            myParameterIndex++;
                        }
                    }
                });
                //Stick it all back together
                myCustomBlockSpec = "";
                $.each(myCustomBlockSpecArray, function(index, value){
                    myCustomBlockSpec += value;
                });
                //Loop through parameter names, and
                //replace $[index] with the parameter name
                $.each(singleBlockArray[2], function(index, value){
                    myCustomBlockSpec = myCustomBlockSpec.replace("$" + index, value);
                });
                myScratchBlocks += myCustomBlockSpec + "\n";
                
                break;
            case "call":
                //A call block is a special stack.
                //It is a custom block, with a corresponding "define" block.
                //Since it is special, we need to make a fake block data for the parameter parser.
                var myCustomBlockSpec = singleBlockArray[1];
                var myCustomBlockSpecArray = myCustomBlockSpec.split('');
                var myParameterOffset = 1;
                var myParameterData = [];
                $.each(myCustomBlockSpecArray, function(index, value){
                    if (index + 1 < myCustomBlockSpecArray.length) {
                        if (value == "%") {
                            switch(myCustomBlockSpecArray[index + 1]){
                                case "n":
                                    myCustomBlockSpecArray.splice(index + 1, 1);
                                    myCustomBlockSpecArray[index] = "($" + myParameterOffset + ")";
                                    myParameterData.push("number");
                                    break;
                                case "b":
                                    myCustomBlockSpecArray.splice(index + 1, 1);
                                    myCustomBlockSpecArray[index] = "<$" + myParameterOffset + ">";
                                    myParameterData.push("boolean");
                                    break;
                                case "s":
                                    myCustomBlockSpecArray.splice(index + 1, 1);
                                    myCustomBlockSpecArray[index] = "[$" + myParameterOffset + "]";
                                    myParameterData.push("string");
                                    break;
                            }
                            myParameterOffset++;
                        }
                    }
                });
                //Stick it all back together
                myCustomBlockSpec = "";
                $.each(myCustomBlockSpecArray, function(index, value){
                    myCustomBlockSpec += value;
                });
                //Make fake block data
                var myFakeBlockData = {
                    type: "call",
                    spec: undefined,
                    scratchblocks: myCustomBlockSpec,
                    parameters: myParameterData,
                    group: "More Blocks"
                };
                //Stick it in the scratchblocks text
                myScratchBlocks += this.replaceTextWithParameters(myFakeBlockData, singleBlockArray) + "\n";
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
            var arrayOffset = 1;
            if (blockData.type == "call") {
                //There is an extra offset to where the parameters are called
                arrayOffset = 2;
            }
	    if (EditorTools.getBlockData(blockArray[arrayOffset + index][0]).type === undefined) {
		if (blockArray[arrayOffset + index] === false) {
		    //A blank boolean. Just remove the $[i]
		    myScratchBlocks = myScratchBlocks.replace("$" + (index + 1), "");
		}else{
		    //Just the default value. Replace the $i's with their parameter value.
                    var myParameterValue = blockArray[arrayOffset + index];
                    if (blockData.parameters[index] == "color") {
                        //Color value needs to be converted into HEX (credit to blob8108 for this conversion)
                        console.log("COLOR CONVERSION: " + myParameterValue);
                        myParameterValue = (myParameterValue >>> 0) & 0xffffff;
                        var myHex = parseInt(myParameterValue).toString(16);
                        while(myHex.length < 6) {
                            myHex = "0" + myHex
                        }
                        myParameterValue = myHex;
                    }
                    try{
                        myScratchBlocks = myScratchBlocks.replace("$" + (index + 1), myParameterValue);
                    }catch(e){
                        console.error("[replaceTextWithParameters:] There was an error with this block: " + blockArray[0]);
                    }
		}
	    }else{
		//That's a block in there!
		myScratchBlocks = myScratchBlocks.replace(new RegExp('((\\<|\\[|\\()\\$' + (index + 1) + '(\\)|\\]|\\>))',["i"]), EditorTools.findScratchBlocksFromBlockArray(blockArray[1 + index]));
	    }
	});
	return myScratchBlocks;
    },
    
    /********************************************************************************************************************/
    hexToRgb: function(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    },
    logAndReturn: function(obj)
    {
        console.log(obj);
        return obj;
    }
}