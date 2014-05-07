var usingnw = true;
try{
    //Hold the node-webkit GUI
    var gui = require("nw.gui");
    //Hold a copy of the filesystem
    var fs = require("fs");
    //Hold a version of JSZip (from node.js)
    var NodeJSZip = require("jszip");
    
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
    var windowMenu = new gui.Menu({ type: 'menubar' });
    gui.Window.get().menu = windowMenu;
    
    var fileSubMenu = new gui.Menu();
    
    gui.Window.get().menu.insert(new gui.MenuItem({ label: "File", submenu: fileSubMenu }), 1);
    
    
    //SET SUB-MENUS!!
    fileSubMenu.append(new gui.MenuItem({ label: "New Project", click: function(e){
            if (window.confirm("Are you sure you want to make a new project?")) {
                //Load up the default project
                fs.readFile("./create/editor/default.ge", function(err, data){
                    if (err) throw err;
                    zipFile = new NodeJSZip(data);
                    doneReadingZip();
                });
            }
        }
    }));
    fileSubMenu.append(new gui.MenuItem({ type: "separator" }));
    fileSubMenu.append(new gui.MenuItem({
        label: "Open...",
        click: function(e){
            $("#openFileDialog").off("change").one("change", function(){
                //Open it
                fs.readFile($(this).val(), function(err, data){
                    if (err) throw err;
                    zipFile = new NodeJSZip(data);
                    doneReadingZip();
                });
            }).click();
        }
    }));
    fileSubMenu.append(new gui.MenuItem({
        label: "Save",
        click: function(e){
            saveProject();
        }
    }));
    fileSubMenu.append(new gui.MenuItem({
        label: "Save As...",
        click: function(e){
            saveProjectAs();
        }
    }));
    fileSubMenu.append(new gui.MenuItem({ type: "separator" }));
    fileSubMenu.append(new gui.MenuItem({
        label: "Quit",
        click: function(e){
            gui.Window.get().close();
        }
    }));
    
    //Listen to the window for closing; if there is an unsaved project, we should
    //ask the user if they want to save
    gui.Window.get().on("close", function(e){
        //CHECK FOR UNSAVED PROJECT!!
        var tmpJSON = generateObjectJSON();
        if (tmpJSON.objName == "Stage") {
            project = tmpJSON;
        }else{
            $.each(project.children, function(index, value){
                if (project.children[index].objName == tmpJSON.objName) {
                    project.children[index] = tmpJSON;
                    return false; //jQuery's way of breaking
                }
            });
        }
        if (!Object.equals(initialProject, project)) {
            if(window.confirm("Your project is unsaved!\nWould you like me to save it for you?"))
            {
                saveProject();
            }
        }
        
        this.hide();
        //Shutdown
        this.close(true);
    });
    
    function saveProject() {
        window.alert("Save project code here");
    }
    function saveProjectAs(){
        window.alert("Save project as code here");
    }
    //If we were opened by a file, open the file (only the first one, though)
    if (gui.App.argv && gui.App.argv[0]) {
        //Open it
        fs.readFile(gui.App.argv[0], function(err, data){
            if (err) throw err;
            zipFile = new NodeJSZip(data);
            //doneReadingZip();
        });
    }else{
        //Load up the default project
        fs.readFile("./create/editor/default.ge", function(err, data){
            if (err) throw err;
            zipFile = new NodeJSZip(data);
            //doneReadingZip();
        });
    }
    
}catch(e){
    usingnw = false;
    console.log(e);
    console.warn("GE isn't running in node-webkit; some features may not work correctly or be unavailable.")
}