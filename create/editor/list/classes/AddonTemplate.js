/*  //DENENDANCY: ge.js, Tools.js
 *  ================
 *  AddonTemplate.js
 *
 *  This file is for Add-on development. It contains a class, Addon, that
 *  every addon should use as a base and extend off of it.
 *
 *  Details on how to make an add-on will be made later on in GE's
 *  development.
 *
 *  For an example add-on, look at addons>>nw.js
 *
 */
function Addon(name) {
    //Name of the add-on
    this.name = name || "ge-addon";
    //Get the ID of the add-on (to tell the uniqueness of the add-on)
    this.id = (ge.addons.length);
    //This is so that GE knows if an add-on has been initialized
    //SHOULD ONLY BE MODIFIED BY GE!
    this.initialized = false;
    
    //Blank. Every add-on must have an initialize.
    this.initialize = function(){
        
    };
};