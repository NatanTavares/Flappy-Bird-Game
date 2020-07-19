const sprites = new Image();
sprites.src = './sprites.png';

const hitSound = new Audio();
hitSound.src = './effects/hit.wav';

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

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

const floor = {
  spriteX: 0,
  spriteY: 610,
  width: 224,
  height: 112,
  x: 0,
  y: canvas.height - 112,
  draw() {
    context.drawImage(
      sprites,
      floor.spriteX, floor.spriteY,
      floor.width, floor.height,
      floor.x, floor.y,
      floor.width, floor.height
    );

    context.drawImage(
      sprites,
      floor.spriteX, floor.spriteY,
      floor.width, floor.height,
      (floor.x + floor.width), floor.y,
      floor.width, floor.height
    )
  }
}

function collision(flappyBird, floor) {
  const flappyBirdY = flappyBird.y + flappyBird.height;
  const floorY = floor.y;

  return (flappyBirdY >= floorY);
}

function createBird() {
  const flappyBird = {
    spriteX: 0,
    spriteY: 0,
    width: 34,
    height: 24,
    x: 10,
    y: 50,
    jumpSize: 4.6,
    jump() {
      flappyBird.velocity = - flappyBird.jumpSize;
    },
    gravity: 0.25,
    velocity: 0,
    refresh() {
      if (collision(flappyBird, floor)) {
        hitSound.play();

        setTimeout(() => {
          changeScreen(screens.init);
        }, 500);
        return
      }

      flappyBird.velocity += flappyBird.gravity;
      flappyBird.y += flappyBird.velocity;
    },
    draw() {
      context.drawImage(
        sprites,
        flappyBird.spriteX, flappyBird.spriteY,
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
    },
    draw() {
      background.draw();
      floor.draw();
      globals.flappyBird.draw();
      messageGetReady.draw();
    },
    click() {
      changeScreen(screens.game);
    },
    refresh() {
    }
  }
};

screens.game = {
  draw() {
    background.draw();
    floor.draw();
    globals.flappyBird.draw();
  },
  click() {
    globals.flappyBird.jump();
  },
  refresh() {
    globals.flappyBird.refresh();
  }
};

function loop() {
  activeScreen.draw();
  activeScreen.refresh();
  
  requestAnimationFrame(loop);
}

window.addEventListener('click', event => {
  if (activeScreen.click) activeScreen.click();
});

changeScreen(screens.init);
loop();