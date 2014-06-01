//DENENDANCY: ge.js
ge.addons = {
    //Hold all the addons we get
    population : [],
    
    //Hold events from functions
    events : []
};

ge.addons.triggerEvent = function(depth){
    if (this.events[depth]) {
        $.each(this.events[depth], function(index, value){
            value();
        });
    }
};

ge.addons.addListener = function(depth, handler){
    if (!this.events[depth]) {
        this.events[depth] = [];
    }
    
    this.events[depth].push(handler);
};