//DENENDANCY: ge.js
ge.addons = {
    //Hold all the addons we get
    population : [],
    
    //Hold events from functions
    events : []
};

//triggerEvent >> trigger an add-on event
ge.addons.triggerEvent = function(depth){
    if (this.events[depth]) {
        $.each(this.events[depth], function(index, value){
            value();
        });
    }
};
//addListener >> add a handler for the given event depth
ge.addons.addListener = function(depth, handler){
    if (!this.events[depth]) {
        this.events[depth] = [];
    }
    
    this.events[depth].push(handler);
};
//addAddon >> adds an addon to the population
ge.addons.addAddon = function(reference){
    ge.addons.population.push(reference);
};