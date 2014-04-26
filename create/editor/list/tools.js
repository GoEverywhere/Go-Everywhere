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
                myBlockCode += EditorTools.replaceTextWithParameters(myBlockData, singleBlockArray, info);
                myBlockCode += "</div>";
		break;
            case "define":
                //The define block. Is like a hat block, except has a block inside it as well.
                myBlockCode += "<div class=\"define-hat " + myBlockData.group.toLowerCase() + "\" spec=\"" + myBlockData.spec + "\" label=\"" + singleBlockArray[1] + "\" varnames=\"" + singleBlockArray[2] + "\" defaults=\"" + singleBlockArray[3] + "\">";
                
                var tmpCharacters = singleBlockArray[1].split("");
                var parameterOffset = 0;
                $.each(tmpCharacters, function(index, value){
                    if (index + 1 < tmpCharacters.length) {
                        if (value == "%") {
                            switch(tmpCharacters[index + 1])
                            {
                                case "n":
                                case "s":
                                    tmpCharacters.splice(index + 1, 1);
                                    tmpCharacters[index] = "<div class=\"reporter custom-arg\">" + singleBlockArray[2][parameterOffset] + "</div>";
                                    parameterOffset++;
                                    break;
                                case "b":
                                    tmpCharacters.splice(index + 1, 1);
                                    tmpCharacters[index] = "<div class=\"boolean custom-arg\">" + singleBlockArray[2][parameterOffset] + "</div>";
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
                myBlockCode += EditorTools.replaceTextWithParameters(myFakeBlockData, singleBlockArray, info);
                
                myBlockCode += "</div>";
                break;
	    case "command":
	    case "stack":
		//A stack block is as follows:
		//The first item in the blockArray is the label.
		//Then, come the parameters.
                myBlockCode += "<div class=\"stack " + myBlockData.group.toLowerCase() + "\" spec=\"" + myBlockData.spec + "\">";
		myBlockCode += this.replaceTextWithParameters(myBlockData, singleBlockArray, info);
                myBlockCode += "</div>";
		break;
	    case "c":
		//A normal C-shape is as follows:
		//The first item in the blockArray is the label.
		//Then, come the parameters.
		//After parameters (parameter-offset) is a stack of blocks inside the C-shape.
                myBlockCode += "<div class=\"cwrap\">";
                
                myBlockCode += "<div class=\"stack cstart " + myBlockData.group.toLowerCase() + "\" spec=\"" + myBlockData.spec + "\">";
                myBlockCode += EditorTools.replaceTextWithParameters(myBlockData, singleBlockArray, info);
                myBlockCode += "</div>";
                
                //Count the parameters:
                var myParamCount = 0;
                var tmpCharacters = myBlockData.label.split("");
                $.each(tmpCharacters, function(index, value){
                    if (index + 1 < tmpCharacters.length) {
                        if (value === "%") {
                            switch(tmpCharacters[index + 1])
                            {
                                case "b":
                                case "c":
                                case "d":
                                case "m":
                                case "n":
                                case "s":
                                    myParamCount++;
                                    break;
                            }
                        }
                    }
                });
                
                myBlockCode += "<div class=\"cmouth " + myBlockData.group.toLowerCase() + "\">";
                if (singleBlockArray[1 + myParamCount] !== null) {
		    //Loop through the mini-stack
		    myBlockCode += EditorTools.findBlocksFromStack(singleBlockArray[1 + myParamCount], info);
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
                
                myBlockCode += "<div class=\"stack cstart " + myBlockData.group.toLowerCase() + "\" spec=\"" + myBlockData.spec + "\">";
                myBlockCode += EditorTools.replaceTextWithParameters(myBlockData, singleBlockArray, info);
                myBlockCode += "</div>";
                
                //Count the parameters:
                var myParamCount = 0;
                var tmpCharacters = myBlockData.label[0].split("");
                $.each(tmpCharacters, function(index, value){
                    if (index + 1 < tmpCharacters.length) {
                        if (value === "%") {
                            switch(tmpCharacters[index + 1])
                            {
                                case "b":
                                case "c":
                                case "d":
                                case "m":
                                case "n":
                                case "s":
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
		        myBlockCode += EditorTools.findScratchBlocksFromStack(singleBlockArray[1 + (index) + myParamCount], info);
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
                myBlockCode += "<div class=\"" + myBlockData.type.toLowerCase() + " " + myBlockData.group.toLowerCase() + "\" spec=\"" + myBlockData.spec + "\">";
		myBlockCode += this.replaceTextWithParameters(myBlockData, singleBlockArray, info);
                myBlockCode += "</div>";
		break;
            case "getParam":
                //This is like a variable,
                //but is purple.
                switch(singleBlockArray[2])
                {
                    case "r":
                        myBlockCode += "<div class=\"reporter custom-arg\">";
                        break;
                    case "b":
                        myBlockCode += "<div class=\"boolean custom-arg\">";
                        break;
                }
                myBlockCode += singleBlockArray[1];
                myBlockCode += "</div>";
                break;
            case "readVariable":
                //This is like a "getParam",
                //just doesn't have the extra selector.
                myBlockCode += "<div class=\"reporter " + myBlockData.group.toLowerCase() + "\" spec=\"" + myBlockData.spec + "\" variable=\"true\">";
                myBlockCode += singleBlockArray[1];
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
                        case "d": //Is here for now, until the element needed is added
                            tmpCharacters.splice(index + 1, 1);
                            
                            if (typeof blockArray[parameterOffset + arrayOffset] !== "object") {
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
                            
                            if (typeof blockArray[parameterOffset + arrayOffset] !== "object") {
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
                            tmpCharacters.splice(index + 1, 1);
                            
                            if (typeof blockArray[parameterOffset + arrayOffset] !== "object") {
                                //Color
                                var a = blockArray[parameterOffset + arrayOffset] >> 24 & 0xFF; //a value is unused
                                var r = blockArray[parameterOffset + arrayOffset] >> 16 & 0xFF;
                                var g = blockArray[parameterOffset + arrayOffset] >> 8 & 0xFF;
                                var b = blockArray[parameterOffset + arrayOffset] & 0xFF;
                                
                                tmpCharacters[index] = "<div class=\"color\" style=\"background-color: rgb(" + r + ", " + g + ", " + b + ");\"> </div>";
                            }else{
                                //Must be a block inside of me
                                tmpCharacters[index] = EditorTools.findBlocksFromBlockArray(blockArray[parameterOffset + arrayOffset], info);
                            }
                            
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

	return ((myBlockCode.replace("@greenFlag", "<span class=\"green-flag\"></span>")).replace("@turnRight", "<span class=\"arrow-cw\"></span>")).replace("@turnLeft", "<span class=\"arrow-ccw\"></span>");
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