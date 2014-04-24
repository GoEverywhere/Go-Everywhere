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
    findBlocksFromStack: function(stackArray, info) {
	var totalStackCode = "";
	
	$.each(stackArray, function(index, value){
	    totalStackCode += EditorTools.findBlocksFromBlockArray(value, info);
	});
	
	return totalStackCode;
    },
    findBlocksFromBlockArray: function(singleBlockArray, info) {
	var myBlockCode = "";
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
		//myScratchBlocks += this.replaceTextWithParameters(myBlockData, singleBlockArray) + "\n";
                //myBlockCode += "<div class=\"hat " + myBlockData.group.toLowerCase() + "\">when <span class=\"green-flag\"></span> clicked\n</div>";
                myBlockCode += "<div class=\"hat " + myBlockData.group.toLowerCase() + "\">";
                //myBlockCode += myBlockData.label.replace("@greenFlag", "<span class=\"green-flag\"></span>");
                myBlockCode += EditorTools.replaceTextWithParameters(myBlockData, singleBlockArray, info);
                myBlockCode += "</div>";
		break;
//            case "define":
//                //This block is special. It is the define block, which is as follows:
//                //The first item is the block spec: always "procDef"
//                //The second item is the spec (following http://goo.gl/mjFG1s).
//                //Currently, only %n, %b, and %s are supported (number, boolean, and string)
//                //The third item is going to hold an array, naming each of the inputs.
//                //The inputs will need to be changed accordingly, then set the their names.
//                myScratchBlocks += "define ";
//                var myCustomBlockSpec = singleBlockArray[1];
//                var myCustomBlockSpecArray = myCustomBlockSpec.split('');
//                var myParameterIndex = 0;
//                $.each(myCustomBlockSpecArray, function(index, value){
//                    if (index + 1 < myCustomBlockSpecArray.length) {
//                        if (value == "%") {
//                            switch(myCustomBlockSpecArray[index + 1]){
//                                case "n":
//                                case "s":
//                                    myCustomBlockSpecArray.splice(index + 1, 1);
//                                    myCustomBlockSpecArray[index] = "( $" + myParameterIndex + " )";
//                                    break;
//                                case "b":
//                                    myCustomBlockSpecArray.splice(index + 1, 1);
//                                    myCustomBlockSpecArray[index] = "< $" + myParameterIndex + " >";
//                                    break;
//                            }
//                            myParameterIndex++;
//                        }
//                    }
//                });
//                //Stick it all back together
//                myCustomBlockSpec = "";
//                $.each(myCustomBlockSpecArray, function(index, value){
//                    myCustomBlockSpec += value;
//                });
//                //Loop through parameter names, and
//                //replace $[index] with the parameter name
//                $.each(singleBlockArray[2], function(index, value){
//                    myCustomBlockSpec = myCustomBlockSpec.replace("$" + index, value);
//                });
//                myScratchBlocks += myCustomBlockSpec + "\n";
//                
//                break;
//            case "call":
//                //A call block is a special stack.
//                //It is a custom block, with a corresponding "define" block.
//                //Since it is special, we need to make a fake block data for the parameter parser.
//                var myCustomBlockSpec = singleBlockArray[1];
//                var myCustomBlockSpecArray = myCustomBlockSpec.split('');
//                var myParameterOffset = 1;
//                var myParameterData = [];
//                $.each(myCustomBlockSpecArray, function(index, value){
//                    if (index + 1 < myCustomBlockSpecArray.length) {
//                        if (value == "%") {
//                            switch(myCustomBlockSpecArray[index + 1]){
//                                case "n":
//                                    myCustomBlockSpecArray.splice(index + 1, 1);
//                                    myCustomBlockSpecArray[index] = "($" + myParameterOffset + ")";
//                                    myParameterData.push("number");
//                                    break;
//                                case "b":
//                                    myCustomBlockSpecArray.splice(index + 1, 1);
//                                    myCustomBlockSpecArray[index] = "<$" + myParameterOffset + ">";
//                                    myParameterData.push("boolean");
//                                    break;
//                                case "s":
//                                    myCustomBlockSpecArray.splice(index + 1, 1);
//                                    myCustomBlockSpecArray[index] = "[$" + myParameterOffset + "]";
//                                    myParameterData.push("string");
//                                    break;
//                            }
//                            myParameterOffset++;
//                        }
//                    }
//                });
//                //Stick it all back together
//                myCustomBlockSpec = "";
//                $.each(myCustomBlockSpecArray, function(index, value){
//                    myCustomBlockSpec += value;
//                });
//                //Make fake block data
//                var myFakeBlockData = {
//                    type: "call",
//                    spec: undefined,
//                    scratchblocks: myCustomBlockSpec,
//                    parameters: myParameterData,
//                    group: "More Blocks"
//                };
//                //Stick it in the scratchblocks text
//                myScratchBlocks += this.replaceTextWithParameters(myFakeBlockData, singleBlockArray) + "\n";
//                break;
	    case "command":
	    case "stack":
		//A stack block is as follows:
		//The first item in the blockArray is the label.
		//Then, come the parameters.
                myBlockCode += "<div class=\"stack " + myBlockData.group.toLowerCase() + "\">";
		myBlockCode += this.replaceTextWithParameters(myBlockData, singleBlockArray, info);
                myBlockCode += "</div>";
		break;
	    case "c":
		//A normal C-shape is as follows:
		//The first item in the blockArray is the label.
		//Then, come the parameters.
		//After parameters (parameter-offset) is a stack of blocks inside the C-shape.
                myBlockCode += "<div class=\"cwrap\">";
                
                myBlockCode += "<div class=\"stack cstart " + myBlockData.group.toLowerCase() + "\">";
                myBlockCode += EditorTools.replaceTextWithParameters(myBlockData, singleBlockArray, info);
                myBlockCode += "</div>";
                
                myBlockCode += "<div class=\"cmouth " + myBlockData.group.toLowerCase() + "\">";
                if (singleBlockArray[1 + myBlockData.parameters.length] !== null) {
		    //Loop through the mini-stack
		    myBlockCode += EditorTools.findBlocksFromStack(singleBlockArray[1 + myBlockData.parameters.length], info);
		}
                myBlockCode += "</div>";
                
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
		myBlockCode += "<div class=\"cwrap\">";
                
                myBlockCode += "<div class=\"stack cstart " + myBlockData.group.toLowerCase() + "\">";
                myBlockCode += EditorTools.replaceTextWithParameters(myBlockData, singleBlockArray, info);
                myBlockCode += "</div>";
                
                $.each(myBlockData.label, function(index, value){
                    if (index != 0) {
                        myBlockCode += "<div class=\"stack celse " + myBlockData.group.toLowerCase() + "\">" + value + "</div>";
                    }
                    //If the parameter-offset is null, that means that
		    //there are no blocks in the C-shape.
                    myBlockCode += "<div class=\"cmouth " + myBlockData.group.toLowerCase() + "\">";
		    if (singleBlockArray[1 + myBlockData.parameters.length] !== null) {
		        //Loop through the mini-stack
		        myBlockCode += EditorTools.findScratchBlocksFromStack(singleBlockArray[1 + (index) + myBlockData.parameters.length], info);
		    }
                    myBlockCode += "</div>";
                });
                
                myBlockCode += "<div class=\"stack cend " + myBlockData.group.toLowerCase() + "\"></div>";
                
                myBlockCode += "</div>";
		break;
	    case "reporter":
	    case "boolean":
		//A reporter/boolean is as follows:
		//The first item in the blockArray is the label.
		//Then, come the parameters.
                myBlockCode += "<div class=\"" + myBlockData.type.toLowerCase() + " " + myBlockData.group.toLowerCase() + "\">";
		myBlockCode += this.replaceTextWithParameters(myBlockData, singleBlockArray, info);
                myBlockCode += "</div>";
		break;
	    
	}
	return myBlockCode;
    },
    replaceTextWithParameters: function(blockData, blockArray, info) {
	if (blockData.type == "special") {
	    var myBlockCode = blockData.label[0];
	}else{
	    var myBlockCode = blockData.label;
	}
        var arrayOffset = 1;
        if (blockData.type == "call") {
            //There is an extra offset to where the parameters are called
            arrayOffset = 2;
        }

        var tmpCharacters = myBlockCode.split("");
        var parameterOffset = 0;
        $.each(tmpCharacters, function(index, value){
            if (index + 1 < tmpCharacters.length) {
                if (value == "%") {
                    switch(tmpCharacters[index + 1])
                    {
                        case "n":
                            tmpCharacters.splice(index + 1, 1);
                            
                            if (typeof blockArray[parameterOffset + arrayOffset] === "number") {
                                //Number
                                tmpCharacters[index] = "<div class=\"number\"><input type=\"text\" pattern=\"[0-9.]+\" size=\"4\" style=\"font-size: 10px;height: 13px;padding: 0;border: none;\" value=\"" + blockArray[parameterOffset + arrayOffset] + "\" /></div>";
                            }else{
                                //Must be a block inside of me
                                tmpCharacters[index] = EditorTools.findBlocksFromBlockArray(blockArray[parameterOffset + arrayOffset], info);
                            }
                            parameterOffset++;
                            break;
                        case "s":
                            tmpCharacters.splice(index + 1, 1);
                            
                            if (typeof blockArray[parameterOffset + arrayOffset] === "string") {
                                //String
                                tmpCharacters[index] = "<div class=\"string\"><input type=\"text\" size=\"4\" style=\"font-size: 10px;height:13px; padding: 0; border: none;\" value=\"" + blockArray[parameterOffset + arrayOffset] + "\" /></div>";
                            }else{
                                //Must be a block inside of me
                                tmpCharacters[index] = EditorTools.findBlocksFromBlockArray(blockArray[parameterOffset + arrayOffset], info);
                            }
                            parameterOffset++;
                            break;
                        case "b":
                            tmpCharacters.splice(index + 1, 1);
                            
                            if (blockArray[parameterOffset + arrayOffset] === false) {
                                //Empty
                                tmpCharacters[index] = "<div class=\"boolean empty\"></div>";
                            }else{
                                //Find the block inside of me
                                tmpCharacters[index] = EditorTools.findBlocksFromBlockArray(blockArray[parameterOffset + arrayOffset], info);
                            }
                            parameterOffset++;
                            break;
                        case "c":
                            parameterOffset++;
                            break;
                        case "m":
                            tmpCharacters.splice(index + 1, 2);
                            var lengthToSplice = 0;
                            var menuName = "";
                            for(var myI = index + 1; myI < tmpCharacters.length; myI++)
                            {
                                if (tmpCharacters[myI] === " ") {
                                    break;
                                }
                                lengthToSplice++;
                                menuName += tmpCharacters[myI];
                            }
                            tmpCharacters.splice(index + 1, lengthToSplice);
                            
                            var tmpMenuCode = "";
                            $.each(params, function(index, value){
                                if (value.name == menuName) {
                                    tmpMenuCode = value.getCode(info);
                                    
                                    return false;
                                }
                            });
                            tmpMenuCode = tmpMenuCode.replace("value=\"" + blockArray[parameterOffset + arrayOffset] + "\"", "selected=\"true\" value=\"" + blockArray[parameterOffset + arrayOffset] + "\"");
                            
                            tmpCharacters[index] = "<div class=\"dropdown\">" + tmpMenuCode + "</div>";
                            
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

	return myBlockCode.replace("@greenFlag", "<span class=\"green-flag\"></span>");
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