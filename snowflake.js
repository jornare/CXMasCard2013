window.cx = window.cx || {};
(function (ns) {
    //var TwoPI = Math.PI * 2;
    var snowFlakeImg = new Image();
    snowFlakeImg.src = "img/snowflake.png";
    //var snowflake = 

    ns.SnowFlake = function (x, y, z, speedx, speedy, size) {
        var self = this;
        this.x = x;
        this.y = y;
        this.z = z;
        this.speedx = speedx || 0.0;
        this.speedy = speedy || 0.0;

        this.size = size;

        //move within sphere
        /*this.move = function (scene, dt) {
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
        };*/
        
        var s, ss;//for speed
        this.draw = function (ctx, x, y, scale) {
            s = (self.size ),
            ss = 2 * s;

            ctx.drawImage(snowFlakeImg, x+ self.x*scale - s, y + self.y*scale - s, ss, ss);
        };

    };


}(window.cx))

