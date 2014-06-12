//Making the ge variable, which will hold all Go-Everywhere items.
var ge = {
    //This will hold all the project information (JSON for .ge and .sb2, others for .sb [Scratch 1.X])
    projectInfo : {
        json: null,
        initialJSON: null,
        fileName: "project"
    },
    
    //This holds all the blocks that are available (see blocks.js)
    blocks : [],
    //This holds all the params (menus) that are available (see params.js)
    params : [],
    //This holds all the broadcasts that are available (per object; broadcasts[OBJNAME] >> array of broadcasts for that object)
    broadcasts : [],
    
    //initialize >> makes sure that all the classes are loaded, and loades HTML into the specified container (default = body)
    initialize : function(container){
        //If the container isn't specified, then use the body.
        if (container === undefined) {
            container = $("body");
        }
        //We need to make sure all the required classes were loaded
        if (!this.Tools || !this.editor || !this.io || !this.addons) {
            throw "Go Everywhere Exception: Not all the required classes were loaded. Go check the source code!";
        }
        //Great! Just need to place all the HTML we need into the container
        $(container).html(
            '<div id="waiting">' +
                '<center><img src="../images/loading.gif" /></center>' +
            '</div>' +
            
            '<div id="toolbar">' +
                '<div id="addNew">' +
                    '<img src="../images/new.png" />' +
                '</div>' +
                '<div id="garbageBin">' +
                    '<img src="../images/trash-bin.jpg" />' +
                '</div>' +
                '<div id="spriteSelect">' +
                    '<select>' +
                        '<!-- Sprite names go here -->' +
                    '</select>' +
                '</div>' +
                '<div id="zipDownloadButton" style="display: none;">' +
                    'Download' +
                '</div>' +
            '</div>' +
            '<div class="sb2" id="palette" style="display: none;">' +
                '<div id="cats">' +
                    '<center>' +
                        '<table border="0">' +
                            '<tr>' +
                                '<td><div class="catSelect" name="motion" style="background-color: #4a6cd4;">Motion</div></td>' +
                                '<td><div class="catSelect" name="events" style="background-color: #c88330;">Events</div></td>' +
                            '</tr>' +
                            '<tr>' +
                                '<td><div class="catSelect" name="looks" style="background-color: #8a55d7;">Looks</div></td>' +
                                '<td><div class="catSelect" name="control" style="background-color: #e1a91a;">Control</div></td>' +
                            '</tr>' +
                            '<tr>' +
                                '<td><div class="catSelect" name="sound" style="background-color: #bb42c3;">Sound</div></td>' +
                                '<td><div class="catSelect" name="sensing" style="background-color: #2ca5e2;">Sensing</div></td>' +
                            '</tr>' +
                            '<tr>' +
                                '<td><div class="catSelect" name="pen" style="background-color: #0e9a6c;">Pen</div></td>' +
                                '<td><div class="catSelect" name="operators" style="background-color: #5cb712;">Operators</div></td>' +
                            '</tr>' +
                            '<tr>' +
                                '<td><div class="catSelect" name="data" style="background-color: #ee7d16;">Data</div></td>' +
                                '<td><div class="catSelect" name="custom" style="background-color: #5947b1;">More Blocks</div></td>' +
                            '</tr>' +
                        '</table>' +
                    '</center>' +
                '</div>' +
                
                '<div class="blockPalette" id="events" style="display: none;"></div>' +
                '<div class="blockPalette" id="control" style="display: none;"></div>' +
                '<div class="blockPalette" id="sensing" style="display: none;"></div>' +
                '<div class="blockPalette" id="operators" style="display: none;"></div>' +
                '<div class="blockPalette" id="custom" style="display: none;"><input type="button" id="createNewCustomBlock" value="Make a Block" onclick="$(\'#newCustomBlockDialog\').dialog(\'open\');ge.setCatsUp();" /></div>' +
                '<div class="blockPalette" id="motion" style="display: none;"></div>' +
                '<div class="blockPalette" id="looks" style="display: none;"></div>' +
                '<div class="blockPalette" id="sound" style="display: none;"></div>' +
                '<div class="blockPalette" id="pen" style="display: none;"></div>' +
                '<div class="blockPalette" id="data" style="display: none;"></div>' +
                
                '<center>' +
                    '<div class="catsUp">^^^</div>' +
                '</center>' +
            '</div>' +
            
            '<div id="costumes" style="display: none;"></div>' +
            '<div id="sounds" style="display: none;"></div>' +
            
            '<div id="blocks">' +
                '<!-- Blocks from project will be loaded here per sprite, as sprite is loaded -->' +
            '</div>' + 
            
            '<div id="dialogs">' +
            
                '<div id="newCustomBlockDialog" title="New Block" class="nowrap" ondialogcancel="$(\'#blockDesigner\').children().children().val(\'\').not(\':first\').remove();" ondialogok="var tmpLabel = \'\', tmpVarNames = [], tmpDefaults = [], tmpAtomic = $(\'#isCustomAtomic\').prop(\'checked\'); $(\'#blockDesigner\').children().children().each(function(){ if($(this).hasClass(\'label\')) { tmpLabel += $(this).val() + \' \'; }else if($(this).hasClass(\'string\')){ tmpLabel += \' %s \'; tmpVarNames.push($(this).val()); tmpDefaults.push(\'\'); }else if($(this).hasClass(\'number\')){ tmpLabel += \' %n \'; tmpVarNames.push($(this).val()); tmpDefaults.push(1); } }); ge.editor.parser.saveCurrentObjectInJSON(); ge.editor.currentObj.scripts.push([0, 0, [[\'procDef\', tmpLabel, tmpVarNames, tmpDefaults, tmpAtomic]]]); ge.editor.loadCurrentSelectedSprite();">' +
                    '<div id="blockDesigner" class="sb2">' +
                        '<div class="stack custom"><input style="background-color: purple; color: white;" class="label string" length="5" type="text" /></div>' + 
                    '</div>' +
                    
                    '<span>' +
                        'Add number input: <div class="button" id="addLabelToDeclaration" onclick="$(\'#blockDesigner\').children().append(\'<input class=\\\'number\\\' length=\\\'5\\\' type=\\\'text\\\' />\');"><div style="background-color: gray;width: 40px; height: 20px; border-radius: 10px;"></div></div><br />' +
                        'Add number input: <div class="button" id="addLabelToDeclaration" onclick="$(\'#blockDesigner\').children().append(\'<input class=\\\'string\\\' length=\\\'5\\\' type=\\\'text\\\' />\');"><div style="background-color: gray;width: 40px; height: 20px;"></div></div><br />' +
                        'Add label text: <div class="button" id="addLabelToDeclaration" onclick="$(\'#blockDesigner\').children().append(\'<input style=\\\'background-color: purple; color: white;\\\' class=\\\'label string\\\' length=\\\'5\\\' type=\\\'text\\\' />\');">text</div><br />' +
                        '<input id="isCustomAtomic" type="checkbox" /> Run without screen refresh' +
                    '</span>' +
                    
                '</div>' +
            
            '</div>'
            );
        
        //INITIAL EVENTS!
        ge.setCatsUp = function(finished){
            $("#palette").hide("blind", 400, function(){
                $(this).children().hide();
                $("#palette").children("#cats").show();
                $(".catsUp").parent().show();
                if (finished !== undefined) {
                    finished();
                }
            });
        };
        //Hide the garbage bin
        $("#garbageBin").hide();
        
        //Make the palette animate in and out
        $("#palette").hide();
        $("#addNew").click(function(){
            $("#palette").show("blind", 400);
        });
        
        $(".catsUp").click(function(){
            ge.setCatsUp();
        });
        $(".catSelect").click(function(){
            var self = this;
            $("#palette").hide("blind", 400, function(){
                $("#palette").children().hide();
                $("#palette").children("#" + $(self).attr("name")).show().css("height", ($(window).height() / 1.5) + "px");
                $(".catsUp").parent().show();
                $("#palette").show("blind", 400);
            });
        });
        $(".blockPalette").isolatedScroll();
        
        //Initialize the dialogs
        $("#dialogs").children().dialog({
            autoOpen: false,
            dialogClass: "no-close-button",
            resizable: false,
            buttons: [
                        {
                            text: "OK",
                            click: function() {
                                $(this).dialog("close");
                                if ($(this).attr("ondialogok") !== "") {
                                    eval($(this).attr("ondialogok"));
                                }
                            }
                        },
                        {
                          text: "Cancel",
                          click: function() {
                            $( this ).dialog( "close" );
                            if ($(this).attr("ondialogcancel") !== "") {
                                eval($(this).attr("ondialogcancel"));
                            }
                          }
                        }
                      ]
        });
        
        //Initialize the buttons
        $(".button").button();
        
        //INITIALIZE FIRST STEP OF ADDONS!
        $.each(ge.addons.population, function(index, value){
            value.initialize();
            value.initialized = true;
        });
    }
};

//enableZipDownloadButton >> enables the button that will download the project in the zip format, with extension .ge, and file name of the original project
ge.enableZipDownloadButton = function(){
    ge.addons.triggerEvent("ge.enableZipDownloadButton:before");
    
    $("#zipDownloadButton").click(function(e){
        ge.io.generateAndDownloadProjectZIP();
    }).show();
    
    
    ge.addons.triggerEvent("ge.enableZipDownloadButton:after");
};