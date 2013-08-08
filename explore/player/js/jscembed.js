(function () {
    var done = [];
    
    function update() {
        var divs = document.querySelectorAll('div[project]');
        var i = divs.length;
        while (i--) {
            if (done.indexOf(divs[i]) === -1) {
                done.push(divs[i]);
                var project = jsc.createPlayer(divs[i].getAttribute('project'), divs[i].getAttribute('jwidth'), divs[i].getAttribute('jheight'), divs[i].getAttribute('autoplay') === 'true');
                window.player = project[1];
                divs[i].innerHTML = '';
                divs[i].appendChild(project[0]);
                //We need to restyle lots of things that that stylesheet styles
                //To get the correct width and height
                $(".player .header").css("width", (parseInt(divs[i].getAttribute('jwidth')) + 2) + "px");
                $(".player .subcon").css("width", divs[i].getAttribute('jwidth') + "px");
                $(".player .subcon").css("height", divs[i].getAttribute('jheight') + "px");
            }
        }
    }

    document.addEventListener('DOMContentLoaded', update, false);
    document.addEventListener("DOMNodeInserted", update, false);
    
    update();
}) ();