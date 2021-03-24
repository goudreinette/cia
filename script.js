const lines = []

let mask, linesGraphics, distortedGraphics, textGraphics,
    sineDistort, duck, font


function preload() {
    duck = loadImage('./img/duck.jpg')
    mask = loadImage('./img/mask.png')
    sineDistort = loadShader('./shader/effect.vert', './shader/effect.frag');
    font = loadFont('./font/GTAmerica-ExtendedBlack.ttf')
}


function setup() {
    createCanvas(1000,1000)
    pixelDensity(1)


    linesGraphics = createGraphics(width, height)
    linesGraphics.pixelDensity(1)

    distortedGraphics = createGraphics(width, height, WEBGL)
    distortedGraphics.pixelDensity(1)

    textGraphics = createGraphics(width, height, WEBGL)
    textGraphics.pixelDensity(1)


    const startX = 0
    const startY = -500
    const startSpread = random(0, 50)

    for(let step = 0; step < 20; step++) {
        lines.push([])

        const negativeOrPositive = random() > 0.5 ? 1 : -1
        const randomX = random(0, 200)
        const randomY = random(-200, 200)
        const randomSpread = noise(step) * random(3, 40)
        
        for(let i = 0; i < 100; i++) {
            if (step == 0) {
                lines[step].push({
                    x1: startX,
                    y1: startY + i * startSpread,
                    x2: startX + randomX,
                    y2: startY + randomY + i * startSpread,
                })
            } else {
                lines[step].push({
                    x1: lines[step - 1][i].x2,
                    y1: lines[step - 1][i].y2,
                    x2: lines[step - 1][i].x2 + randomX,
                    y2: lines[step - 1][i].x2 + randomY + randomSpread * i,
                })
            }
        }
    }
}



function draw() {
    // background('black')

    // Line
    linesGraphics.background(20)
    linesGraphics.stroke('white')
    linesGraphics.strokeWeight(1)

    for (const step of lines) {
        for (const l of step) {
            linesGraphics.line(l.x1, l.y1, l.x2, l.y2)
        }
    }

    let lineImg = linesGraphics.get()

    // Distort
    let freq = map(mouseX, 0, width, 0, 100);
    let amp = map(mouseY, 0, height, 0, 0.25)

    // distortedGraphics.shader(sineDistort)
    // sineDistort.setUniform('tex0', lineImg);
    // sineDistort.setUniform('time', frameCount * 0.01);
    // sineDistort.setUniform('frequency', 0);
    // sineDistort.setUniform('amplitude', 0);
    // distortedGraphics.rect(0,0,width, height)

    // let distortedImg = distortedGraphics.get()

    // Mask
    // distortedImg.mask(mask)
    lineImg.mask(mask)

    image(lineImg, 0,0, width, height);

    textGraphics.textSize(200);
    textGraphics.fill('white')
    textGraphics.noStroke()
    textGraphics.textFont(font)
    textGraphics.textAlign(CENTER, CENTER)
    textGraphics.text("WAT", 0, -10)
    
    image(textGraphics, 0, 100, width, height * .75);


    // Rotated text
    translate(width/2, height/2);

      // current distance around the circle
    let arcLength = 0; 

    let str = "DES IGN ART TECHNOLOGY"
    let r = 350;
    // total number of radians that the text will consume
    let totalAngle = textWidth(str) / r;
    textFont(font)
    fill('white');

    textSize(35)

    for (let i = 0; i < 3; i++) {
        // iterate over each individual character in the String
        for (let i = 0; i < str.length;i++) {
            // charAt(i) gets the character at position i in the String
            let currentChar = str[i]; 
            let w = textWidth(currentChar);
            // since the letters are drawn centered, we advance by half a letter width
            arcLength += w/2;

            // use a some trig to find the angle matching this arclength
            // the totalAngle/2 just adds some additional rotation so the 
            // text starts wraps evenly around the circle
            let theta = arcLength / r - totalAngle/2;

            // save our current origin
            push();
            // rotate to line up with the orientation of the letter
            rotate(theta);
            // translate out along the radius to where the letter will be drawn 
            translate(0, -r);
            // set the fill based on which character we are on
            // draw the character
            text(currentChar, 0, 0);
            // pop back to our origin in the middle of the circle
            // (undoing the rotate and translate)
            pop();
            // add the other half of the character width to our current position
            arcLength += w/2;
        }

        arcLength += 180
    }

    resetMatrix()
    // stroke('red')
    // pop()
    // line(width/2, 0, width/2, height)

}

function keyPressed() {
    saveCanvas('cia', 'png');
}