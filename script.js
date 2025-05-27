function setLevelBackground(imagePath) {
  const gameArea = document.getElementById('game-area');
  gameArea.style.backgroundImage = `url('${imagePath}')`;
}

// Sett start-bakgrunn (placeholder)
setLevelBackground('images//levels/defaultLevel.png');

let currentLevelIndex = 0;

const player = document.getElementById('player');
const gameArea = document.getElementById('game-area');

let currentDirection = 'right'; // Holder retning
let isRunning = false;

// Sett sprite
function updatePlayerSprite(state, direction) {
  const spritePath = `images/player/default/${state}-${direction}.${state === 'run' ? 'gif' : 'png'}`;
  player.style.backgroundImage = `url('${spritePath}')`;
}

// Gå til klikk-posisjon
function isRestricted(x, y) {
  const level = levels[currentLevelIndex];
  return level.restrictedZones.some(zone =>
    x >= zone.x && x <= zone.x + zone.width &&
    y >= zone.y && y <= zone.y + zone.height
  );
}

function movePlayerTo(x, y) {
    const rect = gameArea.getBoundingClientRect();
    const rawX = x - rect.left;
    const rawY = y - rect.top;

    if (isRestricted(rawX, rawY)) {
    console.log("Kan ikke gå dit – blokkert område.");
    return;
    }

    const playerHeight = player.offsetHeight;
    const targetX = rawX;
    const targetY = rawY - playerHeight;

    const currentX = parseFloat(player.style.left || 0);
    const currentY = parseFloat(player.style.top || '600');
    const dx = targetX - currentX;
    const dy = targetY - currentY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const speed = 0.5;
    const duration = distance / speed;

    const direction = dx < 0 ? 'left' : 'right';
    currentDirection = direction;

    updatePlayerSprite('run', direction);
    isRunning = true;

    player.style.transition = `left ${duration}ms linear, top ${duration}ms linear`;
    player.style.left = `${targetX}px`;
    player.style.top = `${targetY}px`;

    setTimeout(() => {
        updatePlayerSprite('idle', currentDirection);
        isRunning = false;
    }, duration);
}


//=======================================================================LEVELS=======================================================================

const levels = [
  {
    //INDEX 0
    name: "level_1",
    background: "images/levels/defaultLevel.png",
    restrictedZones: [
        {// himmel
            x: 200, y: 500, width: 300, height: 120,
            color: "blue", opacity: 0.3, visible: true
        },
        {// vann
            x: 0, y: 0, width: 1280, height: 180,
            color: "red", opacity: 0.3, visible: true
        },
    ]
  },
  {
    //INDEX 1
    name: "level_2",
    background: "images/levels/defaultLevel2.png",
    restrictedZones: [
      { x: 0, y: 0, width: 1280, height: 150 },
      { x: 600, y: 550, width: 250, height: 150 },
    ]
  }
];

function loadLevel(index) {
  const level = levels[index];
  if (!level) return;

  // Sett bakgrunn
  setLevelBackground(level.background);

  // Lagre aktivt nivå for senere bruk
  currentLevelIndex = index;

    // Fjern gamle soner
  document.querySelectorAll('.restricted-zone').forEach(zone => zone.remove());

  // Legg til visuelle soner om ønsket
  level.restrictedZones.forEach(zone => {
    if (zone.visible) {
      const zoneDiv = document.createElement('div');
      zoneDiv.classList.add('restricted-zone');
      zoneDiv.style.position = 'absolute';
      zoneDiv.style.left = `${zone.x}px`;
      zoneDiv.style.top = `${zone.y}px`;
      zoneDiv.style.width = `${zone.width}px`;
      zoneDiv.style.height = `${zone.height}px`;
      zoneDiv.style.backgroundColor = zone.color || 'red';
      zoneDiv.style.opacity = zone.opacity ?? 0.3;
      zoneDiv.style.pointerEvents = 'none'; // Viktig!
      gameArea.appendChild(zoneDiv);
    }
  });
}

//=======================================================================BOTTOM=======================================================================


// Bare hvis man klikker i spillet, ikke på GUI
gameArea.addEventListener('click', (e) => {
  movePlayerTo(e.clientX, e.clientY);
});

// Start med idle høyre
updatePlayerSprite('idle', currentDirection);

//Startnivå når spillet lastes
loadLevel(0); // Startområde
updatePlayerSprite('idle', currentDirection);
