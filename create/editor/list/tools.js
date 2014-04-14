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
            label: undefined,
            scratchblocks: undefined,
            parameters: undefined,
            group: "Obsolete"
        };
    },
    getBlockDataFromScratchblocks : function(cat, label)
    {
        for(var i = 0; i < blocks.length; i++)
        {
            if (blocks[i].group.toLowerCase() == cat && blocks[i].renderLabel == label) {
                return blocks[i];
            }
        }
        return this.getBlockData("");
    },
        
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
                        "<option value=\"floor\">floot</option>\n" +
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
                break;
            case "sensor": //%s
                return "<select>\n" +
                        "<option value=\"loudness\">loudness</option>\n" +
                        "<option value=\"timer\">timer</option>\n" +
                        "<option value=\"video motion\">video motion</option>\n" +
                        "</select>\n";
                break;
            /*case "broadcast": //%r
                var myTotalSelector = "<select>\n";
                $.each(project.costumes, function(index, value){
                    myTotalSelector += "<option value=\"" + value.costumeName + "\">" + value.costumeName + "</option>\n";
                });
                myTotalSelector += "</select>\n";
                break;*/
        }
        return "";
    }
}