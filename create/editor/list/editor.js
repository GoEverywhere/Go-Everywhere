//////SWITCHED TO CLASS STRUCTURE, DO NOT USE THIS FILE!
//////Add in the files found in the sub-folder /classes. To find the correct order to load them in,
//////just look in each file and read the dependencies that the file needs to work correctly (dependencies should be loaded BEFORE the file needing them)
////VARIABLES
//vars;
//
///*************************************************/
//$(document).ready(function(){
//    //IO (with node.js)
//    if (usingnw || usinggap) {
//	//We don't need this here
//	$("#saveProject").remove();
//	if (usingnw) {
//		//We are in nw mode, so there is a project waiting (is required, either by user or default)
//		$(document).one("geprojectload", function(){
//		    doneReadingZip();
//		});
//		//We'll try reading the zip, just in case the file loaded quicker than we arrived here
//		try {
//		    doneReadingZip();
//		} catch(e) {
//		    //Nope, just wait.
//		}
//	}else if (usinggap) {
//		//Show the Android tools
//		$("#androidTools").show();
//		//Bind the "open" to the file browser
//		$("#androidTools #open").bind("touchstart", function(){
//		
//		});
//		//We are in gap, so we need to load the file here (we own the function)
//		loadProject("../default.ge");
//	}
//    }
//    //IO (with not using node.js)
//    if (!usingnw && !usinggap) {
//	$("#saveProject").bind("click touchend", function(e){
//		generateAndDownloadZIP();
//	});
//	if (vars['project'] && vars['project'] != "") {
//		//load project
//		loadProject(vars['project']);
//	}else{
//		$("#blocks").html("<br /><br /><h3>Please provide a project in ?project=PROJECT_PATH</h3>");
//	}
//    }
//});
//
//
