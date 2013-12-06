window.cx = window.cx || {};
(function (ns) {

    ns.Scene = function () {
        var self = this;
        this.width = 0;
        this.height = 0;
        this.scale = { x: 1.0, y: 1.0 };
        this.resizeTimer = null;
        this.canvas = null;
        this.drawTimer = null;
        this.snowFlakes = [];
        this.cxlogo = new CanvasImage(100, 200, 400, 100, 'img/cxlogo.png', true);
        this.bg = new CanvasImage(0, 0, 200, 200, 'img/candlewallpaper.jpg');
        this.stats = false;
        this.tree;

        self.x = 0;
        self.y = 0;
        self.lastFrameTime = 0;
        self.elapsedTime = 0.0;
        self.elapsedTimeSeconds = self.elapsedTime * 0.001;
        self.wind = 0.0;
        self.gravx = 0.0;
        self.gravy = 1.0;
        self.touch = false;
        self.stuckFlakes = [];


        self.flame = null;
        //self.flame = new Flame(213,265);

        this.onLoad = function (canvas, canvascol) {
            var i = 0;
            self.stats = window.location.href.indexOf('#stats') > 0
            self.canvas = canvas;
            self.tree = new window.xmasTree(canvas, 160, 300, 120);
            self.resize(window.innerWidth, window.innerHeight);

            self.drawTimer = setTimeout(self.draw, 50);
        };

        this.move = function () {
            var now = elapsed = new Date().getTime();
            if (self.lastFrameTime == 0) {
                self.lastFrameTime = now;
            }
            var elapsed = self.elapsedTime = now - self.lastFrameTime;
            self.elapsedTimeSeconds = elapsed * 0.001;
            if (elapsed == 0) return;

            var sf = self.snowFlakes;
            var f;

            for (i = 0; i < sf.length; i++) {
                f = sf[i];
                f.move(self, elapsed);
                if (f.y > self.height) {
                    f.y -= self.height;
                    f.x = Math.random() * self.width;
                }
                if (f.y < -200) {
                    f.y += self.height;
                }
                if (f.x > self.width) {
                    f.x -= self.width;
                }
                if (f.x < 0) {
                    f.x += self.width;
                }
                //melting
                f.life -= self.flame.melts(f.x, f.y);
                if (f.speedx * f.speedy == 0.0) {
                    f.life -= 0.0001 * elapsed;
                }
                if (f.life <= 0) {
                    f.life = 1.0;
                    f.y = -Math.random() * 200;
                    f.x = Math.random() * self.width;
                    self.unStuckFlake(f);
                }
            }
            self.tree.move(elapsed);
            self.lastFrameTime = now;
        };

        this.draw = function () {

            var i,
                sf = self.snowFlakes,
                ctx = self.canvas.getContext('2d'),
                a = ctx.globalAlpha;
            //c.clearRect(0,0, self.width,self.height);
            //maps

            self.move();

            //gfx
            self.bg.draw(ctx);
            //self.cxlogo.draw( ctx );



            //c.strokeStyle   = '#fff'; 
            if (self.tree) {
                self.tree.draw(ctx);
            }
            for (i = 0; i < sf.length; i++) {
                sf[i].draw(ctx);
            }
            ctx.globalAlpha = a;

            if (self.flame) {
                self.flame.draw(ctx);
            }



            if (self.stats) {//statistics
                ctx.fillStyle = '#33e';
                ctx.font = 'italic bold 30px sans-serif';
                ctx.textBaseline = 'bottom';
                ctx.fillText(((1000.0 / self.elapsedTime) << 0) + 'fps', 100, 100);
                ctx.fillText(self.snowFlakes.length + 'flakes', 100, 200);
            }
            self.drawTimer = setTimeout(self.draw, 1);
            //self.canvas.style.transform="rotate(30deg)";
        };

        this.collides = function (obj, x, y) {
            var st = self.touch;

            if (st) {//
                for (var i = 0; i < self.stuckFlakes.length; i++) {
                    var o = self.stuckFlakes[i];
                    if (o.obj == obj) {
                        return { x: st.x + o.dx, y: st.y + o.dy };
                    }
                }
                var r = Math.sqrt((st.x - x) * (st.x - x) + (st.y - y) * (st.y - y));
                if (r < 30) {
                    self.stuckFlakes.push({ obj: obj, dx: x - st.x, dy: y - st.y, t: self.lastFrameTime });
                    return { x: obj.x, y: obj.y };
                }
            }
            if (x > self.cxlogo.x && y > self.cxlogo.y && x < self.cxlogo.x + self.cxlogo.width && y < self.cxlogo.height + self.cxlogo.y) {
                return self.cxlogo.collides(obj, x, y);
            }
            return false;
        }

        self.unStuckFlake = function (obj) {
            for (var i = 0; i < self.stuckFlakes.length; i++) {
                if (obj == self.stuckFlakes[i].obj) {
                    self.stuckFlakes.splice(i, 1);
                    return;
                }
            }
        };


        this.resize = function (w, h) {
            self.width = w;
            self.height = h;
            self.scale = { x: w / 1024.0, y: h / 768.0 };
            self.canvas.width = w;
            self.canvas.height = h;
            self.bg.width = w;
            self.bg.height = h;
            self.cxlogo.width = Math.floor(self.scale.x * 820 * 0.8);
            self.cxlogo.height = Math.floor(self.scale.y * 262 * 0.8);
            self.cxlogo.x = Math.floor(self.scale.x * 30);
            self.cxlogo.y = Math.floor(self.scale.y * 450);
            self.cxlogo.createCollisionMap();

            self.flame = new ns.Flame(self, self.scale.x * 806.0, self.scale.y * 330.0);

            if (self.tree) {
                self.tree.setPos(self.scale.x * 200,
                                 self.scale.y * 5,
                                 self.scale.y * 120);
            }


            var numflakes = Math.max(Math.min(self.width * self.height * 0.0005, 700), 300);
            self.snowFlakes.length = 0;
            for (i = self.snowFlakes.length; i < numflakes; i++) {
                self.snowFlakes.push(new ns.SnowFlake(Math.random() * self.width, Math.random() * self.height, 0, 1, self.scale.x * Math.random() * 4 + 2));
            }

            var card = document.getElementById('card');
            card.style.height = h + 'px';

        };

        this.onResize = function (w, h) {
            if (self.resizeTimer) {
                clearTimeout(self.resizeTimer);
            }

            self.resizeTimer = setTimeout(function () {
                self.resizeTimer = null;
                if (w == self.width && h == self.height) {
                    return;
                }
                self.resize(w, h);
            }, 500);
        };

        this.createCanvas = function () {
            if (self.canvas) {
                self.deleteCanvas();
            }
            self.ctx = self.canvas.getContext('2d');
        }
        this.deleteCanvas = function () {
            self.canvas = null;
        };
    }


}(window.cx))

