//DEPENDANCY: ge.js, tools.js
//Holds the functions needed to manipulate data from files

//Create the io object
ge.io = {
    //This will hold the data from the zip file (.ge, .sb2)
    zipFile : null
};

//extractProjectZipInfo >> takes the io.zipFile and extracts the contents into various places
ge.io.extractProjectZipInfo = function(){
    //Loop through all the files inside the project zip
    $.each(this.zipFile.files, function(index, value){
        //Check for the main project JSON
        if (value.name == "project.json") {
            //Set the project info the this project
            ge.projectInfo.json = JSON.parse(value.asText());
            //continue
            return true;
        }
        //Check for image files
        if (value.name.indexOf("png") > -1) {
            //Create a holder for the images if it doesn't exist
            if ($("#costumes").length === 0) {
                $("#body").prepend("<div style=\"display:none;\" id=\"costumes\"></div>");
            }
            //Add the image to the holder
            $("#costumes").html($("#costumes").html() + "<img name=\"" + value.name + "\" src=\"data:image/png;base64," + ge.Tools.base64Encode(value.asUint8Array()) + "\" />");
            //continue
            return true;
        }
        if (value.name.indexOf("jpg") > -1) {
            //Create a holder for the images if it doesn't exist
            if ($("#costumes").length === 0) {
                $("#body").prepend("<div style=\"display:none;\" id=\"costumes\"></div>");
            }
            //Add the image to the holder
            $("#costumes").html($("#costumes").html() + "<img name=\"" + value.name + "\" src=\"data:image/jpeg;base64," + ge.Tools.base64Encode(value.asUint8Array()) + "\" />");
            //continue
            return true;
        }
        //Check for sound files
        if (value.name.indexOf("png") > -1) {
            //Create a holder for the sounds if it doesn't exist
            if ($("#costumes").length === 0) {
                $("#body").prepend("<div style=\"display:none;\" id=\"sounds\"></div>");
            }
            //Add the image to the holder
            $("#sounds").html($("#sounds").html() + "<audio name=\"" + value.name + "\" src=\"data:audio/wav;base64," + ge.Tools.base64Encode(value.asUint8Array()) + "\" />");
            //continue
            return true;
        }
    });
};

//loadProjectZipFromURL >> loads a project in its ZIP format from the HTTP URL given
ge.io.loadProjectZipFromURL = function(url) {
    JSZipUtils.getBinaryContent(url, function(err, data){
	if (err) {
	    throw err;
	}
	
	ge.io.zipFile = new JSZip(data);
	
	//Save the project's filename
	ge.projectInfo.fileName = (url.substring(url.lastIndexOf('/')+1)).replace(/.[^.]+$/g, "").replace(/.[^.]+$/g, "");
	
        //Reload the project
	ge.editor.reloadProject();
        
        //Load the current selected sprite
        ge.editor.loadCurrentSelectedSprite();
    });
};

//generateAndDonloadProjectZIP >> generates the project zip and initializes a download
ge.io.generateAndDownloadProjectZIP = function(){
    //Make sure that our currentObj is saved
    ge.editor.parser.saveCurrentObjectInJSON();
    
    //ONLY SAVES THE JSON!!!!! (although, support can probably now be added for the other files, since the other files are loaded into the HTLM)
    ge.io.zipFile.file("project.json", JSON.stringify(ge.projectInfo.json ));
    
    //Compress the zip and give it to the user!
    saveAs(ge.io.zipFile.generate({ type: "blob" }), ge.projectInfo.fileName + ".ge");
};