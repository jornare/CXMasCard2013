window.cx = window.cx || {};
(function (ns, document, window) {
    var location = window.location,
        dom = {
            to: $('to'),
            card:$('card')
        }

    function $(q) {
        return document.getElementById(q);
    }
    function getReceipientFromUrl(){
        var receipient = location.hash.substr(1);
        return decodeURIComponent(receipient);
    }

    ns.Card = function (scene) {
        var scene = scene;

        this.onLoad = function () {
            dom.to= $('to'),
            dom.card = $('card');
            this.setReceipient();
            scene.onLoad($('scenecanvas'), $('canvascol'));
        }

        this.setReceipient = function (receipient) {
            var to = dom.to;
            to.innerText = receipient || getReceipientFromUrl() || 'Deg';
        }

        this.resize = function (w, h) {
            scene.onResize(w, h);
        }

        this.flip = function (toFront, force) {
            var cssClass = "card";
            if (toFront) {//we are on the flipside

            } else {
                if (force || scene.touch) {
                    if (force || (scene.touch.x < scene.width / 10 && scene.touch.y < scene.height / 10)) {
                        cssClass = "card flip";
                    } else {
                        return;
                    }
                }
            }

            dom.card.setAttribute("class", cssClass); //For Most Browsers
            dom.card.setAttribute("className", cssClass); //For IE; harmless to other browsers.
        }

    };

}(window.cx, document, window));