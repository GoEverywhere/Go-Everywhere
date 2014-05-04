var usingnw = true;
try{
    //Hold the node-webkit GUI
    var gui = require("nw.gui");
    //Hold a copy of the filesystem
    var fs = require("fs");
    //Hold a version of JSZip (from node.js)
    var NodeJSZip = require("jszip");
    
    //***WINDOW MENUS!***//
    /*var windowMenu = new gui.Menu({
        "type": "menubar"
    });
    //FILE MENU!
    var fileMenuItem = new gui.MenuItem({
        label: "File"
    });
    windowMenu.append(fileMenuItem);
    
    gui.Window.get().menu = windowMenu;*/
    var windowMenu = new gui.Menu({ type: 'menubar' });
    gui.Window.get().menu = windowMenu;
    
    var fileSubMenu = new gui.Menu();
    fileSubMenu.append(new gui.MenuItem({ label: "New", click: function(e){
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
    
    gui.Window.get().menu.insert(new gui.MenuItem({ label: "File", submenu: fileSubMenu }), 1);
    
    
    
    $(document).ready(function(){
        //If we were opened by a file, open the file (only the first one, though)
        if (gui.App.argv && gui.App.argv[0]) {
            //Open it
            fs.readFile(gui.App.argv[0], function(err, data){
                if (err) throw err;
                zipFile = new NodeJSZip(data);
                doneReadingZip();
            });
        }else{
            //Load up the default project
            fs.readFile("./create/editor/default.ge", function(err, data){
                if (err) throw err;
                zipFile = new NodeJSZip(data);
                doneReadingZip();
            });
        }
    });
}catch(e){
    nw = false;
    console.log(e);
    console.warn("GE isn't running in node-webkit; some features may not work correctly or be unavailable.")
}