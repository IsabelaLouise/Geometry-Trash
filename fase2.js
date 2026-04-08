let player;
let platforms = [];
let spikes = [];
let speed = 7.5; 
let gameRunning = true;
let canDoubleJump = false;
let bonecoImg;
const LEVEL_END = 20000; 

function preload() {
  bonecoImg = loadImage("boneco.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  buildLevel();
  resetPlayer();
}

function buildLevel() {
  platforms = [];
  spikes = [];

  function createSet(x, y, w, hasSpike) {
    platforms.push({ x, y, w, h: 35 });
    if (hasSpike) {
      let sSize = 45; 
      spikes.push({ x: x + w/2 - sSize/2, y: y, w: sSize, h: sSize });
    }
  }

  // --- NOVO DESIGN DE NÍVEL (MAIS LONGO E DESAFIADOR) ---
  
  // 0% - 10%: Aquecimento
  createSet(0, height - 100, 1000, false);
  createSet(1200, height - 150, 400, true);
  createSet(1750, height - 220, 350, true);

  // 10% - 25%: O Ritmo Começa
  createSet(2300, height - 150, 300, true);
  createSet(2750, height - 250, 300, true);
  createSet(3200, height - 350, 300, true);
  createSet(3700, height - 200, 400, false);

  // 25% - 40%: Sequência de Espinhos (Cuidado!)
  createSet(4300, height - 280, 250, true);
  createSet(4700, height - 350, 250, true);
  createSet(5100, height - 420, 250, true);
  createSet(5600, height - 250, 500, false);

  // 40% - 55%: Saltos Longos (Use o Double Jump)
  createSet(6400, height - 300, 200, true);
  createSet(6900, height - 200, 200, true);
  createSet(7400, height - 350, 200, true);
  createSet(8000, height - 150, 600, false);

  // 55% - 75%: O "Zigue-Zague"
  createSet(8800, height - 250, 300, true);
  createSet(9300, height - 400, 300, true);
  createSet(9800, height - 200, 300, true);
  createSet(10300, height - 450, 300, true);
  createSet(10900, height - 300, 400, false);

  // 75% - 90%: Reta de Precisão
  createSet(11600, height - 250, 200, true);
  createSet(12000, height - 250, 200, true);
  createSet(12400, height - 250, 200, true);
  createSet(13000, height - 400, 250, true);
  createSet(13600, height - 200, 250, true);

  // 90% - 100%: Grande Final
  createSet(14500, height - 350, 200, true);
  createSet(15200, height - 200, 200, true);
  createSet(16000, height - 400, 150, false);
  createSet(17000, height - 200, 4000, false); // Chão da vitória
}

function draw() {
  background(15, 20, 35);
  
  if (!gameRunning) return;

  player.vy += player.gravity;
  player.y += player.vy;
  player.x += speed;

  // DESENHAR PLATAFORMAS
  fill(80, 100, 250);
  for (let p of platforms) {
    let screenX = p.x - player.x + 150; 
    if (screenX + p.w > 0 && screenX < width) {
      rect(screenX, p.y, p.w, p.h, 10);

      if (player.x + player.w > p.x && 
          player.x < p.x + p.w && 
          player.y + player.h > p.y && 
          player.y + player.h < p.y + player.vy + 15 && 
          player.vy >= 0) {
        player.y = p.y - player.h;
        player.vy = 0;
        canDoubleJump = true;
      }
    }
  }

  // DESENHAR ESPINHOS
  fill(255, 50, 80);
  for (let s of spikes) {
    let screenX = s.x - player.x + 150;
    if (screenX + s.w > 0 && screenX < width) {
      triangle(screenX, s.y, screenX + s.w/2, s.y - s.h, screenX + s.w, s.y);

      let margemLateral = 14; 
      if (player.x + player.w > s.x + margemLateral && 
          player.x < s.x + s.w - margemLateral && 
          player.y + player.h > s.y - s.h + 15 && 
          player.y < s.y) {
        gameOver();
      }
    }
  }

  // PERSONAGEM
  if (bonecoImg) {
    image(bonecoImg, 150, player.y, player.w, player.h);
  } else {
    fill(0, 255, 180);
    rect(150, player.y, player.w, player.h, 8);
  }

  // HUD DE PORCENTAGEM
  let progress = floor(min((player.x / LEVEL_END) * 100, 100));
  fill(255);
  noStroke();
  textAlign(CENTER);
  textSize(32);
  text(progress + "%", width/2, 60);

  if (player.y > height) gameOver();
  if (progress >= 100) victory();
}

function keyPressed() {
  if (key === ' ' || keyCode === UP_ARROW) {
    if (gameRunning) {
      if (player.vy === 0) {
        player.vy = player.jump;
      } else if (canDoubleJump) {
        player.vy = player.jump * 0.85; 
        canDoubleJump = false;
      }
    } else {
      restartGame();
    }
  }
}

function restartGame() {
  resetPlayer();
  gameRunning = true;
  loop();
}

function gameOver() {
  gameRunning = false;
  let finalProgress = floor(min((player.x / LEVEL_END) * 100, 100));
  background(10, 230);
  fill(255, 80, 80);
  textSize(50);
  textAlign(CENTER);
  text("PERDEU!", width/2, height/2 - 20);
  fill(255);
  textSize(28);
  text("Progresso: " + finalProgress + "%", width/2, height/2 + 40);
  textSize(18);
  text("Pressione ESPAÇO para tentar novamente", width/2, height/2 + 90);
  noLoop();
}

function victory() {
  gameRunning = false;
  background(30, 180, 100);
  fill(255);
  textSize(60);
  textAlign(CENTER);
  text("PARABÉNS! 100%", width/2, height/2);
  textSize(25);
  text("Você zerou o nível!", width/2, height/2 + 60);
  noLoop();
}

function resetPlayer() {
  player = {
    x: 0,
    y: height - 300,
    w: 65,
    h: 65,
    vy: 0,
    gravity: 0.8, // Gravidade padrão para manter a dificuldade justa
    jump: -16     
  };
  canDoubleJump = true;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}