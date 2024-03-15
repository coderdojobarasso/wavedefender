let playerFrames = [],
  playerFrame = 0,
  frameSpeed = 0.1;
let ghostFrames = [];

let playerPos, playerSpeed, mousePos;
let gunFrame;
let bgImage;
let bulletFrame, bullets =[], bulletCooldown=0, firing=false;
let movers=[];

function preload() {
  for (let i = 1; i < 5; i++) {
    playerFrames.push(loadImage("sprites/Player" + i + ".png"));
  }
  for (let i = 1; i < 5; i++) {
    ghostFrames.push(loadImage("sprites/Ghost" + i + ".png"));
  }
  gunFrame = loadImage("sprites/Gun1.png");
  bulletFrame = loadImage("sprites/Bullet.png");
  bgImage = loadImage("sprites/TheRoom.png");
}

function setup() {
  createCanvas(600, 400);
  playerPos = createVector(width / 2, height / 2);
  playerSpeed = createVector(0, 0);
  mousePos = createVector(mouseX,mouseY);
  imageMode(CENTER);
  for (let i=0;i<20;i++) movers.push(Ghost.random(ghostFrames,10));
}

function draw() {
  //Legge gli input
  controlli();
  //Aggiorna lo stato del gioco
  //Gestione giocatore
  playerPos.add(playerSpeed);
  playerSpeed.mult(0.9);
  if (playerSpeed.mag() < 0.1) {
    playerFrame = 0;
  } else {
    playerFrame = playerFrame + frameSpeed;
    if (playerFrame > playerFrames.length) playerFrame = 0;
  }
  //Gestione proiettili
  gestisciSparo();

  //Aggiorna tutti gli oggetti
  bullets.forEach((bullet) => bullet.update());
  movers.forEach((mover) => {mover.update()});
  
  //Disegna
  imageMode(CORNER);
  background(bgImage);

  imageMode(CENTER);
  //Disegna giocatore
  push();
  translate(playerPos.x, playerPos.y);
  if (playerSpeed.x < 0) {
    scale(-1, 1);
  }
  image(playerFrames[int(playerFrame)], 0, 0);
  pop();

  //Disegna arma
  push();
  mousePos.set(mouseX,mouseY);
  let diff = p5.Vector.sub(mousePos,playerPos);
  translate(playerPos.x, playerPos.y+3);
  
  if (abs(diff.heading())>=HALF_PI) {
    scale(-1, 1);
    rotate(-diff.heading()+PI);
  } else {
    rotate(diff.heading());
  }
  
  image(gunFrame, 0, 0);
  pop();
  
  movers.forEach((mover) => mover.render());
  bullets.forEach((bullet) => bullet.render());
  
  //Rimuovi gli oggetti fuori schermo
  bullets = bullets.filter(bullet => bullet.isAlive());
  movers = movers.filter((mover) => mover.isAlive());
}

function gestisciSparo() {
  if (firing) {
    //Il nuovo proiettile avrà velocità costante in direzione del mouse
    mousePos.set(mouseX,mouseY);
    let bulletSpeed = p5.Vector.sub(mousePos,playerPos);
    bulletSpeed.setMag(10);
    let bulletPos = playerPos.copy().add(bulletSpeed);
    playerPos.add(p5.Vector.mult(bulletSpeed, -0.3))
    bullets.push(new Bullet(bulletPos,bulletSpeed, [bulletFrame],10));
    //Abbiamo sparato
    firing=false;
  }
  //Gestisce il passaggio del tempo
  bulletCooldown--;
}

function controlli() {
  if (keyIsDown(DOWN_ARROW)) {
    playerSpeed.y = 2;
  } else if (keyIsDown(UP_ARROW)) {
    playerSpeed.y = -2;
  }

  if (keyIsDown(LEFT_ARROW)) {
    playerSpeed.x = -2;
  } else if (keyIsDown(RIGHT_ARROW)) {
    playerSpeed.x = 2;
  }
  
  if (mouseIsPressed) {
    if (bulletCooldown<=0) {
      bulletCooldown=20;
      firing=true;
    }
  }
}
