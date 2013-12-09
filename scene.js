window.cx = window.cx || {};
(function (ns) {
    var TWOPI = 2 * Math.PI;
    ns.Scene = function () {
        var self = this;
        var minNumFlakes = 80;//todo:pass on to magicball
        var maxNumFlakes = 500;
        var snowDensity = 0.02;
        var ballCenterX = 100;
        var ballCenterY = 100;
        var ballRadius = 100;

        this.width = 0;
        this.height = 0;
        this.scale = { x: 1.0, y: 1.0 };
        this.resizeTimer = null;
        this.canvas = null;
        this.drawTimer = null;

        //this.cxlogo = new CanvasImage(100, 200, 400, 100, 'img/cxlogo.png', true);
        this.bg = new ns.CanvasImage(0, 0, 200, 200, 'img/fireplacebg.jpg');

        this.stats = false;
        this.magicBall;

        self.x = 0;
        self.y = 0;
        self.lastFrameTime = 0;
        self.elapsedTime = 0.0;
        self.elapsedTimeSeconds = self.elapsedTime * 0.001;
        self.wind = 0.0;
        self.gravx = 0.0;
        self.gravy = 1.0;
        self.touch = false;


        this.onLoad = function (canvas, canvascol) {
            var i = 0;
            self.stats = window.location.href.indexOf('#stats') > 0
            self.canvas = canvas;
            //self.tree = new ns.xmasTree(160, 300, 120);
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

            self.magicBall.gravx = self.gravx;
            self.magicBall.gravy = self.gravy;
            self.magicBall.move(elapsed);
           // self.tree.move(elapsed);
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

            self.magicBall.draw(ctx);


            ctx.globalAlpha = a;

   


            if (self.stats) {//statistics
                ctx.fillStyle = '#33e';
                ctx.font = 'italic bold 30px sans-serif';
                ctx.textBaseline = 'bottom';
                ctx.fillText(((1000.0 / self.elapsedTime) << 0) + 'fps', 100, 100);
                ctx.fillText(self.magicBall.snowFlakes.length + 'flakes', 100, 200);
            }

            self.drawTimer = setTimeout(self.draw, 1);
            //self.canvas.style.transform="rotate(30deg)";
        };

      



        this.resize = function (w, h) {
            self.width = w;
            self.height = h;
            self.scale = { x: w / 1024.0, y: h / 768.0 };
            self.canvas.width = w;
            self.canvas.height = h;
            self.bg.width = w;
            self.bg.height = h;
            /*self.cxlogo.width = Math.floor(self.scale.x * 820 * 0.8);
            self.cxlogo.height = Math.floor(self.scale.y * 262 * 0.8);
            self.cxlogo.x = Math.floor(self.scale.x * 30);
            self.cxlogo.y = Math.floor(self.scale.y * 450);
            self.cxlogo.createCollisionMap();*/

           // self.flame = new ns.Flame(self, self.scale.x * 806.0, self.scale.y * 330.0);

            var mbx = self.scale.x * 400>>0,
                mby = h - 489 * self.scale.x  +40*self.scale.y>>0;

            if (!this.magicBall) {
                this.magicBall = new ns.MagicBall(mbx, mby, self.scale.x, self.scale.y);
            }



            self.magicBall.resize(self.scale);
            self.magicBall.setPos(mbx, mby);


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

