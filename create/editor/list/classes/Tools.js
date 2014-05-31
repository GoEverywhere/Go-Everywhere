//DEPENDANCY: ge.js
//Holds the tools that are useful to GE

//Create the tools object
ge.Tools = {};

//hexToRgb >> turns a hexidecimal string to an object, { r, g, b }
ge.Tools.hexToRgb = function(hex){
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};
//logAndReturn >> logs an object into the console, then returns it
ge.Tools.logAndReturn = function(obj){
    console.log(obj);
    return obj;
};
//base64Encode >> encodes a Uint8 array into a base 64 string
ge.Tools.base64Encode = function(byteArray){
    var digits = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
        i = 0,
        cur, prev, byteNum,
        result=[];      

    while(i < byteArray.length){
        cur = byteArray[i];
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
};