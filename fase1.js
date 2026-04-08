

let player;
let platforms = [];
let spikes = [];
let gameRunning = true;
let canDoubleJump = false;
let speedMultiplier = 1; // Adicione isso
let bonecoImg;
let fundoImg;
let lixoImg;

// CONFIGURAÇÕES GLOBAIS - SINCRONIZADAS COM O DESIGN
const SPEED = 500; 
const GRAVITY = 3200;
const JUMP_FORCE = -1000;
const LEVEL_END = 18000; // Final ajustado para acabar junto com as plataformas

// Função que o botão do HTML vai chamar
function iniciarJogo(nivel) {
    // 1. Esconde o menu HTML
    document.getElementById('menu-home').classList.add('hidden');
    document.getElementById('btn-home-game').classList.remove('hidden');
    
    // 2. Ajusta a dificuldade baseada no nível
    if (nivel === 1) speedMultiplier = 1;
    if (nivel === 2) speedMultiplier = 1.4;
    if (nivel === 3) speedMultiplier = 1.8;

    // 3. Reinicia o jogo
    gameRunning = true;
    buildLevel();
    resetPlayer();
    loop(); // Garante que o p5.js volte a desenhar
}

function voltarAoMenu() {
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
  platforms = [];
  spikes = [];

  function createSet(x, yRelativo, w, hasSpike) {
    let actualY = height * yRelativo;
    platforms.push({ x, y: actualY, w, h: 35 });
    
    if (hasSpike) {
      let sSize = 90;
      spikes.push({ x: x + w/2 - sSize/2, y: actualY, w: sSize, h: sSize });
    }
  }

  // --- DESIGN DO LEVEL COMPLETO E DISTRIBUÍDO ---
  
  // 0% - 30%
  createSet(0, 0.85, 1200, false);
  createSet(1500, 0.75, 500, true);
  createSet(2200, 0.65, 500, true);
  createSet(2900, 0.75, 500, false);
  createSet(3600, 0.60, 500, true);
  createSet(4300, 0.50, 500, false);

  // 30% - 60%
  createSet(5000, 0.65, 500, true);
  createSet(5700, 0.80, 600, false);
  createSet(6500, 0.70, 500, true);
  createSet(7200, 0.70, 500, true);
  createSet(7900, 0.70, 500, true);
  createSet(8700, 0.85, 800, false); // Checkpoint

  // 60% - 85% (SEM PULO IMPOSSÍVEL)
  createSet(9700, 0.75, 500, true); 
  createSet(10400, 0.65, 500, false);
  createSet(11100, 0.70, 500, true);
  createSet(11800, 0.55, 500, true);
  createSet(12500, 0.65, 500, true);
  createSet(13200, 0.75, 500, false);

  // 85% - 100% (A RETA FINAL REAL)
  createSet(14000, 0.70, 450, true);
  createSet(14700, 0.60, 450, true);
  createSet(15400, 0.70, 450, true);
  createSet(16100, 0.80, 450, true);
  createSet(16800, 0.70, 450, true);
  
  // PLATAFORMA FINAL DE CHEGADA (Acaba em 18.000 certinho)
  createSet(17500, 0.85, 1000, false); 
}

function draw() {
  if (fundoImg) {
    image(fundoImg, 0, 0, width, height);
  } else {
    background(135, 206, 235); // Cor de reserva caso a imagem falhe
  }

  if (!gameRunning) return;
  
  if (!gameRunning) return;

  let dt = deltaTime / 1000; 
  if (dt > 0.1) dt = 0.1; 

  player.vy += GRAVITY * dt;
  player.y += player.vy * dt;
  player.x += SPEED * dt;

// DESENHAR PLATAFORMAS (Estilo Grama com Corte de Segurança)
  for (let p of platforms) {
    let screenX = p.x - player.x + 150; 
    if (screenX + p.w > 0 && screenX < width) {
      push(); // Salva o estado atual do desenho
      
      // 1. Criar a "máscara" (Tudo o que for desenhado agora só aparece dentro desse retângulo)
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

      // Colisão de Pouso (Não mexa aqui)
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
      // AJUSTE AQUI: Mudei de "s.y - s.h" para "s.y - s.h + 20"
      // Esse +20 "enterra" o lixo na grama. Se ainda voar, mude para +30 ou +40.
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

function keyPressed() {
  if ((key === ' ' || keyCode === UP_ARROW) && gameRunning) {
      if (player.vy === 0 || Math.abs(player.vy) < 50) { 
        player.vy = JUMP_FORCE;
      } else if (canDoubleJump) {
        player.vy = JUMP_FORCE * 0.85; 
        canDoubleJump = false;
      }
  } else if ((key === ' ' || keyCode === UP_ARROW) && !gameRunning) {
      restartGame();
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
  
  textAlign(CENTER, CENTER); // Garante o alinhamento centralizado
  
  fill(255, 80, 80);
  textSize(50);
  text("VOCÊ PERDEU!", width/2, height/2 - 60); // Sobe o título
  
  fill(255);
  textSize(28);
  text("PROGRESSO: " + finalProgress + "%", width/2, height/2); // Fica no centro
  
  textSize(18);
  text("Pressione ESPAÇO para reiniciar", width/2, height/2 + 60); // Desce a instrução
  
  noLoop();
}

function victory() {
  gameRunning = false;
  background(30, 180, 100);
  fill(255);
  textAlign(CENTER);
  textSize(50);
  text("100% - PARABÉNS, VOCÊ VENCEU!", width/2, height/2);

  textSize(18);
  text("Pressione ESPAÇO para jogar novamente", width/2, height/2 + 60); 
  noLoop();
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

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  buildLevel();
}