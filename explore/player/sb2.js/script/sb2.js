// sb2.js project viewer by RHY3756547
// ----------------------------------
//
// Converts scratch projects to javascript (client side) and excutes them.
//
// ZipFile (zip reader) by Cheeso (http://cheeso.members.winisp.net/)
// CanVG (for rasterising SVGs) by gabelerner i think (http://code.google.com/p/canvg/)


	touchButtonsX = [89, 19, 89, 159, 269, 339, 399]
	touchButtonsY = [214, 284, 284, 284, 284, 284, 214]
	touchButtonsWidth = [60, 60, 60, 60, 60, 120, 60]
	touchButtonsHeight = [60, 60, 60, 60, 60, 60, 60]
	touchButtonsKeyCode = [38, 37, 40, 39, 38, 32, 122]

// general purpose functions

// base 64 encode by some guy 
// thanks some guy

function createVarRefs(spriten) {

//setting var refs

			varRefs[spriten] = new Array();

			if (project.variables != undefined) {

				for (j=0;j<project.variables.length;j++) {
					varRefs[spriten][project.variables[j].name] = project.variables[j];
				}

			}

			if (sprites[spriten].variables != undefined) {

				for (j=0;j<sprites[spriten].variables.length;j++) {
					varRefs[spriten][sprites[spriten].variables[j].name] = sprites[spriten].variables[j];
				}

			}

			//setting list refs

			listRefs[spriten] = new Array();

			if (project.lists != undefined) {

				for (j=0;j<project.lists.length;j++) { //stage variables are first, which are then overridden by local.
					listRefs[spriten][project.lists[j].listName] = project.lists[j];
				}

			}

			if (sprites[spriten].lists != undefined) {

				for (j=0;j<sprites[spriten].lists.length;j++) {
					listRefs[spriten][sprites[spriten].lists[j].listName] = sprites[spriten].lists[j];
				}

			}


}

function connectMesh() {
	server = prompt("Server IP (eg. ws://86.128.200.191:50234)");

	window.WebSocket = window.WebSocket || window.MozWebSocket;

	connection = new WebSocket(server);

	connection.onopen = function () {
		alert("connected - make sure other user connects");
		mesh = true;
		// connection is opened and ready to use
	};

	connection.onerror = function (error) {
		log(error);
	};

	connection.onmessage = function (message) {
		json = JSON.parse(message.data);
		//if (json.type == "greenFlag") execGreenFlag();
		if (json.type == "variables") meshVars = json.data;
		else if (json.type == "broadcast") scratchBroadcast("stage", json.data, true);
	};
	
}

function castNumber(casting) {
	if (typeof casting === 'number') return casting;
	casting = Number(casting);
	if (casting == casting) return casting; //fast NaN test
	else return 0;
}

window.ondevicemotion = function(event) {
	if (!loadedb) return;

	var accel = (event.accelerationIncludingGravity);

	if ((Math.sqrt(Math.pow(accel.x, 2) + Math.pow(accel.y, 2) + Math.pow(accel.z, 2)) > 20) && (!(shakeToggle))) { turboMode = (!(turboMode)); shakeToggle = true; }
	else shakeToggle = false;
}

function base64Encode(bytearray){

    var digits = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
        i = 0,
        cur, prev, byteNum,
        result=[];      

    while(i < bytearray.length){

        cur = bytearray[i];
        byteNum = i % 3;

        switch(byteNum){
            case 0: //first byte
                result.push(digits.charAt(cur >> 2));
                break;

            case 1: //second byte
                result.push(digits.charAt((prev & 3) << 4 | (cur >> 4)));
                break;

            case 2: //third byte
                result.push(digits.charAt((prev & 0x0f) << 2 | (cur >> 6)));
                result.push(digits.charAt(cur & 0x3f));
                break;
        }

        prev = cur;
        i++;
    }

    if (byteNum == 0){
        result.push(digits.charAt((prev & 3) << 4));

        result.push("==");
    } else if (byteNum == 1){
        result.push(digits.charAt((prev & 0x0f) << 2));
        result.push("=");
    }

    return result.join("");
}

function scriptTypeToID(value) {
	if (value == "greenFlag") return 0;
	else if (value == "forever") return 1;
	else if (value == "wait") return 2;
	else if (value == "keyPress") return 3;
	else if (value == "repeat") return 4;
	else if (value == "broadcast") return 5;
	else if (value == "clone") return 6;
	else if (value == "clicked") return 7;
}

function getBroadcastID(value) {
	if (broadcastArgs.indexOf(value) != -1) return broadcastArgs.indexOf(value);
	else return value;
}

function computeHue(r, g, b){
	r /= 255
	g /= 255
	b /= 255
	var compval = Math.atan2((g-b)*(1.7320508075688772935274463415059), 2*r-g-b);

	if (isNaN(compval)) return 0;
	else return compval;
}

function computeLightness(r, g, b){
	var smax = Math.max(r, g, b);
	var smin = Math.min(r, g, b);

	return ((smax+smin)/2)*100/255;
}

function computeSaturation(r, g, b){
	var smax = Math.max(r, g, b)
	var smin = Math.min(r, g, b)
	var delta = (smax-smin)/255

	if (delta == 0) {
		return 0;
	} else {
		return (delta/(1-Math.abs((2*((smax+smin)/2)/255)-1)))*100;
	}
}

// Custom 'midi' engine, as 'midi' as one square wave instrument can get. Might make it sample based in the future.

function genNote(note, duration) {

	if (!(audioSupported)) return;

	note = Math.round(note);
	duration = Math.min(10, duration);

	sampleRate = 44100;
	volume = 0.5;

	peak = Math.round(32767*volume);

	bottom = Math.round(65536-32767*volume);

	notedata = "" //generate square wave

	oneWave = "" //generate square wave

	frequency = sampleRate/(Math.pow(2, (note-69)/12) * 440)
	length = sampleRate*duration/frequency-1;

	for (i=0;i<frequency;i++) {
	
		if (i%frequency < frequency/2) {
        		oneWave += String.fromCharCode(peak % 256);
        		oneWave += String.fromCharCode(Math.floor(peak / 256));
		} else {
        		oneWave += String.fromCharCode(bottom % 256);
        		oneWave += String.fromCharCode(Math.floor(bottom / 256));
		}

	}

	notedata = oneWave.substr(0)

	for (i=0;i<length;i++) {
	
		notedata += oneWave;

	}

	audioplayer = document.createElement("audio");
	audioplayer.src = encodeAudio16bit(notedata);
	audioplayer.play();

}

// ADPCM reader. NOT DONE YET.

function readBytes(start, length, type) {

	if (type == "string") {

		var returnval = ""

		for (j=0;j<length;j++) {
			returnval += String.fromCharCode(uInt8Array[start+j]);
		}

	} else {

		var returnval = 0;

		for (j=0;j<length;j++) {
			returnval += uInt8Array[start+j] << (8*j);
		}
	}

	return returnval;
	
}


function readADPCM() {

		channels = readBytes(22, 2, 'int');
		blockAlign = readBytes(32, 2, 'int');
		samplesPerBlock = (blockAlign - 4) + 1;

		sampleRate = readBytes(24, 4, 'int');

		if (readBytes(20, 2, 'int') != 1) {
			offset = 38+readBytes(36, 2, 'int');
		} else {
			offset = 36;
		}

		offset += 8+readBytes(offset+4, 4, 'int');

		soundBytes = readBytes(offset+4, 4, 'int');

		nBlocks = soundBytes/blockAlign

		offset += 8;

		lookupTable = ["111", "110", "101", "100", "011",  "010",  "001",  "000"]
		resultStepChange = [-1, -1, -1, -1, 2, 4, 6, 8, -1, -1, -1, -1, 2, 4, 6, 8]
		stepSizes = [7, 8, 9, 10, 11, 12, 13, 14, 16, 17, 19, 21, 23, 25, 28, 31, 34, 37, 41, 45, 50, 55, 60, 66, 73, 80, 88, 97, 107, 118, 130, 143, 157, 173, 190, 209, 230, 253, 279, 307, 337, 371, 408, 449, 494, 544, 598, 658, 724, 796, 876, 963, 1060, 1166, 1282, 1411, 1552, 1707, 1878, 2066, 2272, 2499, 2749, 3024, 3327, 3660, 4026, 4428, 4871, 5358, 5894, 6484, 7132, 7845, 8630, 9493, 10442, 11487, 12635, 13899, 15289, 16818, 18500, 20350, 22385, 24623, 27086, 29794, 32767]

		stepID = 8;
		step = 16;
		s = 0

		soundData = new Array();
		volume = 0;

		samplesPerBlock -= 1;

		for (b=0; b<nBlocks; b++) {

		in_s = s

		volume=readBytes(s+offset, 2, 'int')
		if (volume > 32767) volume = (volume-65536);
		stepID=Math.max(0, Math.min(readBytes(s+offset+2, 1, 'int'), 88));
		
		s += 4
		var sample = Math.round(volume);
		if (sample < 0) {
			sample += 65536; // 2's complement signed
		}
		soundData.push(String.fromCharCode(sample % 256));
		soundData.push(String.fromCharCode(Math.floor(sample / 256)));


		for (as=0; as<samplesPerBlock; as++) {



			byte = uInt8Array[s+offset].toString(2);
			while (byte.length<8) {
				byte = "0"+byte;
			}

			for (nibble=0; nibble<2; nibble++) {

				nib = parseInt(byte.substr(nibble*4, 4), 2);

				nib &= 15;

				step = stepSizes[stepID];

				diff = step >> 3;
				if (nib & 1) diff += step >> 2;
				if (nib & 2) diff += step >> 1;
				if (nib & 4) diff += step;

				//diff = Math.round(step*nib[1] + (step/2)*nib[2+nib] + (step/4)*nib[3+nib] + step/8)

				if (nib & 8) diff = 0-diff;
				volume = Math.max(Math.min(32767, volume+diff), -32768)

				var sample = Math.round(volume);
      				if (sample < 0) {
					sample += 65536; // 2's complement signed
				}
				soundData.push(String.fromCharCode(sample % 256));
				soundData.push(String.fromCharCode(Math.floor(sample / 256)));

				stepID = Math.max(0, Math.min(stepID+resultStepChange[nib], 88));


			}

			s += 1;
		}

		s = in_s + blockAlign

		}

	return encodeAudio16bitString(soundData);

}

// wav header stuff by acko 
// thanks acko

  function encodeAudio16bit(data) {
      var n = data.length;
      var integer = 0, i;
      
      // 16-bit mono WAVE header template
      var header = "RIFF<##>WAVEfmt \x10\x00\x00\x00\x01\x00\x01\x00<##><##>\x02\x00\x10\x00data<##>";

      // Helper to insert a 32-bit little endian int.
      function insertLong(value) {
        var bytes = "";
        for (i = 0; i < 4; ++i) {
          bytes += String.fromCharCode(value % 256);
          value = Math.floor(value / 256);
        }
        header = header.replace('<##>', bytes);
      }

      // ChunkSize
      insertLong(36 + n * 2);
      
      // SampleRate
      insertLong(sampleRate);

      // ByteRate
      insertLong(sampleRate * 2);

      // Subchunk2Size
      insertLong(n * 2);
      
      // Output sound data

	header += data;

      /*
      for (var i = 0; i < n; ++i) {
        var sample = Math.round(Math.min(1, Math.max(-1, data[i])) * 32767);
        if (sample < 0) {
          sample += 65536; // 2's complement signed
        }
        header += String.fromCharCode(sample % 256);
        header += String.fromCharCode(Math.floor(sample / 256));
      }
      */
      
      return 'data:audio/wav;base64,' + btoa(header);
    }

  function encodeAudio16bitString(data) {
      var n = data.length/2;
      var integer = 0, i;
      
      // 16-bit mono WAVE header template
      var header = "RIFF<##>WAVEfmt \x10\x00\x00\x00\x01\x00\x01\x00<##><##>\x02\x00\x10\x00data<##>";

      // Helper to insert a 32-bit little endian int.
      function insertLong(value) {
        var bytes = "";
        for (i = 0; i < 4; ++i) {
          bytes += String.fromCharCode(value % 256);
          value = Math.floor(value / 256);
        }
        header = header.replace('<##>', bytes);
      }

      // ChunkSize
      insertLong(36 + n * 2);
      
      // SampleRate
      insertLong(sampleRate);

      // ByteRate
      insertLong(sampleRate * 2);

      // Subchunk2Size
      insertLong(n * 2);
      
      // Output sound data

      header += data.join("");
      
      return 'data:audio/wav;base64,' + btoa(header);
    }

function drawRoundedRectangle(targetcontext, x, y, width, height, roundedpx) { //i draw a lot of these

	x += 0.5;
	y += 0.5;

	targetcontext.beginPath();
	targetcontext.moveTo(x+roundedpx, y);
	targetcontext.lineTo(x+width-roundedpx, y);
	targetcontext.bezierCurveTo(x+width, y, x+width, y+roundedpx, x+width, y+roundedpx);
	targetcontext.lineTo(x+width, y+height-roundedpx);
	targetcontext.bezierCurveTo(x+width, y+height, x+width-roundedpx, y+height, x+width-roundedpx, y+height);
	targetcontext.lineTo(x+roundedpx, y+height);
	targetcontext.bezierCurveTo(x, y+height, x, y+height-roundedpx, x, y+height-roundedpx);
	targetcontext.lineTo(x, y+roundedpx);
	targetcontext.bezierCurveTo(x, y, x+roundedpx, y, x+roundedpx, y);
	targetcontext.lineTo(x+roundedpx+0.1, y);
	targetcontext.closePath();

	x -= 0.5;
	y -= 0.5;

}



function processLayerOps() {

	for (i=0;i<layerOperations.length;i++) {

		if (layerOperations[i].op == "front") {
			var temp = layerOrder.indexOf(layerOperations[i].sprite)
			layerOrder.splice(temp, 1);
			layerOrder.push(layerOperations[i].sprite);

		} else if (layerOperations[i].op == "back") {
			var temp = layerOrder.indexOf(layerOperations[i].sprite);
			layerOrder.splice(temp, 1);
			layerOrder.splice(Math.max(0, Math.min(sprites.length, (temp-layerOperations[i].num-1))), 0, layerOperations[i].sprite);
		}

	}

}

// SCRATCH DRAWING FUNCTIONS (ENGINE, NOT PEN)

function scratchPartialDraw(startl, finishl) { //used for color collision

	if (startl == 0) {

	sprctx.clearRect(0, 0, 480, 360);

	for (ent2=0;ent2<layerOrderVarDisplay.length;ent2++) {
			
		if (layerOrderVarDisplay[ent2] == -1) {
			drawVariableDisplay(ent2);
		}

	}

	}

	spr2 = 0;

	for (num2=startl;num2<finishl;num2++) { //spr=0;sprites.length;spr++

		for (ent2=0;ent2<layerOrderVarDisplay.length;ent2++) {
			
			if (layerOrderVarDisplay[ent2] == num2) {
				drawVariableDisplay(ent2);
			}

		}

// ------- SPRITES -------

		spr2 = layerOrder[num2]; 

		if (sprites[spr2] == undefined) continue;

		if (sprites[spr2].visible) {

		scratchDrawSprite(sprctx, spr2);

		}

	}

}

function scratchDrawAllBut(thectx, exceptfor) { //used for color collision


	spr2 = 0;

	for (num2=0;num2<layerOrder.length;num2++) { //spr=0;sprites.length;spr++


// ------- SPRITES -------

		spr2 = layerOrder[num2]; 

		if (spr2 != exceptfor) {

		if (sprites[spr2] == undefined) continue;

		if (sprites[spr2].visible) {

		scratchDrawSprite(thectx, spr2);

		}

		}

	}

}

function scratchDrawSpeech() {

	for (ent=0;ent<sprites.length;ent++) {

		spr = layerOrder[ent]; 

		if (sprites[spr] == undefined) continue;

		if (sprites[spr].visible) {

			if (specialproperties[spr].say != "") {

				if (specialproperties[spr].say != specialproperties[spr].sayold) {

				specialproperties[spr].sayold = specialproperties[spr].say;
				specialproperties[spr].saylist = new Array();
				sprctx.font = "Bold 10pt Arial";
				var j=0
				var sayprevstring = "";
				var sayprevword = "";
				var saycurword = "";
				var saystring = "";
				
				for (var i=0; i<specialproperties[spr].say.length; i++) {
					sayprevstring = saystring;
					saystring += specialproperties[spr].say.substr(i, 1);
					if (specialproperties[spr].say.substr(i, 1) != " ") {
						saycurword += specialproperties[spr].say.substr(i, 1);
					} else {
						sayprevword += saycurword+" "
						saycurword = "";
					}

					saywidth = sprctx.measureText(saystring).width
					if (saywidth > 128) {
						if (sayprevword == "") {
							i -= 1;
							specialproperties[spr].saylist[j] = sayprevstring;
							saystring = "";
						} else {
							specialproperties[spr].saylist[j] = sayprevword;
							sayprevword = ""
							saystring = saycurword;
						}							
						sayprevstring = "";
						j += 1;
					}
				}
				if (saystring != "") {
					specialproperties[spr].saylist[specialproperties[spr].saylist.length] = saystring;
				}

				}

				var costume = sprites[spr].costumes[sprites[spr].currentCostumeIndex];

				var sayheight = 15*specialproperties[spr].saylist.length-6
				if (specialproperties[spr].saylist.length == 1) var saylength = Math.max(45, sprctx.measureText(specialproperties[spr].saylist[0]).width);
				else var saylength = 128;

				var sayright = true;

				var sayx = Math.max(8, ((sprites[spr].scratchX+240)-costume.rotationCenterX)+images[costume.baseLayerID].width+8);
				if (sayx+saylength+8 > 480) {
					sayright = false;

					sayx = Math.max(8, Math.min(480-(saylength+8), ((sprites[spr].scratchX+240)-costume.rotationCenterX)-(saylength+8)));
				}
				var sayy = Math.min((360-sayheight)-32, Math.max(8, ((180-sprites[spr].scratchY)-costume.rotationCenterY)-sayheight-16));

				sprctx.beginPath();
				sprctx.moveTo(sayx, sayy-8);
				sprctx.lineTo(sayx+saylength, sayy-8);
				sprctx.bezierCurveTo(sayx+saylength+8, sayy-8, sayx+saylength+8, sayy, sayx+saylength+8 , sayy)			
				sprctx.lineTo(sayx+saylength+8, sayy+sayheight);
				sprctx.bezierCurveTo(sayx+saylength+8, sayy+sayheight+8, sayx+saylength, sayy+sayheight+8, sayx+saylength , sayy+sayheight+8)

				if (!(specialproperties[spr].think)) {

				if (sayright) {
					sprctx.lineTo(sayx+40, sayy+sayheight+8);
					sprctx.lineTo(sayx, sayy+sayheight+8+16);
					sprctx.lineTo(sayx+5, sayy+sayheight+8);				
				} else {
					sprctx.lineTo(sayx+saylength-5, sayy+sayheight+8);
					sprctx.lineTo(sayx+saylength, sayy+sayheight+8+16);
					sprctx.lineTo(sayx+saylength-40, sayy+sayheight+8);	
				}

				}


				sprctx.lineTo(sayx, sayy+sayheight+8);	
				sprctx.bezierCurveTo(sayx-8, sayy+sayheight+8, sayx-8, sayy+sayheight, sayx-8, sayy+sayheight);
				sprctx.lineTo(sayx-8, sayy);	
				sprctx.bezierCurveTo(sayx-8, sayy-8, sayx, sayy-8, sayx, sayy-8);
				sprctx.closePath();
				sprctx.lineWidth = 3;
				if (specialproperties[spr].ask) {
					sprctx.strokeStyle = "#4FAFDA";
				} else {
					sprctx.strokeStyle = "#C4C4C4";
				}
				sprctx.fillStyle = "#FFFFFF";
				sprctx.fill();
				sprctx.stroke();

				if (specialproperties[spr].think) {

					sprctx.lineWidth = 2;

					if (sayright) {

					sprctx.beginPath();
					sprctx.moveTo(sayx+6, sayy+sayheight+8+6);
					sprctx.bezierCurveTo(sayx+6, sayy+sayheight+8+3, sayx+12, sayy+sayheight+8+3, sayx+12, sayy+sayheight+8+3);
					sprctx.bezierCurveTo(sayx+18, sayy+sayheight+8+3, sayx+18, sayy+sayheight+8+6, sayx+18, sayy+sayheight+8+6);
					sprctx.bezierCurveTo(sayx+18, sayy+sayheight+8+9, sayx+12, sayy+sayheight+8+9, sayx+12, sayy+sayheight+8+9);
					sprctx.bezierCurveTo(sayx+6, sayy+sayheight+8+9, sayx+6, sayy+sayheight+8+6, sayx+6, sayy+sayheight+8+6);
					sprctx.fill();
					sprctx.stroke();


					sprctx.beginPath();
					sprctx.moveTo(sayx+2, sayy+sayheight+8+14);
					sprctx.bezierCurveTo(sayx+2, sayy+sayheight+8+12, sayx+6, sayy+sayheight+8+12, sayx+6, sayy+sayheight+8+12);
					sprctx.bezierCurveTo(sayx+10, sayy+sayheight+8+12, sayx+10, sayy+sayheight+8+14, sayx+10, sayy+sayheight+8+14);
					sprctx.bezierCurveTo(sayx+10, sayy+sayheight+8+16, sayx+6, sayy+sayheight+8+16, sayx+6, sayy+sayheight+8+16);
					sprctx.bezierCurveTo(sayx+2, sayy+sayheight+8+16, sayx+2, sayy+sayheight+8+14, sayx+2, sayy+sayheight+8+14);
					sprctx.fill();
					sprctx.stroke();

					sprctx.beginPath();
					sprctx.arc(sayx-2, sayy+sayheight+8+18, 1.5, 0, Math.PI*2, true); 
					sprctx.fill();
					sprctx.stroke();

					} else {

					sprctx.beginPath();
					sprctx.moveTo((sayx+saylength)-6, sayy+sayheight+8+6);
					sprctx.bezierCurveTo((sayx+saylength)-6, sayy+sayheight+8+3, (sayx+saylength)-12, sayy+sayheight+8+3, (sayx+saylength)-12, sayy+sayheight+8+3);
					sprctx.bezierCurveTo((sayx+saylength)-18, sayy+sayheight+8+3, (sayx+saylength)-18, sayy+sayheight+8+6, (sayx+saylength)-18, sayy+sayheight+8+6);
					sprctx.bezierCurveTo((sayx+saylength)-18, sayy+sayheight+8+9, (sayx+saylength)-12, sayy+sayheight+8+9, (sayx+saylength)-12, sayy+sayheight+8+9);
					sprctx.bezierCurveTo((sayx+saylength)-6, sayy+sayheight+8+9, (sayx+saylength)-6, sayy+sayheight+8+6, (sayx+saylength)-6, sayy+sayheight+8+6);
					sprctx.fill();
					sprctx.stroke();


					sprctx.beginPath();
					sprctx.moveTo((sayx+saylength)-2, sayy+sayheight+8+14);
					sprctx.bezierCurveTo((sayx+saylength)-2, sayy+sayheight+8+12, (sayx+saylength)-6, sayy+sayheight+8+12, (sayx+saylength)-6, sayy+sayheight+8+12);
					sprctx.bezierCurveTo((sayx+saylength)-10, sayy+sayheight+8+12, (sayx+saylength)-10, sayy+sayheight+8+14, (sayx+saylength)-10, sayy+sayheight+8+14);
					sprctx.bezierCurveTo((sayx+saylength)-10, sayy+sayheight+8+16, (sayx+saylength)-6, sayy+sayheight+8+16, (sayx+saylength)-6, sayy+sayheight+8+16);
					sprctx.bezierCurveTo((sayx+saylength)-2, sayy+sayheight+8+16, (sayx+saylength)-2, sayy+sayheight+8+14, (sayx+saylength)-2, sayy+sayheight+8+14);
					sprctx.fill();
					sprctx.stroke();

					sprctx.beginPath();
					sprctx.arc((sayx+saylength)+2, sayy+sayheight+8+18, 1.5, 0, Math.PI*2, true); 
					sprctx.fill();
					sprctx.stroke();

					}

				}

				if (specialproperties[spr].ask) {
					sprctx.fillStyle = "#4FAFDA";
				} else {
					sprctx.fillStyle = "#333333";	
				}

				for (var i=0; i<specialproperties[spr].saylist.length; i++) {	
					//log(specialproperties[spr].saylist[i]);
					var linelength = sprctx.measureText(specialproperties[spr].saylist[i]).width;
					sprctx.fillText(specialproperties[spr].saylist[i], sayx+(saylength/2)-(linelength/2), sayy+8+i*15);
				}
				
			}

		}

	}

	if (askString != "") {
		sprctx.lineWidth = 3;
		sprctx.fillStyle = "#FFFFFF";
		sprctx.strokeStyle = "#4FAFDA";

		if ((askOwner != "stage") && sprites[askOwner].visible) {
			drawRoundedRectangle(sprctx, 16, 319, 448, 35, 9)
			sprctx.fill();
			sprctx.stroke();
		} else {

			drawRoundedRectangle(sprctx, 16, 304, 448, 50, 9)
			sprctx.fill();
			sprctx.stroke();

			sprctx.fillStyle = "#4FAFDA";
			sprctx.font = "Bold 10pt Arial";
			sprctx.fillText(askString, 25, 321, 400);
		}

		drawRoundedRectangle(sprctx, 24, 326, 410, 21, 3)
		sprctx.lineWidth = 2;
		sprctx.fillStyle = "#F2F2F2";
		sprctx.strokeStyle = "#CCCCCC";
		sprctx.fill();
		sprctx.stroke();

		sprctx.fillStyle = "#333333";
		sprctx.font = "Bold 10pt Arial";
		sprctx.fillText(askAnswer, 30, 341, 400);

		sprctx.drawImage(accept, 439, 326);

		if ((askCursorBlink % 2) < 1) {
			sprctx.fillStyle = "#50AFDA";
			sprctx.fillRect(31+sprctx.measureText(askAnswer.substr(0, cursorPosition)).width, 330, 2, 13);	
		}

		askCursorBlink += 0.1;


	}
}

// SCRATCH EXECUTION QUEUE FUNCTIONS

function scratchBroadcast(spriteu, brdc, byMesh) {
	if (brdc.substr(0,6) == "sb2js-") sb2jsFunction(spriteu, brdc); 
	active = true;
	abortscripts = false;
	scratchAddExecution(spriteu, 'broadcast', getBroadcastID(brdc), 1); 
	if ((byMesh == undefined) && mesh) {
		var packet = {};
		packet.type = "broadcast";
		packet.data = brdc;
		connection.send(JSON.stringify(packet));
	}
}

function sb2jsFunction(spriten, command) {
	switch (command) {
		case "sb2js-close":
			window.close();
	}
}

function scratchAddExecution(spriten, type, sid, time, ttype, tsid, repeatstackn, repeatNum) {
	if (typeof repeatNum == "undefined") repeatNum = 0;
	broadcastReturn = false;

	if (type != 'broadcast') {

	if (typeof repeatstackn == "undefined") {
		repeatstackn = repeatStacks[spriten].length;
		repeatStacks[spriten].push(new Array());
	}

	var obj = {"type": type, "scriptID": sid, "timeUntil": time, "repeatNum": repeatNum, "topLevelType": ttype, "topLevelSID": tsid, "repeatStack": repeatstackn};
	executionQueue[spriten].push(obj);

	} else {

	var initsprite = spriten;
	for (spriten=0;spriten<sprites.length;spriten++) {

		if (scripts[spriten][5][sid] != undefined) {
			for (brc=0;brc<executionQueue[spriten].length;brc++) {
				if (("broadcast" == executionQueue[spriten][brc].topLevelType) && (sid == executionQueue[spriten][brc].topLevelSID) && !((spriten == initsprite) && (brc == q))) eraseExec(spriten, brc);
				if ((spriten == initsprite) && (brc == q) && ("broadcast" == executionQueue[spriten][brc].topLevelType) && (sid == executionQueue[spriten][brc].topLevelSID)) broadcastReturn = true;
			}

			if (typeof bcRepeatStackIDs[spriten][sid] == "undefined") {

				repeatstackn = repeatStacks[spriten].length;
				repeatStacks[spriten].push(new Array());
				bcRepeatStackIDs[spriten][sid] = repeatstackn;

				repeatStackCount += 1;

			} else {

				repeatstackn = bcRepeatStackIDs[spriten][sid];

			}

			var obj = {"type": type, "scriptID": sid, "timeUntil": time, "repeatNum": repeatNum, "topLevelType": "broadcast", "topLevelSID": sid, "repeatStack": repeatstackn};

			executionQueue[spriten].push(obj);
			//executionQueue[spriten].splice(q+1, 0, obj);
		}
	}

	spriten = "stage";

		if (scripts[spriten][5][sid] != undefined) {
			for (brc=0;brc<executionQueue[spriten].length;brc++) {
				if (("broadcast" == executionQueue[spriten][brc].topLevelType) && (sid == executionQueue[spriten][brc].topLevelSID) && !((spriten == initsprite) && (brc == q))) eraseExec(spriten, brc);
				if ((spriten == initsprite) && (brc == q) && ("broadcast" == executionQueue[spriten][brc].topLevelType) && (sid == executionQueue[spriten][brc].topLevelSID)) broadcastReturn = true;
			}

			if (typeof bcRepeatStackIDs[spriten][sid] == "undefined") {

				repeatstackn = repeatStacks[spriten].length;
				repeatStacks[spriten].push(new Array());
				bcRepeatStackIDs[spriten][sid] = repeatstackn;

				repeatStackCount += 1;

			} else {

				repeatstackn = bcRepeatStackIDs[spriten][sid];

			}

			var obj = {"type": type, "scriptID": sid, "timeUntil": time, "repeatNum": repeatNum, "topLevelType": "broadcast", "topLevelSID": sid, "repeatStack": repeatstackn};

			executionQueue[spriten].push(obj);
			//executionQueue[spriten].splice(q+1, 0, obj);
		}

	}
}

function terminateScript(spritey) {
	for (r=0; r<executionQueue[spritey].length; r++) {
		if ((r != q) && (executionQueue[spritey][r].topLevelSID = topSID)) eraseExec(spritey, r);
	}
}

function eraseExec(spriten, value) {
	executionQueue[spriten].splice(value, 1);

	for (r=0; r<repeatStacks[spriten].length; r++) {
		for (stack=0; stack<repeatStacks[spriten][r].length; stack++) {
		if (repeatStacks[spriten][r][stack] > value) repeatStacks[spriten][r][stack] -= 1;
		}
	}
	if ((spr == spriten) && (q > value)) q -= 1;
}

function processExecutionQueue() {

		for (q=0;q<executionQueue[spr].length;q++) {

			thisQItem = executionQueue[spr][q]

			topType = thisQItem.topLevelType;
			topSID = thisQItem.topLevelSID;
			topRepeat = thisQItem.repeatStack;

			if (thisQItem.type == "wait") {

				if (thisQItem.timeUntil == 'untilBroadcast') {
					broadcastWait = false;
					for (bspr=0;bspr<sprites.length;bspr++) {
						for (qitem=0;qitem<executionQueue[bspr].length;qitem++) {
							if ((executionQueue[bspr][qitem].topLevelSID == thisQItem.repeatNum) && (executionQueue[bspr][qitem].topLevelType == "broadcast")) broadcastWait = true;
						}
					}
					bspr = "stage";
					for (qitem=0;qitem<executionQueue[bspr].length;qitem++) {
						if ((executionQueue[bspr][qitem].topLevelSID == thisQItem.repeatNum) && (executionQueue[bspr][qitem].topLevelType == "broadcast")) broadcastWait = true;
					}
				} else {
					broadcastWait = false;
				}

				if (!(broadcastWait) && ((thisQItem.timeUntil == "untilBroadcast") || ((thisQItem.timeUntil == "untilAnswered" && (askString == "")) || (!(thisQItem.timeUntil == "untilAnswered") && (0 >= thisQItem.timeUntil))))) {

					scripts[spr][2][thisQItem.scriptID]();

					if (abortscripts) break;
					executionQueue[spr].splice(q,1);

					for (r=0; r<repeatStacks[spr].length; r++) {
						for (stack=0; stack<repeatStacks[spr][r].length; stack++) {
						if (repeatStacks[spr][r][stack] > q) repeatStacks[spr][r][stack] -= 1;
						}
					}

					q -= 1;


				} else if (!(broadcastWait)) {
					if (!(thisQItem.timeUntil == "untilAnswered")) {
						thisQItem.timeUntil -= 1/FPS;
					}
				}

			} else if (thisQItem.type == "broadcast") {

				
				if (0 >= thisQItem.timeUntil) {

					for (b=0; b<scripts[spr][scriptTypeToID(thisQItem.type)][thisQItem.scriptID].length; b++) {
						scripts[spr][scriptTypeToID(thisQItem.type)][thisQItem.scriptID][b]();

						if (abortscripts) break;
						if (!(active)) break;
					}

					executionQueue[spr].splice(q,1);

					for (r=0; r<repeatStacks[spr].length; r++) {
						for (stack=0; stack<repeatStacks[spr][r].length; stack++) {
						if (repeatStacks[spr][r][stack] > q) repeatStacks[spr][r][stack] -= 1;
						}
					}

					q -= 1;

				} else {
					thisQItem.timeUntil -= 1;
				}

			} else if ((thisQItem.type == "forever" || thisQItem.type == "repeat" || thisQItem.type == "clone")) {

				if (thisQItem.timeUntil != "onHold" && 0 >= thisQItem.timeUntil) {

					repeatBreak = (!(thisQItem.type == "repeat"));

					scripts[spr][scriptTypeToID(thisQItem.type)][thisQItem.scriptID]();

					if (abortscripts) break;

					if (repeatBreak || (thisQItem.repeatNum <= 0)) {

					executionQueue[spr].splice(q,1);

					for (r=0; r<repeatStacks[spr].length; r++) {
						for (stack=0; stack<repeatStacks[spr][r].length; stack++) {
						if (repeatStacks[spr][r][stack] > q) repeatStacks[spr][r][stack] -= 1;
						}
					}

					q -= 1;

					} else {
						thisQItem.timeUntil = "onHold";	
					}

				} else {
					thisQItem.timeUntil -= 1;
				}
			}

			if (abortscripts) break;
			if (!(active)) break;

		}

}


function scratchRemoveExtraBrackets(text) {

	var openbrackets = 0;
	deleteMode = false;

	var result = "result = function() { ";

	for (char = 0;char<text.length;char++) {

		if (deleteMode) {

		if (text.charAt(char) == "{") deleteBrackets += 1;
		if (text.charAt(char) == "}") {
			if (deleteBrackets > 0) {
				deleteBrackets -= 1;
			} else {
				deleteMode = false;
			}
		}

		} else {

		if ((text.substr(char, 8) == "} else {") && (openbrackets == 0)) {
			char += 7;
			deleteMode = true;
			deleteBrackets = 0;
			continue;
		}

		if (text.charAt(char) == "{") openbrackets += 1;
		if (text.charAt(char) == "}") {
			if (openbrackets > 0) {
				openbrackets -= 1;
				result += text.charAt(char)
			}
		} else {
			result += text.charAt(char)
		}

		}
	}


	result += "};";
	eval(result);
	return result;
}
// START SCRATCH BLOCK FUNCTIONS
// not all blocks need to be functions but it speeds up the ones that need multiple lines of code and get slowed down by eval()

function scratchShowVar(spriten, name) {
	if (spriten == "stage") {
		var spritename = "Stage";
	} else {
		var spritename = sprites[spriten].objName;
	}

	if (spritename == undefined) return;

	for (vent=0;vent<varDisplay.length;vent++) {
		if (varDisplay[vent].target == "Stage" && varDisplay[vent].param == name) var varDisp = varDisplay[vent];
	}

	for (vent=0;vent<varDisplay.length;vent++) {
		if (varDisplay[vent].target == spritename && varDisplay[vent].param == name) var varDisp = varDisplay[vent];
	}

	if (varDisp != undefined) varDisp.visible = true;
	
}

function scratchHideVar(spriten, name) {
	if (spriten == "stage") {
		var spritename = "Stage";
	} else {
		var spritename = sprites[spriten].objName;
	}

	if (spritename == undefined) return;

	for (vent=0;vent<varDisplay.length;vent++) {
		if (varDisplay[vent].target == "Stage" && varDisplay[vent].param == name) var varDisp = varDisplay[vent];
	}

	for (vent=0;vent<varDisplay.length;vent++) {
		if (varDisplay[vent].target == spritename && varDisplay[vent].param == name) var varDisp = varDisplay[vent];
	}

	if (varDisp != undefined) varDisp.visible = false;
	
}


function scratchSetVar(spriten, name, value) {

	varRefs[spriten][name].value = value;

	//log("Cannot set variable '"+name+"', does not exist!");
}

function scratchChangeVar(spriten, name, value) {

	varRefs[spriten][name].value = castNumber(varRefs[spriten][name].value);
	varRefs[spriten][name].value += value;

	//log("Cannot set variable '"+name+"', does not exist!");
}

function scratchReadVar(spriten, name) {

	return varRefs[spriten][name].value;

	//log("Cannot read variable '"+name+"', does not exist!");
}

function scratchReadMesh(name) {

	if (mesh) {

		for (m=0;m<meshVars.length;m++) {
			if (meshVars[m].name == name) return meshVars[m].value;
		}	

	}

	return 0;
}


function scratchGetAttribute(name, target) {

	for (i=0;i<sprites.length;i++) {
		if (sprites[i].objName == target) {
			target = i;
			break;
		}
	}

	if (name == "x position") {
		return sprites[target].scratchX;
	} else if (name == "y position") {
		return sprites[target].scratchY;
	} else if (name == "direction") {
		return sprites[target].direction;
	} else if (name == "costume #") {
		return sprites[target].currentCostumeIndex;
	} else if (name == "size") {
		return sprites[target].scale;
	} else {


	if (typeof sprites[target].variables != 'undefined') {

		var id = varIndex[target].indexOf(name);

		if (id != -1) {
			return sprites[target].variables[id].value;
		}
	}

	}

	alert (name);


	return 0;

}

function scratchReadList(spriten, location, name) {

	if (location == 'any') {
		return listRefs[spriten][name].contents[scratchRandomFromTo(1, listRefs[spriten][name].contents.length)];
	} else if (location == 'last') {
		return listRefs[spriten][name].contents[listRefs[spriten][name].length];
	} else {
		var value = listRefs[spriten][name].contents[location-1];
		return (value == undefined)?null:value;
	}

	//log("Cannot read from list '"+name+"', does not exist!");
}

function scratchAppendList(spriten, value, name) {

	listRefs[spriten][name].contents.push(value);
	return;

	//log("Cannot add to list '"+name+"', does not exist!");
}

function scratchDeleteList(spriten, location, name) {

		
	if (location == 'all') {
		listRefs[spriten][name].contents = new Array();
	} else if (location == 'last') {
		listRefs[spriten][name].contents.pop();
	} else {
		listRefs[spriten][name].contents.splice(location-1, 1);
	}

	//log("Cannot remove from list '"+name+"', does not exist!");
}

function scratchAddList(spriten, value, location, name) {

		
	if (location == 'any') {
		listRefs[spriten][name].contents.splice(scratchRandomFromTo(1, listRefs[spriten][name].contents.length), 0, value);
	} else if (location == 'last') {
		listRefs[spriten][name].contents.push(value);
	} else {
		listRefs[spriten][name].contents.splice(location-1, 0, value);
	}

	//log("Cannot add to list '"+name+"', does not exist!");
}

function scratchReplaceList(spriten, value, location, name) {
		
	if (location == 'any') {
		listRefs[spriten][name].contents[scratchRandomFromTo(1, listRefs[spriten][name].contents.length)] = value;
	} else if (location == 'last') {
		listRefs[spriten][name].contents[listRefs[spriten][name].contents.length] = value;
	} else {
		listRefs[spriten][name].contents[location-1] = value;
	}

	//log("Cannot remove from list '"+name+"', does not exist!");
}

function scratchListContents(spriten, name) {

	return listRefs[spriten][name].contents.join("");

}

function scratchListLength(spriten, name) {

	return listRefs[spriten][name].contents.length;

}

function scratchListContains(spriten, name, value) {

	return (listRefs[spriten][name].contents.indexOf(value) > -1);
}



function scratchGotoSprite(spriten, name) {
	if (name == '_mouse_') {
		sprites[spriten].scratchX = MouseX;
		sprites[spriten].scratchY = MouseY;
	}

	for (i=0;i<sprites.length;i++) {
		if (sprites[i].objName == name) {
			sprites[spriten].scratchX = sprites[i].scratchX;
			sprites[spriten].scratchY = sprites[i].scratchY;
			return;
		}
	}
}

function scratchStopAllSounds() {

	if (typeof audio == 'undefined') return;

	for (i=0;i<audio.length;i++) {
		try {
		audio[i].pause();
		audio[i].currentTime = 0.0;
		} catch(err) {

		}
	}

	for (spriten=0;spriten<sprites.length;spriten++) {
		for (sndtest=0;sndtest<executionQueue[spriten].length;sndtest++) {
			if ((executionQueue[spriten][sndtest].type == "wait") && (executionQueue[spriten][sndtest].repeatNum == "audio")) executionQueue[spriten][sndtest].timeUntil = 0;
		}
	}
}

function scratchDistance(spriten, name) {
	if (name == '_mouse_') {	
		return Math.sqrt(Math.pow((sprites[spriten].scratchX - MouseX), 2) + Math.pow((sprites[spriten].scratchY - MouseY), 2));
	}

	for (i=0;i<sprites.length;i++) {
		if (sprites[i].objName == name) {
			return Math.sqrt(Math.pow((sprites[spriten].scratchX - sprites[i].scratchX), 2) + Math.pow((sprites[spriten].scratchY - sprites[i].scratchY), 2));
		}
	}
}

function scratchPointTowards(spriten, name) {
	if (name == '_mouse_') {
		sprites[spriten].direction = (Math.atan2(MouseX - sprites[spriten].scratchX, MouseY - sprites[spriten].scratchY)/Math.PI)*180;
	}

	for (i=0;i<sprites.length;i++) {
		if (sprites[i].objName == name) {
			sprites[spriten].direction = (Math.atan2(sprites[i].scratchX - sprites[spriten].scratchX, sprites[i].scratchY - sprites[spriten].scratchY)/Math.PI)*180;
		}
	}

	if (isNaN(sprites[spriten].direction)) { sprites[spriten].direction = 0; return; }

	if (sprites[spriten].direction < -180) sprites[spriten].direction += 360*Math.ceil((sprites[spriten].direction+180)/-360);
	sprites[spriten].direction = ((sprites[spriten].direction+180)%360)-180;
}

function scratchStep(spriten, value) {
	sprites[spriten].scratchX += Math.sin(sprites[spriten].direction*Math.PI/180)*value;
	sprites[spriten].scratchY += Math.cos(sprites[spriten].direction*Math.PI/180)*value;
}

function scratchMathFunction(type, value) {
	if (type == "abs") return Math.abs(value);
	if (type == "sqrt") return Math.sqrt(value);
	if (type == "sin") return Math.sin(value*Math.PI/180);
	if (type == "cos") return Math.cos(value*Math.PI/180);
	if (type == "tan") return Math.tan(value*Math.PI/180);
	if (type == "asin") return Math.asin(value)*180/Math.PI;
	if (type == "acos") return Math.acos(value)*180/Math.PI;
	if (type == "atan") return Math.atan(value)*180/Math.PI;
	return 0;
}

function scratchSetBackground(value) {

	for (i=0;i<project.costumes.length;i++) {
		if (String(project.costumes[i].costumeName) == String(value)) {
			project.currentCostumeIndex = i;
			return;
		}
	}


	if (value == undefined) return;

	if (isNaN(value)) return;

	value = Math.round(value);

	value = scratchMod(value-1, project.costumes.length)+1;
	project.currentCostumeIndex = Math.max(Math.min(value-1, project.costumes.length-1), 0);
}

function scratchSetCostume(spriten, value) {

	for (cost=0;cost<sprites[spriten].costumes.length;cost++) {
		if (String(sprites[spriten].costumes[cost].costumeName) == String(value)) {
			sprites[spriten].currentCostumeIndex = cost;
			return;
		}
	}

	if (value == undefined) return;

	if (isNaN(value)) return;

	value = Math.round(value);

	value = scratchMod(value-1, sprites[spriten].costumes.length)+1;
	sprites[spriten].currentCostumeIndex = Math.max(Math.min(value-1, sprites[spriten].costumes.length-1), 0);
}

function scratchNextCostume(spriten) {
	value = sprites[spriten].currentCostumeIndex+2;
	value = scratchMod(value-1, sprites[spriten].costumes.length);
	sprites[spriten].currentCostumeIndex = value;
}

function scratchNextBackground() {

	value = project.currentCostumeIndex+2;
	value = scratchMod(value-1, project.costumes.length);
	project.currentCostumeIndex = value;
}

function scratchRandomFromTo(rand1, rand2) {
	return Math.floor(((rand2+1)-rand1)*Math.random())+rand1;
}



function scratchParseCharCode(key) {
	if (key == "up arrow") return 38;
	else if (key == "left arrow") return 37;
	else if (key == "right arrow") return 39;
	else if (key == "down arrow") return 40;
	else if (key == "space") key = " ";

	return key.charCodeAt(0);	
}

function scratchKeyDown(key) {
	if (key == "up arrow") return keyDownArray[38];
	else if (key == "left arrow") return keyDownArray[37];
	else if (key == "right arrow") return keyDownArray[39];
	else if (key == "down arrow") return keyDownArray[40];
	else if (key == "space") key = " ";

	return keyDownArray[key.charCodeAt(0)];	
}

function scratchMod(val1, val2) {
	return val1-(Math.floor(val1/val2)*val2);
}

function scratchGotoXY(spriten, x, y) {
	if (specialproperties[spriten].pendown) {
		penctx.beginPath();
		penctx.moveTo(sprites[spriten].scratchX+240.5, 180.5-sprites[spriten].scratchY);
		penctx.lineTo(x+240.5, 180.5-y);
		penctx.stroke();
		movedSincePen = true;
	}
	sprites[spriten].scratchX = x;
	sprites[spriten].scratchY = y;
}

function scratchGotoX(spriten, x) {
	if (specialproperties[spriten].pendown) {
		penctx.beginPath();
		penctx.moveTo(sprites[spriten].scratchX+240.5, 180.5-sprites[spriten].scratchY);
		penctx.lineTo(x+240.5, 180.5-sprites[spriten].scratchY);
		penctx.stroke();
		movedSincePen = true;
	}
	sprites[spriten].scratchX = x;
}

function scratchChangeX(spriten, x) {
	if (specialproperties[spriten].pendown) {
		penctx.beginPath();
		penctx.moveTo(sprites[spriten].scratchX+240.5, 180.5-sprites[spriten].scratchY);
		penctx.lineTo(sprites[spriten].scratchX+x+240.5, 180.5-sprites[spriten].scratchY);
		penctx.stroke();
		movedSincePen = true;
	}
	sprites[spriten].scratchX += x;
}

function scratchGotoY(spriten, y) {
	if (specialproperties[spriten].pendown) {
		penctx.beginPath();
		penctx.moveTo(sprites[spriten].scratchX+240.5, 180.5-sprites[spriten].scratchY);
		penctx.lineTo(sprites[spriten].scratchX+240.5, 180.5-y);
		penctx.stroke();
		movedSincePen = true;
	}
	sprites[spriten].scratchY = y;
}

function scratchChangeY(spriten, y) {
	if (specialproperties[spriten].pendown) {
		penctx.beginPath();
		penctx.moveTo(sprites[spriten].scratchX+240.5, 180.5-sprites[spriten].scratchY);
		penctx.lineTo(sprites[spriten].scratchX+240.5, 180.5-(sprites[spriten].scratchY+y));
		penctx.stroke();
		movedSincePen = true;
	}
	sprites[spriten].scratchY += y;
}

function scratchFilterReset(spriten) {
	specialproperties[spriten].effects['ghost'] = 0;
}

function scratchGraphicEffect(spriten, type, value) {
	specialproperties[spriten].effects[type] = value;
	if (type == "ghost") specialproperties[spriten].effects[type] = Math.min(Math.max(0, specialproperties[spriten].effects[type]), 100);
}

function scratchSay(spriten, value) {

	if ((askString == "") || (askOwner != spriten)) {
		specialproperties[spriten].say = String(value);
		specialproperties[spriten].think = false;
		specialproperties[spriten].ask = false;
	}
}

function scratchAsk(spriten, value) {
	if (!(spriten == "stage")) {
	specialproperties[spriten].say = String(value);
	specialproperties[spriten].think = false;
	specialproperties[spriten].ask = true;
	}
	askString = String(value);
	askOwner = spriten;
	askAnswer = "";
	cursorPosition = 0;
}

function scratchThink(spriten, value) {
	if ((askString == "") || (askOwner != spriten)) {
		specialproperties[spriten].say = String(value);
		specialproperties[spriten].think = true;
		specialproperties[spriten].ask = false;
	}
}

function scratchChangeGraphicEffect(spriten, type, value) {
	specialproperties[spriten].effects[type] += value;
	if (type == "ghost") specialproperties[spriten].effects[type] = Math.min(Math.max(0, specialproperties[spriten].effects[type]), 100);
}

function scratchSetVolume(spriten, value) {
	specialproperties[spriten].volume = Math.min(100, Math.max(0, value));
	for (aud=0;aud<audioref.length;aud++) {
		if (spriten == audioref[aud]) audio[aud].volume = Math.min(100, Math.max(0, value))/100;
	}
}

function scratchPlaySound(spriten, name) { // plays sound, returns duration.

	if (!(audioSupported)) return 0;

	if (spriten != "stage") {
	
	if (typeof sprites[spriten].sounds != 'undefined') {

	var id = soundIndex[spriten].indexOf(name);

	if (id != -1) {
		try {
		audio[sprites[spriten].sounds[id].soundID].currentTime = 0.0;
		audio[sprites[spriten].sounds[id].soundID].volume = specialproperties[spriten].volume/100;
		audio[sprites[spriten].sounds[id].soundID].play();
		audioref[sprites[spriten].sounds[id].soundID] = spriten;
		return audio[sprites[spriten].sounds[id].soundID].duration;
		} catch(err) {
		log("Fatal Error Playing "+name+", probably unsupported codec (not ADPCM?)");
		return 0;
		}
	}

	}

	} else {

	id = globalsoundIndex.indexOf(name);

	if (id != -1) {
		try {
		audio[project.sounds[id].soundID].currentTime = 0.0;
		audio[project.sounds[id].soundID].volume = specialproperties[spriten].volume/100;
		audio[project.sounds[id].soundID].play();
		return audio[project.sounds[id].soundID].duration;
		} catch(err) {
		log("Fatal Error Playing "+name+", probably unsupported codec (not ADPCM?)");
		return 0;
		}
	}

	if (Number(name) != NaN) {

		if (spriten != "stage") {

		if (soundIndex[spriten].length >= name) {
			try {
			audio[sprites[spriten].sounds[name].soundID].currentTime = 0.0;
			audio[sprites[spriten].sounds[name].soundID].play();
			return audio[sprites[spriten].sounds[name].soundID].duration;
			} catch(err) {
			log("Fatal Error Playing "+name+", probably unsupported codec (not ADPCM?)");
			return 0;
			}
		}
		
		}

		if (globalsoundIndex.length >= name) {
			try {
			audio[project.sounds[name].soundID].currentTime = 0.0;
			audio[project.sounds[name].soundID].play();
			return audio[project.sounds[name].soundID].duration;
			} catch(err) {
			log("Fatal Error Playing "+name+", probably unsupported codec (not ADPCM?)");
			return 0;
			}
		}

	}

	}

	log("Cannot play sound '"+name+"', does not exist!");
}

function scratchColorCollision(spriten, target) {

	//scratchPartialDraw(drawStage, num);

 	target = (16777216 + target).toString(16);
	while (0<(6-target.length)) {
		target = "0"+target;
	}

	var targetr = parseInt(target.substr(0,2), 16)
	var targetg = parseInt(target.substr(2,2), 16)
	var targetb = parseInt(target.substr(4,2), 16)

	colcanvas.width = 480;
	colcanvas.height = 360;

	var costume = project.costumes[project.currentCostumeIndex];
	colctx.drawImage(images[costume.baseLayerID], (0-costume.rotationCenterX)+240, (0-costume.rotationCenterY)+180);

	colctx.drawImage(pencanvas, 0, 0);
	scratchDrawAllBut(colctx, spriten);

	var costume = sprites[spriten].costumes[sprites[spriten].currentCostumeIndex];

	var colourcheck = colctx.getImageData(Math.round(240+sprites[spriten].scratchX)-costume.rotationCenterX, Math.round(180-sprites[spriten].scratchY)-costume.rotationCenterY, images[costume.baseLayerID].width, images[costume.baseLayerID].height);

	colcanvas.width = images[costume.baseLayerID].width;
	colcanvas.height = images[costume.baseLayerID].height;

	colctx.drawImage(images[costume.baseLayerID], 0, 0);
	
	var colourcheck2 = colctx.getImageData(0, 0, colcanvas.width, colcanvas.height);

	var cwidth = colcanvas.width;
	var cheight = colcanvas.height;

	var index = 0;
	var c2data = colourcheck2.data;
	var cdata = colourcheck.data;

	for (var x=0;x<cwidth;x++) {
		for (var y=0;y<cheight;y++) {
			//if ((colourcheck2.data[(x+y*cwidth)*4+3] != 0) && (colourcheck.data[(x+y*cwidth)*4] == targetr) && (colourcheck.data[(x+y*cwidth)*4+1] == targetg) && (colourcheck.data[(x+y*cwidth)*4+2] == targetb)) return true;
			if ((c2data[index+3] != 0) && (cdata[index] == targetr) && (cdata[index+1] == targetg) && (cdata[index+2] == targetb)) return true;
			index += 4
		}
	}

	return false;

}

function rotatedBoundsCalculation(destsprite, costume) {

		var SprCornersX = new Array();
		var SprCornersY = new Array();

		SprCornersX.push(-costume.rotationCenterX);
		SprCornersX.push(-costume.rotationCenterX);
		SprCornersX.push(images[costume.baseLayerID].width-costume.rotationCenterX);
		SprCornersX.push(images[costume.baseLayerID].width-costume.rotationCenterX);

		SprCornersY.push(costume.rotationCenterY);
		SprCornersY.push(costume.rotationCenterY-images[costume.baseLayerID].height);
		SprCornersY.push(costume.rotationCenterY-images[costume.baseLayerID].height);
		SprCornersY.push(costume.rotationCenterY);

		var scale = sprites[destsprite].scale;

		SprCornersXRot = new Array();
		SprCornersYRot = new Array();

		var radians = (90-sprites[destsprite].direction)*Math.PI/180;

		for (rot=0; rot<4; rot++) {
			SprCornersXRot.push(Math.cos(radians)*SprCornersX[rot]*scale+Math.sin(radians)*SprCornersY[rot]*scale);
			SprCornersYRot.push((Math.cos(radians)*SprCornersY[rot]*scale+Math.sin(radians)*SprCornersX[rot]*scale));
		}
}

function boundsForSprite(spritey) {
	costume = sprites[spritey].costumes[sprites[spritey].currentCostumeIndex];

	if (sprites[spritey].rotationStyle == "leftRight") {
		if (sprites[spritey].direction >= 0) {

		var x1 = Math.round((sprites[spritey].scratchX+240)-costume.rotationCenterX)
		var y1 = Math.round((180-sprites[spritey].scratchY)-costume.rotationCenterY)
		var xm1 = x1+images[costume.baseLayerID].width;
		var ym1 = y1+images[costume.baseLayerID].height;

		} else {

		var y1 = Math.round((180-sprites[spritey].scratchY)-costume.rotationCenterY)
		var ym1 = y1+images[costume.baseLayerID].height;
		var xm1 = Math.round((sprites[spritey].scratchX+240)+costume.rotationCenterX)
		var x1 = xm1-images[costume.baseLayerID].width;
		}
	} else if (sprites[spritey].rotationStyle == "normal") {

		rotatedBoundsCalculation(spritey, costume);

		var x1 = sprites[spritey].scratchX+240+Math.min(SprCornersXRot[0], SprCornersXRot[1], SprCornersXRot[2], SprCornersXRot[3]);
		var y1 = 180-(sprites[spritey].scratchY+Math.max(SprCornersYRot[0], SprCornersYRot[1], SprCornersYRot[2], SprCornersYRot[3]));
		var xm1 = sprites[spritey].scratchX+240+Math.max(SprCornersXRot[0], SprCornersXRot[1], SprCornersXRot[2], SprCornersXRot[3]);
		var ym1 = 180-(sprites[spritey].scratchY+Math.min(SprCornersYRot[0], SprCornersYRot[1], SprCornersYRot[2], SprCornersYRot[3]));

	} else {
		var x1 = Math.round((sprites[spritey].scratchX+240)-costume.rotationCenterX)
		var y1 = Math.round((180-sprites[spritey].scratchY)-costume.rotationCenterY)
		var xm1 = x1+images[costume.baseLayerID].width;
		var ym1 = y1+images[costume.baseLayerID].height;
	}

	return [x1, y1, xm1, ym1];
}

function scratchBounceOffEdge(spriten) {
		var tempB = boundsForSprite(spriten);
		var x1 = tempB[0];
		var y1 = tempB[1];
		var xm1 = tempB[2];
		var ym1 = tempB[3];

		if (x1 < 0) { sprites[spriten].scratchX -= x1; sprites[spriten].direction = 0 - sprites[spriten].direction}
		if (xm1 > 480) { sprites[spriten].scratchX += 480-xm1; sprites[spriten].direction = 0 - sprites[spriten].direction }
		if (y1 < 0) { sprites[spriten].scratchX -= y1; sprites[spriten].direction = 180 - sprites[spriten].direction }
		if (ym1 > 360) { sprites[spriten].scratchX += 360-ym1; sprites[spriten].direction = 180 - sprites[spriten].direction }

		if (sprites[spriten].direction < -180) sprites[spriten].direction += 360*Math.ceil((sprites[spriten].direction+180)/-360);
		sprites[spriten].direction = ((sprites[spriten].direction+180)%360)-180;

		return;
}

function scratchCollisionDetect(spriten, name) {
	if (!(sprites[spriten].visible)) return false;

	if (name == '_mouse_') {

		var costume = sprites[spriten].costumes[sprites[spriten].currentCostumeIndex];

		if ((MouseX < (sprites[spriten].scratchX-costume.rotationCenterX)) || (MouseX > (sprites[spriten].scratchX-costume.rotationCenterX)+images[costume.baseLayerID].width) || (MouseY < (sprites[spriten].scratchY+costume.rotationCenterY)-images[costume.baseLayerID].height) || (MouseY > (sprites[spriten].scratchY+costume.rotationCenterY))) return false;
		else return true;

		/*
		colcanvas.width = 480;
		colcanvas.height = 360;

		colctx.clearRect(0, 0, 480, 360);	

		scratchDrawSprite(colctx, spriten, true);

		//colctx.drawImage(images[costume.baseLayerID], ((sprites[spriten].scratchX-240)-costume.rotationCenterX), ((180-sprites[spriten].scratchY)-costume.rotationCenterY));
	
		var colourcheck2 = colctx.getImageData(MouseX+240, 180-MouseY, 1, 1);

		if (colourcheck2.data[3] != 0) return true;
		else return false; */

	} else if (name == '_edge_') {

		var tempB = boundsForSprite(spriten);
		var x1 = tempB[0];
		var y1 = tempB[1];
		var xm1 = tempB[2];
		var ym1 = tempB[3];

		if (x1 < 0) return true;
		if (xm1 > 480) return true;
		if (y1 < 0) return true;
		if (ym1 > 360) return true;
		return false;
	}

	othersprite = -1;

	for (i=0;i<sprites.length;i++) {
		if (sprites[i].objName == name) {
			var othersprite = i;
		}
	}

	if (othersprite == -1) return false;

	if (!(sprites[othersprite].visible)) return false;
	
	var tempB = boundsForSprite(spriten);

	var x1 = tempB[0];
	var y1 = tempB[1];
	var xm1 = tempB[2];
	var ym1 = tempB[3];

	var tempB = boundsForSprite(othersprite);

	var x2 = tempB[0];
	var y2 = tempB[1];
	var xm2 = tempB[2];
	var ym2 = tempB[3];

	//debugctx.strokeRect(x1, y1, Math.max(1, xm1-x1), Math.max(1, ym1-y1));
	//debugctx.strokeRect(x2, y2, Math.max(1, xm2-x2), Math.max(1, ym2-y2));


	if ((x1 > xm2) || (x2 > xm1) || (y1 > ym2) || (y2 > ym1)) return false;


	var xstart = Math.max(x1, x2, 0);
	var xend = Math.min(xm1, xm2, 480);
	var ystart = Math.max(y1, y2, 0);
	var yend = Math.min(ym1, ym2, 360);

	colcanvas.width = 480;
	colcanvas.height = 360;

	colctx.clearRect(0, 0, 480, 360);	

	scratchDrawSprite(colctx, spriten, true);

	var colourcheck = colctx.getImageData(xstart, ystart, Math.max(1, xend-xstart), Math.max(1, yend-ystart));

	colctx.clearRect(0, 0, 480, 360);	

	scratchDrawSprite(colctx, othersprite, true);

	var colourcheck2 = colctx.getImageData(xstart, ystart, Math.max(1, xend-xstart), Math.max(1, yend-ystart));

	var cwidth = Math.max(1, xend-xstart);
	var cheight = Math.max(1, yend-ystart);
	var index = 3;
	var data1 = colourcheck.data;
	var data2 = colourcheck2.data;

	for (var y=0;y<cheight;y++) {
		for (var x=0;x<cwidth;x++) {
			if ((data1[index] > 0) && (data2[index] > 0)) { return true; } ;
			index += 4;
		}
	}

	return false;

}

function scratchDrawSprite(thectx, sprdraw, noAlpha) {

	thectx.save();
	var costume = sprites[sprdraw].costumes[sprites[sprdraw].currentCostumeIndex];
	var costdir = (sprites[sprdraw].direction-90) * Math.PI / 180;
			
	thectx.translate(Math.round(sprites[sprdraw].scratchX)+240, 180-Math.round(sprites[sprdraw].scratchY));

	if (sprites[sprdraw].rotationStyle == "normal"){
		thectx.rotate(costdir);
		thectx.scale(Math.abs(sprites[sprdraw].scale), Math.abs(sprites[sprdraw].scale));
	} else if (sprites[sprdraw].rotationStyle == "leftRight") {
		if (sprites[sprdraw].direction > 0) thectx.scale(Math.abs(sprites[sprdraw].scale), Math.abs(sprites[sprdraw].scale));
		if (sprites[sprdraw].direction < 0) thectx.scale(Math.abs(sprites[sprdraw].scale)*-1, Math.abs(sprites[sprdraw].scale));
	}

	if (noAlpha == undefined) {

		thectx.globalAlpha = (100-specialproperties[sprdraw].effects['ghost'])/100;

	} else {
		thectx.globalAlpha = 1;
	}

	thectx.drawImage(images[costume.baseLayerID], -costume.rotationCenterX, -costume.rotationCenterY);
			

	if (typeof costume.text != 'undefined') {

		if (costume.textLayerID != -1) {
		
			thectx.drawImage(images[costume.textLayerID], -costume.rotationCenterX, -costume.rotationCenterY);

		}
	
	}
	thectx.restore();

}

function scratchColorCollision2(spriten, target1, target2) {

	scratchPartialDraw(drawStage, num);
	drawStage = num;

 	target1 = (16777216 + target1).toString(16);
	for (cl=0;cl<(6-target1.length);i++) {
		target1 = "0"+target1;
	}

	var targetr = parseInt(target1.substr(0,2), 16)
	var targetg = parseInt(target1.substr(2,2), 16)
	var targetb = parseInt(target1.substr(4,2), 16)


 	target2 = (16777216 + target2).toString(16);
	for (cl=0;cl<(6-target2.length);i++) {
		target2 = "0"+target2;
	}

	var target2r = parseInt(target2.substr(0,2), 16)
	var target2g = parseInt(target2.substr(2,2), 16)
	var target2b = parseInt(target2.substr(4,2), 16)

	colcanvas.width = 480;
	colcanvas.height = 360;

	var costume = project.costumes[project.currentCostumeIndex];
	colctx.drawImage(images[costume.baseLayerID], (0-costume.rotationCenterX)+240, (0-costume.rotationCenterY)+180);

	colctx.drawImage(pencanvas, 0, 0);
	colctx.drawImage(sprcanvas, 0, 0);

	var costume = sprites[spriten].costumes[sprites[spriten].currentCostumeIndex];

	var colourcheck = colctx.getImageData(Math.round(240+sprites[spriten].scratchX)-costume.rotationCenterX, Math.round(180-sprites[spriten].scratchY)-costume.rotationCenterY, images[costume.baseLayerID].width, images[costume.baseLayerID].height);

	colcanvas.width = images[costume.baseLayerID].width;
	colcanvas.height = images[costume.baseLayerID].height;

	colctx.drawImage(images[costume.baseLayerID], 0, 0);
	
	var colourcheck2 = colctx.getImageData(0, 0, colcanvas.width, colcanvas.height);

	var cwidth = colcanvas.width;
	var cheight = colcanvas.height;
	var index = 0;
	var c2data = colourcheck2.data;
	var cdata = colourcheck.data;

	for (var x=0;x<cwidth;x++) {
		for (var y=0;y<cheight;y++) {
			//if ((colourcheck2.data[(x+y*cwidth)*4+3] != 0) && (colourcheck2.data[(x+y*cwidth)*4] == targetr) && (colourcheck2.data[(x+y*cwidth)*4+1] == targetg) && (colourcheck2.data[(x+y*cwidth)*4+2] == targetb) && (colourcheck.data[(x+y*cwidth)*4] == target2r) && (colourcheck.data[(x+y*cwidth)*4+1] == target2g) && (colourcheck.data[(x+y*cwidth)*4+2] == target2b)) return true;
			if ((c2data[index+3] != 0) && (c2data[index] == targetr) && (c2data[index+1] == targetg) && (c2data[index+2] == targetb) && (cdata[index] == target2r) && (cdata[index+1] == target2g) && (cdata[index+2] == target2b)) return true;
			index += 4;
		}
	}

	return false;

}

// ----- SCRATCH PEN BLOCKS -----

function scratchClearPen() {
	penctx.clearRect(0, 0, 480, 360);
}

function scratchPenDot(spriten) {
	penctx.beginPath();
	penctx.moveTo(sprites[spriten].scratchX+240.5, 180.5-sprites[spriten].scratchY); 
	penctx.lineTo(sprites[spriten].scratchX+240.6, 180.5-sprites[spriten].scratchY);
	penctx.stroke();
}


function scratchSetPenColor(spriten, value) {
	specialproperties[spriten].penhue = value*360/200;
	specialproperties[spriten].penhue = scratchMod(specialproperties[spriten].penhue, 360);
	specialproperties[spriten].pensaturation = 100;
	specialproperties[spriten].color = "hsl("+specialproperties[spriten].penhue+", "+specialproperties[spriten].pensaturation+"%, "+specialproperties[spriten].penlightness+"%)";
	penctx.strokeStyle = specialproperties[spriten].color;

}

function scratchSetPenShade(spriten, value) {
	specialproperties[spriten].penlightness = value;
	specialproperties[spriten].penlightness = Math.min(Math.max(specialproperties[spriten].penlightness, 0), 100);
	specialproperties[spriten].pensaturation = 100;
	specialproperties[spriten].color = "hsl("+specialproperties[spriten].penhue+", "+specialproperties[spriten].pensaturation+"%, "+specialproperties[spriten].penlightness+"%)";
	penctx.strokeStyle = specialproperties[spriten].color;
}

function scratchChangePenColor(spriten, value) {
	specialproperties[spriten].penhue += value*360/200;
	specialproperties[spriten].penhue = scratchMod(specialproperties[spriten].penhue, 360);
	specialproperties[spriten].pensaturation = 100;
	specialproperties[spriten].color = "hsl("+specialproperties[spriten].penhue+", "+specialproperties[spriten].pensaturation+"%, "+specialproperties[spriten].penlightness+"%)";
	penctx.strokeStyle = specialproperties[spriten].color;
}

function scratchChangePenShade(spriten, value) {
	specialproperties[spriten].penlightness += value;
	specialproperties[spriten].penlightness = Math.min(Math.max(specialproperties[spriten].penlightness, 0), 100);
	specialproperties[spriten].pensaturation = 100;
	specialproperties[spriten].color = "hsl("+specialproperties[spriten].penhue+", "+specialproperties[spriten].pensaturation+"%, "+specialproperties[spriten].penlightness+"%)";
	penctx.strokeStyle = specialproperties[spriten].color;
}

function scratchPenColor(spriten, value) {
 	value = (16777216 + value).toString(16);

	while (0<(6-value.length)) {
		value = "0"+value;
	}

	var r1 = parseInt(value.substr(0,2), 16);
	var g1 = parseInt(value.substr(2,2), 16);
	var b1 = parseInt(value.substr(4,2), 16);


	specialproperties[spriten].penhue = computeHue(r1, g1, b1)*180/Math.PI;
	specialproperties[spriten].pensaturation = computeSaturation(r1, g1, b1);
	specialproperties[spriten].penlightness = computeLightness(r1, g1, b1);

	specialproperties[spriten].color = "hsl("+specialproperties[spriten].penhue+", "+specialproperties[spriten].pensaturation+"%, "+specialproperties[spriten].penlightness+"%)";

	penctx.strokeStyle = specialproperties[spriten].color;
}

function scratchPenSize(spriten, value) {
 	specialproperties[spriten].pensize = Math.max(Math.round(value), 1);
	penctx.lineWidth = specialproperties[spriten].pensize;
}

function scratchStamp(spriten) {

	penctx.save();
	var costume = sprites[spriten].costumes[sprites[spriten].currentCostumeIndex];
	var costdir = (sprites[spriten].direction-90) * Math.PI / 180;
			
	penctx.translate(Math.round(sprites[spriten].scratchX)+240, 180-Math.round(sprites[spriten].scratchY));

	if (sprites[spriten].rotationStyle == "normal"){
		penctx.rotate(costdir);
		penctx.scale(Math.abs(sprites[spriten].scale), Math.abs(sprites[spriten].scale));
	} else if (sprites[spriten].rotationStyle == "leftRight") {
		if (sprites[spriten].direction > 0) penctx.scale(Math.abs(sprites[spriten].scale), Math.abs(sprites[spriten].scale));
		if (sprites[spriten].direction < 0)	penctx.scale(Math.abs(sprites[spriten].scale)*-1, Math.abs(sprites[spriten].scale));
	}


	penctx.drawImage(images[costume.baseLayerID], -costume.rotationCenterX, -costume.rotationCenterY);
			

	if (typeof costume.text != 'undefined') {

		if (costume.textLayerID != -1) {
		
			penctx.drawImage(images[costume.textLayerID], -costume.rotationCenterX, -costume.rotationCenterY);

		}
	
	}
	penctx.restore();
}

// ------- SCRATCH 2.0 EXCLUSIVE -------


function scratchClone(spriten, name) {

	for (c=0;c<sprites.length;c++) {
		if (sprites[c].objName == name) {

			var temp = JSON.stringify(sprites[c]);
			sprites.push(JSON.parse(temp));

			scripts.push(scripts[c]);
			//var temp = JSON.stringify(scripts[c]);
			//scripts.push(JSON.parse(temp));

			executionQueue.push(new Array());
			repeatStacks.push(new Array());

			var tempobj = {"time": 0, "starttime": 0, "x": 0, "y": 0, "startx": 0, "starty": 0};

			glideData.push(tempobj);

			var temp = JSON.stringify(varIndex[c]);
			varIndex.push(JSON.parse(temp));

			var temp = JSON.stringify(soundIndex[c]);
			soundIndex.push(JSON.parse(temp));

			var temp = JSON.stringify(listIndex[c]);
			listIndex.push(JSON.parse(temp));


			specialproperties.push({"pendown": false, "pensize": 1, "color": "#000000", "say": "", "sayold": "", "saylist": [], "think": false, "ask": false, "effects": [], "penhue": 0, "pensaturation": 100, "penlightness": 50});
			
			specialproperties[specialproperties.length-1].effects['ghost'] = 0;
			specialproperties[specialproperties.length-1].effects['brightness'] = 0;
			
			sprites[sprites.length-1].clone = true;

			layerOrder.push(sprites.length-1);

			for (cln=0;cln<scripts[scripts.length-1][6].length;cln++) {

				scratchAddExecution(sprites.length-1, "clone", cln, 0, "clone", cln);

			}

			sprites[sprites.length-1].scratchX = sprites[spriten].scratchX;
			sprites[sprites.length-1].scratchY = sprites[spriten].scratchY;

			createVarRefs(sprites.length-1);

			return;
		}
	}
}

function scratchDeleteClone(spriten) {

	for(lyr=0;lyr<layerOrder.length;lyr++) {
		if (layerOrder[lyr] > spriten) layerOrder[lyr] -= 1;
	}

	layerOrder.splice(num, 1);
	sprites.splice(spriten, 1);
	scripts.splice(spriten, 1);
	executionQueue.splice(spriten, 1);
	repeatStacks.splice(spriten, 1);
	glideData.splice(spriten, 1);
	varIndex.splice(spriten, 1);
	soundIndex.splice(spriten, 1);
	listIndex.splice(spriten, 1);
	specialproperties.splice(spriten, 1);

	varRefs.splice(spriten, 1);
	listRefs.splice(spriten, 1);


	num -= 1;

	abortscripts = true;

}

// END SCRATCH BLOCKS

function drawVariableDisplay(ent) {

		if (varDisplay[ent].visible) {

		if (varDisplay[ent].cmd == "getVar:") { 

			sprctx.lineWidth = 1;

			resid = "stage";

			if (varDisplay[ent].target == "Stage") {
				var vardisplay = scratchReadVar("stage", varDisplay[ent].param);
			} else {
				for (i=0;i<sprites.length;i++) {
					if (sprites[i].objName == varDisplay[ent].target) resid = i;
				}
				var vardisplay = scratchReadVar(resid, varDisplay[ent].param);
			}

			var varname = varDisplay[ent].label;

			if (varDisplay[ent].mode == 2) {

				sprctx.font = "Bold 12pt Arial";
				var valuelength = Math.max(36, sprctx.measureText(vardisplay).width);

				drawRoundedRectangle(sprctx, varDisplay[ent].x, varDisplay[ent].y, valuelength+12, 21, 7);
				sprctx.fillStyle = "#FFFFFF";
				sprctx.strokeStyle = "#FF6600";
				sprctx.fill();
				sprctx.stroke();

				drawRoundedRectangle(sprctx, varDisplay[ent].x-2, varDisplay[ent].y-2, valuelength+16, 25, 9);
				sprctx.strokeStyle = "#FFCC00";
				sprctx.stroke();

				sprctx.fillStyle = "#FF6600";
				sprctx.fillText(vardisplay, varDisplay[ent].x+6+valuelength/2-sprctx.measureText(vardisplay).width/2, varDisplay[ent].y+17);

			} else if ((varDisplay[ent].mode == 1) || (varDisplay[ent].mode == 3)) {

				sprctx.font = "Bold 10pt Arial";
				var valuelength = Math.max(24, sprctx.measureText(vardisplay).width);
				var namelength = sprctx.measureText(varname).width

				if (varDisplay[ent].mode == 1) var varheight = 21;
				else var varheight = 32;

				drawRoundedRectangle(sprctx, varDisplay[ent].x, varDisplay[ent].y, valuelength+16+namelength+10+4, varheight, 7);
				sprctx.fillStyle = "#FFFFFF";
				sprctx.strokeStyle = "#878787";
				sprctx.fill();
				sprctx.stroke();

				drawRoundedRectangle(sprctx, varDisplay[ent].x+namelength+10, varDisplay[ent].y+3, valuelength+16, 15, 4);
				sprctx.strokeStyle = "#FFCC00";
				sprctx.fill();
				sprctx.stroke();

				drawRoundedRectangle(sprctx, varDisplay[ent].x-2, varDisplay[ent].y-2, valuelength+16+namelength+10+4+4, varheight+4, 9);
				sprctx.strokeStyle = "#E2E2E2";
				sprctx.stroke();

				sprctx.fillStyle = "#333333";
				sprctx.fillText(varname, varDisplay[ent].x+5, varDisplay[ent].y+15);

				sprctx.fillStyle = "#FF6600";
				sprctx.fillText(vardisplay, varDisplay[ent].x+namelength+10+8+valuelength/2-(sprctx.measureText(vardisplay).width)/2, varDisplay[ent].y+15);

				if (varDisplay[ent].mode == 3) {
					drawRoundedRectangle(sprctx, varDisplay[ent].x+6, varDisplay[ent].y+22, (valuelength+16+namelength+10+4)-12, 6, 3);
					sprctx.fillStyle = "#CCCCCC";
					sprctx.strokeStyle = "#999999";
					sprctx.fill();
					sprctx.stroke();

					var scrollwidth = (valuelength+16+namelength+10+4)-17;

					if (scratchMouseDown && (MouseX+240 >= (varDisplay[ent].x+6)) && (MouseX+240 <= (varDisplay[ent].x+6+(valuelength+16+namelength+10+4)-12)) && (180-MouseY >= (varDisplay[ent].y+22)) && (180-MouseY <= (varDisplay[ent].y+28))) {
						// if anyone has a less stupid way to check this be my guest

						var decimalplaces = 0;
						var afterpoint = false;
						for (i=0;i<String(varDisplay[ent].sliderMin).length;i++) {
							if (String(varDisplay[ent].sliderMin).charAt(i) == ".") afterpoint = true;
							else if (afterpoint) decimalplaces += 1;
						}

						var decimalplaces2 = 0;
						afterpoint = false;
						for (i=0;i<String(varDisplay[ent].sliderMax).length;i++) {
							if (String(varDisplay[ent].sliderMax).charAt(i) == ".") afterpoint = true;
							else if (afterpoint) decimalplaces2 += 1;
						}

						decimalplaces = Math.max(decimalplaces, decimalplaces2);

						vardisplay = Math.max(Math.min(varDisplay[ent].sliderMin+((MouseX+240 - (varDisplay[ent].x+9))/scrollwidth)*(varDisplay[ent].sliderMax - varDisplay[ent].sliderMin), varDisplay[ent].sliderMax), varDisplay[ent].sliderMin);
						vardisplay = vardisplay.toFixed(decimalplaces)
						scratchSetVar(resid, varDisplay[ent].param, vardisplay);
					}

					var scrollfactor = (Math.max(Math.min(castNumber(vardisplay), varDisplay[ent].sliderMax), varDisplay[ent].sliderMin) - varDisplay[ent].sliderMin) / (varDisplay[ent].sliderMax - varDisplay[ent].sliderMin)

					sprctx.beginPath();
					sprctx.arc(varDisplay[ent].x+8.5+(scrollwidth*scrollfactor), varDisplay[ent].y+25.5, 4.5, 0, Math.PI*2, true); 
					sprctx.fillStyle = "#FFFFFF";
					sprctx.strokeStyle = "#333333";
					sprctx.fill();
					sprctx.stroke();

					sprctx.beginPath();
					sprctx.arc(varDisplay[ent].x+8.5+(scrollwidth*scrollfactor), varDisplay[ent].y+25.5, 2.5, 0, Math.PI*2, true); 
					sprctx.strokeStyle = "#CCCCCC";
					sprctx.stroke();
				}

			}

		}
	}
}


totalfiles = 8;
loaded = 0;

function drawProgress() {
	baranim += 1;
	framectx.clearRect(0, 0, 486, 391);

	barctx.drawImage(bar, -50+baranim%50, 0);
	barctx.clearRect(199-Math.round((100-LoadProgress)*1.98),1,Math.round((100-LoadProgress)*1.98),6);

	if (framed) {

		framectx.drawImage(frame, 0, 0);
		framectx.drawImage(preload, 3, 28);
		framectx.drawImage(barcanvas, 143, 251);

	} else {

		framectx.drawImage(preload, 0, 0);
		framectx.drawImage(barcanvas, 140, 223);

	}
}

function IncLoad() {
	loaded += 1;
	if (loaded == totalfiles) {
		if (framed) {
			framectx.drawImage(frame, 0, 0)
		}
		if (typeof autoLoad != 'undefined') setTimeout(function() { ReadFile(autoLoad); }, 16);
	}
}


document.addEventListener("DOMContentLoaded", init);

function renderSVGs() {

		for (i=0;i<svgs.length;i++) {

			svgcanvas = document.createElement("canvas");
			svgctx = canvas.getContext("2d");

			var imagenum = svgnums[i];
			//svgctx.drawSvg(svgs[i], 0, 0);
			canvg(svgcanvas, svgs[i]);
			images[imagenum] = new Image();
			images[imagenum].src = svgcanvas.toDataURL()
		}

	execGreenFlag();

	updateInterval = setInterval(update, 1000/framerate);

}

function keyPress(evt) {


	if (focus) {


		if (askString != "") {

		var validCharacters = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890!\"£$%^&*()-=_+|#~[];'#,./{}:@~<>? "

		if (validCharacters.indexOf(String.fromCharCode(evt.charCode)) != -1) {
			askAnswer = askAnswer.substr(0, cursorPosition)+String.fromCharCode(evt.charCode)+askAnswer.substr(cursorPosition);
			cursorPosition += 1;
		}

		}

		evt.preventDefault();

	}

}

function keyDown(evt) {
	if (focus && loadedb) {

		if (evt.keyCode == 16) shiftKey = true;

		if (evt.keyCode == 223) {

			if (console) console = false;
			else console = true;
	
		}

		if (evt.preventDefault != undefined) {

		if ((evt.keyCode == 8) || (evt.keyCode == 38) || (evt.keyCode == 40)) evt.preventDefault();

		}

		if (askString != "") {
			if (evt.keyCode == 8 && cursorPosition > 0) {
				askAnswer = askAnswer.substr(0, cursorPosition-1)+askAnswer.substr(cursorPosition);
				cursorPosition -= 1;
			}
			if (evt.keyCode == 13) {	
				askString = "";
				scratchAnswer = askAnswer;
				if (askOwner != "stage") {
					specialproperties[askOwner].say = "";
					specialproperties[askOwner].think = false;
					specialproperties[askOwner].ask = false;
					askOwner = -1;
				}
			}	

			if (evt.keyCode == 37) cursorPosition = Math.max(0, Math.min(cursorPosition-1, askAnswer.length))

			if (evt.keyCode == 39) cursorPosition = Math.max(0, Math.min(cursorPosition+1, askAnswer.length))
		}

		
		var lowerCaseKeyCode = String.fromCharCode(evt.keyCode).toLowerCase().charCodeAt(0);

		keyDownArray[lowerCaseKeyCode] = true;

		for (spr=0;spr<sprites.length;spr++) {
			for (j=0;j<scripts[spr][3][lowerCaseKeyCode].length;j++) {
				scripts[spr][3][lowerCaseKeyCode][j]();
			}
		}

	}
}

function touchKeyDown(keyc) {
		keyDownArray[keyc] = true;

		if (loadedb) {

		for (spr=0;spr<sprites.length;spr++) {
			for (j=0;j<scripts[spr][3][keyc].length;j++) {
				scripts[spr][3][keyc][j]();
			}
		}

		}
}

function touchKeyUp(keyc) {
		keyDownArray[keyc] = false;
}

function keyUp(evt) {
	if (focus) {

		var lowerCaseKeyCode = String.fromCharCode(evt.keyCode).toLowerCase().charCodeAt(0);
		keyDownArray[lowerCaseKeyCode] = false;
		if (evt.keyCode == 16) shiftKey = false;

	}
}

function getMousePosition(evt) {

	if (typeof scaledHeight == "undefined") scale = 1;
	else scale = scaledHeight / framecanvas.height;

	el = framecanvas

	var _x = 0;
	var _y = 0;

    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
       	_x += el.offsetLeft;
        _y += el.offsetTop;
        el = el.offsetParent;
    }

	if (framed) {

		MouseX = ((evt.pageX - _x)-241*scale)/scale;
		MouseY = (206*scale - (evt.pageY - _y))/scale;

	} else {

		MouseX = ((evt.pageX - _x)-240*scale)/scale;
		MouseY = (180*scale - (evt.pageY - _y))/scale;

	}


}

function touchMove(evt) {

	event.preventDefault();

	el = framecanvas

	var _x = 0;
	var _y = 0;

    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
       	_x += el.offsetLeft; // - el.scrollLeft
        _y += el.offsetTop; // - el.scrollTop
        el = el.offsetParent;
    }

	if (typeof scaledHeight == "undefined") scale = 1;
	else scale = scaledHeight / framecanvas.height;

	if (framed) {

		MouseX = ((evt.touches[0].pageX - _x)-241*scale)/scale;
		MouseY = (206*scale - (evt.touches[0].pageY - _y))/scale;

	} else {

		MouseX = ((evt.touches[0].pageX - _x)-240*scale)/scale;
		MouseY = (180*scale - (evt.touches[0].pageY - _y))/scale;

	}


	for (j=0; j<evt.touches.length; j++) {

	for (i=0; i<touchButtonsX.length; i++) {
		if (touchingScreenSection(calcMouse("x", evt.touches[j].pageX), calcMouse("y", evt.touches[j].pageY), touchButtonsX[i], touchButtonsY[i], touchButtonsWidth[i], touchButtonsHeight[i]) && !(keyDownArray[touchButtonsKeyCode[i]])) { touchKeyDown(touchButtonsKeyCode[i]); }
	}

	}

	for (i=0; i<touchButtonsX.length; i++) {

		if (touchButtonsKeyCode[i] != 38) {
		touched = false
		for (j=0; j<evt.touches.length; j++) {

				if (touchingScreenSection(calcMouse("x", evt.touches[j].pageX), calcMouse("y", evt.touches[j].pageY), touchButtonsX[i], touchButtonsY[i], touchButtonsWidth[i], touchButtonsHeight[i])) touched = true;


		}
		if (!(touched) && keyDownArray[touchButtonsKeyCode[i]]) { touchKeyUp(touchButtonsKeyCode[i]); }
		}
	}
	touched = false

	for (j=0; j<evt.touches.length; j++) {

	i = touchButtonsKeyCode.indexOf(38);
	if (touchingScreenSection(calcMouse("x", evt.touches[j].pageX), calcMouse("y", evt.touches[j].pageY), touchButtonsX[i], touchButtonsY[i], touchButtonsWidth[i], touchButtonsHeight[i])) touched = true;

	i = touchButtonsKeyCode.lastIndexOf(38);
	if (touchingScreenSection(calcMouse("x", evt.touches[j].pageX), calcMouse("y", evt.touches[j].pageY), touchButtonsX[i], touchButtonsY[i], touchButtonsWidth[i], touchButtonsHeight[i])) touched = true;

	}
	previousTouchesLength = evt.touches.length;
	if (!(touched) && keyDownArray[touchButtonsKeyCode[i]]) { touchKeyUp(touchButtonsKeyCode[i]); }

}

function calcMouse(type, item) {

	if (typeof scaledHeight == "undefined") scale = 1;
	else scale = scaledHeight / framecanvas.height;

	event.preventDefault();

	el = framecanvas

	var _x = 0;
	var _y = 0;

    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
       	_x += el.offsetLeft; // - el.scrollLeft
        _y += el.offsetTop; // - el.scrollTop
        el = el.offsetParent;
    }

	if (framed) {

	if (type == "x") return ((item - _x)-241*scale)/scale;
	if (type == "y") return (206*scale - (item - _y))/scale;

	} else {

	if (type == "x") return ((item - _x)-240*scale)/scale;
	if (type == "y") return (180*scale - (item - _y))/scale;


	}

}


function touchDown(evt) {

	touchMove(evt);


	mouseDown(evt);
}

function touchUp(evt) {

	scratchMouseDown = false;

	if (loadedb) {

	if (previousTouchesLength == 1) {

	for (i=0; i<touchButtonsX.length; i++) {
		if (keyDownArray[touchButtonsKeyCode[i]]) { touchKeyUp(touchButtonsKeyCode[i]); }
	}

	}

	}

}

function mouseDown(evt) {

	scratchMouseDown = true;
	focus = 1;
	evt.preventDefault();

	if (loadedb) {

	if (askString != "") {
		if ((MouseX+240 > 439) && (MouseX+240 < 460) && (180-MouseY > 326) && (180-MouseY < 347)) {
			askString = "";
			scratchAnswer = askAnswer;
			if (askOwner != "stage") {
				specialproperties[askOwner].say = "";
				specialproperties[askOwner].think = false;
				specialproperties[askOwner].ask = false;
				askOwner = -1;
			}
		}
	}


	if ((MouseX > 180) && (MouseX < 206) && (MouseY < 205) && (MouseY > 184)) {
		if (shiftKey) {
			turboMode = (!(turboMode));
		} else {
			stopAll();

			if (mesh) {
				var packet = {};
				packet.type = "greenFlag";
				connection.send(JSON.stringify(packet));
			}

			execGreenFlag();
		}
	}

	if ((MouseX > 215) && (MouseX < 235) && (MouseY < 205) && (MouseY > 184)) {
		stopAll();
	}

	if (active) {
		for (ms=0;ms<sprites.length;ms++) {
			var costume = sprites[ms].costumes[sprites[ms].currentCostumeIndex];

			if ((MouseX > sprites[ms].scratchX-costume.rotationCenterX) && (MouseX < (sprites[ms].scratchX-costume.rotationCenterX)+images[costume.baseLayerID].width) && (MouseY < sprites[ms].scratchY+costume.rotationCenterY) && (MouseY > sprites[ms].scratchY+costume.rotationCenterY-images[costume.baseLayerID].height)) {
				for (j=0;j<scripts[ms][7].length;j++) {
					scripts[ms][7][j]();
				}
			}
		}
	}
	}

}

function mouseUp(evt) {

	scratchMouseDown = false;

}

function init() {

	if (typeof framed == "undefined") framed = true;
	if (typeof basedir == "undefined") basedir = "";
	if (typeof framerate == "undefined") framerate = 30;

	movedSincePen = false;
	previousTouchesLength = 0;
	touchesKeyCodes = []

	mesh = false;
	shiftKey = false;
	if (typeof turboMode == 'undefined') turboMode = false;
	scratchMouseDown = false;
	drawStage = 0;

	console = false;
	consolelog = new Array();

	log("sb2.js by RHY3756547");
	log("Development Version");
	log("-----------------------------");
	log(" ");

	baranim = 0;

	focussteal = document.getElementById('scratch');

	loadedb = false;

	keyDownArray = new Array();
	for (i=0;i<256;i++){
		keyDownArray[i] = false;
	}
	document.onkeydown=keyDown;
	document.onkeypress=keyPress;
	document.onkeyup=keyUp;

	parent.window.onmousedown = function(evt) {
		if (!scratchMouseDown) focus = 0;
	};


	MouseX = 0;
	MouseY = 0;

	touchDevice = ((navigator.platform == "iPad") || (navigator.platform == "iPhone") || (navigator.platform == "Android"))

	audioSupported = !((navigator.platform == "iPad") || (navigator.platform == "iPhone"))

	framecanvas = document.getElementById('scratch');
    	framectx = framecanvas.getContext('2d');
	if (framed) framecanvas.style.outline = 0;

	barcanvas = document.createElement("canvas");
	barcanvas.width = 200;
	barcanvas.height = 8;
    	barctx = barcanvas.getContext('2d');

	debugcanvas = document.createElement("canvas");
	debugcanvas.width = 480;
	debugcanvas.height = 360;
    	debugctx = debugcanvas.getContext('2d');

	framecanvas.onmousedown = mouseDown;
	framecanvas.ontouchstart = touchDown;
	framecanvas.ontouchmove = touchMove;

	document.onmouseup = mouseUp;

	document.ontouchend = touchUp;
	framecanvas.onmousemove = getMousePosition;

	// Start Player Images

	if ((typeof imagesPreloaded == "undefined") || (imagesPreloaded != true)) {

	frame = new Image();
	frame.src = basedir+"frame.png"
	frame.onload = IncLoad;

	bar = new Image();
	bar.src = basedir+"bar.png"
	bar.onload = IncLoad;

	greenflagn = new Image();
	greenflagn.src = basedir+"greenflag.png"
	greenflagn.onload = IncLoad;

	greenflaga = new Image();
	greenflaga.src = basedir+"greenflaga.png"
	greenflaga.onload = IncLoad;

	stopn = new Image();
	stopn.src = basedir+"stop.png"
	stopn.onload = IncLoad;

	stopa = new Image();
	stopa.src = basedir+"stopa.png"
	stopa.onload = IncLoad;

	preload = new Image();
	preload.src = basedir+"preloader.png"
	preload.onload = IncLoad;

	accept = new Image();
	accept.src = basedir+"accept.png"
	accept.onload = IncLoad;

	// Extra images for smartphones.

	if (touchDevice) {
		totalfiles += 1;

		touchbuttons = new Image();
		touchbuttons.src = "phonebuttons.png"
		touchbuttons.onload = IncLoad;

	}

	} else {
		loaded = totalfiles-1;
		IncLoad();
	}

	// End Player Images

}


function blockHandler(block, reporter, number) {

	if (typeof number == "undefined") number = false;

	if (!reporter) {
		if (!(Object.prototype.toString.call( block ) === '[object Array]')) { //; //if it's not a list then it's not a block, it's actually a string
			block = [block];
		}
	}

	if (!reporter || (Object.prototype.toString.call( block ) === '[object Array]')){
		var j=0;
		var f=0;
		if (!reporter) {
			if (block[0] == "whenGreenFlag") {

				scriptValidity = true;
				scripts[spritenum][0][scripts[spritenum][0].length] = scripttext.length;

				for (j=1;j<block.length;j++){
					ifLoopVar.push(j);
					blockHandler(block[j], false);
					j = ifLoopVar.pop();
				}


			} else if (block[0] == "whenClicked") {

				scriptValidity = true;
				scripts[spritenum][7][scripts[spritenum][7].length] = scripttext.length;

				for (j=1;j<block.length;j++){
					ifLoopVar.push(j);
					blockHandler(block[j], false);
					j = ifLoopVar.pop();
				}


			} else if (block[0] == "whenCloned") {

				scriptValidity = true;
				scripts[spritenum][6][scripts[spritenum][6].length] = scripttext.length;


				for (j=1;j<block.length;j++){
					ifLoopVar.push(j);
					blockHandler(block[j], false);
					j = ifLoopVar.pop();
				}


			} else if (block[0][0] == "whenIReceive") {

				scriptValidity = true;

				if (broadcastArgs.indexOf([block[0][1]]) == -1) {
					broadcastArgs.push(block[0][1]);
					scripts[spritenum][5][scripts[spritenum][5].length] = new Array();
				}

				scripts[spritenum][5][getBroadcastID(block[0][1])][scripts[spritenum][5][getBroadcastID(block[0][1])].length] = scripttext.length;

				for (j=1;j<block.length;j++){
					ifLoopVar.push(j);
					blockHandler(block[j], false);
					j = ifLoopVar.pop();
				}

			/*} else if (block[0][0] == "procDef") {

				scriptValidity = true;

				if (blockArgs.indexOf([block[0][1]]) == -1) {
					blockArgs.push(block[0][1]);
					scripts[spritenum][8][getBlockID(block[0][1])] = scripttext.length;
				}
	
				scripttext += "var procNames = "+JSON.stringify(block[0][2])+"; "
				scripttext += "var procNVars = procVars; "
				scripttext += "procVars = new Array(); "
				scripttext += "for (prc=0;prc<procNVars.length;prc++){ procVars[procNames[prc]] = procNVars[prc]; }"

				for (j=1;j<block.length;j++){
					ifLoopVar.push(j);
					blockHandler(block[j], false);
					j = ifLoopVar.pop();
				}
			*/

			} else if (block[0] == "wait:elapsed:from:") {
	

				scripttext += "scratchAddExecution(spr, 'wait', "+scripts[spritenum][2].length+", ";
				blockHandler(block[1], true, true);
				scripttext += ", topType, topSID, topRepeat); return; ";
				scripts[spritenum][2][scripts[spritenum][2].length] = scripttext.length;
		

			} else if (block[0] == "glideSecs:toX:y:elapsed:from:") {
	
				scripttext += "glideData[spr].starttime = ";	
				blockHandler(block[1], true, true);	
				scripttext += "; glideData[spr].time = glideData[spr].starttime; glideData[spr].startx = sprites[spr].scratchX; glideData[spr].x = ";	
				blockHandler(block[2], true, true);	
				scripttext += "; glideData[spr].starty = sprites[spr].scratchY; glideData[spr].y = ";	
				blockHandler(block[3], true, true);	
				scripttext += "; ";	

				scripttext += "scratchAddExecution(spr, 'wait', "+scripts[spritenum][2].length+", ";
				blockHandler(block[1], true, true);
				scripttext += ", topType, topSID, topRepeat); return; ";
				scripts[spritenum][2][scripts[spritenum][2].length] = scripttext.length;


			} else if (block[0] == "say:duration:elapsed:from:") {

				scripttext += "scratchSay(spr, ";
				blockHandler(block[1], true);
				scripttext += "); ";

				scripttext += "scratchAddExecution(spr, 'wait', "+scripts[spritenum][2].length+", ";
				blockHandler(block[2], true, true);
				scripttext += ", topType, topSID, topRepeat); return; ";
				scripts[spritenum][2][scripts[spritenum][2].length] = scripttext.length;

				scripttext += "specialproperties[spr].say = ''; ";

			} else if (block[0] == "noteOn:duration:elapsed:from:") {

				scripttext += "var noteDuration = (";
				blockHandler(block[2], true, true);
				scripttext += ")/(scratchTempo/60); ";
				scripttext += "genNote(";
				blockHandler(block[1], true, true);
				scripttext += ", noteDuration); ";

				scripttext += "scratchAddExecution(spr, 'wait', "+scripts[spritenum][2].length+", noteDuration, topType, topSID, topRepeat); return; ";
				scripts[spritenum][2][scripts[spritenum][2].length] = scripttext.length;


			} else if (block[0] == "rest:elapsed:from:") {

				scripttext += "var noteDuration = (";
				blockHandler(block[1], true, true);
				scripttext += ")/(scratchTempo/60); ";

				scripttext += "scratchAddExecution(spr, 'wait', "+scripts[spritenum][2].length+", noteDuration, topType, topSID, topRepeat); return; ";
				scripts[spritenum][2][scripts[spritenum][2].length] = scripttext.length;


			} else if (block[0] == "think:duration:elapsed:from:") {

				scripttext += "scratchThink(spr, ";
				blockHandler(block[1], true);
				scripttext += "); ";

				scripttext += "scratchAddExecution(spr, 'wait', "+scripts[spritenum][2].length+", ";
				blockHandler(block[2], true, true);
				scripttext += ", topType, topSID, topRepeat); return; ";
				scripts[spritenum][2][scripts[spritenum][2].length] = scripttext.length;

				scripttext += "specialproperties[spr].say = ''; ";
				

			} else if (block[0] == "doAsk") {
				
				scripttext += "scratchAsk(spr, ";
				blockHandler(block[1], true);
				scripttext += "); ";

				scripttext += "scratchAddExecution(spr, 'wait', "+scripts[spritenum][2].length+", 'untilAnswered'";
				scripttext += ", topType, topSID, topRepeat); return; ";
				scripts[spritenum][2][scripts[spritenum][2].length] = scripttext.length;

			} else if (block[0] == "doPlaySoundAndWait") {

				scripttext += "scratchAddExecution(spr, 'wait', "+scripts[spritenum][2].length+", ";

				scripttext += "scratchPlaySound(spr, "; //this returns the duration, it waits for that long.
				blockHandler(block[1], true);
				scripttext += ")";

				scripttext += ", topType, topSID, topRepeat, 'audio'); return; ";
				scripts[spritenum][2][scripts[spritenum][2].length] = scripttext.length;

			} else if (block[0] == "doRepeat") {


				scripttext += "repeatBreak = false; scratchAddExecution(spr, 'repeat', "+scripts[spritenum][4].length+", 0, topType, topSID, topRepeat, ";
				blockHandler(block[1], true, true);
				scripttext += "); return; ";
				ifLoopVar.push(scripts[spritenum][4].length);
				scripts[spritenum][4][scripts[spritenum][4].length] = scripttext.length;

				scripttext += "repeatStacks[spr][topRepeat].push(q); if (executionQueue[spr][q].repeatNum > 0) {";

				if (block[2] != null) {

				for (j=0;j<block[2].length;j++){
					ifLoopVar.push(j);
					blockHandler(block[2][j], false);
					j = ifLoopVar.pop();
				}

				}

				scripttext += "} var tempq = repeatStacks[spr][topRepeat].pop(); quickref = executionQueue[spr][tempq]; quickref.timeUntil = 1; if (0 < quickref.repeatNum) { quickref.repeatNum -= 1; "

				scripttext += "scratchAddExecution(spr, 'repeat', "+ifLoopVar.pop()+", 1, topType, topSID, topRepeat, quickref.repeatNum); if (q != tempq) { eraseExec(spr, tempq); } repeatBreak = true; return; } else { if (q != tempq) { eraseExec(spr, tempq); } }";

			} else if (block[0] == "doUntil") {



				scripttext += "scratchAddExecution(spr, 'repeat', "+scripts[spritenum][4].length+", 0, topType, topSID, topRepeat";
				scripttext += "); return; ";
				ifLoopVar.push(scripts[spritenum][4].length);
				scripts[spritenum][4][scripts[spritenum][4].length] = scripttext.length;

				scripttext += "if (!("

				blockHandler(block[1], true);

				scripttext += ")) {"		

				for (j=0;j<block[2].length;j++){
					ifLoopVar.push(j);
					blockHandler(block[2][j], false);
					j = ifLoopVar.pop();
				}

				scripttext += " }  repeatBreak = true; if (!("

				blockHandler(block[1], true);		

				scripttext += ")) { scratchAddExecution(spr, 'repeat', "+ifLoopVar.pop()+", 1, topType, topSID, topRepeat); return; }";

			} else if (block[0] == "doWaitUntil") {

				//just a repeat with no content - aren't i cunning :>

				scripttext += "scratchAddExecution(spr, 'repeat', "+scripts[spritenum][4].length+", 0, topType, topSID, topRepeat";
				scripttext += "); return; ";
				ifLoopVar.push(scripts[spritenum][4].length);
				scripts[spritenum][4][scripts[spritenum][4].length] = scripttext.length;

				scripttext += "repeatBreak = true; if (!("

				blockHandler(block[1], true);		

				scripttext += ")) { scratchAddExecution(spr, 'repeat', "+ifLoopVar.pop()+", 1, topType, topSID, topRepeat); return; }";


			} else if (block[0][0] == "whenKeyPressed") {

				scriptValidity == true;
				scripts[spritenum][3][scratchParseCharCode(block[0][1])][scripts[spritenum][3][scratchParseCharCode(block[0][1])].length] = scripttext.length;

				for (j=1;j<block.length;j++){
					ifLoopVar.push(j);
					blockHandler(block[j], false);
					j = ifLoopVar.pop();
				}



			} else if (block[0] == "doForever") {

				scripttext += "scratchAddExecution(spr, 'forever', "+scripts[spritenum][1].length+", 0, topType, topSID, topRepeat); return; ";

				ifLoopVar.push(scripts[spritenum][1].length);

				scripts[spritenum][1][scripts[spritenum][1].length] = scripttext.length;

				
				foreverlength += 1;
				for (f=0;f<block[1].length;f++){
					ifLoopVar.push(f);
					blockHandler(block[1][f], false);
					f = ifLoopVar.pop();
				}

				scripttext += "scratchAddExecution(spr, 'forever', "+ifLoopVar.pop()+", 1, topType, topSID, topRepeat); return; ";

			} else if (block[0] == "doForeverIf") { //if you ever use this block you suck

				scripttext += "scratchAddExecution(spr, 'forever', "+scripts[spritenum][1].length+", 0, topType, topSID, topRepeat); return; ";

				ifLoopVar.push(scripts[spritenum][1].length);

				scripts[spritenum][1][scripts[spritenum][1].length] = scripttext.length;

				scripttext += "if (";
				blockHandler(block[1], true);
				scripttext += ") { ";

				foreverlength += 1;
				for (f=0;f<block[2].length;f++){
					ifLoopVar.push(f);
					blockHandler(block[2][f], false);
					f = ifLoopVar.pop();
				}

				scripttext += "} scratchAddExecution(spr, 'forever', "+ifLoopVar.pop()+", 1, topType, topSID, topRepeat); return; ";

			} else if (block[0] == "doReturn") {

				scripttext += "terminateScript(spr); "; // the most literal block name of them all
				scripttext += "return; "; // the most literal block name of them all


			} else if (block[0] == "broadcast:") {

				scripttext += "scratchBroadcast(spr, ";
				blockHandler(block[1], true);
				scripttext += "); if(broadcastReturn) { repeatBreak = true; return; } ";

			} else if (block[0] == "doBroadcastAndWait") {

				scripttext += "scratchBroadcast(spr, ";
				blockHandler(block[1], true);
				scripttext += "); if(broadcastReturn) { repeatBreak = true; return; } ";

				scripttext += "scratchAddExecution(spr, 'wait', "+scripts[spritenum][2].length+", 'untilBroadcast'";
				scripttext += ", topType, topSID, topRepeat, getBroadcastID(";

				blockHandler(block[1], true);

				scripttext += ")); return; ";

				scripts[spritenum][2][scripts[spritenum][2].length] = scripttext.length;

			} else if (block[0] == "doIf") {

				scripttext += "if (";
				blockHandler(block[1], true);
				scripttext += ") { ";

				if (block[2] != null) {
				for (j=0;j<block[2].length;j++){
					ifLoopVar.push(j);
					blockHandler(block[2][j], false);
					j = ifLoopVar.pop();
				}
				}
				scripttext += " } ";


			} else if (block[0] == "doIfElse") {

				scripttext += "if (";
				blockHandler(block[1], true);
				scripttext += ") { ";

				if (block[2] != null) {
				for (j=0;j<block[2].length;j++){
					ifLoopVar.push(j);
					blockHandler(block[2][j], false);
					j = ifLoopVar.pop();
				}
				}



				scripttext += " } else { ";
				if (block[3] != null) {
				for (j=0;j<block[3].length;j++){
					ifLoopVar.push(j);
					blockHandler(block[3][j], false);
					j = ifLoopVar.pop();
				}
				}
				scripttext += " } ";

			} else if (block[0] == "setVar:to:") {

				scripttext += "scratchSetVar(spr, ";
				blockHandler(block[1], true);
				scripttext += ", ";
				blockHandler(block[2], true);
				scripttext += "); ";

			} else if (block[0] == "changeVar:by:") {

				scripttext += "scratchChangeVar(spr, ";
				blockHandler(block[1], true);
				scripttext += ", ";
				blockHandler(block[2], true, true);
				scripttext += "); ";

			} else if (block[0] == "pointTowards:") {

				scripttext += "scratchPointTowards(spr, ";
				blockHandler(block[1], true);
				scripttext += "); ";

			} else if (block[0] == "filterReset") {

				scripttext += "scratchFilterReset(spr); ";

			} else if (block[0] == "forward:") {

				scripttext += "scratchStep(spr, ";
				blockHandler(block[1], true, true);
				scripttext += "); ";

			} else if (block[0] == "gotoSpriteOrMouse:") {

				scripttext += "scratchGotoSprite(spr, ";
				blockHandler(block[1], true);
				scripttext += "); ";

			} else if (block[0] == "lookLike:") {

				scripttext += "scratchSetCostume(spr, ";
				blockHandler(block[1], true);
				scripttext += "); ";

			} else if (block[0] == "showBackground:") {

				scripttext += "scratchSetBackground(";
				blockHandler(block[1], true);
				scripttext += "); ";

			} else if (block[0] == "nextCostume") {

				scripttext += "scratchNextCostume(spr); ";

			} else if (block[0] == "nextBackground") {

				scripttext += "scratchNextBackground(); ";

			} else if (block[0] == "append:toList:") {

				scripttext += "scratchAppendList(spr, ";
				blockHandler(block[1], true);
				scripttext += ", ";
				blockHandler(block[2], true);
				scripttext += "); ";


			} else if (block[0] == "insert:at:ofList:") {

				scripttext += "scratchAddList(spr, ";
				blockHandler(block[1], true);
				scripttext += ", ";
				blockHandler(block[2], true);
				scripttext += ", ";
				blockHandler(block[3], true);
				scripttext += "); ";


			} else if (block[0] == "deleteLine:ofList:") {

				scripttext += "scratchDeleteList(spr, ";
				blockHandler(block[1], true);
				scripttext += ", ";
				blockHandler(block[2], true);
				scripttext += "); ";

			} else if (block[0] == "setLine:ofList:to:") {

				scripttext += "scratchReplaceList(spr, ";
				blockHandler(block[3], true);
				scripttext += ", ";
				blockHandler(block[1], true);
				scripttext += ", ";
				blockHandler(block[2], true);
				scripttext += "); ";

			} else if (block[0] == "timerReset") {

				scripttext += "scratchTimeStart = Date.now(); ";

			} else if (block[0] == "clearPenTrails") {

				scripttext += "scratchClearPen(); "

			} else if (block[0] == "putPenDown") {

				scripttext += "specialproperties[spr].pendown = true; movedSincePen = false;";

			} else if (block[0] == "putPenUp") {

				scripttext += "specialproperties[spr].pendown = false; if (!movedSincePen) scratchPenDot(spr); ";

			} else if (block[0] == "stopAllSounds") {

				scripttext += "scratchStopAllSounds(); "

			} else if (block[0] == "stopAll") {

				scripttext += "stopAll(); return;"


			} else if (block[0] == "stampCostume") {

				scripttext += "scratchStamp(spr); "

			} else if (block[0] == "createCloneOf") {

				scripttext += "scratchClone(spr, ";
				blockHandler(block[1], true);
				scripttext += "); ";

			} else if (block[0] == "deleteClone") {

				scripttext += "scratchDeleteClone(spr); return;";


			} else if (block[0] == "setSizeTo:") {

				scripttext += "sprites[spr].scale = (";
				blockHandler(block[1], true, true);
				scripttext += ")/100; ";

			} else if (block[0] == "setTempoTo:") {

				scripttext += "scratchTempo = (";
				blockHandler(block[1], true, true);
				scripttext += "); ";

			} else if (block[0] == "changeSizeBy:") {

				scripttext += "sprites[spr].scale += (";
				blockHandler(block[1], true, true);
				scripttext += ")/100; ";

			} else if (block[0] == "gotoX:y:") {
				
				scripttext += "scratchGotoXY(spr, ";
				blockHandler(block[1], true, true);
				scripttext += ", ";
				blockHandler(block[2], true, true);
				scripttext += "); ";

			} else if (block[0] == "changeXposBy:") {
				
				scripttext += "scratchChangeX(spr, ";
				blockHandler(block[1], true, true);
				scripttext += "); ";

			} else if (block[0] == "penColor:") {
				
				scripttext += "scratchPenColor(spr, ";
				blockHandler(block[1], true);
				scripttext += "); ";

			} else if (block[0] == "changePenHueBy:") {
				
				scripttext += "scratchChangePenColor(spr, ";
				blockHandler(block[1], true, true);
				scripttext += "); ";


			} else if (block[0] == "setPenHueTo:") {
				
				scripttext += "scratchSetPenColor(spr, ";
				blockHandler(block[1], true, true);
				scripttext += "); ";

			} else if (block[0] == "changePenShadeBy:") {
				
				scripttext += "scratchChangePenShade(spr, ";
				blockHandler(block[1], true, true);
				scripttext += "); ";


			} else if (block[0] == "setPenShadeTo:") {
				
				scripttext += "scratchSetPenShade(spr, ";
				blockHandler(block[1], true, true);
				scripttext += "); ";


			} else if (block[0] == "penSize:") {
				
				scripttext += "scratchPenSize(spr, ";
				blockHandler(block[1], true, true);
				scripttext += "); ";

			} else if (block[0] == "changeYposBy:") {
				
				scripttext += "scratchChangeY(spr, ";
				blockHandler(block[1], true, true);
				scripttext += "); ";

			} else if (block[0] == "xpos:") {
				
				scripttext += "scratchGotoX(spr, ";
				blockHandler(block[1], true, true);
				scripttext += "); ";

			} else if (block[0] == "ypos:") {
				
				scripttext += "scratchGotoY(spr, ";
				blockHandler(block[1], true, true);
				scripttext += "); ";

			} else if (block[0] == "bounceOffEdge") {

				scripttext += "scratchBounceOffEdge(spr); ";

			} else if (block[0] == "say:") {
				
				scripttext += "scratchSay(spr, ";
				blockHandler(block[1], true);
				scripttext += "); ";

			} else if (block[0] == "think:") {
				
				scripttext += "scratchThink(spr, ";
				blockHandler(block[1], true);
				scripttext += "); ";

			} else if (block[0] == "show") {

				scripttext += "sprites[spr].visible = true; ";


			} else if (block[0] == "comeToFront") {

				scripttext += "layerOperations[layerOperations.length] = {'sprite': spr, 'op': 'front'};"


			} else if (block[0] == "goBackByLayers:") {

				scripttext += "layerOperations[layerOperations.length] = {'sprite': spr, 'op': 'back', 'num': "
				blockHandler(block[1], true, true);
				scripttext += "}; ";

			} else if (block[0] == "hide") {

				scripttext += "sprites[spr].visible = false; ";

			} else if (block[0] == "showVariable:") {
				
				scripttext += "scratchShowVar(spr, ";
				blockHandler(block[1], true);
				scripttext += "); ";

			} else if (block[0] == "hideVariable:") {
				
				scripttext += "scratchHideVar(spr, ";
				blockHandler(block[1], true);
				scripttext += "); ";

			} else if (block[0] == "setGraphicEffect:to:") {

				scripttext += "scratchGraphicEffect(spr, ";
				blockHandler(block[1], true);
				scripttext += ", ";
				blockHandler(block[2], true, true);
				scripttext += "); ";

			} else if (block[0] == "changeGraphicEffect:by:") {

				scripttext += "scratchChangeGraphicEffect(spr, ";
				blockHandler(block[1], true);
				scripttext += ", ";
				blockHandler(block[2], true, true);
				scripttext += "); ";

			} else if (block[0] == "playSound:") {

				scripttext += "scratchPlaySound(spr, ";
				blockHandler(block[1], true);
				scripttext += "); ";


			} else if (block[0] == "setVolumeTo:") {

				scripttext += "scratchSetVolume(spr, ";
				blockHandler(block[1], true, true);
				scripttext += "); ";

			} else if (block[0] == "turnRight:") {

				scripttext += "sprites[spr].direction += ";
				blockHandler(block[1], true, true);
				scripttext += "; ";
				scripttext += "if (sprites[spr].direction < -180) sprites[spr].direction += 360*Math.ceil((sprites[spr].direction+180)/-360); ";
				scripttext += "sprites[spr].direction = ((sprites[spr].direction+180)%360)-180; ";


			} else if (block[0] == "heading:") {

				scripttext += "sprites[spr].direction = ";
				blockHandler(block[1], true, true);
				scripttext += "; ";
				scripttext += "if (sprites[spr].direction < -180) sprites[spr].direction += 360*Math.ceil((sprites[spr].direction+180)/-360); ";
				scripttext += "sprites[spr].direction = ((sprites[spr].direction+180)%360)-180; ";


			} else if (block[0] == "turnLeft:") {

				scripttext += "sprites[spr].direction -= ";
				blockHandler(block[1], true, true);
				scripttext += "; ";
				scripttext += "if (sprites[spr].direction < -180) sprites[spr].direction += 360*Math.ceil((sprites[spr].direction+180)/-360); ";
				scripttext += "sprites[spr].direction = ((sprites[spr].direction+180)%360)-180; ";
			} else if (scriptValidity) {
		
					if (unimp.indexOf(block[0]) == -1) unimp.push(block[0]);
			}
		} else {

			if (block[0] == "readVariable") {

				if (number) scripttext += "castNumber(";
				scripttext += "scratchReadVar(spr, ";
				blockHandler(block[1], true);
				scripttext += ")";
				if (number) scripttext += ")";

			} else if (block[0] == "sensor:") {

				if (number) scripttext += "castNumber(";
				scripttext += "scratchReadMesh(";
				blockHandler(block[1], true);
				scripttext += ")";
				if (number) scripttext += ")";

			} else if (block[0] == "getLine:ofList:") {


				if (number) scripttext += "castNumber(";
				scripttext += "scratchReadList(spr, ";
				blockHandler(block[1], true);
				scripttext += ", ";
				blockHandler(block[2], true);
				scripttext += ")";
				if (number) scripttext += ")";


			} else if (block[0] == "lineCountOfList:") {

				scripttext += "scratchListLength(spr, ";
				blockHandler(block[1], true);
				scripttext += ")";

			} else if (block[0] == "contentsOfList:") {

				if (number) scripttext += "castNumber(";
				scripttext += "scratchListContents(spr, ";
				blockHandler(block[1], true);
				scripttext += ")";
				if (number) scripttext += ")";

			} else if (block[0] == "getAttribute:of:") {

				if (number) scripttext += "castNumber(";
				scripttext += "scratchGetAttribute(";
				blockHandler(block[1], true);
				scripttext += ", ";
				blockHandler(block[2], true);
				scripttext += ")";
				if (number) scripttext += ")";

			} else if (block[0] == "list:contains:") {

				scripttext += "scratchListContains(spr, ";
				blockHandler(block[1], true);
				scripttext += ", ";
				blockHandler(block[2], true);
				scripttext += ")";


			} else if (block[0] == "computeFunction:of:") {

				if (number) scripttext += "castNumber(";
				scripttext += "scratchMathFunction(";
				blockHandler(block[1], true);
				scripttext += ", ";
				blockHandler(block[2], true, true);
				scripttext += ")";
				if (number) scripttext += ")";


			} else if (block[0] == "=") {

				scripttext += "(";
				blockHandler(block[1], true);
				scripttext += "== ";
				blockHandler(block[2], true);
				scripttext += ")";

			} else if (block[0] == ">") {

				scripttext += "(";
				blockHandler(block[1], true, true);
				scripttext += " > ";
				blockHandler(block[2], true, true);
				scripttext += ")";

			} else if (block[0] == "<") {

				scripttext += "(";
				blockHandler(block[1], true, true);
				scripttext += " < ";
				blockHandler(block[2], true, true);
				scripttext += ")";

			} else if (block[0] == "not") {

				scripttext += "(!";
				blockHandler(block[1], true);
				scripttext += ")";

			} else if (block[0] == "|") {

				scripttext += "(";
				blockHandler(block[1], true);
				scripttext += "|| ";
				blockHandler(block[2], true);
				scripttext += ")";

			} else if (block[0] == "&") {

				scripttext += "(";
				blockHandler(block[1], true);
				scripttext += "&& ";
				blockHandler(block[2], true);
				scripttext += ")";

			} else if (block[0] == "-") {

				scripttext += "(";
				blockHandler(block[1], true, true);
				scripttext += " - ";
				blockHandler(block[2], true, true);
				scripttext += ")";

			} else if (block[0] == "+") {

				scripttext += "(";
				blockHandler(block[1], true, true);
				scripttext += " + ";
				blockHandler(block[2], true, true);
				scripttext += ")";


			} else if (block[0] == "concatenate:with:") {

				if (number) scripttext += "castNumber(";
				scripttext += "(String(";
				blockHandler(block[1], true);
				scripttext += ") + String(";
				blockHandler(block[2], true);
				scripttext += "))";
				if (number) scripttext += ")";

			} else if (block[0] == "timer") {

				scripttext += "(((Date.now()) - scratchTimeStart)/1000)";

			} else if (block[0] == "answer") {

				if (number) scripttext += "castNumber(";
				scripttext += "(scratchAnswer)";
				if (number) scripttext += ")";

			} else if (block[0] == "mouseX") {

				scripttext += "(MouseX)";

			} else if (block[0] == "mouseY") {

				scripttext += "(MouseY)";

			} else if (block[0] == "*") {

				scripttext += "(";
				blockHandler(block[1], true, true);
				scripttext += " * ";
				blockHandler(block[2], true, true);
				scripttext += ")";

			} else if (block[0] == "\\\\") {

				scripttext += "scratchMod(";
				blockHandler(block[1], true, true);
				scripttext += ", ";
				blockHandler(block[2], true, true);
				scripttext += ")";


			} else if (block[0] == "\/") {

				scripttext += "(";
				blockHandler(block[1], true, true);
				scripttext += " / ";
				blockHandler(block[2], true, true);
				scripttext += ")";


			} else if (block[0] == "rounded") {

				scripttext += "Math.round(";
				blockHandler(block[1], true, true);
				scripttext += ")";

			} else if (block[0] == "keyPressed:") {

				scripttext += "scratchKeyDown(";
				blockHandler(block[1], true);
				scripttext += ")";

			} else if (block[0] == "mousePressed") {

				scripttext += "(scratchMouseDown)";

			} else if (block[0] == "xpos") {

				scripttext += "sprites[spr].scratchX";

			} else if (block[0] == "heading") {

				scripttext += "sprites[spr].direction";


			} else if (block[0] == "scale") {

				scripttext += "(sprites[spr].scale*100)";

			} else if (block[0] == "costumeIndex") {

				scripttext += "(sprites[spr].currentCostumeIndex+1)";

			} else if (block[0] == "backgroundIndex") {

				scripttext += "(project.currentCostumeIndex+1)";


			} else if (block[0] == "randomFrom:to:") {

				scripttext += "scratchRandomFromTo(";
				blockHandler(block[1], true, true);
				scripttext += ", ";
				blockHandler(block[2], true, true);
				scripttext += ")";

			} else if (block[0] == "touchingColor:") {

				scripttext += "scratchColorCollision(spr, ";
				blockHandler(block[1], true);
				scripttext += ")";

			} else if (block[0] == "color:sees:") {

				scripttext += "scratchColorCollision2(spr, ";
				blockHandler(block[1], true);
				scripttext += ", ";
				blockHandler(block[2], true);
				scripttext += ")";

			} else if (block[0] == "stringLength:") {

				scripttext += "(String(";
				blockHandler(block[1], true);
				scripttext += ").length)";

			} else if (block[0] == "letter:of:") {

				if (number) scripttext += "castNumber(";
				scripttext += "(String(";
				blockHandler(block[2], true);
				scripttext += ").charAt(";
				blockHandler(block[1], true, true);
				scripttext += "-1))";
				if (number) scripttext += ")";

			} else if (block[0] == "touching:") {

				scripttext += "scratchCollisionDetect(spr, ";
				blockHandler(block[1], true);
				scripttext += ")";

			} else if (block[0] == "distanceTo:") {

				scripttext += "scratchDistance(spr, ";
				blockHandler(block[1], true);
				scripttext += ")";

			} else if (block[0] == "ypos") {

				scripttext += "sprites[spr].scratchY";

			} else {
				alert(block[0]);
			}
		}
	} else {
		if (typeof block == 'string') {
			if (number) scripttext += castNumber(block);
			else scripttext += "'"+block.replace("'", "\\'")+"'";
		} else {
			if (number) scripttext += castNumber(block);
			else scripttext += block;
		}
	}
	return;

}


function log(value) {
	consolelog[consolelog.length] = value;
}

function stopAll() {

	active = false;

	scratchStopAllSounds();

	specialproperties = new Array(); 

	for (i=0;i<sprites.length;i++) {
		if (sprites[i].clone != undefined) {
			num = layerOrder.indexOf(i);
			scratchDeleteClone(i);
			i -= 1;
		} else {

		specialproperties[i] = {"pendown": false, "pensize": 1, "color": "#000000", "say": "", "sayold": "", "saylist": [], "think": false, "ask": false, "effects": [], "penhue": 0, "pensaturation": 100, "penlightness": 50, "volume": 100};
		specialproperties[i].effects['ghost'] = 0;
		specialproperties[i].effects['brightness'] = 0;
		}
	}

	specialproperties["stage"] = {"effects": []};
	specialproperties["stage"].volume = 100;
	specialproperties["stage"].effects['ghost'] = 0;
	specialproperties["stage"].effects['brightness'] = 0;

	executionQueue = new Array();

	for (i=0;i<sprites.length;i++) {
		executionQueue[i] = new Array();
	}
	executionQueue['stage'] = new Array();


}

function execGreenFlag() {

	q = -1;

	endFrameMs = Date.now();

	startFrameMs = Date.now();

	active = true;

	askString = "";
	askOwner = -1;

	scratchTimeStart = Date.now();

	executionQueue = new Array();


	for (i=0;i<sprites.length;i++) {
		executionQueue[i] = new Array();


	}
	executionQueue['stage'] = new Array();

	glideData = new Array();
	for (spr=0;spr<sprites.length;spr++) {
		glideData[spr] = {"time": 0, "starttime": 0, "x": 0, "y": 0, "startx": 0, "starty": 0};
	}

	layerOperations = new Array();

	for (spr=sprites.length-1;spr>-1;spr--) {
		for (gfs=0;gfs<scripts[spr][0].length;gfs++) {
			topType = "greenFlag";
			topSID = gfs;
			topRepeat = repeatStacks[spr].length;
			repeatStacks[spr].push([]);
			scripts[spr][0][gfs]();
		}
	}

	processLayerOps();

	spr = "stage";
	for (gfs=0;gfs<scripts["stage"][0].length;gfs++) {
		topType = "greenFlag";
		topSID = gfs;
		topRepeat = repeatStacks[spr].length;
		repeatStacks[spr].push([]);
		scripts["stage"][0][gfs]();
	}


}

function scratchEval(string) {
	eval(String(string).substr(14, String(string).length-15));
}

function executeFrame() {

	drawStage = 0;

	var tempTime = Date.now();

	FPS = 1000/(tempTime - startFrameMs);

	startFrameMs = tempTime;

	layerOperations = new Array();

	spr = 0;

	for (num=layerOrder.length-1;num>-1;num--) { //spr=0;sprites.length;spr++

// ------- SPRITES -------

		spr = layerOrder[num]; 

		if (glideData[spr].time > 0) {
			glideData[spr].time -= 1/FPS
			if (glideData[spr].time < 0) glideData[spr].time = 0;

			var glideStep = (glideData[spr].starttime - glideData[spr].time) / glideData[spr].starttime;

			sprites[spr].scratchX = glideData[spr].x * glideStep + glideData[spr].startx * (1-glideStep);
			sprites[spr].scratchY = glideData[spr].y * glideStep + glideData[spr].starty * (1-glideStep);
		}

		if (sprites[spr] == undefined) continue;

		
		if (specialproperties[spr].pendown) {
			penctx.lineWidth = specialproperties[spr].pensize;
			penctx.strokeStyle = specialproperties[spr].color;
		}

		abortscripts = false;

		if (active) {
		
		processExecutionQueue();

		}

	}

	processLayerOps();

// ------- STAGE SCRIPTS -------


		abortscripts = false;

		if (active) {

		spr = "stage";

		processExecutionQueue();

		}

// ------- END STAGE SCRIPTS -------



}

function touchingScreenSection(touchx, touchy, x, y, bwidth, bheight) {
	return (((touchx+240) > x) && ((touchx+240) < x+bwidth) && ((180-touchy) > y) && ((180-touchy) < y+bheight));
}

function update() {

	framectx.clearRect(0, 0, 486, 391);

	renderMs = Date.now();

	scratchPartialDraw(drawStage, layerOrder.length);

	scratchDrawSpeech();

	ctx.clearRect(0, 0, 480, 360);

	penctx.lineCap = "round";

	ctx.globalAlpha = 1;
	var costume = project.costumes[project.currentCostumeIndex];
	ctx.drawImage(images[costume.baseLayerID], (0-costume.rotationCenterX)+240, (0-costume.rotationCenterY)+180);

	ctx.drawImage(pencanvas, 0, 0);
	ctx.drawImage(sprcanvas, 0, 0);

	if (touchDevice) {
		ctx.globalAlpha = 0.2;
		ctx.drawImage(touchbuttons, 0, 0);


		ctx.globalAlpha = 1;
	}

	rendMs = Date.now() - renderMs;

	if (console) {
		ctx.globalAlpha = 0.75;
		ctx.fillStyle = "#000000";
		ctx.fillRect(0, 0, 480, 360);
		ctx.fillStyle = "#FFFFFF";
		ctx.font = "10px sans-serif";
		for (i=0;i<Math.min(consolelog.length, 29);i++) {
			ctx.fillText(consolelog[(consolelog.length-Math.min(consolelog.length, 29))+i], 5, 15+i*12);
		}
		ctx.font = "bold 25px arial";
		ctx.fillText(Math.round(FPS)+" FPS", 475-ctx.measureText(Math.round(FPS)+" FPS").width, 25);
		ctx.font = "15px arial";
		ctx.fillText("update: "+Math.round(updateMs)+"ms", 475-ctx.measureText("update: "+Math.round(updateMs)+"ms").width, 40);
		ctx.fillText("free: "+Math.round(freeMs)+"ms", 475-ctx.measureText("free: "+Math.round(freeMs)+"ms").width, 55);
		ctx.fillText("render: "+Math.round(rendMs)+"ms", 475-ctx.measureText("render: "+Math.round(rendMs)+"ms").width, 70);
	}

	// END DRAWING CODE

	if (framed) { //bundled frame drawing code

		if (focus == 0) framectx.globalAlpha = 0.5;
		framectx.drawImage(frame, 0, 0);
		framectx.globalAlpha = 1;
		framectx.drawImage(canvas, 3, 28);

		//framectx.drawImage(debugcanvas, 3, 28);

		if ((MouseX > 180) && (MouseX < 206) && (MouseY < 205) && (MouseY > 184)) {
			framectx.drawImage(greenflaga, 423, 3);	
		} else {
			framectx.drawImage(greenflagn, 423, 3);	
		}

		if ((MouseX > 215) && (MouseX < 235) && (MouseY < 205) && (MouseY > 184)) {
			framectx.drawImage(stopa, 456, 3);
		} else {
			framectx.drawImage(stopn, 456, 3);
		}

	if (turboMode) framectx.fillText("Turbo Mode", 360, 15)

	} else { //draws only the canvas, useful for custom frames.

		framectx.drawImage(canvas, 0, 0);

	}

	//-----------EXPERIMENTAL DRAWING AT START OF FRAME-----------

	freeMs = Date.now() - endFrameMs;

	startAllFrameMs = Date.now();

	if (focus == 1) {

	focussteal.focus()

	}

	//debugctx.clearRect(0, 0, 480, 360);

	if(active) {

	if (turboMode) {
		while (Date.now() - startAllFrameMs < 1000/framerate) executeFrame();
	} else {
		executeFrame();
	
	}

	} else {
		startFrameMs = Date.now();
	}

	updateMs = Date.now() - startFrameMs;

	

	//if you have no frame and want to call greenFlag, just have your greenFlag button call stopAll(); and execGreenFlag(); and stop would just call stopAll();

	if (mesh) {
		var packet = {};
		packet.type = "variables";
		packet.data = project.variables;
		connection.send(JSON.stringify(packet));
	}

	endFrameMs = Date.now();

}

function ScratchToJS(lscripts) {
	var scriptlist = new Array();
	foreverlength=0;
	greenflaglength=0;
	ifdepth = 0;
	extrabrackets = 0;
	ifLoopVar = new Array();
	for (scriptnum=0;scriptnum<lscripts.length;scriptnum++) {

		for (i=0;i<broadcastArgs.length;i++) {
			if (typeof scripts[spritenum][5][i] == 'undefined') scripts[spritenum][5][i] = new Array();
		}

		scripttext = new String();

		scriptValidity = false;
		
		blockHandler(lscripts[scriptnum][2], false);

		scriptlist[scriptnum] = scripttext;

		spr = spritenum;

		for (i=0;i<scripts[spritenum][2].length;i++) {
			if (typeof scripts[spritenum][2][i] == 'number') {
				scripts[spritenum][2][i] = scratchRemoveExtraBrackets(scripttext.substr(scripts[spritenum][2][i]));
			}
		}
		for (i=0;i<scripts[spritenum][1].length;i++) {
			if (typeof scripts[spritenum][1][i] == 'number') {
				scripts[spritenum][1][i] = scratchRemoveExtraBrackets(scripttext.substr(scripts[spritenum][1][i]));
			}
		}
		for (i=0;i<scripts[spritenum][0].length;i++) {
			if (typeof scripts[spritenum][0][i] == 'number') {
				scripts[spritenum][0][i] = scratchRemoveExtraBrackets(scripttext.substr(scripts[spritenum][0][i]));
			}
		}
		for (i=0;i<scripts[spritenum][4].length;i++) {
			if (typeof scripts[spritenum][4][i] == 'number') {
				scripts[spritenum][4][i] = scratchRemoveExtraBrackets(scripttext.substr(scripts[spritenum][4][i]));
			}
		}
		for (i=0;i<scripts[spritenum][6].length;i++) {
			if (typeof scripts[spritenum][6][i] == 'number') {
				scripts[spritenum][6][i] = scratchRemoveExtraBrackets(scripttext.substr(scripts[spritenum][6][i]));
			}
		}
		for (i=0;i<scripts[spritenum][7].length;i++) {
			if (typeof scripts[spritenum][7][i] == 'number') {
				scripts[spritenum][7][i] = scratchRemoveExtraBrackets(scripttext.substr(scripts[spritenum][6][i]));
			}
		}
		for (i=0;i<broadcastArgs.length;i++) {
			for (j=0;j<scripts[spritenum][5][i].length;j++) {	
			if (typeof scripts[spritenum][5][i][j] == 'number') {
				scripts[spritenum][5][i][j] = scratchRemoveExtraBrackets(scripttext.substr(scripts[spritenum][5][i][j]));
			}
			}
		}
		for (i=0;i<broadcastArgs.length;i++) {
			for (j=0;j<scripts[spritenum][5][i].length;j++) {	
			if (typeof scripts[spritenum][5][i][j] == 'number') {
				scripts[spritenum][5][i][j] = scratchRemoveExtraBrackets(scripttext.substr(scripts[spritenum][5][i][j]));
			}
			}
		}
		for (j=0;j<256;j++) {
		for (i=0;i<scripts[spritenum][3][j].length;i++) {
			if (typeof scripts[spritenum][3][j][i] == 'number') {
				scripts[spritenum][3][j][i] = scratchRemoveExtraBrackets(scripttext.substr(scripts[spritenum][3][j][i]));
			}
		}
		}

		
	}


	return scriptlist;
}

active = new Boolean(false);
   
var ReadFile = function(url) {

	meshVars = new Array();

	if (typeof updateInterval != 'undefined') {
		clearInterval(updateInterval);
	}

	scratchStopAllSounds();

	if (loaded != totalfiles) {
		alert("Viewer not loaded yet");
		return;
	}

	canvas = document.createElement("canvas");
	canvas.width = 480;
	canvas.height = 360;
	ctx = canvas.getContext("2d");

	pencanvas = document.createElement("canvas");
	pencanvas.width = 480;
	pencanvas.height = 360;

	sprcanvas = document.createElement("canvas");
	sprcanvas.width = 480;
	sprcanvas.height = 360;

	colcanvas = document.createElement("canvas");
	colcanvas.width = 480;
	colcanvas.height = 360;

	loadedb = false;

	colctx = colcanvas.getContext("2d");

	sprctx = sprcanvas.getContext("2d");

	penctx = pencanvas.getContext("2d");

	framectx.clearRect(0, 0, 486, 391);

	if (framed) {

		framectx.drawImage(frame, 0, 0);

		framectx.drawImage(preload, 3, 28);

	} else {

		framectx.drawImage(preload, 0, 0);

	}

        var doneReading = function (zip) {

		loadedb = true; 
		focus = 1;
		repeatStackCount = 0;

		
		for (i=0;i<zipFile.entries.length;i++) {
			if (zipFile.entries[i].name == "project.json") {
				project = JSON.parse(zipFile.entries[i].extract(null, true));
			}
		}

		unimp = new Array();

		images = new Array();
		sprites = new Array();
		varDisplay = new Array();
		specialproperties = new Array(); 
		layerOrderVarDisplay = new Array();
		for (i=0;i<project.children.length;i++) {
			if (project.children[i].indexInLibrary != undefined) {

				specialproperties[specialproperties.length] = {"pendown": false, "pensize": 1, "color": "#000000", "say": "", "sayold": "", "saylist": [], "think": false, "ask": false, "effects": [], "penhue": 0, "pensaturation": 100, "penlightness": 50, "volume": 100};
				specialproperties[specialproperties.length-1].effects['ghost'] = 0;
				specialproperties[specialproperties.length-1].effects['brightness'] = 0;
				sprites[sprites.length] = project.children[i];


			} else {
				varDisplay.push(project.children[i]);
				layerOrderVarDisplay.push(sprites.length-1);
			}
		}


		specialproperties["stage"] = {};
		specialproperties["stage"].volume = 100;
		specialproperties["stage"].effects = new Array();
		specialproperties["stage"].effects['ghost'] = 0;
		specialproperties["stage"].effects['brightness'] = 0;

		askCursorBlink = 0;

		scripts = new Array();
		executionQueue = new Array();
		layerOrder = new Array();
		repeatStacks = new Array();

		varRefs = new Array(); //v2.0 faster variable and list whatever
		listRefs = new Array();

		bcRepeatStackIDs = new Array();

		for (i=0;i<sprites.length;i++) {
			layerOrder[i] = i;
			scripts[i] = new Array();
			scripts[i][2] = new Array();
			scripts[i][3] = new Array();
			for (j=0;j<256;j++) {
				scripts[i][3][j] = new Array();
			}
			scripts[i][1] = new Array();
			scripts[i][0] = new Array();
			scripts[i][4] = new Array();
			scripts[i][5] = new Array();
			scripts[i][6] = new Array();
			scripts[i][7] = new Array();

			repeatStacks[i] = new Array();

			bcRepeatStackIDs[i] = new Array();

			createVarRefs(i);			

			executionQueue[i] = new Array();

		}


			varRefs["stage"] = new Array();

			if (project.variables != undefined) {

				for (j=0;j<project.variables.length;j++) {
					varRefs["stage"][project.variables[j].name] = project.variables[j];
				}

			}

			listRefs["stage"] = new Array();

			if (project.lists != undefined) {

				for (j=0;j<project.lists.length;j++) {
					listRefs["stage"][project.lists[j].listName] = project.lists[j];
				}

			}


			bcRepeatStackIDs["stage"] = new Array();

			scripts["stage"] = new Array();
			scripts["stage"][2] = new Array();
			scripts["stage"][3] = new Array();
			for (j=0;j<256;j++) {
				scripts["stage"][3][j] = new Array();
			}
			scripts["stage"][1] = new Array();
			scripts["stage"][0] = new Array();
			scripts["stage"][4] = new Array();
			scripts["stage"][5] = new Array();
			scripts["stage"][6] = new Array();
			scripts["stage"][7] = new Array();


			repeatStacks["stage"] = new Array();

			executionQueue["stage"] = new Array();


		broadcastArgs = new Array();

		scratchTempo = 120;

		globalvarIndex = new Array();

		if (typeof project.variables != 'undefined') {

		for (i=0;i<project.variables.length;i++) {
			globalvarIndex[i] = project.variables[i].name;
		}

		}

		globallistIndex = new Array();

		if (typeof project.lists != 'undefined') {

		for (i=0;i<project.lists.length;i++) {
			globallistIndex[i] = project.lists[i].listName;
		}

		}

		globalsoundIndex = new Array();

		if (typeof project.sounds != 'undefined') {

		for (i=0;i<project.sounds.length;i++) {
			globalsoundIndex[i] = project.sounds[i].soundName;
		}

		}

		varIndex = new Array();
		soundIndex = new Array();
		listIndex = new Array();

		for (j=0;j<sprites.length;j++) {

			varIndex[j] = new Array();
			listIndex[j] = new Array();
			soundIndex[j] = new Array();

			if (typeof sprites[j].variables != 'undefined') {

			for (i=0;i<sprites[j].variables.length;i++) {
				varIndex[j][i] = sprites[j].variables[i].name;
			}
			
			}

			if (typeof sprites[j].sounds != 'undefined') {

			for (i=0;i<sprites[j].sounds.length;i++) {
				soundIndex[j][i] = sprites[j].sounds[i].soundName;
			}
			
			}

			if (typeof sprites[j].lists != 'undefined') {

			for (i=0;i<sprites[j].lists.length;i++) {
				listIndex[j][i] = sprites[j].lists[i].listName;
			}
			
			}

		}

		svgs = new Array();
		svgnums = new Array();
		audio = new Array();
		audioref = new Array();

		var AudioTimer = Date.now();
		
		for (i=0;i<zipFile.entries.length;i++) {
			var ext = (zipFile.entries[i].name).substr(zipFile.entries[i].name.length-3)
			if (ext == "png") {
				var imagenum = parseInt((zipFile.entries[i].name).substr(0, zipFile.entries[i].name.length-4));
				var imgdata = zipFile.entries[i].extract()
				images[imagenum] = new Image();
				images[imagenum].src = "data:image/png;base64," + base64Encode(imgdata) //.toString() .replace(",", "");
			} else if (ext == "jpg") {
				var imagenum = parseInt((zipFile.entries[i].name).substr(0, zipFile.entries[i].name.length-4));
				var imgdata = zipFile.entries[i].extract()
				images[imagenum] = new Image();
				images[imagenum].src = "data:image/jpeg;base64," + base64Encode(imgdata) //.toString() .replace(",", "");
			} else if (ext == "svg") {
				svgs[svgs.length] = zipFile.entries[i].extract(null, true);
				svgnums[svgnums.length] = parseInt((zipFile.entries[i].name).substr(0, zipFile.entries[i].name.length-4));
			} else if (ext == "wav") {
				if ((navigator.platform != "iPad") && (navigator.platform != "iPhone")) {

				var imagenum = parseInt((zipFile.entries[i].name).substr(0, zipFile.entries[i].name.length-4));
				var imgdata = zipFile.entries[i].extract()
				audio[imagenum] = document.createElement("audio");
				audioref[imagenum] = "stage";

				uInt8Array = new Uint8Array(imgdata);

				if (readBytes(20, 2, 'int') == 17) {
					audio[imagenum].src = readADPCM();
				} else {
					audio[imagenum].src = "data:audio/wav;base64," + base64Encode(imgdata) //.toString() .replace(",", "");
				}

				}
			}
		}

		log("Media took "+((Date.now())-AudioTimer)+" ms");

		//penctx.drawImage(images[0], 0, 0);
		scratchClearPen();
		spritenum = "stage";

		var AudioTimer = Date.now();

		if (typeof project.scripts != 'undefined') {
			javascriptgen = ScratchToJS(project.scripts);
		}

		spritenum = 0;
		
		for (spritenum=0;spritenum<sprites.length;spritenum++) {
			if (typeof sprites[spritenum].scripts != 'undefined') {
				javascriptgen = ScratchToJS(sprites[spritenum].scripts);
			}
		}

		log("Scripts took "+((Date.now())-AudioTimer)+" ms");

		penctx.lineCap = "round"; 

		log("Project Loaded. "+unimp.length+" errors.");

		if (unimp.length > 0) {
			log("---");
			for (i=0;i<unimp.length;i++) {
				log("'"+unimp[i]+"' is unimplemented.");
			}
		log("---");
		}
	
		log(" ");

		if (typeof editorInit == 'function') {
			editorInit();
		}

		setTimeout(renderSVGs, 1);

        };
        var zipFile = new ZipFile(url, doneReading, 1);
    };