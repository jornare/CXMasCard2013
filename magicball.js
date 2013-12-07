window.cx = window.cx || {};
(function (ns) {
    var magicBallImg = new ns.CanvasImage(100, 50, 400, 489, 'img/magicball.png'),
    bgImg = new ns.CanvasImage(100, 50, 400, 489, 'img/magicball_bg.png'),
    TWOPI = Math.PI *2;

    ns.MagicBall = function (x, y, scaleX, scaleY) {
        var self = this;
        this.x = x;
        this.y = y;
        this.width = this.height=100;
        this.children = [];
        this.scaleX = scaleX;
        this.scaleY = scaleY;
        this.centerX = 0;
        this.centerY = 0;
        this.bottomY = 0;
        this.radius = 0;
        this.snowFlakes = [];
        this.maxNumFlakes = 800;
        this.minNumFlakes = 100;
        this.numFlakes = 0;
        this.snowDensity = 0.02;
        this.tree;
        this.wind = 0;
        this.gravx = 0;
        this.gravy = 0.001;

        this.move = function (elapsed) {
            var sf = self.snowFlakes;
            var snowFlakeDelta = elapsed * 0.0001;
            self.tree.move(elapsed);
            for (i = 0; i < sf.length; i++) {

                this.moveFlake(sf[i], snowFlakeDelta);


            }
        }

        this.moveFlake = function (obj, snowFlakeDelta) {
            obj.y += snowFlakeDelta;
           


            /*
            
            var speedx2 = obj.speedx * obj.speedx,
            speedy2 = obj.speedy * obj.speedy,
            angularspeed = Math.sqrt(speedx2 + speedy2),
            airresx = 0.005 * (speedx2),
            airresy = 0.1 * (speedy2),
            accx = (this.gravx + this.wind + (Math.random()) - 0.5),
            accy = (this.gravy + (Math.random() * 0.2) - 0.1);//acceleration

            airresx = self.speedx >= 0.0 ? -airresx : airresx;
            airresy = self.speedy >= 0.0 ? -airresy : airresy;

            obj.speedx += (accx + airresx);
            obj.speedy += (accy + airresy);
            obj.x += obj.speedx*0.01;
            obj.y += obj.speedy*0.01;


            */





            var r = Math.sqrt(obj.x * obj.x + obj.y * obj.y);
            if (r >= 1) {
                obj.x /= r;
                obj.y /= r;
            }
            var xedge = Math.sqrt(1 - obj.x * obj.x);

            if (obj.y > 0.8) {
                obj.x = Math.random()*2 - 1;
                obj.y =-Math.sqrt(1-obj.x*obj.x)+0.02;
            }
        }

        this.draw = function (ctx) {
           // ctx.arc(self.centerX + self.x, self.centerY + self.y, self.radius, 0, TWOPI, false);
           // ctx.stroke();
            bgImg.draw(ctx);
            //c.strokeStyle   = '#fff'; 
            self.tree.draw(ctx);
            self.drawFlakes(ctx);
            magicBallImg.draw(ctx);
        }

        this.drawFlakes = function (ctx) {
            var sf = this.snowFlakes, sfi;
            for (i = 0; i < sf.length; i++) {
                sfi = sf[i];

                sf[i].draw(ctx, this.x+this.centerX, this.y+this.centerY, this.radius);

            }
        }

        this.resize = function (scale) {
            this.scaleX = scale.x;
            this.scaleY = scale.y;


            magicBallImg.width = bgImg.width = this.scaleX * 400;
            magicBallImg.height = bgImg.height = this.scaleX * 489;


            magicBallImg.x = bgImg.x = this.x;// + this.scaleX * 200;
            magicBallImg.y = bgImg.y = this.y;// + this.scaleY * 50;
 
            this.radius = magicBallImg.width / 2 - 8;
            this.centerX = this.radius+4;
            this.centerY = this.radius;
            this.bottomY = this.radius * 1.8;

            this.width = this.height = this.radius * 2;

            this.numflakes = this.calculateNumFlakes();
            self.snowFlakes.length = 0;
            for (i = self.snowFlakes.length; i < this.numflakes; i++) {
                self.snowFlakes.push(new ns.SnowFlake(
                    Math.random()*2-1, //x
                    Math.random()*2-1, //y
                    Math.random()*2-1 , //z
                    0,
                    1,
                    self.scaleX * Math.random() * 4 + 2));
            }
            
            if (self.tree) {
                self.tree.setPos(self.x + self.radius - scale.x * 20,
                                 self.y + scale.y * 180,
                                 scale.y * self.radius * 0.3);
            } else {
                this.tree = new ns.XmasTree(self.x + self.radius-scale.x*20,
                                 self.y + scale.y * 180,
                                 scale.y * self.radius * 0.3);
            }
        }


        /*
        this.collides = function (obj, x, y,z ) {
           // return false;
            if (y >= 0.8*this.radius) {
                return { x: obj.x, y: self.bottomY };
            }

            var dx = x - self.centerX,
                dy = y - self.centerY,
                h = Math.sqrt(dx * dx + dy * dy);
            if (h > self.radius) {

                return { x: self.centerX + Math.cos(dx / h) * self.radius, y: Math.min(self.centerY + Math.sin(dy / h) * self.radius, self.bottomY) };
            }
            return false;
        }
        */

        this.calculateNumFlakes = function () {
            return Math.max(Math.min(self.radius * self.radius * 0.001 * this.snowDensity, this.maxNumFlakes), this.minNumFlakes);
        }

    };

}(window.cx));