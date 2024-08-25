const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();

const bird = {
    x: canvas.width * 0.1,
    y: canvas.height / 2,
    width: 34,
    height: 24,
    scale: 1.5,
    gravity: 0.02,
    lift: -1.5,
    velocity: 0,
    frames: [new Image(), new Image(), new Image()],
    currentFrame: 0,
    frameCount: 0,
    draw() {
        ctx.drawImage(this.frames[this.currentFrame], this.x, this.y, this.width * this.scale, this.height * this.scale);
    },
    update() {
        this.velocity += this.gravity;
        this.y += this.velocity;

        // Prevent bird from falling out of the screen
        if (this.y + this.height * this.scale > canvas.height) {
            this.y = canvas.height - this.height * this.scale;
            this.velocity = 0;
        }
        if (this.y < 0) {
            this.y = 0;
            this.velocity = 0;
        }

        // Frame animation for bird
        this.frameCount++;
        if (this.frameCount % 30 === 0) {
            this.currentFrame = (this.currentFrame + 1) % this.frames.length;
        }
    },
    moveUp() {
        this.velocity = this.lift;
    }
};

bird.frames[0].src = 'assets/sprites/yellowupflap.png';
bird.frames[1].src = 'assets/sprites/yellowmidflap.png';
bird.frames[2].src = 'assets/sprites/yellowdownflap.png';

const pipe = {
    img: new Image(),
    width: 50,
    height: 320
};
pipe.img.src = 'assets/sprites/pipe-green.png';

const pipes= [];
const pipeGap = 150;
let frameCount = 0;

function drawPipes() {
    pipes.forEach(pipeObj => {
        // Draw the upper pipe (rotated)
        ctx.save();
        ctx.translate(pipeObj.x + pipe.width / 2, pipeObj.height);
        ctx.rotate(Math.PI); // Rotate 180 degrees (in radians)
        ctx.drawImage(pipe.img, -pipe.width / 2, 0, pipe.width, pipeObj.height); // Draw the pipe
        ctx.restore();

        ctx.drawImage(pipe.img, pipeObj.x, pipeObj.height + pipeGap, pipe.width, canvas.height - (pipeObj.height + pipeGap));

        pipeObj.x -= 1;

        if (pipeObj.x + pipe.width < 0) {
            pipes.shift();
        }

        if (bird.x < pipeObj.x + pipe.width && bird.x + bird.width * bird.scale > pipeObj.x &&
            (bird.y < pipeObj.y + pipeObj.height || bird.y + bird.height * bird.scale > pipeObj.y + pipeObj.height + pipeGap)
        ) {
            resetGame();
        }
    });
}

function spawnPipe() {
    const pipeHeight = Math.floor(Math.random() * (canvas.height / 2));
    pipes.push({ x: canvas.width, y: 0, height: pipeHeight });
}

function resetGame() {
    pipes.length = 0;
    bird.y = canvas.height / 2;
    bird.velocity = 0;
    frameCount = 0;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    bird.draw();
    drawPipes();

    bird.update();

    frameCount++;
    if (frameCount % 400 === 0) {
        spawnPipe();
    }

    requestAnimationFrame(draw);
}

window.addEventListener("keydown", function(event) {
    if (event.code === "Space") {
        bird.moveUp();
    }
});

window.addEventListener('resize', resizeCanvas);


Promise.all(bird.frames.map(img => new Promise(resolve => img.onload = resolve)))
    .then(() => {
        draw();
    });
