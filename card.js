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
    function getReceipientFromUrl() {
        var l = location ? location : (window.location ? window.location : document.location);
        var receipient = l.hash ? l.hash.substr(1):(l.search?l.search.substr(1):'');
        return decodeURIComponent(receipient);
    }

    ns.Card = function (scene) {
        var scene = scene,
            dontFlip = false;
        this.lang = 'en';

        this.onLoad = function () {
            dom.card = $('card');
            dom.to = $('to');
            dom.to_en = $('to_en');
            this.setLang();
            this.setReceipient();
            scene.onLoad($('scenecanvas'), $('canvascol'));
        }

        this.setReceipient = function (receipient) {
            dom.to.innerText = dom.to.textContent = dom.to_en.innerText = dom.to_en.textContent = receipient || getReceipientFromUrl() || (this.lang=='no'?'Deg':'You');
        }

        this.setLang = function (language) {
            dontFlip = true;
            setTimeout(function () { dontFlip = false }, 100);
            if (!language) {
                if (location.href.toLowerCase().indexOf('card.html') >= 0) {
                    language = 'en';
                } else if (location.href.toLowerCase().indexOf('kort.html') >= 0) {
                    language = 'no';
                } else if (navigator.userLanguage) // Explorer
                    language = navigator.userLanguage;
                else if (navigator.language) // FF
                    language = navigator.language;
                else
                    language = "en";
            }
            if (language.indexOf('nb') >=0 || language.indexOf('no') >= 0) {
                language = 'no';
            }
            this.lang = language;
            if (language == 'no') {
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