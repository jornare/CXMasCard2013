window.cx = window.cx || {};
(function (ns, document, window) {
    var location = window.location,
        dom = {
            to: $('to'),
            to_en: $('to_en'),
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
        var dontFlip = false;

        this.onLoad = function () {
            dom.card = $('card');
            dom.to = $('to');
            dom.to_en = $('to_en');
            this.setLang();
            this.setReceipient();
            scene.onLoad($('scenecanvas'), $('canvascol'));
        }

        this.setReceipient = function (receipient) {
            dom.to.innerText = dom.to_en = receipient || getReceipientFromUrl() || 'Deg';
        }

        this.setLang = function (language) {
            dontFlip = true;
            setTimeout(function () { dontFlip = false }, 100);
            if (!language) {
                if (location.href.toLowerCase().indexOf('card') >= 0) {
                    language = 'en';
                }else if (navigator.userLanguage) // Explorer
                    language = navigator.userLanguage;
                else if (navigator.language) // FF
                    language = navigator.language;
                else
                    language = "en";
            }
            if (language.indexOf('no')>=0 || language.indexOf('nb') >= 0) {
                $('english').style.display = 'none';
                $('norwegian').style.display = 'inline-block';
            } else {
                $('english').style.display = 'inline-block';
                $('norwegian').style.display = 'none';
            }
        };

        this.resize = function (w, h) {
            scene.onResize(w, h);
        }

        this.flip = function (toFront, force) {
            var cssClass = "card";
            if (toFront) {//we are on the flipside
                if (dontFlip) {
                    return;
                }
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