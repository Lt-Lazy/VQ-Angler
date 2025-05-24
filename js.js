const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let inventoryOpen = false;

const inventoryCols = 5;
const inventoryRows = 4;
const inventorySize = inventoryCols * inventoryRows;
let inventory = new Array(inventorySize).fill(null);

const inventorySlotSize = 60; // px


//================================================================================ MAP ===================================================
const TILE_SIZE = 40;

const solidTiles = ['G1'];

// Tile definisjoner
const tileMap = {
  'W1': 'images/tiles/waterTile.png',
  'P1': 'images/tiles/plankTile.png',
  'G1': 'images/tiles/grassTile.png',
  'B1': 'images/tiles/brickTile.png',
  'S1': 'images/tiles/sandPathTile.png',
  'C1': 'images/tiles/coblestoneTile.png',

  'F1': 'images/tiles/fenceTile.png',
};

// Laste inn bilder
const tileImages = {};
let loadedImages = 0;
const totalImages = Object.keys(tileMap).length;

for (let key in tileMap) {
  const img = new Image();
  img.src = tileMap[key];
  img.onload = () => {
    loadedImages++;
    if (loadedImages === totalImages) {
        player.y = getGroundY(player.x); // plasser spiller på bakken
        drawGame();
    }
  };
  tileImages[key] = img;
}

let currentLevelIndex = 0;
let levelData = levels[currentLevelIndex];
let level = levelData.tiles;
let foreground = levelData.foregroundLayer || [];

function drawLevel() {
  const bgTileCode = levelData.backgroundTile;
  const bgTileImage = tileImages[bgTileCode];

  for (let y = 0; y < level.length; y++) {
    for (let x = 0; x < level[y].length; x++) {
      // Først: tegn bakgrunn
      if (bgTileImage) {
        ctx.drawImage(bgTileImage, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      }

      // Så: tegn nivåets faktiske tile hvis den finnes
      const tileCode = level[y][x];
      const img = tileImages[tileCode];
      if (img && tileCode !== bgTileCode) {
        ctx.drawImage(img, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      }
    }
  }
}

function drawBackgroundAndTiles() {
  const bgTileCode = levelData.backgroundTile;
  const bgTileImage = tileImages[bgTileCode];

  for (let y = 0; y < level.length; y++) {
    for (let x = 0; x < level[y].length; x++) {
      // Bakgrunn
      if (bgTileImage) {
        ctx.drawImage(bgTileImage, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      }

      // Hovedtile
      const tileCode = level[y][x];
      const img = tileImages[tileCode];
      if (img && tileCode !== bgTileCode) {
        ctx.drawImage(img, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      }
    }
  }
}

function drawForeground() {
  for (let y = 0; y < foreground.length; y++) {
    for (let x = 0; x < foreground[y].length; x++) {
      const tileCode = foreground[y][x];
      const img = tileImages[tileCode];
      if (img) {
        ctx.drawImage(img, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      }
    }
  }
}

//================================================================================ KARAKTER ===================================================

// Last inn spillerbilder
const playerSprites = {
  up: new Image(),
  down: new Image(),
  left: new Image(),
  right: new Image()
};

playerSprites.up.src = 'images/player/pixelmannUp.png';
playerSprites.down.src = 'images/player/pixelmannDown.png';
playerSprites.left.src = 'images/player/pixelmannLeft.png';
playerSprites.right.src = 'images/player/pixelmannRight.png';

// Spillerens posisjon og retning
let player = {
  tileX: 2,
  tileY: 0,
  pixelX: 2 * TILE_SIZE,
  pixelY: 0,
  dir: 'right',
  speed: 4 // piksler per frame
};

// Tegn hele spillet
function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!inventoryOpen) {
    drawBackgroundAndTiles();
    drawPlayer();
    drawForeground();
  } else {
    drawInventory();
  }
}

// Tegn spilleren
function drawPlayer() {
  const sprite = playerSprites[player.dir];
  ctx.drawImage(sprite, player.pixelX, player.pixelY, TILE_SIZE, TILE_SIZE);
}

// === Finn høyeste solide tile i en kolonne ===
function getGroundY(x) {
  for (let y = 0; y < level.length; y++) {
    const tileCode = level[y][x];
    if (solidTiles.includes(tileCode)) {
      return y - 1; // spilleren står oppå denne
    }
  }
  return level.length - 1; // fallback
}

function updatePlayerPosition() {
const targetX = player.tileX * TILE_SIZE;
const dx = targetX - player.pixelX;

if (Math.abs(dx) > player.speed) {
    player.pixelX += player.speed * Math.sign(dx);
} else {
    player.pixelX = targetX;
}

// y oppdateres direkte (ingen vertikal bevegelse)
player.tileY = getGroundY(player.tileX);
player.pixelY = player.tileY * TILE_SIZE;
}

function movePlayer(dir) {

    if (dir === 'left') {
        if (player.tileX > 0) {
        player.tileX -= 1;
        } else {
        changeLevel("prev");
        return;
        }
        player.dir = 'left';
    }

    if (dir === 'right') {
        if (player.tileX < level[0].length - 1) {
        player.tileX += 1;
        } else {
        changeLevel("next");
        return;
        }
        player.dir = 'right';
    }

    if (dir === 'up') {
        player.dir = 'up';
    }

    if (dir === 'down') {
        player.dir = 'down';
    }

    drawGame();
}

//================================================================================ KONTROLLER ===================================================

// === Gamepad ===
let gamepadIndex = null;

window.addEventListener("gamepadconnected", (e) => {
  console.log("Gamepad connected:", e.gamepad);
  gamepadIndex = e.gamepad.index;
});

let lastMoveTime = 0;
const moveCooldown = 150; // juster hastighet i millisekunder

function pollGamepad() {

    if (inventoryOpen) return;

    const gamepads = navigator.getGamepads();
    const gp = gamepads[gamepadIndex];
    if (!gp) return;

    const now = Date.now();
    if (now - lastMoveTime < moveCooldown) return;

    const left = gp.buttons[14].pressed;
    const right = gp.buttons[15].pressed;
    const up = gp.buttons[12].pressed;
    const down = gp.buttons[13].pressed;
    const triangle = gp.buttons[3].pressed; // PS: Triangle

    if (left) {
        movePlayer('left');
        lastMoveTime = now;
    } else if (right) {
        movePlayer('right');
        lastMoveTime = now;
    } else if (up) {
        movePlayer('up');
        lastMoveTime = now;
    } else if (down) {
        movePlayer('down');
        if (triangle) {
            toggleInventory();
            lastMoveTime = now;
            return;
        }
        lastMoveTime = now;
    }
}

//================================================================================ NIVÅER ======================================================

function changeLevel(direction) {
    if (direction === "next" && currentLevelIndex < levels.length - 1) {
        currentLevelIndex++;
    } else if (direction === "prev" && currentLevelIndex > 0) {
        currentLevelIndex--;
    } else {
        return; // kan ikke gå videre
    }

    levelData = levels[currentLevelIndex];
    level = levelData.tiles;
    foreground = levelData.foregroundLayer || [];

    player.tileX = (direction === "next" ? 0 : level[0].length - 1);
    player.pixelX = player.tileX * TILE_SIZE;
    player.tileY = getGroundY(player.tileX);
    player.pixelY = player.tileY * TILE_SIZE;

    drawGame();
}

//================================================================================ INVENTORY ===================================================

function toggleInventory() {
  inventoryOpen = !inventoryOpen;
  drawGame();
}

function drawInventory() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;

  const startX = (canvas.width - (inventoryCols * inventorySlotSize)) / 2;
  const startY = (canvas.height - (inventoryRows * inventorySlotSize)) / 2;

  for (let i = 0; i < inventorySize; i++) {
    const item = inventory[i];
    const col = i % inventoryCols;
    const row = Math.floor(i / inventoryCols);
    const x = startX + col * inventorySlotSize;
    const y = startY + row * inventorySlotSize;

    // Draw slot
    ctx.strokeRect(x, y, inventorySlotSize, inventorySlotSize);

    // Draw item if exists
    if (item) {
      const img = tileImages[item]; // Forenkling: bruker tileMap for nå
      if (img) {
        ctx.drawImage(img, x + 10, y + 10, inventorySlotSize - 20, inventorySlotSize - 20);
      }
    }
  }

  ctx.fillStyle = "#fff";
  ctx.font = "20px sans-serif";
  ctx.fillText("INVENTORY - Trykk △ for å lukke", startX, startY - 20);
}

function addItemToInventory(itemCode) {
  const index = inventory.findIndex(slot => slot === null);
  if (index !== -1) {
    inventory[index] = itemCode;
  }
}


//================================================================================ GAME LOOP ===================================================

// === Spill-loop ===
function gameLoop() {
  if (gamepadIndex !== null) 
    pollGamepad();

    updatePlayerPosition(); // oppdaterer smooth bevegelse
    drawGame();             // tegner med ny posisjon

    requestAnimationFrame(gameLoop);
}

gameLoop();