window.cx = window.cx || {};
(function (ns) {
    var TWOPI = 2 * Math.PI,
        redBall = 11,
        cBall = 12,
        heart = 13,
        treeLight=14
        star=15;

    var starImg = new Image();
    starImg.src = "img/star.png";
    var treeLightImg = new Image();
    treeLightImg.src = "img/treelight.png";
    var heartImg = new Image();
    heartImg.src = "img/julekurv.png";
    var redBallImg = new Image();
    redBallImg.src = "img/redball.png";
    var cBallImg = new Image();
    cBallImg.src = "img/cball.png";


    ns.XmasTree = function (_left, _top, _height, _scale) {
        var spriteArray = [],
            vectors = [],
            numberOfVectors = 0,
            left = (_left || 0),
            top = _top || 0,
            scale = _scale || 1.0,
            height = _height || 100,
            treeHeight = 0,
            treeWidth = 0;

        createSprites();
        createBalls();
        createHeart();
        createStar();
        createTreeLight();
        createTree(height);

        this.setPos=function(l,t,h, s){
            left = l;
            top = t;
            this.resize(s,h);
        }

        this.resize = function(s, h){
            height = h;
            scale = s || 1.0;
            createSprites();
            createBalls();
            createHeart();
            createStar();
            createTreeLight();
            createTree(height);
        }

        // Let's make 10 leaves sprites, with different color intensities, to make the inner leaves inside the tree darker
        function createSprites() {
            var rhalf =  8*scale >> 0,
                r=2*rhalf,
                w= 2*r;

            for (k = 1; k <= 10; k++) {
                // Setting up the sprite size and getting the context

                spriteArray[k] = document.createElement('canvas');
                spriteArray[k].width = w;
                spriteArray[k].height = w;
                var spriteContext = spriteArray[k].getContext('2d');

                // Drawing a lot of random lines/leaves

                for (i = 0; i < 446; i++) {
                    var x = Math.sin(i), // think this sin is just a random number between -1 and 1, this was done for size reasons.
                        y = Math.random() * 2 - 1, // other random number from -1 to 1
                        B = Math.sqrt((x * x + y * y) - x / .9 - 1.5 * y + 1),// This is something similar to a radial gradient.
                        R = 56 * (B + 1) * (L = k / 9 + .8) >> 1; // Also for the colors of the leaves

                    if ((x * x + y * y) < 1) // we will draw lines only if they are inside a circle
                    {
                        spriteContext.beginPath();
                        spriteContext.strokeStyle = 'rgba(' + R + ', ' + (R + B * L >> 0) + ', 30, .1)';
                        spriteContext.moveTo(r + x * rhalf, r + y * rhalf);
                        spriteContext.lineTo(r + x * r, r + y * r);
                        spriteContext.stroke();
                    }
                }
            }
        }


        // Now, let's make the red, yellow balls and the snowflake sprites.
        function createBalls() {
            for (var k = 11; k <= 13; k++) {
                // Setting up the sprite size and getting the context

                spriteArray[k] = document.createElement('canvas');
                spriteArray[k].width = 6 * scale >> 0;
                spriteArray[k].height = 12 * scale >> 0;
                var spriteContext = spriteArray[k].getContext('2d');
 /*               
                for (i = 0; i < 7; i++) // Instead of using radial gradients, I've done the gradient on the balls by drawing 7 circles, one on top of each other. Just for size reasons.
                {
                    var I = i * 32;

                    spriteContext.beginPath();

                    spriteContext.fillStyle = 'rgba(' + (147 + I) + ', ' + (k % 2 ? 128 + I : 0) + ', ' + I + ', .5)';
                    spriteContext.arc(32 - i / 3, 24 - i / 2, 24 - i, 0, TWOPI, 1);
                    spriteContext.fill();
                }*/
            }
            redBallImg.width = cBallImg.width = 51 * 0.5*scale >> 0;
            redBallImg.height = cBallImg.height = 64 * 0.5*scale >> 0;
            spriteArray[redBall + 1] = redBallImg;
            spriteArray[cBall + 1] = cBallImg;
        }

        function createTreeLight() {
            treeLightImg.width = 16 * scale >> 0;
            treeLightImg.height = 16 * scale >> 0;
            spriteArray[treeLight + 1] = treeLightImg;
        }

        function createStar() {
            starImg.width = 98 * scale >> 0;
            starImg.height = 98 * scale >> 0;
            spriteArray[star + 1] = starImg;
        }

        function createHeart() {
            heartImg.width = 25 * scale * 0.9 >> 0;
            heartImg.height = 32 * scale * 0.9 >> 0;
            spriteArray[heart+1] = heartImg;
        }


        // Now, let's define the vectors following the paths of the branches
        function createTree(height) {
            vectors = [];
            vectors.length = 0;
            numberOfVectors = 0;
            var x, y, z, R, spriteNum, P = 4 * scale; // some parameter to control the distance between sprites


            for (var k = 0; true; k++) // 80 branches
            {
                x = 0,
                z = 0, // x=0 and z=0 is the central axis of the tree
                y = H = k*scale + Math.sqrt(k) * scale * 6, // the bottom of the tree will get more branches than the top with this
                // also, H, the branch lenght, is proportional to the distance to the top of the tree
                R = Math.random() * 446; // this picks a random angle for the branch

                if (y > height) {
                    break;
                }
                for (j = 0; j < H;) // the number of sprites in a branch is proportional to its length.
                {

                    // Now, a vector defined as a size 4 array. The first position is x, second y, third z, and last
                    // position is the number of the sprite it is.
                    spriteNum = j / H * 20 >> 1;
                    if (Math.random() > .95 && y < height * 0.9 && y > height*0.2) {
                        spriteNum = Math.random() * 4 + redBall>>0;
                    } else if (Math.random() > .9) {
                        spriteNum = treeLight;
                    }
                    j += 8*scale;
                    vectors[numberOfVectors++] = [
                        x += Math.sin(R) * P + Math.random() * 6*scale - 3*scale,
                        y += Math.random() * 16*scale - 8*scale,
                        z += Math.cos(R) * P + Math.random() * 6*scale - 3*scale,
                        spriteNum];
                    /*original
                    vectors[numberOfVectors++] = [
                        x += Math.sin(R) * P + Math.random() * 6 - 3,
                        y += Math.random() * 16 - 8,
                        z += Math.cos(R) * P + Math.random() * 6 - 3,
                        j / H * 20 + ((j += 16) > H & Math.random() > .8 ? Math.random() * 4 : 0) >> 1];
                        */
                    // This is doing some few things. By one hand, it adds randomness to the path of the branch,
                    // so it is not completely straight. Also it checks if it is at the end of the branch,
                    // if so, randomly no ball or one of the 2 balls available are added.
                    // The darker sprites are choosen for the inner parts of a branch.
                    // I think there is something missing in this clear version, but as far as I remember
                    // the original version also moved a bit more from the branch the balls when they were added.
                }
            }
            treeHeight = height;
            treeWidth = 100;
        }


        var D = 0, // this is an animation counter
            mcd = Math.cos(D),
            msd = Math.sin(D);

        this.move = function (elapsed) {
            D += elapsed * 0.00005;
            if (elapsed > 10) {
                mcd = Math.cos(D),
                msd = Math.sin(D);
                vectors.sort(
                    function (m, l) {
                        return (m[2] - l[2]) * mcd + (l[0] - m[0]) * msd;  // order the vectors by its depth coordinate
                    });
            }

        }

        var sprite = 0;
        this.draw = function (context) {
            //context.fillStyle = '#cca';
            
            for (i = 0; L = vectors[i++];) // for all the ordered vectors
            {
                sprite=spriteArray[L[3] + 1];
                if(sprite==treeLightImg && Math.random()>0.999) {
                    continue;
                }
                context.drawImage(sprite, //sprite
                    left + L[0] * mcd + L[2] * msd >> 0, //x
                    top + L[1] >> 0
                    , //y
                    sprite.width,
                    sprite.height
                    ); 
            }
          //  context.drawImage(treeLightImg, left, top);

            context.drawImage(starImg,
                left - (starImg.width / 2 ) ,
                top - (starImg.height / 2) ,
                starImg.width,
                starImg.height);
        }



    }



}(window.cx));

