params.push({
    name: "key",
    getCode: function(info){
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
    }
});
params.push({
    name: "spriteOrMouse",
    getCode: function(info){
        var paramToReturn = "<select>\n" +
                        "<option name=\"mouse-pointer\">mouse-pointer</option>\n";
                        $("#toolbar #spriteSelect select option:not([name='Stage'],:selected)").each(function(){
                            paramToReturn += "<option name=\"" + $(this).attr("name") + "\">" + $(this).attr("name") + "</option>\n";
                        });
            paramToReturn += "</select>\n";
        return paramToReturn;
    }
});
params.push({
    name: "mathOp",
    getCode: function(info){
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
    }
});
params.push({
    name: "backdrop",
    getCode: function(info){
        var myTotalSelector = "<select>\n";
            $.each(info.project.costumes, function(index, value){
                myTotalSelector += "<option value=\"" + value.costumeName + "\">" + value.costumeName + "</option>\n";
            });
            myTotalSelector += "</select>\n";
        return myTotalSelector;
    }
});
params.push({
    name: "triggerSensor",
    getCode: function(info){
        return "<select>\n" +
                        "<option value=\"loudness\">loudness</option>\n" +
                        "<option value=\"timer\">timer</option>\n" +
                        "<option value=\"video motion\">video motion</option>\n" +
                        "</select>\n";
    }
});
params.push({
    name: "broadcast",
    getCode: function(info){
        var myTotalSelector = "<select>\n";
        $.each(broadcasts, function(index, value){
            myTotalSelector += "<option value=\"" + value + "\">" + value + "</option>\n";
        });
        myTotalSelector += "<option value=\"message1\">message1</option>\n";
        myTotalSelector += "</select>\n";
        return myTotalSelector;
    }
});
params.push({
    name: "stop",
    getCode: function(info){
        return "<select>\n" +
                "<option value=\"all\">all</option>\n" +
                "<option value=\"this script\">this script</option>\n" +
                "<option value=\"other scripts in sprite\">other scripts in sprite</option>\n" +
                "</select>\n";
    }
});
params.push({
    name: "spriteOnly",
    getCode: function(info){
        var paramToReturn = "<select>\n" +
                        "<option name=\"myself\">myself</option>\n";
        $("#toolbar #spriteSelect select option:not([name='Stage'],:selected)").each(function(){
            paramToReturn += "<option name=\"" + $(this).attr("name") + "\">" + $(this).attr("name") + "</option>\n";
        });
        paramToReturn += "</select>\n";
        return paramToReturn;
    }
});
params.push({
    name: "videoMotionType",
    getCode: function(info){
        return "<select>\n" +
                "<option value=\"motion\">motion</option>\n" +
                "<option value=\"direction\">direction</option>\n" +
                "</select>\n";
    }
});
params.push({
    name: "stageOrThis",
    getCode: function(info){
        return "<select>\n" +
                "<option value=\"Stage\">Stage</option>\n" +
                "<option value=\"this sprite\">this sprite</option>\n" +
                "</select>\n";
    }
});
params.push({
    name: "videoState",
    getCode: function(info){
        return "<select>\n" +
                "<option value=\"off\">off</option>\n" +
                "<option value=\"on\">on</option>\n" +
                "<option value=\"on-flipped\">on-flipped</option>\n" +
                "</select>\n";
    }
});
params.push({
    name: "sensor",
    getCode: function(info){
        return "<select>\n" +
                "<option value=\"x position\">x position</option>\n" +
                "<option value=\"y position\">y position</option>\n" +
                "<option value=\"direction\">direction</option>\n" +
                "<option value=\"costume #\">costume #</option>\n" +
                "<option value=\"costume name\">costume name</option>\n" +
                "<option value=\"size\">size</option>\n" +
                "<option value=\"volume\">volume</option>\n" +
                "</select>\n";
    }
});
params.push({
    name: "spriteOrStage",
    getCode: function(info){
        var paramToReturn = "<select>\n";
        $("#toolbar #spriteSelect select option:not(:selected)").each(function(){
            paramToReturn += "<option name=\"" + $(this).attr("name") + "\">" + $(this).attr("name") + "</option>\n";
        });
        paramToReturn += "</select>\n";
        return paramToReturn;
    }
});
params.push({
    name: "timeAndDate",
    getCode: function(info){
        return "<select>\n" +
                "<option value=\"year\">year</option>\n" +
                "<option value=\"month\">month</option>\n" +
                "<option value=\"date\">date</option>\n" +
                "<option value=\"day of week\">day of week</option>\n" +
                "<option value=\"hour\">hour</option>\n" +
                "<option value=\"minute\">minute</option>\n" +
                "<option value=\"second\">second</option>\n" +
                "</select>\n";
    }
});
params.push({
    name: "touching",
    getCode: function(info){
        var paramToReturn = "<select>\n" +
                        "<option name=\"mouse-pointer\">mouse-pointer</option>\n" +
                        "<option name=\"edge\">edge</option>\n";
                        $("#toolbar #spriteSelect select option:not([name='Stage'],:selected)").each(function(){
                            paramToReturn += "<option name=\"" + $(this).attr("name") + "\">" + $(this).attr("name") + "</option>\n";
                        });
            paramToReturn += "</select>\n";
        return paramToReturn;
    }
});
params.push({
    name: "effect",
    getCode: function(info){
        return "<select>\n" +
                "<option value=\"color\">color</option>\n" +
                "<option value=\"fisheye\">fisheye</option>\n" +
                "<option value=\"whirl\">whirl</option>\n" +
                "<option value=\"pixelate\">pixelate</option>\n" +
                "<option value=\"mosaic\">mosaic</option>\n" +
                "<option value=\"brightness\">brightness</option>\n" +
                "<option value=\"ghost\">ghost</option>\n" +
                "</select>\n";
    }
});
params.push({
    name: "sound",
    getCode: function(info){
        var myTotalSelector = "<select>\n";
            $.each(info.currentObj.sounds, function(index, value){
                myTotalSelector += "<option value=\"" + value.soundName + "\">" + value.soundName + "</option>\n";
            });
            myTotalSelector += "</select>\n";
        return myTotalSelector;
    }
});
params.push({
    name: "costume",
    getCode: function(info){
        var myTotalSelector = "<select>\n";
            $.each(info.currentObj.costumes, function(index, value){
                myTotalSelector += "<option value=\"" + value.costumeName + "\">" + value.costumeName + "</option>\n";
            });
            myTotalSelector += "</select>\n";
        return myTotalSelector;
    }
});