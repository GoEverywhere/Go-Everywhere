params.push({
    name: "key",
    getCode: function(info){
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
params.push({
    name: "spriteOrMouse",
    getCode: function(info){
        var paramToReturn = "<select>" +
                        "<option name=\"mouse-pointer\">mouse-pointer</option>";
                        $("#toolbar #spriteSelect select option:not([name='Stage'],:selected)").each(function(){
                            paramToReturn += "<option name=\"" + $(this).attr("name") + "\">" + $(this).attr("name") + "</option>";
                        });
            paramToReturn += "</select>";
        return paramToReturn;
    }
});
params.push({
    name: "mathOp",
    getCode: function(info){
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
params.push({
    name: "backdrop",
    getCode: function(info){
        var myTotalSelector = "<select>";
            $.each(info.project.costumes, function(index, value){
                myTotalSelector += "<option value=\"" + value.costumeName + "\">" + value.costumeName + "</option>";
            });
            myTotalSelector += "</select>";
        return myTotalSelector;
    }
});
params.push({
    name: "triggerSensor",
    getCode: function(info){
        return "<select>" +
                        "<option value=\"loudness\">loudness</option>" +
                        "<option value=\"timer\">timer</option>" +
                        "<option value=\"video motion\">video motion</option>" +
                        "</select>";
    }
});
params.push({
    name: "broadcast",
    getCode: function(info){
        var myTotalSelector = "<select>";
        $.each(broadcasts, function(index, value){
            myTotalSelector += "<option value=\"" + value + "\">" + value + "</option>";
        });
        myTotalSelector += "<option value=\"message1\">message1</option>";
        myTotalSelector += "</select>";
        return myTotalSelector;
    }
});
params.push({
    name: "stop",
    getCode: function(info){
        return "<select>" +
                "<option value=\"all\">all</option>" +
                "<option value=\"this script\">this script</option>" +
                "<option value=\"other scripts in sprite\">other scripts in sprite</option>" +
                "</select>";
    }
});
params.push({
    name: "spriteOnly",
    getCode: function(info){
        var paramToReturn = "<select>" +
                        "<option name=\"myself\">myself</option>";
        $("#toolbar #spriteSelect select option:not([name='Stage'],:selected)").each(function(){
            paramToReturn += "<option name=\"" + $(this).attr("name") + "\">" + $(this).attr("name") + "</option>";
        });
        paramToReturn += "</select>";
        return paramToReturn;
    }
});
params.push({
    name: "videoMotionType",
    getCode: function(info){
        return "<select>" +
                "<option value=\"motion\">motion</option>" +
                "<option value=\"direction\">direction</option>" +
                "</select>";
    }
});
params.push({
    name: "stageOrThis",
    getCode: function(info){
        return "<select>" +
                "<option value=\"Stage\">Stage</option>" +
                "<option value=\"this sprite\">this sprite</option>" +
                "</select>";
    }
});
params.push({
    name: "videoState",
    getCode: function(info){
        return "<select>" +
                "<option value=\"off\">off</option>" +
                "<option value=\"on\">on</option>" +
                "<option value=\"on-flipped\">on-flipped</option>" +
                "</select>";
    }
});
params.push({
    name: "sensor",
    getCode: function(info){
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
params.push({
    name: "spriteOrStage",
    getCode: function(info){
        var paramToReturn = "<select>";
        $("#toolbar #spriteSelect select option:not(:selected)").each(function(){
            paramToReturn += "<option name=\"" + $(this).attr("name") + "\">" + $(this).attr("name") + "</option>";
        });
        paramToReturn += "</select>";
        return paramToReturn;
    }
});
params.push({
    name: "timeAndDate",
    getCode: function(info){
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
params.push({
    name: "touching",
    getCode: function(info){
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
params.push({
    name: "effect",
    getCode: function(info){
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
params.push({
    name: "sound",
    getCode: function(info){
        var myTotalSelector = "<select>";
            $.each(info.currentObj.sounds, function(index, value){
                myTotalSelector += "<option value=\"" + value.soundName + "\">" + value.soundName + "</option>";
            });
            myTotalSelector += "</select>";
        return myTotalSelector;
    }
});
params.push({
    name: "costume",
    getCode: function(info){
        var myTotalSelector = "<select>";
            $.each(info.currentObj.costumes, function(index, value){
                myTotalSelector += "<option value=\"" + value.costumeName + "\">" + value.costumeName + "</option>";
            });
            myTotalSelector += "</select>";
        return myTotalSelector;
    }
});
params.push({
    name: "rotationStyle",
    getCode: function(info){
        return "<select>" +
                "<option value=\"left-right\">left-right</option>" +
                "<option value=\"don't rotate\">don't rotate</option>" +
                "<option value=\"all around\">all around</option>" +
                "</select>";
    }
});
params.push({
    name: "var",
    getCode: function(info){
        var myTotalSelector = "<select>";
        if (info.project.variables) {
            $.each(info.project.variables, function(index, value){
                myTotalSelector += "<option value=\"" + value.name + "\">" + value.name + "</option>";
            });
        }
        if (info.currentObj.variables && info.currentObj.name !== "Stage") {
            $.each(info.currentObj.variables, function(index, value){
                myTotalSelector += "<option value=\"" + value.name + "\">" + value.name + "</option>";
            });
        }
        myTotalSelector += "</select>";
        
        return myTotalSelector;
    }
});
params.push({
    name: "list",
    getCode: function(info){
        var myTotalSelector = "<select>";
        if (info.project.lists) {
            $.each(info.project.lists, function(index, value){
                myTotalSelector += "<option value=\"" + value.listName + "\">" + value.listName + "</option>";
            });
        }
        if (info.currentObj.lists && info.currentObj.name !== "Stage") {
            $.each(info.currentObj.lists, function(index, value){
                myTotalSelector += "<option value=\"" + value.listName + "\">" + value.listName + "</option>";
            });
        }
        myTotalSelector += "</select>";
        
        return myTotalSelector;
    }
});
params.push({
    name: "direction",
    getCode: function(info){
        return "<select>" +
                "<option value=\"90\">(90) right</option>" +
                "<option value=\"-90\">(-90) left</option>" +
                "<option value=\"0\">(0) up</option>" +
                "<option value=\"180\">(180) down</option>" +
                "</select>";
    }
});