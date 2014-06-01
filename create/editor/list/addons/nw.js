//DEPENDANCY: ge.js, Tools.js, addons.js, editor.js, io.js, AddonTemplate.js
//Adds support for node-webkit
var nwAddon = new Addon();

ge.addons.population.push(nwAddon);

nwAddon.usingnw = true;

//loadProjectZipFromNodeFile >> using node's file API, load a project ZIP from the system path given
ge.io.loadProjectZipFromNodeFile = function(path){
    ge.addons.triggerEvent("ge.io.loadProjectZipFromNodeFile:before");
    
    nwAddon.fs.readFile(path, function(err, data){
        if (err) throw err;
        
        //Set the zip file to the zipFile variable
        ge.io.zipFile = new nwAddon.JSZip(data);
        
        //Extract information from the project ZIP
        ge.io.extractProjectZipInfo();
	
        //Reload the project
	ge.editor.reloadProject();
        
        //Load the current selected sprite
        ge.editor.loadCurrentSelectedSprite();
    });
    
    ge.addons.triggerEvent("ge.io.loadProjectZipFromNodeFile:after");
};

nwAddon.initialize = function(){
    try {
        //Hold the node-webkit GUI
        this.gui = require("nw.gui");
        //Hold a copy of the filesystem
        this.fs = require("fs");
        //Hold a version of JSZip (from node.js)
        this.JSZip = require("jszip");
        //Hold a copy of the OS data
        this.os = require("os");
        
        //***HTML***//
        $("body").prepend("<input style=\"display: none;\" id=\"openFileDialog\" type=\"file\" accept=\".ge,.sb2\" />");
        
        //***LOCAL SERVER!***//
        //Hold a version of http
        var http = require("http");
        //Hold a version of Connect
        var connect = require('connect');
        try{
            http.createServer(connect().use(connect.static("./"))).listen(6564);
        }catch(e){
            console.log(e);
            console.warn("Something is using port [6564]. Relieve this port if you want to host GE files on your computer.");
        }
        
        //***WINDOW MENUS!***//
        var windowMenu = new this.gui.Menu({ type: 'menubar' });
        this.gui.Window.get().menu = windowMenu;
        
        var fileSubMenu = new this.gui.Menu();
        
        //SET SUB-MENUS!!
        fileSubMenu.append(new this.gui.MenuItem({ label: "New Project", click: function(e){
                if (window.confirm("Are you sure you want to make a new project?")) {
                    //Load up the default project
                    ge.io.loadProjectZipFromNodeFile("./create/editor/default.ge");
                }
            }
        }));
        fileSubMenu.append(new this.gui.MenuItem({ type: "separator" }));
        fileSubMenu.append(new this.gui.MenuItem({
                label: "Open...",
                click: function(e){
                        $("#openFileDialog").off("change").one("change", function(){
                            //Open it
                            ge.io.loadProjectZipFromNodeFile($(this).val());
                        }).click();
                }
        }));
        fileSubMenu.append(new this.gui.MenuItem({
                label: "Save",
                click: function(e){
                        saveProject();
                }
        }));
        fileSubMenu.append(new this.gui.MenuItem({
                label: "Save As...",
                click: function(e){
                        saveProjectAs();
                }
        }));
        fileSubMenu.append(new this.gui.MenuItem({ type: "separator" }));
        fileSubMenu.append(new this.gui.MenuItem({
                label: "Quit",
                click: function(e){
                        nwAddon.gui.Window.get().close();
                }
        }));
        
        //Set the menu of the window to our custom submenus (Mac OSX has needs to have File before required "Edit")
        if(this.os.platform() === "darwin"){
                this.gui.Window.get().menu.insert(new this.gui.MenuItem({ label: "File", submenu: fileSubMenu }), 1);
        }else{
                var finishedMenu = new this.gui.Menu({ type: "menubar" });
                finishedMenu.append(new this.gui.MenuItem({ label: "File", submenu: fileSubMenu }));
                
                this.gui.Window.get().menu = finishedMenu;
        }
        
        //***File Handling***//
        //If we were opened by a file, open the file (only the first one, though)
        if (this.gui.App.argv && this.gui.App.argv[0]) {
            //Open it
            ge.io.loadProjectZipFromNodeFile(this.gui.App.argv[0]);
        }else{
            //Load up the default project
            ge.io.loadProjectZipFromNodeFile("./create/editor/default.ge");
        }
        
        //***NW EVENTS***//
        //Listen to the window for closing; if there is an unsaved project, we should
        //ask the user if they want to save
        this.gui.Window.get().on("close", function(e){
            //CHECK FOR UNSAVED PROJECT!!
            ge.editor.parser.saveCurrentObjectInJSON();
            
            if (!Object.equals(ge.projectInfo.initialJSON, ge.projectInfo.json)) {
                if(window.confirm("Your project is unsaved!\nWould you like me to save it for you?"))
                {
                    saveProject();
                }
            }
            
            this.hide();
            //Shutdown
            this.close(true);
        });
        
    } catch(e) {
        console.log(e);
        console.warn("Not running in node-webkit, node-webkit features will be unavailable");
        
        nwAddon.usingnw = false;
    }
};

//Saves a project via node.js filesystem
nwAddon.saveProject = function(){
    window.alert("Save project code here");
};
//Saves a project as via node.js filesystem
nwAddon.saveProjectAs = function(){
    window.alert("Save project code here");
};