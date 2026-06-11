let player;
let platforms = [];
let spikes = [];
let gameRunning = true;
let canDoubleJump = false;
let speedMultiplier = 1; 
let bonecoImg;
let fundoImg;
let lixoImg;
let currentLevel = 1;
let gameState = "menu";
let finalProgress = 0;
let musica;
let somAtivado = true;
let musicaMenu;

// CONFIGURAÇÕES GLOBAIS - SINCRONIZADAS COM O DESIGN
const SPEED = 500; 
const GRAVITY = 3200;
const JUMP_FORCE = -1000;
const LEVEL_END = 18000; 

function abrirSobre() {
    document.getElementById("popupSobre").classList.remove("hidden");
}

function abrirComoJogar() {
    document.getElementById("popupComoJogar").classList.remove("hidden");
}

function fecharPopup(id) {
    document.getElementById(id).classList.add("hidden");
}

// Função que o botão do HTML vai chamar
function iniciarJogo(nivel) {
  userStartAudio();
  if (musicaMenu.isPlaying()) {
    musicaMenu.stop();
  }

  if (somAtivado && !musica.isPlaying()) {
    musica.loop();
  }

  gameState = "playing";
    currentLevel = nivel;

    document.getElementById('menu-home').classList.add('hidden');
    document.getElementById('btn-home-game').classList.remove('hidden');

    if (nivel === 1) speedMultiplier = 1;
    if (nivel === 2) speedMultiplier = 1.2;
    if (nivel === 3) speedMultiplier = 1.2 ;

    gameRunning = true;
    buildLevel();
    resetPlayer();
    loop();
}

function voltarAoMenu() {
  if (musica.isPlaying()) {
    musica.stop();
  }

  if (somAtivado && !musicaMenu.isPlaying()) {
    musicaMenu.loop();
  }

  gameState = "menu";
    // 1. Para o motor do jogo (p5.js) imediatamente
    gameRunning = false;
    noLoop(); 
    
    // 2. Reseta o player para o início (X=0) 
    // Isso evita que ele continue andando ou que o som de morte toque
    resetPlayer(); 

    // 3. Controle das telas (CSS/HTML)
    document.getElementById('menu-home').classList.remove('hidden'); // Mostra Home
    document.getElementById('btn-home-game').classList.add('hidden'); // Esconde o botão da fase
    
    // Se a tela de Game Over estiver aberta, esconde ela também
    if(document.getElementById('ui-fim-de-jogo')) {
        document.getElementById('ui-fim-de-jogo').classList.add('hidden');
    }
    
    // 4. Limpa o desenho da tela para não ficar o rastro do jogo atrás do menu
    background(20, 30, 50); 
}

function preload() {
  bonecoImg = loadImage("boneco.png");
  fundoImg = loadImage("fundo.webp");
  lixoImg = loadImage("lixo.png");

  musica = loadSound("musica.mp3");
  musicaMenu = loadSound("musicaMenu.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  gameRunning = false; 
  noLoop();
  buildLevel();
  resetPlayer();
}

function buildLevel() {
    if (currentLevel === 1) {
        buildLevel1();
    }
    else if (currentLevel === 2) {
        buildLevel2();
    }
    else if (currentLevel === 3) {
        buildLevel3();
    }
}


function buildLevel1() {

  platforms = [];
  spikes = [];

  function createSet(x, yRelativo, w, hasSpike) {
    let actualY = height * yRelativo;

    platforms.push({
      x,
      y: actualY,
      w,
      h: 35
    });

    if (hasSpike) {
      let sSize = 90;

      spikes.push({
        x: x + w/2 - sSize/2,
        y: actualY,
        w: sSize,
        h: sSize
      });
    }
  }

  createSet(0, 0.85, 1200, false);
  createSet(1500, 0.75, 500, true);
  createSet(2200, 0.65, 500, true);
  createSet(2900, 0.75, 500, false);
  createSet(3600, 0.60, 500, true);
  createSet(4300, 0.50, 500, false);

  createSet(5000, 0.65, 500, true);
  createSet(5700, 0.80, 600, false);
  createSet(6500, 0.70, 500, true);
  createSet(7200, 0.70, 500, true);
  createSet(7900, 0.70, 500, true);
  createSet(8700, 0.85, 800, false);

  createSet(9700, 0.75, 500, true);
  createSet(10400, 0.65, 500, false);
  createSet(11100, 0.70, 500, true);
  createSet(11800, 0.55, 500, true);
  createSet(12500, 0.65, 500, true);
  createSet(13200, 0.75, 500, false);

  createSet(14000, 0.70, 450, true);
  createSet(14700, 0.60, 450, true);
  createSet(15400, 0.70, 450, true);
  createSet(16100, 0.80, 450, true);
  createSet(16800, 0.70, 450, true);

  createSet(17500, 0.85, 1000, false);
}

function buildLevel2() {

  platforms = [];
  spikes = [];

  function createSet(x, yRelativo, w, hasSpike) {
    let actualY = height * yRelativo;

    platforms.push({
      x,
      y: actualY,
      w,
      h: 35
    });

    if (hasSpike) {
      let sSize = 90;

      spikes.push({
        x: x + w/2 - sSize/2,
        y: actualY,
        w: sSize,
        h: sSize
      });
    }
  }

  createSet(0, 0.85, 1000, false);

  createSet(1300, 0.75, 450, true);
  createSet(1900, 0.65, 450, false);
  createSet(2500, 0.75, 450, true);

  createSet(3200, 0.75, 400, true);
  createSet(3800, 0.70, 400, true);
  createSet(4400, 0.55, 400, false);

  createSet(5200, 0.45, 400, true);
  createSet(5900, 0.65, 350, true);
  createSet(6600, 0.50, 450, true);

  createSet(7400, 0.75, 300, true);
  createSet(7900, 0.65, 500, true);
  createSet(8600, 0.75, 350, true);

  createSet(9500, 0.85, 800, false);

  createSet(10600, 0.70, 350, true);
  createSet(11200, 0.60, 350, true);
  createSet(11800, 0.50, 350, true);
  createSet(12400, 0.60, 350, true);

  createSet(13200, 0.45, 320, true);
  createSet(13700, 0.55, 280, false);
  createSet(14200, 0.45, 280, true);
  createSet(14700, 0.65, 280, true);

  createSet(15400, 0.75, 400, true);
  createSet(16000, 0.60, 400, true);
  createSet(16600, 0.50, 400, true);
  createSet(17200, 0.70, 400, true);

  createSet(17900, 0.85, 1200, false);
}

function buildLevel3() {

  platforms = [];
  spikes = [];

  function createSet(x, yRelativo, w, hasSpike) {
    let actualY = height * yRelativo;

    platforms.push({
      x,
      y: actualY,
      w,
      h: 35
    });

    if (hasSpike) {
      let sSize = 90;

      spikes.push({
        x: x + w/2 - sSize/2,
        y: actualY,
        w: sSize,
        h: sSize
      });
    }
  }

  createSet(0, 0.85, 900, false);

  createSet(1200, 0.70, 300, true);
  createSet(1700, 0.55, 300, true);
  createSet(2200, 0.60, 300, false);
  createSet(2700, 0.50, 400, true);

  createSet(3400, 0.40, 250, true);
  createSet(3900, 0.65, 250, false);
  createSet(4400, 0.60, 250, true);
  createSet(4900, 0.55, 250, true);

  createSet(5500, 0.75, 350, true);
  createSet(6100, 0.65, 250, true);
  createSet(6600, 0.65, 250, true);
  createSet(7100, 0.55, 250, true);

  createSet(7800, 0.85, 700, false);

  createSet(8800, 0.70, 400, true);
  createSet(9500, 0.60, 250, true);
  createSet(10000, 0.60, 250, true);
  createSet(10500, 0.45, 250, true);

  createSet(11200, 0.35, 220, true);
  createSet(11650, 0.55, 220, true);
  createSet(12100, 0.45, 220, true);
  createSet(12550, 0.55, 220, true);

  createSet(13200, 0.45, 220, true);
  createSet(13650, 0.60, 220, true);
  createSet(14100, 0.45, 220, true);
  createSet(14550, 0.70, 220, true);

  createSet(15200, 0.55, 220, true);
  createSet(15650, 0.60, 220, false);
  createSet(16100, 0.45, 220, true);

  createSet(17000, 0.85, 1500, false);
}

function draw() {
  if (fundoImg) {
    image(fundoImg, 0, 0, width, height);
  } else {
    background(135, 206, 235); // Cor de reserva caso a imagem falhe
  }


  let dt = deltaTime / 1000; 
  if (dt > 0.1) dt = 0.1; 

  player.vy += GRAVITY * dt;
  player.y += player.vy * dt;
  player.x += SPEED * dt;
  if (!gameRunning && gameState === "playing") {
    return;
  }

  if (gameState === "gameover") {

    fill(0, 180);
    rect(0, 0, width, height);

    textAlign(CENTER, CENTER);

    fill(255, 80, 80);
    textSize(50);
    text("VOCÊ PERDEU!", width/2, height/2 - 80);

    fill(255);
    textSize(28);
    text(
      "PROGRESSO: " + finalProgress + "%",
      width/2,
      height/2
    );

    textSize(18);
    text(
      "Pressione ESPAÇO para reiniciar",
      width/2,
      height/2 + 60
    );

    return;
  }

  if (gameState === "victory") {

    fill(0, 180);
    rect(0, 0, width, height);

    textAlign(CENTER, CENTER);

    // 100%
    fill(255);
    textSize(60);
    text(
      "100%",
      width / 2,
      height / 2 - 80
    );

    // Mensagem de vitória
    fill(0, 255, 100);
    textSize(45);
    text(
      "PARABÉNS, VOCÊ VENCEU!",
      width / 2,
      height / 2
    );

    // Instrução
    fill(255);
    textSize(18);
    text(
      "Pressione ESPAÇO para jogar novamente",
      width / 2,
      height / 2 + 70
    );

    return;
  }

// DESENHAR PLATAFORMAS (Estilo Grama com Corte de Segurança)
  for (let p of platforms) {
    let screenX = p.x - player.x + 150; 
    if (screenX + p.w > 0 && screenX < width) {
      push(); // Salva o estado atual do desenho

      noStroke();
      
      // 2. Desenha a Terra (parte de baixo)
      fill(100, 65, 45); // Marrom terra
      rect(screenX, p.y + 10, p.w, p.h - 10, 0, 0, 10, 10);

      // 3. Desenha a Grama e suas franjas
      fill(50, 180, 50); // Verde grama
      rect(screenX, p.y, p.w, 15, 10, 10, 0, 0); 
      
      // Desenha as franjas, mas garantindo que não passem da largura
      for (let xGrama = 0; xGrama < p.w; xGrama += 15) {
        // Se o próximo triângulo for ultrapassar a largura, a gente não desenha o que sobra
        let espacoRestante = p.w - xGrama;
        let larguraTriangulo = min(15, espacoRestante);
        
        triangle(
          screenX + xGrama, p.y + 15,
          screenX + xGrama + larguraTriangulo / 2, p.y + 22,
          screenX + xGrama + larguraTriangulo, p.y + 15
        );
      }
      
      pop(); // Restaura o desenho (para não afetar o resto do jogo)

      // Colisão de Pouso hitbox plataforma
      if (player.x + player.w > p.x && 
          player.x < p.x + p.w && 
          player.y + player.h > p.y && 
          player.y + player.h < p.y + (player.vy * dt) + 25 && 
          player.vy >= 0) {
        player.y = p.y - player.h;
        player.vy = 0;
        canDoubleJump = true;
      }
    }
  }

// --- DESENHAR OBSTÁCULOS (LIXO) ---
for (let s of spikes) {
  let screenX = s.x - player.x + 150;
  if (screenX + s.w > 0 && screenX < width) {
    
    if (lixoImg) {
      // "s.y - s.h" para "s.y - s.h + 20"
      // Esse +20 "enterra" o lixo na grama.
      image(lixoImg, screenX, s.y - s.h + 15, s.w, s.h);
    } else {
      fill(255, 50, 80);
      triangle(screenX, s.y, screenX + s.w/2, s.y - s.h, screenX + s.w, s.y);
    }

    // --- AJUSTE DE COLISÃO (Para não morrer no "ar") ---
    let hitboxMargin = 30; // Mais margem nas laterais
    if (player.x + player.w > s.x + hitboxMargin && 
        player.x < s.x + s.w - hitboxMargin && 
        // Aqui ajustamos para o pé do player encostar no desenho real do lixo
        player.y + player.h > s.y - s.h + 35 && 
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

  // HUD - PORCENTAGEM REAL
  let progress = floor(min((player.x / LEVEL_END) * 100, 100));
  fill(255);
  noStroke();
  textAlign(CENTER);
  textSize(32);
  text(progress + "%", width/2, 60);

  // CAIU OU CHEGOU
  if (player.y > height) gameOver();
  if (progress >= 100) victory();
}

// Tecla de espaço e seta para cima clicados, "ativa" o jump force, se o jogo estiver rodando
function keyPressed() {
  if ((key === ' ' || keyCode === UP_ARROW) && gameRunning) {
      if (player.vy === 0 || Math.abs(player.vy) < 50) { 
        player.vy = JUMP_FORCE;
      } else if (canDoubleJump) { //segundo pulo um pouco menor, e só pode pular se não estiver no meio de outro double jump
        player.vy = JUMP_FORCE * 0.85; 
        canDoubleJump = false;
      }
  } else if ((key === ' ' || keyCode === UP_ARROW) && !gameRunning) {
      restartGame();
  }
}

function restartGame() {
  resetPlayer();

  gameState = "playing";
  gameRunning = true;

  if (somAtivado && !musica.isPlaying()) {
    musica.loop();
  }

  loop();
}

function gameOver() {

  if (musica.isPlaying()) {
      musica.stop();
  }
  gameRunning = false;
  gameState = "gameover";

  finalProgress = floor(
    min((player.x / LEVEL_END) * 100, 100)
  );
  
}

function victory() {
  gameRunning = false;
  gameState = "victory";
}

function resetPlayer() {
  player = {
    x: 0,
    y: height * 0.5,
    w: 100,
    h: 100,
    vy: 0
  };
  canDoubleJump = true;
}

function toggleSom() {
  somAtivado = !somAtivado;

  let btn = document.getElementById("btnSom");

  if (somAtivado) {
    btn.innerHTML = "🔊";

    if (gameState === "menu") {
      musicaMenu.loop();
    } else if (gameState === "playing") {
      musica.loop();
    }

  } else {
    btn.innerHTML = "🔇";

    musica.stop();
    musicaMenu.stop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  buildLevel();
}