import * as THREE from "three";
import { NPC_DEFS } from "./npc-data.js";
import { ITEM_DEFS } from "./item-data.js";
import { CONTAINER_DEFS } from "./container-data.js";

const minimapCanvas = document.getElementById("minimap");
const minimapCtx = minimapCanvas.getContext("2d");

const containerWindow = document.getElementById("containerWindow");
const containerTitle = document.getElementById("containerTitle");
const containerGrid = document.getElementById("containerGrid");
const CONTAINER_SIZE = 16;
let activeContainer = null;

minimapCanvas.width = 160;
minimapCanvas.height = 160;

let minimapGround = [];
let minimapWalls = [];
let minimapObjects = [];

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0b0a12);
scene.fog = new THREE.Fog(0x0b0a12, 420, 760);

const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.set(0, 28, 80);

const renderer = new THREE.WebGLRenderer({
  antialias: false
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(1);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.NoToneMapping;
renderer.toneMappingExposure = 0.75;
document.body.appendChild(renderer.domElement);

// Lys
const light = new THREE.AmbientLight(0xffffff, 1);
// Myk horisont / mørk atmosfære
const hemiLight = new THREE.HemisphereLight(
  0x8888aa, // himmel
  0x221811, // bakken
  0.35
);
scene.add(hemiLight);

const TILE_SIZE = 40;
const WALL_HEIGHT = 45;
const PLAYER_RADIUS = 10;
const PLAYER_EYE_HEIGHT = 30;
const NPC_HEIGHT = 46;
const NPC_WIDTH = 28;

const textureLoader = new THREE.TextureLoader();

function loadPixelTexture(path) {
  const texture = textureLoader.load(path);

  texture.colorSpace = THREE.SRGBColorSpace;
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  texture.generateMipmaps = false;

  return texture;
}

const textureCache = {};

function getTexture(path) {
  if (!textureCache[path]) {
    textureCache[path] = loadPixelTexture(path);
  }

  return textureCache[path];
}

const WALL_DEFS = {
  3: {
    height: WALL_HEIGHT
  },

  5: {
    height: WALL_HEIGHT
  },

  12: {
    height: 135
  },

  13: {
    height: 135
  },

};

const tileMaterials = {
  2: new THREE.MeshBasicMaterial({
    map: loadPixelTexture("assets/textures/grass02.png")
  }),

  3: new THREE.MeshBasicMaterial({
    map: loadPixelTexture("assets/textures/mud.png")
  }),

  4: new THREE.MeshBasicMaterial({
    map: loadPixelTexture("assets/textures/water-waves.png")
  }),

  5: new THREE.MeshBasicMaterial({
    map: loadPixelTexture("assets/textures/blackwall.png")
  }),

  6: new THREE.MeshBasicMaterial({
    map: loadPixelTexture("assets/textures/tree.png"),
    transparent: true,
    alphaTest: 0.5,
    side: THREE.DoubleSide
  }),

  12: new THREE.MeshBasicMaterial({
    map: loadPixelTexture("assets/textures/house/plank-wall32x96.png")
  }),

  13: new THREE.MeshBasicMaterial({
    map: loadPixelTexture("assets/textures/house/plank-wall-window32x96.png")
  }),


};

const entityMaterials = {
  npc: new THREE.MeshBasicMaterial({
    map: loadPixelTexture("assets/textures/tree.png"),
    transparent: true,
    alphaTest: 0.5,
    side: THREE.DoubleSide
  }),

  enemy: new THREE.MeshBasicMaterial({
    color: 0xaa2222,
    side: THREE.DoubleSide
  })
};

const floorGeo = new THREE.PlaneGeometry(TILE_SIZE, TILE_SIZE);

let groundGrid = [];
let collisionGrid = [];
let mapWidth = 0;
let mapHeight = 0;

const raycaster = new THREE.Raycaster();
const mouseNdc = new THREE.Vector2();
const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

const player = {
  x: 0,
  z: 120,
  targetX: 0,
  targetZ: 120,
  facingAngle: -Math.PI / 2,
  moving: false,
  mesh: null,
  sprites: NPC_DEFS.villager.sprites,
  currentSpriteDirection: "front"
};

const playerMoveSpeed = 115; // world units per second

let cameraYaw = Math.PI * 0.25;
const cameraDistance = 260;
const cameraHeight = 210;
const cameraLookHeight = 20;

let rotatingCamera = false;

function layerToGrid(layer, width, height) {
  const grid = [];

  for (let y = 0; y < height; y++) {
    const row = [];

    for (let x = 0; x < width; x++) {
      row.push(layer.data[y * width + x]);
    }

    grid.push(row);
  }

  return grid;
}

function tileToWorld(x, y, width, height) {
  return {
    x: (x - width / 2) * TILE_SIZE + TILE_SIZE / 2,
    z: (y - height / 2) * TILE_SIZE + TILE_SIZE / 2
  };
}

function worldToTile(worldX, worldZ) {
  return {
    x: Math.floor(worldX / TILE_SIZE + mapWidth / 2),
    y: Math.floor(worldZ / TILE_SIZE + mapHeight / 2)
  };
}

function isBlocked(worldX, worldZ) {
  const points = [
    [worldX, worldZ],
    [worldX + PLAYER_RADIUS, worldZ],
    [worldX - PLAYER_RADIUS, worldZ],
    [worldX, worldZ + PLAYER_RADIUS],
    [worldX, worldZ - PLAYER_RADIUS],
    [worldX + PLAYER_RADIUS, worldZ + PLAYER_RADIUS],
    [worldX - PLAYER_RADIUS, worldZ - PLAYER_RADIUS],
    [worldX + PLAYER_RADIUS, worldZ - PLAYER_RADIUS],
    [worldX - PLAYER_RADIUS, worldZ + PLAYER_RADIUS],
  ];

  for (const [x, z] of points) {
    const tile = worldToTile(x, z);

    if (
      tile.x < 0 ||
      tile.y < 0 ||
      tile.x >= mapWidth ||
      tile.y >= mapHeight
    ) {
      return true;
    }

    if (collisionGrid[tile.y][tile.x] !== 0) {
      return true;
    }
  }

    const groundTile = getGroundAt(worldX, worldZ);

    if (groundTile === 4) {
    return true; // vann
    }

  return false;
}

function getGroundAt(worldX, worldZ) {
  const tile = worldToTile(worldX, worldZ);

  if (
    tile.x < 0 ||
    tile.y < 0 ||
    tile.x >= mapWidth ||
    tile.y >= mapHeight
  ) {
    return 0;
  }

  return groundGrid[tile.y][tile.x];
}

function tiledPropertiesToObject(properties = []) {
  const result = {};

  for (const prop of properties) {
    result[prop.name] = prop.value;
  }

  return result;
}

function buildTileDefsFromTiledMap(data) {
  const defs = {};

  for (const tileset of data.tilesets || []) {
    const firstgid = tileset.firstgid || 1;

    for (const tile of tileset.tiles || []) {
      const gid = firstgid + tile.id;
      const props = tiledPropertiesToObject(tile.properties);

      defs[gid] = {
        gid,
        localId: tile.id,
        texture: props.texture || null,
        kind: props.kind || null,
        solid: props.solid ?? false,
        height: Number(props.height || 45)
      };
    }
  }

  return defs;
}

const materialCache = {};

function getTileMaterialFromDef(tileDef, fallbackMaterial) {
  if (!tileDef?.texture) {
    return fallbackMaterial;
  }

  const textureName = tileDef.texture;
  const path = `assets/textures/${textureName}.png`;

  if (!materialCache[path]) {
    materialCache[path] = new THREE.MeshBasicMaterial({
      map: getTexture(path)
    });
  }

  return materialCache[path];
}


function createPlayerMesh() {
  if (player.mesh) return;

  const mat = new THREE.MeshBasicMaterial({
    map: getTexture(player.sprites.front),
    color: 0xffffff,
    transparent: true,
    alphaTest: 0.5,
    side: THREE.DoubleSide
  });

  const geo = new THREE.PlaneGeometry(NPC_WIDTH, NPC_HEIGHT);
  const mesh = new THREE.Mesh(geo, mat);

  mesh.position.set(player.x, NPC_HEIGHT / 2, player.z);
  mesh.userData.isBillboard = true;

  scene.add(mesh);
  player.mesh = mesh;
}

function setPlayerPosition(x, z) {
  player.x = x;
  player.z = z;
  player.targetX = x;
  player.targetZ = z;
  player.moving = false;

  if (player.mesh) {
    player.mesh.position.set(player.x, NPC_HEIGHT / 2, player.z);
  }

  updateCameraRotation();
}

async function loadTiledMap(path) {
  const response = await fetch(path);
  const data = await response.json();
  const tileDefs = buildTileDefsFromTiledMap(data);
  console.log("Loaded tileDefs:", tileDefs);

  mapWidth = data.width;
  mapHeight = data.height;

  const groundLayer = data.layers.find(layer => layer.name === "grounds");
  const wallLayer = data.layers.find(layer => layer.name === "walls");
  const objectLayer = data.layers.find(layer => layer.name === "objects");

  const ground = layerToGrid(groundLayer, data.width, data.height);
  groundGrid = ground;
  const walls = layerToGrid(wallLayer, data.width, data.height);

  const objects = objectLayer ? layerToGrid(objectLayer, data.width, data.height) : [];

  minimapGround = ground;
  minimapWalls = walls;
  minimapObjects = objects;

  collisionGrid = walls;

  for (let y = 0; y < data.height; y++) {
    for (let x = 0; x < data.width; x++) {
      const pos = tileToWorld(x, y, data.width, data.height);

      const groundTile = ground[y][x];
      const groundDef = tileDefs[groundTile];
      const groundMat = getTileMaterialFromDef(
        groundDef,
        tileMaterials[groundTile] || tileMaterials[2]
      );

      const floor = new THREE.Mesh(floorGeo, groundMat);
      floor.rotation.x = -Math.PI / 2;
      floor.position.set(pos.x, 0, pos.z);

      floor.userData.worldX = pos.x;
      floor.userData.worldZ = pos.z;
      floor.userData.renderCulled = true;

      scene.add(floor);
      worldRenderObjects.push(floor);

      const wallTile = walls[y][x];

      if (wallTile !== 0) {
        const wallDefFromTiled = tileDefs[wallTile];
        const oldWallDef = WALL_DEFS[wallTile] || { height: WALL_HEIGHT };

        const wallHeight = wallDefFromTiled?.height || oldWallDef.height || WALL_HEIGHT;

        const wallMat = getTileMaterialFromDef(
          wallDefFromTiled,
          tileMaterials[wallTile] || tileMaterials[5]
        );

        const wallGeo = new THREE.BoxGeometry(TILE_SIZE, wallHeight, TILE_SIZE);
        const wall = new THREE.Mesh(wallGeo, wallMat);

        wall.position.set(pos.x, wallHeight / 2, pos.z);

        wall.userData.worldX = pos.x;
        wall.userData.worldZ = pos.z;
        wall.userData.renderCulled = true;

        scene.add(wall);
        worldRenderObjects.push(wall);
      }

      const objectTile = objects[y]?.[x] || 0;

        if (objectTile !== 0) {
            const objectMat = tileMaterials[objectTile] || tileMaterials[6];

            const spriteGeo = new THREE.PlaneGeometry(TILE_SIZE, TILE_SIZE * 1.5);
            const object = new THREE.Mesh(spriteGeo, objectMat);

            object.position.set(pos.x, TILE_SIZE * 0.75, pos.z);
            object.userData.isBillboard = true;

            object.userData.worldX = pos.x;
            object.userData.worldZ = pos.z;
            object.userData.renderCulled = true;

            scene.add(object);
            worldRenderObjects.push(object);
        }
    }
  }

  setPlayerPosition(0, 120);
  createPlayerMesh();
  updateCameraRotation();

  spawnNpc("villager", 40, 40);
  spawnNpc("snake", -80, 80);
  spawnContainers();
}

// Player/camera
const keys = {};
let yaw = 0;
let pitch = 0;

const mouseSensitivity = 0.0025;
const maxPitch = 1.15;

const walkSpeed = 2.0;
const runSpeed = 3.4;

const maxStamina = 100;
let stamina = maxStamina;

const playerMaxHealth = 100;
let playerHealth = playerMaxHealth;
let playerDead = false;

const playerBaseStrength = 1;

let isAttacking = false;
let lastAttackTime = 0;

const attackDuration = 280;
const attackCooldown = 650;

const playerAttackRange = 60;
const playerAttackAngle = 0.35;

let activeCombatEnemy = null;
const enemyForgetRange = 180;

const staminaDrainPerSecond = 28;
const staminaRegenPerSecond = 22;

let staminaRegenDelay = 0;
let lastMoveTime = performance.now();

const dialogueBox = document.getElementById("dialogueBox");
const dialogueName = document.getElementById("dialogueName");
const dialogueText = document.getElementById("dialogueText");

const inventoryWindow = document.getElementById("inventoryWindow");
const inventoryGrid = document.getElementById("inventoryGrid");
const inventoryTooltip = document.getElementById("inventoryTooltip");
const itemContextMenu = document.getElementById("itemContextMenu");

const equipmentWindow = document.getElementById("equipmentWindow");
const equipmentSlots = document.querySelectorAll(".equipment-slot");

const pauseMenu = document.getElementById("pauseMenu");
const saveGameButton = document.getElementById("saveGameButton");
const loadGameButton = document.getElementById("loadGameButton");
const closeMenuButton = document.getElementById("closeMenuButton");
const saveSlotPanel = document.getElementById("saveSlotPanel");
const saveSlotTitle = document.getElementById("saveSlotTitle");
const saveSlots = document.getElementById("saveSlots");

const weaponView = document.getElementById("weaponView");
const weaponViewImage = document.getElementById("weaponViewImage");

const damageFlash = document.getElementById("damageFlash");

let pauseMenuOpen = false;
let saveSlotMode = "save";

const INVENTORY_WIDTH = 4;
const INVENTORY_HEIGHT = 6;
const INVENTORY_SIZE = INVENTORY_WIDTH * INVENTORY_HEIGHT;

const inventory = new Array(INVENTORY_SIZE).fill(null);

const equipment = {
  weapon: null,
  head: null,
  chest: null,
  legs: null,
  feet: null
};

inventory[2] = { itemId: "cloth_hat", amount: 1 };
inventory[3] = { itemId: "cloth_shirt", amount: 1 };
inventory[4] = { itemId: "cloth_pants", amount: 1 };
inventory[5] = { itemId: "cloth_shoes", amount: 1 };

inventory[0] = { itemId: "rusty_sword", amount: 1 };
inventory[1] = { itemId: "apple", amount: 5 };

let inventoryOpen = false;

let activeDialogue = null;
let dialogueIndex = 0;

document.addEventListener("keydown", e => {
  const key = e.key.toLowerCase();

  if (key === "tab") {
    e.preventDefault();
    toggleInventory();
    return;
  }

  if (key === "h") { //fjernes
    damagePlayer(10);
    return;
  }

  if (key === "j") { //fjernes
    healPlayer(10);
    return;
  }

  if (key === "e") {
    if (activeDialogue) {
      advanceDialogue();
      return;
    }

    const target = getLookTargetEntity();
    console.log("Look target:", target);

  if (target) {
    interactWithEntity(target);
    return;
    }
  }

  keys[key] = true;
});

document.addEventListener("click", e => {
  if (!e.target.closest("#itemContextMenu")) {
    closeItemContextMenu();
  }
});

document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    e.preventDefault();

    closeItemContextMenu();

    if (activeDialogue) {
      closeDialogue();
      return;
    }

    togglePauseMenu();
  }
});

document.addEventListener("keyup", e => {
  keys[e.key.toLowerCase()] = false;
});

saveGameButton.addEventListener("click", () => {
  showSaveSlots("save");
});

loadGameButton.addEventListener("click", () => {
  showSaveSlots("load");
});

closeMenuButton.addEventListener("click", () => {
  closePauseMenu();
});

document.addEventListener("contextmenu", e => {
  e.preventDefault();
});

document.addEventListener("mousedown", e => {
  if (isUiClick(e.target)) return;

  if (e.button === 2) {
    rotatingCamera = true;
    return;
  }

  if (e.button === 0) {
    setPlayerDestinationFromMouse(e);
  }
});

document.addEventListener("mouseup", e => {
  if (e.button === 2) {
    rotatingCamera = false;
  }
});

document.addEventListener("mousemove", e => {
  if (!rotatingCamera) return;

  cameraYaw -= e.movementX * 0.006;
  updateCameraRotation();
});

function isUiClick(target) {
  return Boolean(
    target.closest("#hud") ||
    target.closest("#minimap") ||
    target.closest("#inventoryWindow") ||
    target.closest("#equipmentWindow") ||
    target.closest("#containerWindow") ||
    target.closest("#itemContextMenu") ||
    target.closest("#pauseMenu") ||
    target.closest("#dialogueBox")
  );
}

function setPlayerDestinationFromMouse(e) {
  if (playerDead || inventoryOpen || pauseMenuOpen || activeDialogue) return;

  mouseNdc.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouseNdc.y = -(e.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouseNdc, camera);

  const hit = new THREE.Vector3();

  if (!raycaster.ray.intersectPlane(groundPlane, hit)) {
    return;
  }

  if (isBlocked(hit.x, hit.z)) {
    return;
  }

  player.targetX = hit.x;
  player.targetZ = hit.z;
  player.moving = true;
}

function renderHeldWeapon() { //fjernes ???

  weaponView.classList.add("hidden");
  weaponViewImage.removeAttribute("src");

  const weaponEntry = equipment.weapon;

  if (!weaponEntry) {
    weaponView.classList.add("hidden");
    weaponViewImage.removeAttribute("src");
    return;
  }

  const item = ITEM_DEFS[weaponEntry.itemId];

  if (!item || !item.heldSprite) {
    weaponView.classList.add("hidden");
    weaponViewImage.removeAttribute("src");
    return;
  }

  weaponViewImage.src = item.heldSprite;
  weaponView.classList.remove("hidden");
}

function randomInt(min, max) {
  return Math.floor(min + Math.random() * (max - min + 1));
}

function rollLoot(lootTable) {
  const loot = [];

  for (const entry of lootTable || []) {
    const chance = entry.chance ?? 1;

    if (Math.random() > chance) {
      continue;
    }

    const amount = entry.amount ?? randomInt(entry.minAmount ?? 1, entry.maxAmount ?? 1);

    if (amount <= 0) continue;

    loot.push({
      itemId: entry.itemId,
      amount
    });
  }

  return loot;
}

function performPlayerAttack() {
  const now = performance.now();

  if (isAttacking) return;
  if (now - lastAttackTime < attackCooldown) return;

  const weaponEntry = equipment.weapon;

  if (!weaponEntry) {
    console.log("You need a weapon to attack.");
    return;
  }

  const weapon = ITEM_DEFS[weaponEntry.itemId];

  if (!weapon) return;

  isAttacking = true;
  lastAttackTime = now;

  playWeaponAttackAnimation();

  const target = getPlayerAttackTargetEnemy();

  if (target) {
    const damage = getPlayerStrength();

    damageEntity(target, damage);

    if (target.type === "enemy" && target.hostile && target.hp > 0) {
      activeCombatEnemy = target;
    }

    console.log(
      `You hit ${target.name} for ${damage}. Enemy HP: ${Math.max(0, target.hp)}/${target.maxHp}`
    );
  } else {
    console.log(`You swing ${weapon.name}, but hit nothing.`);
  }

  setTimeout(() => {
    isAttacking = false;
  }, attackDuration);
}

function playWeaponAttackAnimation() {
  weaponViewImage.classList.remove("weapon-attacking");

  // Tving browseren til å restarte animasjonen
  void weaponViewImage.offsetWidth;

  weaponViewImage.classList.add("weapon-attacking");

  setTimeout(() => {
    weaponViewImage.classList.remove("weapon-attacking");
  }, attackDuration);
}

function getPlayerAttackTargetEnemy() {
  let bestEnemy = null;
  let bestScore = Infinity;

  const forwardX = -Math.sin(yaw);
  const forwardZ = -Math.cos(yaw);

  for (const entity of entities) {
    if (!entity.hostile) continue;
    if (entity.hp <= 0) continue;

    const dx = entity.x - player.x;
    const dz = entity.z - player.z;

    const distance = Math.sqrt(dx * dx + dz * dz);

    if (distance > playerAttackRange) continue;

    const dirX = dx / distance;
    const dirZ = dz / distance;

    const dot = forwardX * dirX + forwardZ * dirZ;
    const angle = Math.acos(dot);

    if (angle < playerAttackAngle && angle < bestScore) {
      bestScore = angle;
      bestEnemy = entity;
    }
  }

  return bestEnemy;
}

function damageEntity(entity, amount) {
  if (!entity) return;
  if (entity.hp <= 0) return;

  entity.hp -= amount;

  flashEntityDamage(entity);

  if (entity.hp <= 0) {
    entity.hp = 0;
    killEnemy(entity);
  }
}

function flashEntityDamage(entity) {
  if (!entity?.mesh?.material) return;

  const material = entity.mesh.material;

  material.color.set(0xff4444);

  setTimeout(() => {
    if (!entity.mesh || !entity.mesh.material) return;

    entity.mesh.material.color.set(0xffffff);
  }, 120);
}

function killEnemy(entity) {
  console.log(`${entity.name} died.`);

  if (activeCombatEnemy === entity) {
    activeCombatEnemy = null;
  }

  convertEnemyToGravestone(entity);
}

function convertEnemyToGravestone(entity) {
  const graveSprite = entity.graveSprite || "assets/creatures/corps/gravestone/gravestone.png";
  const graveWidth = entity.graveWidth || 38;
  const graveHeight = entity.graveHeight || 48;

  if (entity.mesh) {
    scene.remove(entity.mesh);
  }

  const mat = new THREE.MeshBasicMaterial({
    map: getTexture(graveSprite),
    color: 0xffffff,
    transparent: true,
    alphaTest: 0.5,
    side: THREE.DoubleSide
  });

  const geo = new THREE.PlaneGeometry(graveWidth, graveHeight);
  const mesh = new THREE.Mesh(geo, mat);

  mesh.position.set(entity.x, graveHeight / 2, entity.z);
  mesh.userData.isBillboard = true;

  scene.add(mesh);

  const lootContents = rollLoot(entity.loot || []);

  entity.type = "container";
  entity.containerType = "grave";
  entity.name = `${entity.name} grave`;
  entity.hp = 1;
  entity.maxHp = 1;
  entity.hostile = false;
  entity.interactable = true;
  entity.movement = { mode: "idle" };
  entity.attackDamage = 0;
  entity.attackRange = 0;
  entity.attackCooldown = 0;
  entity.lastEnemyAttackTime = 0;
  entity.dialogue = [];
  entity.sprites = null;
  entity.contents = normalizeContainerContents(lootContents);
  entity.openSprite = entity.graveOpenSprite || "assets/ui/gravestone-loot.png";
  entity.mesh = mesh;
}

function getPlayerStrength() {
  let totalStrength = playerBaseStrength;

  for (const slot of Object.keys(equipment)) {
    const equippedEntry = equipment[slot];
    if (!equippedEntry) continue;

    const item = ITEM_DEFS[equippedEntry.itemId];
    if (!item) continue;

    totalStrength += item.strength || 0;
  }

  return totalStrength;
}

function updatePlayerStatsUi() {
  playerStatsLine.textContent = `STR: ${getPlayerStrength()}`;
}

function openDialogue(entity) {
  if (!entity.dialogue || entity.dialogue.length === 0) return;

  activeDialogue = entity;
  dialogueIndex = 0;

  dialogueName.textContent = entity.name;
  dialogueText.textContent = entity.dialogue[dialogueIndex];

  dialogueBox.classList.remove("hidden");
}

function updateEnemyCombat() {
  if (!activeCombatEnemy) return;
  if (playerDead) return;

  const enemy = activeCombatEnemy;

  if (enemy.type !== "enemy" || !enemy.hostile) {
    activeCombatEnemy = null;
    return;
  }

  if (!entities.includes(enemy)) {
    activeCombatEnemy = null;
    return;
  }

  if (enemy.hp <= 0) {
    activeCombatEnemy = null;
    return;
  }

  const dx = enemy.x - player.x;
  const dz = enemy.z - player.z;
  const distance = Math.sqrt(dx * dx + dz * dz);

  if (distance > enemyForgetRange) {
    console.log(`${enemy.name} stops fighting.`);
    activeCombatEnemy = null;
    return;
  }

  if (distance > enemy.attackRange) {
    return;
  }

  const now = performance.now();

  if (now - enemy.lastEnemyAttackTime < enemy.attackCooldown) {
    return;
  }

  enemy.lastEnemyAttackTime = now;

  damagePlayer(enemy.attackDamage);

  console.log(
    `${enemy.name} hits you for ${enemy.attackDamage}. HP: ${playerHealth}/${playerMaxHealth}`
  );
}

function closeDialogue() {
  activeDialogue = null;
  dialogueIndex = 0;
  dialogueBox.classList.add("hidden");
}

function advanceDialogue() {
  if (!activeDialogue) return;

  dialogueIndex++;

  if (dialogueIndex >= activeDialogue.dialogue.length) {
    closeDialogue();
    return;
  }

  dialogueText.textContent = activeDialogue.dialogue[dialogueIndex];
}

function interactWithEntity(entity) {
  if (entity.type === "container") {
    openContainer(entity);
    return;
  }

  openDialogue(entity);
}

function toggleInventory() {
  inventoryOpen = !inventoryOpen;

  if (inventoryOpen) {
    renderInventory();
    renderEquipment();

    inventoryWindow.classList.remove("hidden");
    equipmentWindow.classList.remove("hidden");

  } else {
    inventoryWindow.classList.add("hidden");
    equipmentWindow.classList.add("hidden");
    inventoryTooltip.classList.add("hidden");
    itemContextMenu.classList.add("hidden");
    closeContainer();

  }
}

function renderInventory() {
  inventoryGrid.innerHTML = "";

  for (let i = 0; i < INVENTORY_SIZE; i++) {
    const slot = document.createElement("div");
    slot.className = "inventory-slot";
    slot.dataset.slotIndex = i;

    slot.addEventListener("dragover", e => {
      e.preventDefault();
      slot.classList.add("drag-over");
    });

    slot.addEventListener("dragleave", () => {
      slot.classList.remove("drag-over");
    });

    slot.addEventListener("drop", e => {
      e.preventDefault();
      slot.classList.remove("drag-over");

      const rawPayload = e.dataTransfer.getData("application/json");
      if (!rawPayload) return;

      const payload = JSON.parse(rawPayload);

      // Inventory drag/drop skal bare flytte items inni inventory.
      // Chest <-> inventory skjer kun med Shift + klikk.
      if (payload.source !== "inventory") return;

      handleItemDrop(payload, { source: "inventory", index: i });
    });

    const entry = inventory[i];

    if (entry) {
      const item = ITEM_DEFS[entry.itemId];

      const img = document.createElement("img");
      img.className = "inventory-item";
      img.src = item.icon;
      img.alt = item.name;
      img.draggable = true;

      img.addEventListener("click", e => {
        if (e.shiftKey && activeContainer) {
          quickTransferItem("inventory", i);
        }
      });

      img.addEventListener("dragstart", e => {
        e.dataTransfer.setData("application/json", JSON.stringify({
          source: "inventory",
          index: i
        }));
        e.dataTransfer.effectAllowed = "move";
        inventoryTooltip.classList.add("hidden");
      });

      img.addEventListener("contextmenu", e => {
        e.preventDefault();
        e.stopPropagation();

        inventoryTooltip.classList.add("hidden");
        openItemContextMenu(i, e.clientX, e.clientY);
      });

      img.addEventListener("mouseenter", e => {
        showItemTooltip(item, e.clientX, e.clientY);
      });

      img.addEventListener("mousemove", e => {
        moveItemTooltip(e.clientX, e.clientY);
      });

      img.addEventListener("mouseleave", () => {
        inventoryTooltip.classList.add("hidden");
      });

      slot.appendChild(img);

      if (item.stackable && entry.amount > 1) {
        const count = document.createElement("div");
        count.className = "inventory-count";
        count.textContent = entry.amount;
        slot.appendChild(count);
      }
    }

    inventoryGrid.appendChild(slot);
  }
}

function moveInventoryItem(fromIndex, toIndex) {
  if (fromIndex === toIndex) return;
  if (fromIndex < 0 || fromIndex >= INVENTORY_SIZE) return;
  if (toIndex < 0 || toIndex >= INVENTORY_SIZE) return;

  const fromItem = inventory[fromIndex];
  const toItem = inventory[toIndex];

  if (!fromItem) return;

  inventory[toIndex] = fromItem;
  inventory[fromIndex] = toItem;

  renderInventory();
}

function openItemContextMenu(slotIndex, x, y) {
  const entry = inventory[slotIndex];
  if (!entry) return;

  const item = ITEM_DEFS[entry.itemId];
  const amounts = getDestroyAmounts(entry.amount);

  itemContextMenu.innerHTML = "";

  if (item.equipSlot) {
    const equipOption = document.createElement("div");
    equipOption.className = "item-context-option";
    equipOption.textContent = "Equip";

    equipOption.addEventListener("click", () => {
      equipItemFromInventory(slotIndex);
      closeItemContextMenu();
    });

    itemContextMenu.appendChild(equipOption);
  }

  const title = document.createElement("div");
  title.className = "item-context-option";
  title.textContent = item.name;
  title.style.opacity = "0.7";
  title.style.cursor = "default";
  itemContextMenu.appendChild(title);

  for (const amount of amounts) {
    const option = document.createElement("div");
    option.className = "item-context-option";
    option.textContent = `Destroy ${amount}`;

    option.addEventListener("click", () => {
      destroyInventoryItem(slotIndex, amount);
      closeItemContextMenu();
    });

    itemContextMenu.appendChild(option);
  }

  itemContextMenu.style.left = `${x}px`;
  itemContextMenu.style.top = `${y}px`;
  itemContextMenu.classList.remove("hidden");
}

function getDestroyAmounts(stackAmount) {
  const steps = [1, 5, 20, 50, 100, 500];
  return steps.filter(amount => stackAmount >= amount);
}

function destroyInventoryItem(slotIndex, amount) {
  const entry = inventory[slotIndex];
  if (!entry) return;

  entry.amount -= amount;

  if (entry.amount <= 0) {
    inventory[slotIndex] = null;
  }

  renderInventory();
}

function closeItemContextMenu() {
  itemContextMenu.classList.add("hidden");
}

function showItemTooltip(item, x, y) {
  inventoryTooltip.innerHTML = `
    <strong>${item.name}</strong><br>
    <span>${item.type}</span><br>
    <small>${item.description}</small>
  `;

  moveItemTooltip(x, y);
  inventoryTooltip.classList.remove("hidden");
}

function moveItemTooltip(x, y) {
  inventoryTooltip.style.left = `${x + 14}px`;
  inventoryTooltip.style.top = `${y + 14}px`;
}

function normalizeContainerContents(contents) {
  const slots = new Array(CONTAINER_SIZE).fill(null);

  for (let i = 0; i < Math.min(contents.length, CONTAINER_SIZE); i++) {
    if (contents[i]) {
      slots[i] = { ...contents[i] };
    }
  }

  return slots;
}

function spawnContainer(containerId) {
  const def = CONTAINER_DEFS[containerId];

  if (!def) {
    console.warn("Unknown container id:", containerId);
    return null;
  }

  const mat = new THREE.MeshBasicMaterial({
    map: getTexture(def.sprite),
    transparent: true,
    alphaTest: 0.5,
    side: THREE.DoubleSide
  });

  const geo = new THREE.PlaneGeometry(def.width || 34, def.height || 28);
  const mesh = new THREE.Mesh(geo, mat);

  mesh.position.set(def.x, (def.height || 28) / 2, def.z);
  mesh.userData.isBillboard = true;

  scene.add(mesh);

  return createEntity({
    id: def.id,
    type: "container",
    containerType: def.type,
    name: def.name,
    x: def.x,
    z: def.z,
    hp: 1,
    movement: { mode: "idle" },
    interactable: true,
    hostile: false,
    dialogue: [],
    mesh,
    contents: normalizeContainerContents(def.contents || []),
    openSprite: def.openSprite || null
  });
}

function spawnContainers() {
  for (const containerId of Object.keys(CONTAINER_DEFS)) {
    spawnContainer(containerId);
  }
}

function openContainer(container) {
  activeContainer = container;

  containerTitle.textContent = container.name;

  if (container.openSprite) {
    containerWindow.style.backgroundImage = `url("${container.openSprite}")`;
  } else {
    containerWindow.style.backgroundImage = "";
  }

  containerWindow.classList.remove("hidden");

  if (!inventoryOpen) {
    inventoryOpen = true;
    inventoryWindow.classList.remove("hidden");
  }

  renderInventory();
  renderContainer();
}

function closeContainer() {
  activeContainer = null;
  containerWindow.classList.add("hidden");
}

function renderContainer() {
  if (!activeContainer) return;

  containerGrid.innerHTML = "";

  for (let i = 0; i < CONTAINER_SIZE; i++) {
    const slot = document.createElement("div");
    slot.className = "container-slot";

    const entry = activeContainer.contents[i];

    if (entry) {
      const item = ITEM_DEFS[entry.itemId];

      const img = document.createElement("img");
      img.className = "inventory-item";
      img.src = item.icon;
      img.alt = item.name;
      img.draggable = false;

      img.addEventListener("click", e => {
        if (e.shiftKey) {
          quickTransferItem("container", i);
        }
      });

      img.addEventListener("mouseenter", e => {
        showItemTooltip(item, e.clientX, e.clientY);
      });

      img.addEventListener("mousemove", e => {
        moveItemTooltip(e.clientX, e.clientY);
      });

      img.addEventListener("mouseleave", () => {
        inventoryTooltip.classList.add("hidden");
      });

      slot.appendChild(img);

      if (item.stackable && entry.amount > 1) {
        const count = document.createElement("div");
        count.className = "inventory-count";
        count.textContent = entry.amount;
        slot.appendChild(count);
      }
    }

    containerGrid.appendChild(slot);
  }
}

function handleItemDrop(from, to) {
  if (!from || !to) return;
  if (from.source === to.source && from.index === to.index) return;

  const fromArray = getItemArrayBySource(from.source);
  const toArray = getItemArrayBySource(to.source);

  if (!fromArray || !toArray) return;

  const fromItem = fromArray[from.index];
  const toItem = toArray[to.index];

  if (!fromItem) return;

  // Hvis itemene er like og stackable slås de sammen
  if (canStackItems(fromItem, toItem)) {
    toItem.amount += fromItem.amount;
    fromArray[from.index] = null;
  } else {
    // Hvis ikke stackable, bytt plass som før
    fromArray[to.index] = fromItem;
    fromArray[from.index] = toItem || null;
  }

  renderInventory();

  if (activeContainer) {
    renderContainer();
  }
}

function getItemArrayBySource(source) {
  if (source === "inventory") {
    return inventory;
  }

  if (source === "container") {
    return activeContainer?.contents || null;
  }

  return null;
}

function canStackItems(a, b) {
  if (!a || !b) return false;
  if (a.itemId !== b.itemId) return false;

  const itemDef = ITEM_DEFS[a.itemId];
  return itemDef?.stackable === true;
}

function addItemToArray(targetArray, itemToAdd) {
  if (!targetArray || !itemToAdd) return false;

  const itemDef = ITEM_DEFS[itemToAdd.itemId];

  if (itemDef?.stackable) {
    const existingStackIndex = targetArray.findIndex(slot =>
      slot && slot.itemId === itemToAdd.itemId
    );

    if (existingStackIndex !== -1) {
      targetArray[existingStackIndex].amount += itemToAdd.amount;
      return true;
    }
  }

  const emptyIndex = targetArray.findIndex(slot => slot === null);

  if (emptyIndex !== -1) {
    targetArray[emptyIndex] = itemToAdd;
    return true;
  }

  return false;
}

function quickTransferItem(fromSource, fromIndex) {
  const fromArray = getItemArrayBySource(fromSource);
  if (!fromArray) return;

  const item = fromArray[fromIndex];
  if (!item) return;

  let toSource = null;

  if (fromSource === "container") {
    toSource = "inventory";
  } else if (fromSource === "inventory" && activeContainer) {
    toSource = "container";
  }

  if (!toSource) return;

  const toArray = getItemArrayBySource(toSource);
  if (!toArray) return;

  const moved = addItemToArray(toArray, item);

  if (!moved) {
    console.log("No free slots in", toSource);
    return;
  }

  fromArray[fromIndex] = null;

  renderInventory();

  if (activeContainer) {
    renderContainer();
  }
}

function equipItemFromInventory(inventoryIndex) {
  const entry = inventory[inventoryIndex];
  if (!entry) return;

  const item = ITEM_DEFS[entry.itemId];
  if (!item?.equipSlot) return;

  const slot = item.equipSlot;

  if (!equipment.hasOwnProperty(slot)) {
    console.warn("Unknown equipment slot:", slot);
    return;
  }

  const currentlyEquipped = equipment[slot];

  equipment[slot] = entry;
  inventory[inventoryIndex] = currentlyEquipped || null;

  renderInventory();
  renderEquipment();
  renderHeldWeapon();
  updatePlayerStatsUi();
}

function unequipItem(slot) {
  const equippedItem = equipment[slot];
  if (!equippedItem) return;

  const emptyIndex = inventory.findIndex(item => item === null);

  if (emptyIndex === -1) {
    console.log("Inventory is full.");
    return;
  }

  inventory[emptyIndex] = equippedItem;
  equipment[slot] = null;

  renderInventory();
  renderEquipment();
  renderHeldWeapon();
  updatePlayerStatsUi();
}

function renderEquipment() {
  for (const slotElement of equipmentSlots) {
    const slot = slotElement.dataset.equipSlot;
    const entry = equipment[slot];

    slotElement.innerHTML = "";

    if (!entry) continue;

    const item = ITEM_DEFS[entry.itemId];

    const img = document.createElement("img");
    img.className = "equipment-item";
    img.src = item.icon;
    img.alt = item.name;

    img.addEventListener("mouseenter", e => {
      showItemTooltip(item, e.clientX, e.clientY);
    });

    img.addEventListener("mousemove", e => {
      moveItemTooltip(e.clientX, e.clientY);
    });

    img.addEventListener("mouseleave", () => {
      inventoryTooltip.classList.add("hidden");
    });

    img.addEventListener("click", () => {
      unequipItem(slot);
    });

    slotElement.appendChild(img);
  }
}

function getEquipmentSlotLabel(slot) {
  if (slot === "weapon") return "Weapon";
  if (slot === "head") return "Head";
  if (slot === "chest") return "Chest";
  if (slot === "legs") return "Pants";
  if (slot === "feet") return "Shoes";
  return slot;
}

function getLookTargetEntity() {
  const maxDistance = 70;

  let bestEntity = null;
  let bestDistance = Infinity;

  for (const entity of entities) {
    if (!entity.interactable) continue;

    const dx = entity.x - player.x;
    const dz = entity.z - player.z;

    const distance = Math.sqrt(dx * dx + dz * dz);

    if (distance > maxDistance) continue;

    if (distance < bestDistance) {
      bestDistance = distance;
      bestEntity = entity;
    }
  }

  return bestEntity;
}

const SAVE_VERSION = 1;
const SAVE_SLOT_COUNT = 3;
const SAVE_KEY_PREFIX = "voidquest_save_slot_";

function togglePauseMenu() {
  if (pauseMenuOpen) {
    closePauseMenu();
  } else {
    openPauseMenu();
  }
}

function openPauseMenu() {
  pauseMenuOpen = true;
  pauseMenu.classList.remove("hidden");
  saveSlotPanel.classList.add("hidden");

}

function closePauseMenu() {
  pauseMenuOpen = false;
  pauseMenu.classList.add("hidden");
  saveSlotPanel.classList.add("hidden");

}

function showSaveSlots(mode) {
  saveSlotMode = mode;
  saveSlotPanel.classList.remove("hidden");
  saveSlotTitle.textContent = mode === "save" ? "Save to slot" : "Load from slot";

  renderSaveSlots();
}

function renderSaveSlots() {
  saveSlots.innerHTML = "";

  for (let i = 1; i <= SAVE_SLOT_COUNT; i++) {
    const button = document.createElement("button");
    button.className = "save-slot-button";

    const saveData = getSaveSlotData(i);

    if (saveData) {
      const date = new Date(saveData.savedAt);
      button.innerHTML = `
        Slot ${i}
        <span class="save-slot-meta">
          ${date.toLocaleString()} | x:${Math.round(saveData.player.x)} z:${Math.round(saveData.player.z)}
        </span>
      `;
    } else {
      button.textContent = `Slot ${i} - Empty`;
    }

    button.addEventListener("click", () => {
      if (saveSlotMode === "save") {
        saveGameToSlot(i);
      } else {
        loadGameFromSlot(i);
      }

      renderSaveSlots();
    });

    saveSlots.appendChild(button);
  }
}

function getSaveSlotKey(slotNumber) {
  return `${SAVE_KEY_PREFIX}${slotNumber}`;
}

function getSaveSlotData(slotNumber) {
  const raw = localStorage.getItem(getSaveSlotKey(slotNumber));

  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch (error) {
    console.warn("Could not parse save slot:", slotNumber, error);
    return null;
  }
}

function cloneSlotArray(slotArray) {
  return slotArray.map(slot => {
    if (!slot) return null;
    return { ...slot };
  });
}

function buildContainerSaveData() {
  const containerData = {};

  for (const entity of entities) {
    if (entity.type !== "container") continue;

    containerData[entity.id] = {
      contents: cloneSlotArray(entity.contents || [])
    };
  }

  return containerData;
}

function buildSaveData() {
  return {
    version: SAVE_VERSION,
    savedAt: new Date().toISOString(),

    player: {
      x: player.x,
      z: player.z,
      targetX: player.targetX,
      targetZ: player.targetZ,
      cameraYaw,
      facingAngle: player.facingAngle,
      health: playerHealth,
      maxHealth: playerMaxHealth,
      dead: playerDead
    },

    inventory: cloneSlotArray(inventory),

    equipment: {
      weapon: equipment.weapon ? { ...equipment.weapon } : null,
      head: equipment.head ? { ...equipment.head } : null,
      chest: equipment.chest ? { ...equipment.chest } : null,
      legs: equipment.legs ? { ...equipment.legs } : null,
      feet: equipment.feet ? { ...equipment.feet } : null
    },

    containers: buildContainerSaveData()
  };
}

function saveGameToSlot(slotNumber) {
  const saveData = buildSaveData();

  localStorage.setItem(
    getSaveSlotKey(slotNumber),
    JSON.stringify(saveData)
  );

  console.log("Saved game to slot", slotNumber, saveData);
}

function loadGameFromSlot(slotNumber) {
  const saveData = getSaveSlotData(slotNumber);

  if (!saveData) {
    console.log("No save data in slot", slotNumber);
    return;
  }

  applySaveData(saveData);
  closePauseMenu();

  console.log("Loaded game from slot", slotNumber, saveData);
}

function applySaveData(saveData) {
  if (!saveData) return;

  if (saveData.player) {
    setPlayerPosition(
      saveData.player.x ?? player.x,
      saveData.player.z ?? player.z
    );

    player.targetX = saveData.player.targetX ?? player.x;
    player.targetZ = saveData.player.targetZ ?? player.z;
    player.facingAngle = saveData.player.facingAngle ?? player.facingAngle;
    cameraYaw = saveData.player.cameraYaw ?? cameraYaw;

    updatePlayerSpriteDirection();
    updateCameraRotation();

    playerHealth = saveData.player.health ?? playerHealth;
    playerDead = saveData.player.dead ?? false;

    updateHealthBar();
  }

  if (Array.isArray(saveData.inventory)) {
    for (let i = 0; i < INVENTORY_SIZE; i++) {
      inventory[i] = saveData.inventory[i] ? { ...saveData.inventory[i] } : null;
    }
  }

  if (saveData.equipment) {
    equipment.weapon = saveData.equipment.weapon ? { ...saveData.equipment.weapon } : null;
    equipment.head = saveData.equipment.head ? { ...saveData.equipment.head } : null;
    equipment.chest = saveData.equipment.chest ? { ...saveData.equipment.chest } : null;
    equipment.legs = saveData.equipment.legs ? { ...saveData.equipment.legs } : null;
    equipment.feet = saveData.equipment.feet ? { ...saveData.equipment.feet } : null;
  }

  if (saveData.containers) {
    applyContainerSaveData(saveData.containers);
  }

  renderInventory();
  renderEquipment();
  renderHeldWeapon();
  updatePlayerStatsUi();

  if (activeContainer) {
    renderContainer();
  }
}

function applyContainerSaveData(containerSaveData) {
  for (const entity of entities) {
    if (entity.type !== "container") continue;

    const savedContainer = containerSaveData[entity.id];

    if (!savedContainer) continue;

    entity.contents = normalizeContainerContents(savedContainer.contents || []);
  }
}

function updateCameraRotation() {
  const offsetX = Math.sin(cameraYaw) * cameraDistance;
  const offsetZ = Math.cos(cameraYaw) * cameraDistance;

  camera.position.set(
    player.x + offsetX,
    cameraHeight,
    player.z + offsetZ
  );

  camera.lookAt(player.x, cameraLookHeight, player.z);
}

function movePlayer() {
  const now = performance.now();
  const deltaSeconds = Math.min((now - lastMoveTime) / 1000, 0.1);
  lastMoveTime = now;

  if (playerDead || activeDialogue || inventoryOpen || pauseMenuOpen) {
    updateCameraRotation();
    return;
  }

  const dx = player.targetX - player.x;
  const dz = player.targetZ - player.z;
  const distance = Math.sqrt(dx * dx + dz * dz);

  if (distance > 2) {
    const step = Math.min(playerMoveSpeed * deltaSeconds, distance);
    const dirX = dx / distance;
    const dirZ = dz / distance;

    const nextX = player.x + dirX * step;
    const nextZ = player.z + dirZ * step;

    player.facingAngle = Math.atan2(dirZ, dirX);

    if (!isBlocked(nextX, player.z)) {
      player.x = nextX;
    }

    if (!isBlocked(player.x, nextZ)) {
      player.z = nextZ;
    }

    player.moving = true;
  } else {
    player.x = player.targetX;
    player.z = player.targetZ;
    player.moving = false;
  }

  if (player.mesh) {
    player.mesh.position.set(player.x, NPC_HEIGHT / 2, player.z);
  }
  stamina = Math.min(stamina, maxStamina);
  updateStaminaBar();

  updatePlayerSpriteDirection();
  updateCameraRotation();
}

function updateStaminaBar() {
  const percent = Math.max(0, Math.min(100, (stamina / maxStamina) * 100));
  staminaBarInner.style.width = `${percent}%`;
}

function updateHealthBar() {
  const percent = Math.max(0, Math.min(100, (playerHealth / playerMaxHealth) * 100));
  healthBarInner.style.width = `${percent}%`;
}

function flashPlayerDamage() {
  damageFlash.classList.remove("damage-flash-active");

  // Tving browseren til å starte animasjonen på nytt
  void damageFlash.offsetWidth;

  damageFlash.classList.add("damage-flash-active");
}

function damagePlayer(amount) {
  if (playerDead) return;

  playerHealth -= amount;
  playerHealth = Math.max(0, playerHealth);

  flashPlayerDamage();
  updateHealthBar();

  if (playerHealth <= 0) {
    killPlayer();
  }
}

function healPlayer(amount) {
  if (playerDead) return;

  playerHealth += amount;
  playerHealth = Math.min(playerHealth, playerMaxHealth);

  updateHealthBar();
}

function killPlayer() {
  playerDead = true;
  playerHealth = 0;
  updateHealthBar();

  console.log("Player died.");

  // Midlertidig dødslogikk.
  // Senere kan dette åpne death screen / respawn menu.
}

function drawMinimap() {
  if (!minimapGround.length) return;

  const w = minimapCanvas.width;
  const h = minimapCanvas.height;

  minimapCtx.clearRect(0, 0, w, h);

  const scale = Math.floor(Math.min(
    w / mapWidth,
    h / mapHeight
  ));

  const mapPixelWidth = mapWidth * scale;
  const mapPixelHeight = mapHeight * scale;

  const offsetX = Math.floor((w - mapPixelWidth) / 2);
  const offsetY = Math.floor((h - mapPixelHeight) / 2);

  minimapCtx.fillStyle = "rgba(0,0,0,0.75)";
  minimapCtx.fillRect(0, 0, w, h);

  for (let y = 0; y < mapHeight; y++) {
    for (let x = 0; x < mapWidth; x++) {
      const groundTile = minimapGround[y][x];
      const wallTile = minimapWalls[y][x];
      const objectTile = minimapObjects[y]?.[x] || 0;

      if (groundTile === 2) minimapCtx.fillStyle = "#2f7d32";
      else if (groundTile === 3) minimapCtx.fillStyle = "#7a5732";
      else if (groundTile === 4) minimapCtx.fillStyle = "#4aa3d8";
      else minimapCtx.fillStyle = "#222";

      minimapCtx.fillRect(
        offsetX + x * scale,
        offsetY + y * scale,
        scale,
        scale
      );

      if (wallTile !== 0) {
        minimapCtx.fillStyle = "#8a5230";
        minimapCtx.fillRect(
          offsetX + x * scale,
          offsetY + y * scale,
          scale,
          scale
        );
      }

      if (objectTile !== 0) {
        minimapCtx.fillStyle = "#9be27a";
        minimapCtx.fillRect(
          offsetX + x * scale + Math.floor(scale / 4),
          offsetY + y * scale + Math.floor(scale / 4),
          Math.max(1, Math.floor(scale / 2)),
          Math.max(1, Math.floor(scale / 2))
        );
      }
    }
  }

  const playerTile = worldToTile(player.x, player.z);

  const px = offsetX + playerTile.x * scale + scale / 2;
  const py = offsetY + playerTile.y * scale + scale / 2;

  minimapCtx.fillStyle = "#fff0b0";
  minimapCtx.beginPath();
  minimapCtx.arc(px, py, 4, 0, Math.PI * 2);
  minimapCtx.fill();

  minimapCtx.strokeStyle = "#fff0b0";
  minimapCtx.beginPath();
  minimapCtx.moveTo(px, py);
  minimapCtx.lineTo(
    px + Math.cos(player.facingAngle) * 12,
    py + Math.sin(player.facingAngle) * 12
  );
  minimapCtx.stroke();
}

function randomRange(min, max) {
  return min + Math.random() * (max - min);
}

function pickWanderTarget(entity) {
  const movement = entity.movement;
  const radius = movement.radius || 80;

  for (let i = 0; i < 20; i++) {
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * radius;

    const targetX = entity.homeX + Math.cos(angle) * distance;
    const targetZ = entity.homeZ + Math.sin(angle) * distance;

    if (!isBlocked(targetX, targetZ)) {
      entity.targetX = targetX;
      entity.targetZ = targetZ;
      return;
    }
  }

  entity.targetX = entity.x;
  entity.targetZ = entity.z;
}

function updateWanderEntity(entity, now) {
  const movement = entity.movement;

  if (now < entity.pauseUntil) {
    return;
  }

  const dx = entity.targetX - entity.x;
  const dz = entity.targetZ - entity.z;
  const distance = Math.sqrt(dx * dx + dz * dz);

  if (distance < 3) {
    const pauseMin = movement.pauseMin || 1000;
    const pauseMax = movement.pauseMax || 3000;

    entity.pauseUntil = now + randomRange(pauseMin, pauseMax);
    pickWanderTarget(entity);
    return;
  }

  const speed = movement.speed || 0.35;

  const moveX = (dx / distance) * speed;
  const moveZ = (dz / distance) * speed;

  entity.facingAngle = Math.atan2(moveZ, moveX);

  const nextX = entity.x + moveX;
  const nextZ = entity.z + moveZ;

  if (!isBlocked(nextX, entity.z)) {
    entity.x = nextX;
  } else {
    pickWanderTarget(entity);
  }

  if (!isBlocked(entity.x, nextZ)) {
    entity.z = nextZ;
  } else {
    pickWanderTarget(entity);
  }
}

function updateEntities() {
  const now = performance.now();
  const simulationRadiusSq = simulationRadius * simulationRadius;

  for (const entity of entities) {
    const dx = entity.x - player.x;
    const dz = entity.z - player.z;
    const distSq = dx * dx + dz * dz;

    const shouldSimulate = distSq <= simulationRadiusSq;

    if (shouldSimulate) {
      if (entity.movement?.mode === "wander") {
        updateWanderEntity(entity, now);
      }

      if (entity.update) {
        entity.update(entity);
      }
    }

    if (entity.mesh) {
      entity.mesh.position.x = entity.x;
      entity.mesh.position.z = entity.z;
    }
  }
}

const fpsElement = document.getElementById("fps");
const playerStatsLine = document.getElementById("playerStatsLine");
const staminaBarInner = document.getElementById("staminaBarInner");
const healthBarInner = document.getElementById("healthBarInner");

let fpsLastTime = performance.now();
let fpsFrames = 0;
let fpsValue = 0;

const renderRadius = 520;
const renderRadiusBuffer = 80;
const simulationRadius = 360;

const worldRenderObjects = [];

function updateFpsCounter() {
  fpsFrames++;

  const now = performance.now();

  if (now - fpsLastTime >= 1000) {
    fpsValue = fpsFrames;
    fpsFrames = 0;
    fpsLastTime = now;

    fpsElement.textContent = `FPS: ${fpsValue}`;
  }
}

function normalizeAngle(angle) {
  while (angle > Math.PI) angle -= Math.PI * 2;
  while (angle < -Math.PI) angle += Math.PI * 2;
  return angle;
}

function updateDirectionalSprites() {
  for (const entity of entities) {
    if (!entity.mesh || !entity.sprites) continue;

    const angleToCamera = Math.atan2(
      camera.position.z - entity.z,
      camera.position.x - entity.x
    );

    const relative = normalizeAngle(angleToCamera - entity.facingAngle);

    let direction;

    if (relative > -Math.PI / 4 && relative <= Math.PI / 4) {
      direction = "front";
    } else if (relative > Math.PI / 4 && relative <= Math.PI * 3 / 4) {
      direction = "right";
    } else if (relative < -Math.PI / 4 && relative >= -Math.PI * 3 / 4) {
      direction = "left";
    } else {
      direction = "back";
    }

    if (entity.currentSpriteDirection !== direction) {
      entity.currentSpriteDirection = direction;

      const texturePath = entity.sprites[direction];

      if (texturePath) {
        entity.mesh.material.map = getTexture(texturePath);
        entity.mesh.material.needsUpdate = true;
      }
    }
  }
}

function updatePlayerSpriteDirection() {
  if (!player.mesh || !player.sprites) return;

  const angleToCamera = Math.atan2(
    camera.position.z - player.z,
    camera.position.x - player.x
  );

  const relative = normalizeAngle(angleToCamera - player.facingAngle);

  let direction;

  if (relative > -Math.PI / 4 && relative <= Math.PI / 4) {
    direction = "front";
  } else if (relative > Math.PI / 4 && relative <= Math.PI * 3 / 4) {
    direction = "right";
  } else if (relative < -Math.PI / 4 && relative >= -Math.PI * 3 / 4) {
    direction = "left";
  } else {
    direction = "back";
  }

  if (player.currentSpriteDirection !== direction) {
    player.currentSpriteDirection = direction;

    const texturePath = player.sprites[direction];

    if (texturePath) {
      player.mesh.material.map = getTexture(texturePath);
      player.mesh.material.needsUpdate = true;
    }
  }
}

function updateWorldRenderRadius() {
  const maxDistance = renderRadius + renderRadiusBuffer;
  const maxDistanceSq = maxDistance * maxDistance;

  for (const obj of worldRenderObjects) {
    const dx = obj.userData.worldX - player.x;
    const dz = obj.userData.worldZ - player.z;
    const distSq = dx * dx + dz * dz;

    obj.visible = distSq <= maxDistanceSq;
  }

  for (const entity of entities) {
    if (!entity.mesh) continue;

    const dx = entity.x - player.x;
    const dz = entity.z - player.z;
    const distSq = dx * dx + dz * dz;

    entity.mesh.visible = distSq <= maxDistanceSq;
  }

  if (player.mesh) {
    player.mesh.visible = true;
  }
}

function loop() {
  movePlayer();
  updateEntities();
  updateEnemyCombat();
  updateDirectionalSprites();
  updateWorldRenderRadius();

  scene.traverse(obj => {
    if (obj.userData.isBillboard) {
      // Billboard skal bare rotere horisontalt, ikke vippe opp/ned
      obj.lookAt(
        camera.position.x,
        obj.position.y,
        camera.position.z
      );
    }
  });

  drawMinimap();
  updateFpsCounter();
  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}

const entities = [];

function createEntity(options) {
  const entity = {
    id: options.id || crypto.randomUUID(),
    type: options.type || "generic",
    name: options.name || "Entity",
    x: options.x,
    z: options.z,
    hp: options.hp ?? 1,
    maxHp: options.maxHp ?? options.hp ?? 1,
    movement: options.movement || { mode: "idle" },
    homeX: options.homeX ?? options.x,
    homeZ: options.homeZ ?? options.z,
    targetX: options.targetX ?? options.x,
    targetZ: options.targetZ ?? options.z,
    pauseUntil: options.pauseUntil ?? 0,
    sprites: options.sprites || null,
    facingAngle: options.facingAngle ?? 0,
    currentSpriteDirection: options.currentSpriteDirection || "front",
    interactable: options.interactable ?? false,
    hostile: options.hostile ?? false,
    attackDamage: options.attackDamage ?? 1,
    attackRange: options.attackRange ?? 60,
    attackCooldown: options.attackCooldown ?? 1500,
    lastEnemyAttackTime: 0,
    dialogue: options.dialogue || [],
    mesh: options.mesh || null,
    update: options.update || null,
    contents: options.contents || null,
    openSprite: options.openSprite || null,
    containerType: options.containerType || null,
    loot: options.loot || [],
    graveSprite: options.graveSprite || null,
    graveOpenSprite: options.graveOpenSprite || null,
    graveWidth: options.graveWidth || 38,
    graveHeight: options.graveHeight || 48,
  };

  entities.push(entity);
  return entity;
}

function removeEntity(entity) {
  if (entity.mesh) {
    scene.remove(entity.mesh);
  }

  const index = entities.indexOf(entity);
  if (index !== -1) {
    entities.splice(index, 1);
  }
}

function spawnNpc(npcId, worldX, worldZ) {
  const def = NPC_DEFS[npcId];

  if (!def) {
    console.warn("Unknown NPC id:", npcId);
    return null;
  }

  const startTexture =
    def.sprites?.front ||
    def.texture ||
    "assets/textures/tree.png";

  const mat = new THREE.MeshBasicMaterial({
    map: getTexture(startTexture),
    color: 0xffffff,
    transparent: true,
    alphaTest: 0.5,
    side: THREE.DoubleSide
  });

  const geo = new THREE.PlaneGeometry(NPC_WIDTH, NPC_HEIGHT);
  const mesh = new THREE.Mesh(geo, mat);

  mesh.position.set(worldX, NPC_HEIGHT / 2, worldZ);
  mesh.userData.isBillboard = true;

  scene.add(mesh);

  return createEntity({
    type: def.type,
    name: def.name,
    x: worldX,
    z: worldZ,
    hp: def.hp,
    maxHp: def.hp,
    attackDamage: def.attackDamage ?? 1,
    attackRange: def.attackRange ?? 60,
    attackCooldown: def.attackCooldown ?? 1500,
    movement: def.movement || { mode: "idle" },
    homeX: worldX,
    homeZ: worldZ,
    targetX: worldX,
    targetZ: worldZ,
    pauseUntil: 0,
    sprites: def.sprites || null,
    facingAngle: 0,
    currentSpriteDirection: "front",
    interactable: def.interactable,
    hostile: def.hostile,
    dialogue: def.dialogue,
    mesh,
    loot: def.loot || [],
    graveSprite: def.graveSprite || null,
    graveOpenSprite: def.graveOpenSprite || null,
    graveWidth: def.graveWidth || 38,
    graveHeight: def.graveHeight || 48,
  });
}

loadTiledMap("maps/overworld.json").then(() => {
  updateHealthBar();
  updateStaminaBar();
  updatePlayerStatsUi();
  renderHeldWeapon();
  updatePlayerSpriteDirection();
  updateCameraRotation();
  loop();
});

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
});