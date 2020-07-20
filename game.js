const sprites = new Image();
sprites.src = './sprites.png';

const hitSound = new Audio();
hitSound.src = './effects/hit.wav';

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

let frames = 0;

const background = {
  spriteX: 390,
  spriteY: 0,
  width: 275,
  height: 204,
  x: 0,
  y: canvas.height - 204,
  draw() {
    context.fillStyle = '#70c5ce';
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.drawImage(
      sprites,
      background.spriteX, background.spriteY,
      background.width, background.height,
      background.x, background.y,
      background.width, background.height
    );

    context.drawImage(
      sprites,
      background.spriteX, background.spriteY,
      background.width, background.height,
      (background.x + background.width), background.y,
      background.width, background.height
    );
  }
}

function createGround() {
  const ground = {
    spriteX: 0,
    spriteY: 610,
    width: 224,
    height: 112,
    x: 0,
    y: canvas.height - 112,
    update() {
      const groundMovement = 1;
      const movement = ground.x -= groundMovement;
      const repeatIn = ground.width / 2;

      ground.x = movement % repeatIn; // crazy logic, i know
    },
    draw() {
      context.drawImage(
        sprites,
        ground.spriteX, ground.spriteY,
        ground.width, ground.height,
        ground.x, ground.y,
        ground.width, ground.height
      );
  
      context.drawImage(
        sprites,
        ground.spriteX, ground.spriteY,
        ground.width, ground.height,
        (ground.x + ground.width), ground.y,
        ground.width, ground.height
      )
    }
  }

  return ground;
}

function collision(flappyBird, ground) {
  const flappyBirdY = flappyBird.y + flappyBird.height;
  const groundY = ground.y;

  return (flappyBirdY >= groundY);
}

function createBird() {
  const flappyBird = {
    spriteX: 0,
    spriteY: 0,
    width: 34,
    height: 24,
    x: 30,
    y: 190,
    jumpSize: 4.6,
    jump() {
      flappyBird.velocity = - flappyBird.jumpSize;
    },
    gravity: 0.25,
    velocity: 0,
    update() {
      if (collision(flappyBird, globals.ground)) {
        hitSound.play();

        setTimeout(() => {
          changeScreen(screens.init);
        }, 500);
        return
      }

      flappyBird.velocity += flappyBird.gravity;
      flappyBird.y += flappyBird.velocity;
    },
    movements: [
      { spriteX: 0, spriteY: 0 },
      { spriteX: 0, spriteY: 26 },
      { spriteX: 0, spriteY: 52 },
      { spriteX: 0, spriteY: 26 }
    ],
    currentFrame: 0,
    updateCurrentFrame() {
      const frameInterval = 10;
      const hasPassed = frames % frameInterval === 0;

      if (hasPassed) {
        const baseOfIncrement = 1;
        const increment = flappyBird.currentFrame + baseOfIncrement;
        const baseOfRepeat = flappyBird.movements.length;
        flappyBird.currentFrame = increment % baseOfRepeat;
      }
    },
    draw() {
      flappyBird.updateCurrentFrame();
      const { spriteX, spriteY } = flappyBird.movements[flappyBird.currentFrame];
      context.drawImage(
        sprites,
        spriteX, spriteY,
        flappyBird.width, flappyBird.height,
        flappyBird.x, flappyBird.y,
        flappyBird.width, flappyBird.height
      );  
    }
  }

  return flappyBird;
}

const messageGetReady = {
  sX: 134, sY: 0,
  w: 174, h: 152,
  x: (canvas.width / 2) - 174 / 2,
  y: 50,
  draw() {
    context.drawImage(
      sprites,
      messageGetReady.sX, messageGetReady.sY,
      messageGetReady.w , messageGetReady.h,
      messageGetReady.x, messageGetReady.y,
      messageGetReady.w, messageGetReady.h    
    );
  }
}

function createPipe() {
  const pipe = {
    width: 52,
    height: 400,
    bottom: {
      spriteX: 0,
      spriteY: 169
    },
    top: {
      spriteX: 52,
      spriteY: 169
    },
    space: 90,
    draw(){
      pipe.pairs.forEach(pairs => {
        const yRandom = pairs.y;

        const pipeTopX = pairs.x;
        const pipeTopY = yRandom;
        
        const pipeBottomX = pairs.x;
        const pipeBottomY = pipe.height + pipe.space + yRandom;
        context.drawImage(
          sprites,
          pipe.top.spriteX, pipe.top.spriteY,
          pipe.width, pipe.height,
          pipeTopX, pipeTopY,
          pipe.width, pipe.height
        )

        context.drawImage(
          sprites,
          pipe.bottom.spriteX, pipe.bottom.spriteY,
          pipe.width, pipe.height,
          pipeBottomX, pipeBottomY,
          pipe.width, pipe.height
        )

        pairs.topPipe = {
          x: pipeTopX,
          y: pipe.height + pipeTopY
        }

        pairs.bottomPipe = {
          x: pipeBottomX,
          y: pipeBottomY
        }
      });
    },
    collision(pairs) {
      const headBird = globals.flappyBird.y;
      const footBird = globals.flappyBird.y + globals.flappyBird.height;
      if (globals.flappyBird.x >= pairs.x) {
        if (headBird <= pairs.topPipe.y) {
          return true;
        }
        if (footBird >= pairs.bottomPipe.y) {
          return true;
        }
      }
      return false;
    },
    pairs: [],
    update() {
      if (frames % 100 === 0) {
        const newPipe = { x: canvas.width, y: (-150 * (Math.random() + 1)) };
        pipe.pairs.push(newPipe);
      }

      pipe.pairs.forEach(pairs => {
        pairs.x -= 2;

        if (pairs.x <= -pipe.width) pipe.pairs.shift();

        if (pipe.collision(pairs)) {
          hitSound.play();
          changeScreen(screens.init);
          return
        }
      });
    }
  }

  return pipe;
}

const globals = {};
let activeScreen = {};

function changeScreen(newScreen) {
  activeScreen = newScreen;
  
  if (activeScreen.start) activeScreen.start();
}

const screens = {
  init: {
    start() {
      globals.flappyBird = createBird();
      globals.ground = createGround();
      globals.pipe = createPipe();
    },
    draw() {
      background.draw();
      globals.ground.draw();
      globals.flappyBird.draw();
      messageGetReady.draw();
    },
    click() {
      changeScreen(screens.game);
    },
    update() {
      globals.ground.update();
    }
  }
};

screens.game = {
  draw() {
    background.draw();
    globals.pipe.draw();
    globals.ground.draw();
    globals.flappyBird.draw();
  },
  click() {
    globals.flappyBird.jump();
  },
  update() {
    globals.flappyBird.update();
    globals.ground.update();
    globals.pipe.update();
  }
};

function loop() {
  activeScreen.draw();
  activeScreen.update();
  
  frames++;
  requestAnimationFrame(loop);
}

window.addEventListener('click', event => {
  if (activeScreen.click) activeScreen.click();
});

changeScreen(screens.init);
loop();