//DEPENDANCY: ge.js, tools.js
//Adds menus to the params array

//"key" >> keys for input
ge.params.push({
    name: "key",
    getCode: function(){
        return "<select>" +
                        "<option value=\"up\">up arrow</option>" +
                        "<option value=\"down\">down arrow</option>" +
                        "<option value=\"right\">right arrow</option>" +
                        "<option value=\"left\">left arrow</option>" +
                        "<option value=\"space\">space</option>" +
                        "<option value=\"a\">a</option>" +
                        "<option value=\"b\">b</option>" +
                        "<option value=\"c\">c</option>" +
                        "<option value=\"d\">d</option>" +
                        "<option value=\"e\">e</option>" +
                        "<option value=\"f\">f</option>" +
                        "<option value=\"g\">g</option>" +
                        "<option value=\"h\">h</option>" +
                        "<option value=\"i\">i</option>" +
                        "<option value=\"j\">j</option>" +
                        "<option value=\"k\">k</option>" +
                        "<option value=\"l\">l</option>" +
                        "<option value=\"m\">m</option>" +
                        "<option value=\"n\">n</option>" +
                        "<option value=\"o\">o</option>" +
                        "<option value=\"p\">p</option>" +
                        "<option value=\"q\">q</option>" +
                        "<option value=\"r\">r</option>" +
                        "<option value=\"s\">s</option>" +
                        "<option value=\"t\">t</option>" +
                        "<option value=\"u\">u</option>" +
                        "<option value=\"v\">v</option>" +
                        "<option value=\"w\">w</option>" +
                        "<option value=\"x\">x</option>" +
                        "<option value=\"y\">y</option>" +
                        "<option value=\"z\">z</option>" +
                        "<option value=\"0\">0</option>" +
                        "<option value=\"1\">1</option>" +
                        "<option value=\"2\">2</option>" +
                        "<option value=\"3\">3</option>" +
                        "<option value=\"4\">4</option>" +
                        "<option value=\"5\">5</option>" +
                        "<option value=\"6\">6</option>" +
                        "<option value=\"7\">7</option>" +
                        "<option value=\"8\">8</option>" +
                        "<option value=\"9\">9</option>" +
                        "</select>";
    }
});
//"spriteOrMouse" >> all sprites and the mouse
ge.params.push({
    name: "spriteOrMouse",
    getCode: function(){
        var paramToReturn = "<select>" +
                        "<option name=\"mouse-pointer\">mouse-pointer</option>";
                        $("#toolbar #spriteSelect select option:not([name='Stage'],:selected)").each(function(){
                            paramToReturn += "<option name=\"" + $(this).attr("name") + "\">" + $(this).attr("name") + "</option>";
                        });
            paramToReturn += "</select>";
        return paramToReturn;
    }
});
//"mathOp" >> all math operations available
ge.params.push({
    name: "mathOp",
    getCode: function(){
        return "<select>" +
                "<option value=\"abs\">abs</option>" +
                "<option value=\"floor\">floor</option>" +
                "<option value=\"ceiling\">ceiling</option>" +
                "<option value=\"sqrt\">sqrt</option>" +
                "<option value=\"sin\">sin</option>" +
                "<option value=\"cos\">cos</option>" +
                "<option value=\"tan\">tan</option>" +
                "<option value=\"asin\">asin</option>" +
                "<option value=\"acos\">acos</option>" +
                "<option value=\"atan\">atan</option>" +
                "<option value=\"ln\">ln</option>" +
                "<option value=\"log\">log</option>" +
                "<option value=\"e ^\">e ^</option>" +
                "<option value=\"10 ^\">10 ^</option>" +
                "</select>";
    }
});
//"backdrop" >> all backdrop names
ge.params.push({
    name: "backdrop",
    getCode: function(){
        var myTotalSelector = "<select>";
            $.each(ge.projectInfo.json.costumes, function(index, value){
                myTotalSelector += "<option value=\"" + value.costumeName + "\">" + value.costumeName + "</option>";
            });
            myTotalSelector += "</select>";
        return myTotalSelector;
    }
});
//"triggerSensor" >> all sensors that can trigger the sensor event hat block
ge.params.push({
    name: "triggerSensor",
    getCode: function(){
        return "<select>" +
                "<option value=\"loudness\">loudness</option>" +
                "<option value=\"timer\">timer</option>" +
                "<option value=\"video motion\">video motion</option>" +
                "</select>";
    }
});
//"broadcast" >> all broadcasts
ge.params.push({
    name: "broadcast",
    getCode: function(){
        var myTotalSelector = "<select>";
        if (ge.broadcasts[ge.editor.currentObj.name]) {
            $.each(ge.broadcasts[ge.editor.currentObj.name], function(index, value){
                myTotalSelector += "<option value=\"" + value + "\">" + value + "</option>";
            });
        }
        myTotalSelector += "<option value=\"message1\">message1</option>";
        myTotalSelector += "</select>";
        return myTotalSelector;
    }
});
//"stop" >> different objects to stop
ge.params.push({
    name: "stop",
    getCode: function(){
        return "<select>" +
                "<option value=\"all\">all</option>" +
                "<option value=\"this script\">this script</option>" +
                "<option value=\"other scripts in sprite\">other scripts in sprite</option>" +
                "</select>";
    }
});
//"spriteOnly" >> all sprites
ge.params.push({
    name: "spriteOnly",
    getCode: function(){
        var paramToReturn = "<select>" +
                        "<option name=\"myself\">myself</option>";
        $("#toolbar #spriteSelect select option:not([name='Stage'],:selected)").each(function(){
            paramToReturn += "<option name=\"" + $(this).attr("name") + "\">" + $(this).attr("name") + "</option>";
        });
        paramToReturn += "</select>";
        return paramToReturn;
    }
});
//"videoMotionType" >> motion types of the video
ge.params.push({
    name: "videoMotionType",
    getCode: function(){
        return "<select>" +
                "<option value=\"motion\">motion</option>" +
                "<option value=\"direction\">direction</option>" +
                "</select>";
    }
});
//"stageOrThis" >> returns the stage and the current selected object
ge.params.push({
    name: "stageOrThis",
    getCode: function(){
        return "<select>" +
                "<option value=\"Stage\">Stage</option>" +
                "<option value=\"this sprite\">this sprite</option>" +
                "</select>";
    }
});
//"videoState" >> States that the video can be in
ge.params.push({
    name: "videoState",
    getCode: function(){
        return "<select>" +
                "<option value=\"off\">off</option>" +
                "<option value=\"on\">on</option>" +
                "<option value=\"on-flipped\">on-flipped</option>" +
                "</select>";
    }
});
//"sensor" >> all types of a sensor that can be sensed by a sprite or stage
ge.params.push({
    name: "sensor",
    getCode: function(){
        return "<select>" +
                "<option value=\"x position\">x position</option>" +
                "<option value=\"y position\">y position</option>" +
                "<option value=\"direction\">direction</option>" +
                "<option value=\"costume #\">costume #</option>" +
                "<option value=\"costume name\">costume name</option>" +
                "<option value=\"size\">size</option>" +
                "<option value=\"volume\">volume</option>" +
                "</select>";
    }
});
//"spriteOrStage" >> all sprites or the stage
ge.params.push({
    name: "spriteOrStage",
    getCode: function(){
        var paramToReturn = "<select>";
        $("#toolbar #spriteSelect select option:not(:selected)").each(function(){
            paramToReturn += "<option name=\"" + $(this).attr("name") + "\">" + $(this).attr("name") + "</option>";
        });
        paramToReturn += "</select>";
        return paramToReturn;
    }
});
//"timeAndDate" >> all the different types of time that can be accessed
ge.params.push({
    name: "timeAndDate",
    getCode: function(){
        return "<select>" +
                "<option value=\"year\">year</option>" +
                "<option value=\"month\">month</option>" +
                "<option value=\"date\">date</option>" +
                "<option value=\"day of week\">day of week</option>" +
                "<option value=\"hour\">hour</option>" +
                "<option value=\"minute\">minute</option>" +
                "<option value=\"second\">second</option>" +
                "</select>";
    }
});
//"touching" >> objects that the mouse can be touching
ge.params.push({
    name: "touching",
    getCode: function(){
        var paramToReturn = "<select>" +
                        "<option name=\"mouse-pointer\">mouse-pointer</option>" +
                        "<option name=\"edge\">edge</option>";
                        $("#toolbar #spriteSelect select option:not([name='Stage'],:selected)").each(function(){
                            paramToReturn += "<option name=\"" + $(this).attr("name") + "\">" + $(this).attr("name") + "</option>";
                        });
            paramToReturn += "</select>";
        return paramToReturn;
    }
});
//"effect" >> graphic effects that can be used
ge.params.push({
    name: "effect",
    getCode: function(){
        return "<select>" +
                "<option value=\"color\">color</option>" +
                "<option value=\"fisheye\">fisheye</option>" +
                "<option value=\"whirl\">whirl</option>" +
                "<option value=\"pixelate\">pixelate</option>" +
                "<option value=\"mosaic\">mosaic</option>" +
                "<option value=\"brightness\">brightness</option>" +
                "<option value=\"ghost\">ghost</option>" +
                "</select>";
    }
});
//"sound" >> all sounds in the selected object
ge.params.push({
    name: "sound",
    getCode: function(){
        var myTotalSelector = "<select>";
            $.each(ge.editor.currentObj.sounds, function(index, value){
                myTotalSelector += "<option value=\"" + value.soundName + "\">" + value.soundName + "</option>";
            });
            myTotalSelector += "</select>";
        return myTotalSelector;
    }
});
//"costume" >> all costumes in the selected object
ge.params.push({
    name: "costume",
    getCode: function(){
        var myTotalSelector = "<select>";
            $.each(ge.editor.currentObj.costumes, function(index, value){
                myTotalSelector += "<option value=\"" + value.costumeName + "\">" + value.costumeName + "</option>";
            });
            myTotalSelector += "</select>";
        return myTotalSelector;
    }
});
//"rotationStyle" >> the rotation styles of a sprite
ge.params.push({
    name: "rotationStyle",
    getCode: function(){
        return "<select>" +
                "<option value=\"left-right\">left-right</option>" +
                "<option value=\"don't rotate\">don't rotate</option>" +
                "<option value=\"all around\">all around</option>" +
                "</select>";
    }
});
//"var" >> all variables available to the selected object
ge.params.push({
    name: "var",
    getCode: function(){
        var myTotalSelector = "<select>";
        if (ge.projectInfo.json.variables) {
            $.each(ge.projectInfo.json.variables, function(index, value){
                myTotalSelector += "<option value=\"" + value.name + "\">" + value.name + "</option>";
            });
        }
        if (ge.editor.currentObj.variables && ge.editor.currentObj.name !== "Stage") {
            $.each(ge.editor.currentObj.variables, function(index, value){
                myTotalSelector += "<option value=\"" + value.name + "\">" + value.name + "</option>";
            });
        }
        myTotalSelector += "</select>";
        
        return myTotalSelector;
    }
});
//"list" >> all lists available to the selected object
ge.params.push({
    name: "list",
    getCode: function(){
        var myTotalSelector = "<select>";
        if (ge.projectInfo.json.lists) {
            $.each(ge.projectInfo.json.lists, function(index, value){
                myTotalSelector += "<option value=\"" + value.listName + "\">" + value.listName + "</option>";
            });
        }
        if (ge.editor.currentObj.lists && ge.editor.currentObj.name !== "Stage") {
            $.each(ge.editor.currentObj.lists, function(index, value){
                myTotalSelector += "<option value=\"" + value.listName + "\">" + value.listName + "</option>";
            });
        }
        myTotalSelector += "</select>";
        
        return myTotalSelector;
    }
});
//"direction" >> most common directions used
ge.params.push({
    name: "direction",
    getCode: function(){
        return "<select>" +
                "<option value=\"90\">(90) right</option>" +
                "<option value=\"-90\">(-90) left</option>" +
                "<option value=\"0\">(0) up</option>" +
                "<option value=\"180\">(180) down</option>" +
                "</select>";
    }
});