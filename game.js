const sprites = new Image();
sprites.src = './sprites.png';

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

const flappyBird = {
  spriteX: 0,
  spriteY: 0,
  width: 34,
  height: 24,
  x: 10,
  y: 50,
  gravity: 0.25,
  velocity: 0,
  refresh() {
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

function loop() {
  flappyBird.refresh();


  background.draw();
  floor.draw();
  flappyBird.draw();

  

  requestAnimationFrame(loop);
}

loop();