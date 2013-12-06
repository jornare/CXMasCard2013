window.cx = window.cx || {};
(function (ns) {
    //var TwoPI = Math.PI * 2;
    var snowFlakeImg = new Image();
    snowFlakeImg.src = "img/snowflake.png";
    //var snowflake = 

    ns.SnowFlake = function (x, y, speedx, speedy, size) {
        var self = this;
        this.x = x;
        this.y = y;
        this.speedx = speedx || 0.0;
        this.speedy = speedy || 0.0;
        this.life = 1.0;
        this.size = size;

        this.move = function (scene, dt) {
            var frames = dt / 100,
                newx,
                newy,
                speedx2 = self.speedx * self.speedx,
                speedy2 = self.speedy * self.speedy,
                angularspeed = Math.sqrt(speedx2 + speedy2),
                airresx = 0.005 * (speedx2),
                airresy = 0.1 * (speedy2),
                accx=(scene.gravx + scene.wind + (Math.random()) - 0.5),
                accy = (scene.gravy + (Math.random() * 0.2) - 0.1);//acceleration

            airresx = self.speedx >= 0.0 ? -airresx : airresx;
            airresy = self.speedy >= 0.0 ? -airresy : airresy;

            self.speedx += (accx + airresx);
            self.speedy += (accy + airresy);


            newx = self.x + self.speedx * frames;
            newy = self.y + self.speedy * frames;

            var collisionpos = scene.collides(self, newx, newy);
            if (collisionpos) {
                self.x = collisionpos.x;
                self.y = collisionpos.y;
                self.speedx = 0;
                self.speedy = 0;
            } else {
                self.x = newx;
                self.y = newy;
            }
        };

        var s, ss;//for speed
        this.draw = function (ctx) {
            s = (self.size * self.life),
            ss = 2 * s;
            if (self.life != ctx.globalAlpha)
                ctx.globalAlpha = self.life;
            ctx.drawImage(snowFlakeImg, self.x - s, self.y - s, ss, ss);
        };

    };


}(window.cx))

