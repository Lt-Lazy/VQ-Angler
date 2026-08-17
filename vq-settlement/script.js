"use strict";


/* =========================================================
   VQ SETTLEMENT
   Main game script
   ========================================================= */


/* =========================================================
   CANVAS
   ========================================================= */

const canvas =
    document.getElementById("game-canvas");

const ctx =
    canvas.getContext("2d");

ctx.imageSmoothingEnabled = false;

const categoryBuildButton =
    document.getElementById("category-build");

const settlementCenterButton =
    document.getElementById("tool-settlement-center");

const houseButton =
    document.getElementById("tool-house");

const chopTreeButton =
    document.getElementById("tool-chop-tree");

const buildCategoryHousingButton =
    document.getElementById(
        "build-category-housing"
    );

const roadButton =
    document.getElementById("tool-road");

const buildCategoryFoodButton =
    document.getElementById(
        "build-category-food"
    );

const buildCategoryInfrastructureButton =
    document.getElementById(
        "build-category-infrastructure"
    );

const buildToolbarBackButton =
    document.getElementById(
        "build-toolbar-back"
    );


const settlementNameText =
    document.getElementById("settlement-name");

const settlementPopulationText =
    document.getElementById("settlement-population");


const resourceFoodText =
    document.getElementById("resource-food");

const resourceWoodText =
    document.getElementById("resource-wood");

const resourceStoneText =
    document.getElementById("resource-stone");



const settingsButton =
    document.getElementById("settings-button");

const settingsOverlay =
    document.getElementById("settings-overlay");

const saveGameButton =
    document.getElementById("save-game-button");

const loadGameButton =
    document.getElementById("load-game-button");

const closeSettingsButton =
    document.getElementById("close-settings-button");

const saveStatusText =
    document.getElementById("save-status");

const newGameButton =
    document.getElementById("new-game-button");


const settlementNameOverlay =
    document.getElementById("settlement-name-overlay");

const settlementNameInput =
    document.getElementById("settlement-name-input");

const confirmSettlementNameButton =
    document.getElementById("confirm-settlement-name");

const farmButton =
    document.getElementById("tool-farm");

const gameDayText =
    document.getElementById("game-day");

const gameTimeText =
    document.getElementById("game-time");


/* =========================================================
   DEBUG UI
   ========================================================= */

const debugTile =
    document.getElementById("debug-tile");

const debugZoom =
    document.getElementById("debug-zoom");

const debugGround =
    document.getElementById("debug-ground");

const debugWater =
    document.getElementById("debug-water");

const debugNature =
    document.getElementById("debug-nature");


/* =========================================================
   MAP
   ========================================================= */

const MAP_URL =
    "assets/maps/settlement-map.tmj";


let tiledMap = null;

let mapWidth = 0;
let mapHeight = 0;

let tileWidth = 32;
let tileHeight = 32;

let mapLoaded = false;


const loadedTilesets = [];


/* =========================================================
   CAMERA
   ========================================================= */

const camera = {

    x: 0,
    y: 0,

    zoom: 1,

    minZoom: 0.4,
    maxZoom: 3,

    speed: 500

};


/* =========================================================
   MOUSE
   ========================================================= */

const mouse = {

    screenX: 0,
    screenY: 0,

    worldX: 0,
    worldY: 0,

    tileX: 0,
    tileY: 0,

    insideCanvas: false

};

const cameraDrag = {

    active: false,

    lastX: 0,
    lastY: 0

};


/* =========================================================
   SELECTED TILE
   ========================================================= */

let selectedTile = null;


/* =========================================================
   BUILD SYSTEM
   ========================================================= */

const BUILDING_DEFS = {

    settlementCenter: {

        name: "Settlement Center",

        label: "CENTER",

        width: 3,
        height: 3,

        cost: {},

        housingCapacity: 5

    },


    house: {

        name: "House",

        label: "HOUSE",

        width: 1,
        height: 1,

        cost: {

            wood: 20

        },

        housingCapacity: 5

    },

    farm: {

        name: "Farm",

        label: "FARM",

        width: 2,
        height: 2,

        cost: {

            wood: 30

        },

        foodPerDay: 10

    }

};


const worldState = {

    settlement: {

        founded: false,

        name: "Not founded",

        population: 0

    },


    resources: {

        food: 0,

        wood: 0,

        stone: 0

    },

    time: {

        day: 1,

        elapsed: 0

    },


    buildings: [],

    roads: {},

    /*
        Natur som spilleren har fjernet.

        Eksempel:
        "54,32": true
    */

    removedNature: {}

};

let buildModeActive =
    false;

let activeBuildCategory =
    null;

let buildMode = null;

let harvestMode = null;

const SECONDS_PER_DAY =
    60;

const MIN_FOOD_FOR_POPULATION_GROWTH =
    10;

const SAVE_KEY =
    "vq-settlement-save-v1";


let settingsOpen =
    false;

let namingSettlement =
    false;

/* =========================================================
   HELP FUNCTIONS
   ========================================================= */

function drawRoads() {

    for (
        const key
        of Object.keys(
            worldState.roads
        )
    ) {

        if (
            worldState.roads[key] !== true
        ) {

            continue;

        }

        const [
            x,
            y
        ] =
            key
                .split(",")
                .map(Number);

        ctx.fillStyle =
            "#777777";

        ctx.fillRect(
            x * tileWidth + 1,
            y * tileHeight + 1,
            tileWidth - 2,
            tileHeight - 2
        );

    }

}

function openSettingsMenu() {

    settingsOpen =
        true;

    settingsOverlay.classList.add(
        "open"
    );

    updateSaveStatus();

}


function closeSettingsMenu() {

    settingsOpen =
        false;

    settingsOverlay.classList.remove(
        "open"
    );

}

function openSettlementNameMenu() {

    namingSettlement =
        true;


    settlementNameOverlay.classList.add(
        "open"
    );


    settlementNameInput.value =
        "";


    /*
        Fokus etter at vinduet har blitt synlig.
    */

    setTimeout(
        () => {

            settlementNameInput.focus();

        },
        0
    );

}

function activateBuildMode(
    type,
    button
) {

    if (!buildModeActive) {
        return;
    }


    cancelHarvestMode();


    buildMode =
        type;


    settlementCenterButton.classList.remove(
        "active"
    );

    houseButton.classList.remove(
        "active"
    );

    farmButton.classList.remove(
        "active"
    );

    roadButton.classList.remove(
        "active"
    );

    button.classList.add(
        "active"
    );


    canvas.style.cursor =
        "crosshair";

}

function confirmSettlementName() {

    if (!namingSettlement) {
        return;
    }


    const name =
        settlementNameInput.value.trim();


    if (!name) {

        settlementNameInput.focus();

        return;

    }


    worldState.settlement.name =
        name;


    namingSettlement =
        false;


    settlementNameOverlay.classList.remove(
        "open"
    );

    updateSettlementUI();

    console.log(
        `Settlement founded: ${name}`
    );

}

confirmSettlementNameButton.addEventListener(
    "click",
    () => {

        confirmSettlementName();

    }
);

roadButton.addEventListener(
    "click",
    () => {

        if (
            !worldState.settlement.founded
        ) {

            return;

        }

        if (
            buildMode === "road"
        ) {

            cancelBuildMode();

            return;

        }

        activateBuildMode(
            "road",
            roadButton
        );

    }
);

farmButton.addEventListener(
    "click",
    () => {

        if (
            !worldState.settlement.founded
        ) {

            return;

        }

        if (
            buildMode === "farm"
        ) {

            cancelBuildMode();

            return;

        }

        activateBuildMode(
            "farm",
            farmButton
        );

    }
);

settlementNameInput.addEventListener(
    "keydown",
    (event) => {

        if (event.key === "Enter") {

            confirmSettlementName();

        }

    }
);

function updateSaveStatus() {

    const rawSave =
        localStorage.getItem(
            SAVE_KEY
        );


    if (!rawSave) {

        saveStatusText.textContent =
            "No save found.";

        loadGameButton.disabled =
            true;

        return;

    }


    loadGameButton.disabled =
        false;


    try {

        const saveData =
            JSON.parse(rawSave);


        if (saveData.savedAt) {

            const date =
                new Date(
                    saveData.savedAt
                );


            saveStatusText.textContent =
                `Save found\n${date.toLocaleString()}`;

        }
        else {

            saveStatusText.textContent =
                "Save found.";

        }

    }
    catch {

        saveStatusText.textContent =
            "Save data could not be read.";

        loadGameButton.disabled =
            true;

    }

}

function canAffordBuilding(
    buildingDef
) {

    const cost =
        buildingDef.cost || {};


    for (
        const [resource, amount]
        of Object.entries(cost)
    ) {

        const available =
            worldState.resources[resource] || 0;


        if (
            available < amount
        ) {

            return false;

        }

    }


    return true;

}


function payBuildingCost(
    buildingDef
) {

    const cost =
        buildingDef.cost || {};


    for (
        const [resource, amount]
        of Object.entries(cost)
    ) {

        worldState.resources[resource] -=
            amount;

    }

}

/* =========================================================
   SAVE / LOAD
   ========================================================= */

function saveGame() {

    const saveData = {

        version: 1,

        savedAt:
            new Date().toISOString(),


        settlement: {
            ...worldState.settlement
        },

        time: {
            ...worldState.time
        },

        resources: {
            ...worldState.resources
        },

        roads: {
            ...worldState.roads
        },

        buildings:
            worldState.buildings.map(
                building => ({
                    ...building
                })
            ),


        removedNature: {
            ...worldState.removedNature
        },


        camera: {

            x:
                camera.x,

            y:
                camera.y,

            zoom:
                camera.zoom

        }

    };


    localStorage.setItem(
        SAVE_KEY,
        JSON.stringify(saveData)
    );


    console.log(
        "Game saved.",
        saveData
    );


    updateSaveStatus();

}

function loadGame() {

    const rawSave =
        localStorage.getItem(
            SAVE_KEY
        );


    if (!rawSave) {

        console.log(
            "No save found."
        );

        return;

    }


    try {

        const saveData =
            JSON.parse(rawSave);


        /*
            Settlement
        */

        if (saveData.settlement) {

            worldState.settlement = {
                ...worldState.settlement,
                ...saveData.settlement
            };

        }

        worldState.time = {

            day: 1,

            elapsed: 0

        };


        if (saveData.time) {

            worldState.time = {
                ...worldState.time,
                ...saveData.time
            };

        }

        if (saveData.resources) {

            worldState.resources = {
                ...worldState.resources,
                ...saveData.resources
            };

        }

        worldState.roads =
            saveData.roads &&
            typeof saveData.roads === "object"
                ? {
                    ...saveData.roads
                }
                : {};

        /*
            Buildings
        */

        worldState.buildings =
            Array.isArray(
                saveData.buildings
            )
                ? saveData.buildings
                : [];


        /*
            Removed nature
        */

        worldState.removedNature =
            saveData.removedNature &&
            typeof saveData.removedNature === "object"
                ? {
                    ...saveData.removedNature
                }
                : {};


        /*
            Camera
        */

        if (saveData.camera) {

            if (
                Number.isFinite(
                    saveData.camera.x
                )
            ) {

                camera.x =
                    saveData.camera.x;

            }


            if (
                Number.isFinite(
                    saveData.camera.y
                )
            ) {

                camera.y =
                    saveData.camera.y;

            }


            if (
                Number.isFinite(
                    saveData.camera.zoom
                )
            ) {

                camera.zoom =
                    Math.max(
                        camera.minZoom,
                        Math.min(
                            camera.maxZoom,
                            saveData.camera.zoom
                        )
                    );

            }

        }


        /*
            Vi skal ikke laste inn et gammelt
            aktivt tool/build mode.
        */

        cancelBuildMode();

        cancelHarvestMode();


        selectedTile =
            null;


        /*
            Center kan ikke bygges igjen
            dersom settlement allerede finnes.
        */

        settlementCenterButton.disabled =
            worldState.settlement.founded;

        houseButton.disabled =
            !worldState.settlement.founded;

        farmButton.disabled =
            !worldState.settlement.founded;

        roadButton.disabled =
            !worldState.settlement.founded;

        updateSettlementUI();


        console.log(
            "Game loaded.",
            saveData
        );


        closeSettingsMenu();

    }
    catch (error) {

        console.error(
            "Failed to load save:",
            error
        );


        saveStatusText.textContent =
            "Save could not be loaded.";

    }

}

function newGame() {


    worldState.settlement = {

        founded: false,

        name: "Not founded",

        population: 0

    };


    worldState.time = {

        day: 1,

        elapsed: 0

    };

    worldState.resources = {

        food: 0,

        wood: 0,

        stone: 0

    };

    worldState.roads =
        {};

    worldState.buildings =
        [];



    worldState.removedNature =
        {};

 

    cancelBuildMode();

    cancelHarvestMode();


    selectedTile =
        null;


    /*
        Settlement Center kan bygges igjen.
    */

    settlementCenterButton.disabled =
        false;

    houseButton.disabled =
        true;

    farmButton.disabled =
        true;

    roadButton.disabled =
        true;

    /*
        Sett kamera tilbake til midten.
    */

    camera.zoom =
        1;


    centerCameraOnMap();


    updateSettlementUI();


    closeSettingsMenu();


    console.log(
        "New game started."
    );

}

newGameButton.addEventListener(
    "click",
    () => {

        const confirmed =
            window.confirm(
                "Start a new game? Unsaved progress will be lost."
            );


        if (!confirmed) {
            return;
        }


        newGame();

    }
);


/* =========================================================
   CANVAS RESIZE
   ========================================================= */

function resizeCanvas() {

    const dpr =
        window.devicePixelRatio || 1;

    const rect =
        canvas.getBoundingClientRect();

    const width =
        Math.max(1, rect.width);

    const height =
        Math.max(1, rect.height);


    canvas.width =
        Math.floor(width * dpr);

    canvas.height =
        Math.floor(height * dpr);


    ctx.imageSmoothingEnabled =
        false;

}


window.addEventListener(
    "resize",
    resizeCanvas
);

resizeCanvas();

const mapFrame =
    document.getElementById("map-frame");


const mapResizeObserver =
    new ResizeObserver(() => {

        resizeCanvas();

    });


mapResizeObserver.observe(
    mapFrame
);


/* =========================================================
   LOAD JSON
   ========================================================= */

async function loadJSON(url) {

    const response =
        await fetch(url);


    if (!response.ok) {

        throw new Error(
            `Could not load JSON: ${url}`
        );

    }


    return await response.json();

}


/* =========================================================
   LOAD IMAGE
   ========================================================= */

function loadImage(url) {

    return new Promise(
        (resolve, reject) => {

            const image =
                new Image();


            image.onload = () => {

                resolve(image);

            };


            image.onerror = () => {

                reject(
                    new Error(
                        `Could not load image: ${url}`
                    )
                );

            };


            image.src = url;

        }
    );

}


/* =========================================================
   LOAD MAP
   ========================================================= */

async function loadTiledMap() {

    try {

        console.log(
            "Loading Tiled map..."
        );


        const mapURL =
            new URL(
                MAP_URL,
                window.location.href
            ).href;


        tiledMap =
            await loadJSON(mapURL);


        mapWidth =
            tiledMap.width;

        mapHeight =
            tiledMap.height;

        tileWidth =
            tiledMap.tilewidth;

        tileHeight =
            tiledMap.tileheight;


        /*
            Load external tilesets.
        */

        for (
            const tilesetReference
            of tiledMap.tilesets
        ) {

            await loadTileset(
                tilesetReference,
                mapURL
            );

        }


        mapLoaded = true;


        centerCameraOnMap();


        console.log(
            "Map loaded."
        );


        console.log(
            "Map:",
            mapWidth,
            "x",
            mapHeight
        );


        console.log(
            "Tilesets:",
            loadedTilesets
        );

    }
    catch (error) {

        console.error(
            "Failed to load map:",
            error
        );

    }

}


/* =========================================================
   LOAD TILESET
   ========================================================= */

async function loadTileset(
    tilesetReference,
    mapURL
) {

    if (!tilesetReference.source) {

        console.warn(
            "Embedded tilesets are not currently supported."
        );

        return;

    }


    const tilesetURL =
        new URL(
            tilesetReference.source,
            mapURL
        ).href;


    const tilesetData =
        await loadJSON(
            tilesetURL
        );


    const loadedTileset = {

        firstgid:
            tilesetReference.firstgid,

        url:
            tilesetURL,

        data:
            tilesetData,

        tiles:
            new Map()

    };


    /*
        Collection of Images
    */

    if (tilesetData.tiles) {

        for (
            const tileData
            of tilesetData.tiles
        ) {

            if (!tileData.image) {
                continue;
            }


            const imageURL =
                new URL(
                    tileData.image,
                    tilesetURL
                ).href;


            const image =
                await loadImage(
                    imageURL
                );


            /*
                Convert Tiled properties:

                [
                    {
                        name: "name",
                        value: "tree"
                    }
                ]

                becomes:

                {
                    name: "tree"
                }
            */

            const properties = {};


            if (tileData.properties) {

                for (
                    const property
                    of tileData.properties
                ) {

                    properties[
                        property.name
                    ] =
                        property.value;

                }

            }


            loadedTileset.tiles.set(
                tileData.id,
                {

                    id:
                        tileData.id,

                    image:
                        image,

                    width:
                        tileData.imagewidth ||
                        tileWidth,

                    height:
                        tileData.imageheight ||
                        tileHeight,

                    properties:
                        properties

                }
            );

        }

    }


    loadedTilesets.push(
        loadedTileset
    );

}


/* =========================================================
   GID → TILE
   ========================================================= */

function getTileFromGid(gid) {

    if (!gid) {
        return null;
    }


    /*
        Remove Tiled flip flags.
    */

    const cleanGid =
        gid & 0x0fffffff;


    let selectedTileset =
        null;


    for (
        const tileset
        of loadedTilesets
    ) {

        if (
            cleanGid >=
            tileset.firstgid
        ) {

            if (
                !selectedTileset ||
                tileset.firstgid >
                selectedTileset.firstgid
            ) {

                selectedTileset =
                    tileset;

            }

        }

    }


    if (!selectedTileset) {
        return null;
    }


    const localId =
        cleanGid -
        selectedTileset.firstgid;


    const tile =
        selectedTileset.tiles.get(
            localId
        );


    if (!tile) {
        return null;
    }


    return {

        tile:
            tile,

        tileset:
            selectedTileset

    };

}


/* =========================================================
   GET LAYER
   ========================================================= */

function getLayer(name) {

    if (!tiledMap) {
        return null;
    }


    return tiledMap.layers.find(
        layer =>
            layer.name.toLowerCase() ===
            name.toLowerCase()
    );

}


/* =========================================================
   GET TILE GID FROM LAYER
   ========================================================= */

function getLayerGidAt(
    layerName,
    x,
    y
) {

    if (!mapLoaded) {
        return 0;
    }


    if (
        x < 0 ||
        y < 0 ||
        x >= mapWidth ||
        y >= mapHeight
    ) {

        return 0;

    }


    const layer =
        getLayer(layerName);


    if (
        !layer ||
        layer.type !== "tilelayer"
    ) {

        return 0;

    }


    const index =
        y * layer.width +
        x;


    return (
        layer.data[index] || 0
    );

}


/* =========================================================
   GET TILE DATA FROM LAYER
   ========================================================= */

function getLayerTileAt(
    layerName,
    x,
    y
) {

    const gid =
        getLayerGidAt(
            layerName,
            x,
            y
        );


    if (!gid) {
        return null;
    }


    const result =
        getTileFromGid(gid);


    if (!result) {
        return null;
    }


    return result.tile;

}


/* =========================================================
   GET TILE NAME
   ========================================================= */

function getTileName(
    layerName,
    x,
    y
) {

    const tile =
        getLayerTileAt(
            layerName,
            x,
            y
        );


    if (!tile) {
        return null;
    }


    /*
        This is the custom property
        you added in Tiled:

        name = grass
        name = tree
        etc.
    */

    return (
        tile.properties.name ||
        null
    );

}


/* =========================================================
   GET COMPLETE WORLD TILE INFO
   ========================================================= */

function getTileInfo(
    x,
    y
) {

    if (
        x < 0 ||
        y < 0 ||
        x >= mapWidth ||
        y >= mapHeight
    ) {

        return null;

    }


    const ground =
        getTileName(
            "ground",
            x,
            y
        );


    const water =
        getTileName(
            "water",
            x,
            y
        );


    const nature =
        isNatureRemoved(x, y)
            ? null
            : getTileName(
                "nature",
                x,
                y
            );


    return {

        x:
            x,

        y:
            y,

        ground:
            ground,

        water:
            water,

        nature:
            nature,

        hasWater:
            water !== null,

        hasNature:
            nature !== null

    };

}


/* =========================================================
   CAMERA
   ========================================================= */

function centerCameraOnMap() {

    if (!mapLoaded) {
        return;
    }


    const worldWidth =
        mapWidth *
        tileWidth;

    const worldHeight =
        mapHeight *
        tileHeight;


    camera.x =
        worldWidth / 2 -
        canvas.clientWidth /
        camera.zoom /
        2;


    camera.y =
        worldHeight / 2 -
        canvas.clientHeight /
        camera.zoom /
        2;

}



/* =========================================================
   MOUSE MOVEMENT
   ========================================================= */

canvas.addEventListener(
    "mousemove",
    (event) => {

        const rect =
            canvas.getBoundingClientRect();


        mouse.screenX =
            event.clientX -
            rect.left;

        mouse.screenY =
            event.clientY -
            rect.top;


        mouse.insideCanvas =
            true;


        /*
            Hvis scroll-knappen holdes inne,
            dra kameraet sammen med musen.
        */

        if (cameraDrag.active) {

            const deltaX =
                event.clientX -
                cameraDrag.lastX;

            const deltaY =
                event.clientY -
                cameraDrag.lastY;


            camera.x -=
                deltaX /
                camera.zoom;

            camera.y -=
                deltaY /
                camera.zoom;


            cameraDrag.lastX =
                event.clientX;

            cameraDrag.lastY =
                event.clientY;

        }

    }
);

canvas.addEventListener(
    "mousedown",
    (event) => {

        /*
            Middle mouse button / scroll button
        */

        if (event.button !== 1) {
            return;
        }


        if (
            settingsOpen ||
            namingSettlement
        ) {

            return;

        }


        event.preventDefault();


        cameraDrag.active =
            true;


        cameraDrag.lastX =
            event.clientX;

        cameraDrag.lastY =
            event.clientY;


        canvas.style.cursor =
            "grabbing";

    }
);

window.addEventListener(
    "mouseup",
    (event) => {

        if (event.button !== 1) {
            return;
        }


        cameraDrag.active =
            false;


        canvas.style.cursor =
            (
                buildMode ||
                harvestMode
            )
                ? "crosshair"
                : "grab";

    }
);

canvas.addEventListener(
    "auxclick",
    (event) => {

        if (event.button === 1) {

            event.preventDefault();

        }

    }
);


canvas.addEventListener(
    "mouseenter",
    () => {

        mouse.insideCanvas =
            true;

    }
);


canvas.addEventListener(
    "mouseleave",
    () => {

        mouse.insideCanvas =
            false;

    }
);


/* =========================================================
   SELECT TILE
   ========================================================= */

canvas.addEventListener(
    "mousedown",
    (event) => {

        /*
            Left mouse button only.
        */

        if (event.button !== 0) {
            return;
        }



        if (
            settingsOpen ||
            namingSettlement
        ) {

            return;

        }

        if (buildMode) {

            if (
                buildMode === "road"
            ) {

                placeRoad(
                    mouse.tileX,
                    mouse.tileY
                );

            }
            else {

                placeBuilding(
                    buildMode,
                    mouse.tileX,
                    mouse.tileY
                );

            }

            return;

        }

        if (
            harvestMode === "tree"
        ) {

            harvestTree(
                mouse.tileX,
                mouse.tileY
            );

            return;

        }

        if (!mapLoaded) {
            return;
        }


        const tileInfo =
            getTileInfo(
                mouse.tileX,
                mouse.tileY
            );


        if (!tileInfo) {
            return;
        }


        selectedTile = {

            x:
                mouse.tileX,

            y:
                mouse.tileY

        };


        console.log(
            "Selected tile:",
            tileInfo
        );

    }
);


/* =========================================================
   ZOOM
   ========================================================= */

canvas.addEventListener(
    "wheel",
    (event) => {

        event.preventDefault();


        if (!mapLoaded) {
            return;
        }


        const worldBeforeZoomX =
            camera.x +
            mouse.screenX /
            camera.zoom;


        const worldBeforeZoomY =
            camera.y +
            mouse.screenY /
            camera.zoom;


        if (event.deltaY < 0) {

            camera.zoom *=
                1.1;

        }
        else {

            camera.zoom /=
                1.1;

        }


        camera.zoom =
            Math.max(
                camera.minZoom,
                Math.min(
                    camera.maxZoom,
                    camera.zoom
                )
            );


        camera.x =
            worldBeforeZoomX -
            mouse.screenX /
            camera.zoom;


        camera.y =
            worldBeforeZoomY -
            mouse.screenY /
            camera.zoom;

    },
    {
        passive: false
    }
);

/* =========================================================
   BUILD / BUTTONS
   ========================================================= */

function updateBuildToolbar() {

    const items =
        document.querySelectorAll(
            ".build-toolbar-item"
        );


    /*
        Skjul alt først.
    */

    for (
        const item
        of items
    ) {

        item.hidden =
            true;

    }


    /*
        Utenfor Build Mode skal
        toolbaren være tom.
    */

    if (!buildModeActive) {
        return;
    }


    /*
        Ingen kategori valgt:
        vis kategoriene.
    */

    if (!activeBuildCategory) {

        buildCategoryHousingButton.hidden =
            false;

        buildCategoryFoodButton.hidden =
            false;

        buildCategoryInfrastructureButton.hidden =
            false;

        return;

    }


    /*
        Inne i en kategori:
        vis Back.
    */

    buildToolbarBackButton.hidden =
        false;


    /*
        Vis bygningene som tilhører
        valgt kategori.
    */

    const categoryButtons =
        document.querySelectorAll(
            `[data-build-category="${activeBuildCategory}"]`
        );


    for (
        const button
        of categoryButtons
    ) {

        button.hidden =
            false;

    }

}


function enterBuildMode() {

    buildModeActive =
        true;


    activeBuildCategory =
        null;


    /*
        Harvest og building placement
        kan ikke være aktive samtidig.
    */

    cancelHarvestMode();

    cancelBuildMode();


    categoryBuildButton.classList.add(
        "active"
    );


    canvas.style.cursor =
        "grab";


    updateBuildToolbar();

}


function exitBuildMode() {

    buildModeActive =
        false;


    activeBuildCategory =
        null;


    cancelBuildMode();


    categoryBuildButton.classList.remove(
        "active"
    );


    updateBuildToolbar();

}


function openBuildCategory(
    category
) {

    cancelBuildMode();


    activeBuildCategory =
        category;


    updateBuildToolbar();

}

categoryBuildButton.addEventListener(
    "click",
    () => {

        if (buildModeActive) {

            exitBuildMode();

        }
        else {

            enterBuildMode();

        }

    }
);

buildCategoryHousingButton.addEventListener(
    "click",
    () => {

        openBuildCategory(
            "housing"
        );

    }
);


buildCategoryFoodButton.addEventListener(
    "click",
    () => {

        openBuildCategory(
            "food"
        );

    }
);


buildCategoryInfrastructureButton.addEventListener(
    "click",
    () => {

        openBuildCategory(
            "infrastructure"
        );

    }
);


buildToolbarBackButton.addEventListener(
    "click",
    () => {

        cancelBuildMode();


        activeBuildCategory =
            null;


        updateBuildToolbar();

    }
);


settlementCenterButton.addEventListener(
    "click",
    () => {

        if (
            buildMode ===
            "settlementCenter"
        ) {

            cancelBuildMode();

            return;

        }


        activateBuildMode(
            "settlementCenter",
            settlementCenterButton
        );

    }
);

houseButton.addEventListener(
    "click",
    () => {

        if (
            !worldState.settlement.founded
        ) {

            console.log(
                "Build the Settlement Center first."
            );

            return;

        }


        if (
            buildMode === "house"
        ) {

            cancelBuildMode();

            return;

        }


        activateBuildMode(
            "house",
            houseButton
        );

    }
);

settingsButton.addEventListener(
    "click",
    () => {

        openSettingsMenu();

    }
);


closeSettingsButton.addEventListener(
    "click",
    () => {

        closeSettingsMenu();

    }
);


saveGameButton.addEventListener(
    "click",
    () => {

        saveGame();

    }
);


loadGameButton.addEventListener(
    "click",
    () => {

        loadGame();

    }
);

settingsOverlay.addEventListener(
    "mousedown",
    (event) => {

        if (
            event.target ===
            settingsOverlay
        ) {

            closeSettingsMenu();

        }

    }
);

function cancelBuildMode() {

    buildMode = null;

    farmButton.classList.remove(
        "active"
    );

    settlementCenterButton.classList.remove(
        "active"
    );

    houseButton.classList.remove(
        "active"
    );

    roadButton.classList.remove(
        "active"
    );

    canvas.style.cursor =
        "grab";

}

function cancelHarvestMode() {

    harvestMode = null;


    chopTreeButton.classList.remove(
        "active"
    );


    canvas.style.cursor =
        "grab";

}

function harvestTree(x, y) {

    if (
        !worldState.settlement.founded
    ) {

        return;

    }


    const tile =
        getTileInfo(
            x,
            y
        );


    if (!tile) {
        return;
    }


    if (
        tile.nature !== "tree"
    ) {

        console.log(
            "There is no tree here."
        );

        return;

    }


    /*
        Fjern treet fra runtime-verdenen.
    */

    removeNatureAt(
        x,
        y
    );


    /*
        Foreløpig gir hvert tre 5 Wood.
        Dette balanserer vi senere.
    */

    worldState.resources.wood +=
        5;


    updateSettlementUI();


    console.log(
        "Tree chopped. +5 Wood"
    );

}

window.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Escape"
        ) {

            if (namingSettlement) {

                settlementNameInput.focus();

                return;

            }

            if (settingsOpen) {

                closeSettingsMenu();

                return;

            }

            if (buildModeActive) {

                if (buildMode) {

                    cancelBuildMode();

                    return;

                }

                if (activeBuildCategory) {

                    activeBuildCategory =
                        null;


                    updateBuildToolbar();

                    return;

                }


                exitBuildMode();

                return;

            }


            if (buildMode) {

                cancelBuildMode();

            }


            if (harvestMode) {

                cancelHarvestMode();

            }

        }

    }
);

canvas.addEventListener(
    "contextmenu",
    (event) => {

        event.preventDefault();


        if (buildMode) {

            cancelBuildMode();

        }

        if (harvestMode) {

            cancelHarvestMode();

        }

    }
);

chopTreeButton.addEventListener(
    "click",
    () => {

        /*
            Man må først grunnlegge settlementen.
        */

        if (
            !worldState.settlement.founded
        ) {

            console.log(
                "Build the Settlement Center first."
            );

            return;

        }


        /*
            Hvis Chop allerede er valgt,
            slå det av.
        */

        if (
            harvestMode === "tree"
        ) {

            cancelHarvestMode();

            return;

        }


        /*
            Slå av building mode.
        */

        cancelBuildMode();


        harvestMode =
            "tree";


        chopTreeButton.classList.add(
            "active"
        );


        canvas.style.cursor =
            "crosshair";

    }
);

function buildingOccupiesTile(
    building,
    tileX,
    tileY
) {

    return (
        tileX >= building.x &&
        tileX < building.x + building.width &&
        tileY >= building.y &&
        tileY < building.y + building.height
    );

}

function tileHasBuilding(
    tileX,
    tileY
) {

    return worldState.buildings.some(
        building =>
            buildingOccupiesTile(
                building,
                tileX,
                tileY
            )
    );

}

function tileHasRoad(
    tileX,
    tileY
) {

    const key =
        getTileKey(
            tileX,
            tileY
        );


    return (
        worldState.roads[key] === true
    );

}


function canPlaceRoad(
    x,
    y
) {

    const tile =
        getTileInfo(
            x,
            y
        );

    if (!tile) {
        return false;
    }

    if (tile.hasWater) {
        return false;
    }

    if (tile.hasNature) {
        return false;
    }

    if (
        tileHasBuilding(
            x,
            y
        )
    ) {

        return false;

    }

    if (
        tileHasRoad(
            x,
            y
        )
    ) {

        return false;

    }

    if (
        worldState.resources.wood < 2
    ) {

        return false;

    }

    return true;

}


function placeRoad(
    x,
    y
) {

    if (
        !worldState.settlement.founded
    ) {

        return;

    }

    if (
        !canPlaceRoad(
            x,
            y
        )
    ) {

        console.log(
            "Cannot build road here."
        );

        return;

    }

    const key =
        getTileKey(
            x,
            y
        );

    worldState.roads[key] =
        true;

    worldState.resources.wood -=
        2;

    updateSettlementUI();

    console.log(
        `Road built at ${x}, ${y}. -2 Wood`
    );

}

function canPlaceBuilding(
    buildingDef,
    startX,
    startY
) {

    for (
        let offsetY = 0;
        offsetY < buildingDef.height;
        offsetY++
    ) {

        for (
            let offsetX = 0;
            offsetX < buildingDef.width;
            offsetX++
        ) {

            const x =
                startX + offsetX;

            const y =
                startY + offsetY;


            const tile =
                getTileInfo(
                    x,
                    y
                );


            /*
                Utenfor kartet.
            */

            if (!tile) {
                return false;
            }


            /*
                Vann blokkerer.
            */

            if (tile.hasWater) {
                return false;
            }


            /*
                Trær / steiner blokkerer.
            */

            if (tile.hasNature) {
                return false;
            }


            /*
                Eksisterende bygning blokkerer.
            */

            if (
                tileHasBuilding(
                    x,
                    y
                )
            ) {

                return false;

            }

            /*
                Veier blokkerer bygninger.
            */

            if (
                tileHasRoad(
                    x,
                    y
                )
            ) {

                return false;

            }

        }

    }


    return true;

}

function placeBuilding(
    type,
    x,
    y
) {

    const def =
        BUILDING_DEFS[type];


    if (!def) {
        return;
    }

    if (
        type === "settlementCenter" &&
        worldState.settlement.founded
    ) {

        console.log(
            "A Settlement Center already exists."
        );

        return;

    }


    if (
        type !== "settlementCenter" &&
        !worldState.settlement.founded
    ) {

        console.log(
            "Found the settlement first."
        );

        return;

    }

    if (
        !canAffordBuilding(def)
    ) {

        console.log(
            `Not enough resources to build ${def.name}.`
        );

        return;

    }

    if (
        !canPlaceBuilding(
            def,
            x,
            y
        )
    ) {

        console.log(
            "Cannot build here."
        );

        return;

    }


    const building = {

        id:
            Date.now(),

        type:
            type,

        x:
            x,

        y:
            y,

        width:
            def.width,

        height:
            def.height

    };


    worldState.buildings.push(
        building
    );

    payBuildingCost(
        def
    );

    if (
        type === "settlementCenter"
    ) {

        worldState.settlement.founded =
            true;


        worldState.settlement.name =
            "Unnamed Settlement";


        worldState.settlement.population =
            5;


        worldState.resources.food =
            25;


        settlementCenterButton.disabled =
            true;

        houseButton.disabled =
            false;

        farmButton.disabled =
            false;

        roadButton.disabled =
            false;

        settlementCenterButton.classList.remove(
            "active"
        );


        buildMode =
            null;


        canvas.style.cursor =
            "grab";


        updateSettlementUI();


        openSettlementNameMenu();

    }

    updateSettlementUI();

    console.log(
        "Building placed:",
        building
    );

}

function drawBuildings() {

    for (
        const building
        of worldState.buildings
    ) {

        const def =
            BUILDING_DEFS[
                building.type
            ];

        const x =
            building.x *
            tileWidth;

        const y =
            building.y *
            tileHeight;


        const width =
            building.width *
            tileWidth;

        const height =
            building.height *
            tileHeight;


        /*
            Midlertidig placeholder.
            Senere blir dette en PNG.
        */

        ctx.fillStyle =
            "#b59a63";


        ctx.fillRect(
            x + 2,
            y + 2,
            width - 4,
            height - 4
        );


        ctx.strokeStyle =
            "#332716";


        ctx.lineWidth =
            2 /
            camera.zoom;


        ctx.strokeRect(
            x + 2,
            y + 2,
            width - 4,
            height - 4
        );


        ctx.fillStyle =
            "#111";


        ctx.font =
            "10px monospace";


        ctx.fillText(
            def?.label ||
            building.type,

            x + 6,
            y + 18
        );

    }

}

function drawBuildPreview() {

    if (!buildMode) {
        return;
    }

    if (
        buildMode === "road"
    ) {

        const valid =
            canPlaceRoad(
                mouse.tileX,
                mouse.tileY
            );

        const x =
            mouse.tileX *
            tileWidth;

        const y =
            mouse.tileY *
            tileHeight;

        ctx.fillStyle =
            valid
                ? "rgba(120, 120, 120, 0.65)"
                : "rgba(220, 50, 50, 0.35)";

        ctx.strokeStyle =
            valid
                ? "rgba(220, 220, 220, 1)"
                : "rgba(255, 80, 80, 1)";

        ctx.fillRect(
            x,
            y,
            tileWidth,
            tileHeight
        );

        ctx.lineWidth =
            2 /
            camera.zoom;

        ctx.strokeRect(
            x,
            y,
            tileWidth,
            tileHeight
        );

        return;

    }

    const def =
        BUILDING_DEFS[
            buildMode
        ];


    if (!def) {
        return;
    }


    const valid =
        canPlaceBuilding(
            def,
            mouse.tileX,
            mouse.tileY
        ) &&
        canAffordBuilding(
            def
        );


    const x =
        mouse.tileX *
        tileWidth;


    const y =
        mouse.tileY *
        tileHeight;


    const width =
        def.width *
        tileWidth;


    const height =
        def.height *
        tileHeight;


    if (valid) {

        ctx.fillStyle =
            "rgba(70, 220, 90, 0.35)";

        ctx.strokeStyle =
            "rgba(100, 255, 120, 1)";

    }
    else {

        ctx.fillStyle =
            "rgba(220, 50, 50, 0.35)";

        ctx.strokeStyle =
            "rgba(255, 80, 80, 1)";

    }


    ctx.fillRect(
        x,
        y,
        width,
        height
    );


    ctx.lineWidth =
        2 /
        camera.zoom;


    ctx.strokeRect(
        x,
        y,
        width,
        height
    );

}


/* =========================================================
   UPDATE MOUSE WORLD POSITION
   ========================================================= */

function updateMouseWorldPosition() {

    mouse.worldX =
        camera.x +
        mouse.screenX /
        camera.zoom;


    mouse.worldY =
        camera.y +
        mouse.screenY /
        camera.zoom;


    mouse.tileX =
        Math.floor(
            mouse.worldX /
            tileWidth
        );


    mouse.tileY =
        Math.floor(
            mouse.worldY /
            tileHeight
        );

}


/* =========================================================
   DRAW BACKGROUND
   ========================================================= */

function drawBackground() {

    ctx.fillStyle =
        "#111111";


    ctx.fillRect(
        0,
        0,
        canvas.clientWidth,
        canvas.clientHeight
    );

}


/* =========================================================
   DRAW TILE LAYER
   ========================================================= */

function drawTileLayer(
    layer
) {

    if (
        !layer ||
        layer.type !== "tilelayer" ||
        !layer.visible
    ) {

        return;

    }


    const startX =
        Math.max(
            0,
            Math.floor(
                camera.x /
                tileWidth
            ) - 1
        );


    const startY =
        Math.max(
            0,
            Math.floor(
                camera.y /
                tileHeight
            ) - 1
        );


    const endX =
        Math.min(
            layer.width,
            Math.ceil(
                (
                    camera.x +
                    canvas.clientWidth /
                    camera.zoom
                ) /
                tileWidth
            ) + 1
        );


    const endY =
        Math.min(
            layer.height,
            Math.ceil(
                (
                    camera.y +
                    canvas.clientHeight /
                    camera.zoom
                ) /
                tileHeight
            ) + 1
        );


    for (
        let y = startY;
        y < endY;
        y++
    ) {

        for (
            let x = startX;
            x < endX;
            x++
        ) {

            if (
                layer.name.toLowerCase() === "nature" &&
                isNatureRemoved(x, y)
            ) {

                continue;

            }

            const index =
                y *
                layer.width +
                x;


            const gid =
                layer.data[index];


            if (!gid) {
                continue;
            }


            const result =
                getTileFromGid(
                    gid
                );


            if (!result) {
                continue;
            }


            const tile =
                result.tile;


            const layerName =
                layer.name.toLowerCase();


            const overlap =
                layerName === "ground"
                    ? 1 / camera.zoom
                    : 0;


            ctx.drawImage(
                tile.image,

                x * tileWidth,

                y * tileHeight,

                tile.width + overlap,

                tile.height + overlap
            );

        }

    }

}

function getTileKey(x, y) {

    return `${x},${y}`;

}


function isNatureRemoved(x, y) {

    const key =
        getTileKey(x, y);


    return (
        worldState.removedNature[key] === true
    );

}


function removeNatureAt(x, y) {

    const key =
        getTileKey(x, y);


    worldState.removedNature[key] =
        true;

}


/* =========================================================
   DRAW MAP
   ========================================================= */

function drawMap() {

    drawTileLayer(
        getLayer("ground")
    );

    drawTileLayer(
        getLayer("water")
    );

    drawTileLayer(
        getLayer("nature")
    );

}

function drawBuildGrid() {

    if (
        !buildModeActive ||
        !mapLoaded
    ) {

        return;

    }

    const startX =
        Math.max(
            0,
            Math.floor(
                camera.x /
                tileWidth
            )
        );


    const startY =
        Math.max(
            0,
            Math.floor(
                camera.y /
                tileHeight
            )
        );

    const endX =
        Math.min(
            mapWidth,
            Math.ceil(
                (
                    camera.x +
                    canvas.clientWidth /
                    camera.zoom
                ) /
                tileWidth
            )
        );

    const endY =
        Math.min(
            mapHeight,
            Math.ceil(
                (
                    camera.y +
                    canvas.clientHeight /
                    camera.zoom
                ) /
                tileHeight
            )
        );


    ctx.save();

    ctx.beginPath();

    for (
        let x = startX;
        x <= endX;
        x++
    ) {

        const worldX =
            x * tileWidth;


        ctx.moveTo(
            worldX,
            startY * tileHeight
        );


        ctx.lineTo(
            worldX,
            endY * tileHeight
        );

    }

    for (
        let y = startY;
        y <= endY;
        y++
    ) {

        const worldY =
            y * tileHeight;


        ctx.moveTo(
            startX * tileWidth,
            worldY
        );


        ctx.lineTo(
            endX * tileWidth,
            worldY
        );

    }

    ctx.strokeStyle =
        "rgba(255, 255, 255, 0.45)";


    ctx.lineWidth =
        1 /
        camera.zoom;


    ctx.stroke();

    ctx.restore();

}


/* =========================================================
   DRAW HOVER TILE
   ========================================================= */

function drawTileHighlight() {

    if (
        !mapLoaded ||
        !mouse.insideCanvas
    ) {

        return;

    }


    if (
        mouse.tileX < 0 ||
        mouse.tileY < 0 ||
        mouse.tileX >= mapWidth ||
        mouse.tileY >= mapHeight
    ) {

        return;

    }


    const x =
        mouse.tileX *
        tileWidth;


    const y =
        mouse.tileY *
        tileHeight;


    ctx.fillStyle =
        "rgba(255,255,255,0.14)";


    ctx.fillRect(
        x,
        y,
        tileWidth,
        tileHeight
    );


    ctx.strokeStyle =
        "rgba(255,255,255,0.9)";


    ctx.lineWidth =
        2 /
        camera.zoom;


    ctx.strokeRect(
        x,
        y,
        tileWidth,
        tileHeight
    );

}


/* =========================================================
   DRAW SELECTED TILE
   ========================================================= */

function drawSelectedTile() {

    if (!selectedTile) {
        return;
    }


    const x =
        selectedTile.x *
        tileWidth;


    const y =
        selectedTile.y *
        tileHeight;


    ctx.strokeStyle =
        "rgba(255, 220, 80, 1)";


    ctx.lineWidth =
        3 /
        camera.zoom;


    ctx.strokeRect(
        x + 1,
        y + 1,
        tileWidth - 2,
        tileHeight - 2
    );

}


/* =========================================================
   DEBUG UI
   ========================================================= */

function updateDebugUI() {

    debugTile.textContent =
        `${mouse.tileX}, ${mouse.tileY}`;


    debugZoom.textContent =
        `${Math.round(
            camera.zoom * 100
        )}%`;


    const info =
        getTileInfo(
            mouse.tileX,
            mouse.tileY
        );


    if (!info) {

        debugGround.textContent =
            "-";

        debugWater.textContent =
            "-";

        debugNature.textContent =
            "-";

        return;

    }


    debugGround.textContent =
        info.ground || "-";


    debugWater.textContent =
        info.water || "-";


    debugNature.textContent =
        info.nature || "-";

}


/* =========================================================
   UPDATE
   ========================================================= */

function processNewDay() {

    let foodProduced =
        0;

    for (
        const building
        of worldState.buildings
    ) {

        const def =
            BUILDING_DEFS[
                building.type
            ];


        if (!def) {
            continue;
        }


        foodProduced +=
            def.foodPerDay || 0;

    }

    const foodConsumed =
        worldState.settlement.population;


    worldState.resources.food +=
        foodProduced;


    worldState.resources.food =
        Math.max(
            0,
            worldState.resources.food
        );


    processPopulationGrowth();


    console.log(
        `Day ${worldState.time.day}: +${foodProduced} Food, -${foodConsumed} Food`
    );


    updateSettlementUI();

}

function processPopulationGrowth() {

    const population =
        worldState.settlement.population;


    const capacity =
        getPopulationCapacity();


    if (
        population >= capacity
    ) {

        return;

    }

    if (
        worldState.resources.food <
        MIN_FOOD_FOR_POPULATION_GROWTH
    ) {

        return;

    }

    worldState.settlement.population +=
        1;


    console.log(
        "A new settler has arrived."
    );

}

function updateSimulation(
    deltaTime
) {

    if (
        !worldState.settlement.founded
    ) {

        return;

    }

    if (
        settingsOpen ||
        namingSettlement ||
        buildModeActive
    ) {

        return;

    }

    worldState.time.elapsed +=
        deltaTime;


    while (
        worldState.time.elapsed >=
        SECONDS_PER_DAY
    ) {

        worldState.time.elapsed -=
            SECONDS_PER_DAY;


        worldState.time.day +=
            1;


        processNewDay();

    }

}

function update(
    deltaTime
) {

    updateMouseWorldPosition();

    updateDebugUI();

    updateSimulation(
        deltaTime
    );

    updateClockUI();

}

function getPopulationCapacity() {

    let capacity =
        0;


    for (
        const building
        of worldState.buildings
    ) {

        const def =
            BUILDING_DEFS[
                building.type
            ];


        if (!def) {
            continue;
        }


        capacity +=
            def.housingCapacity || 0;

    }


    return capacity;

}

function updateClockUI() {

    const dayProgress =
        worldState.time.elapsed /
        SECONDS_PER_DAY;

    const hoursPassed =
        Math.floor(
            dayProgress * 24
        );

    const hour =
        (
            8 +
            hoursPassed
        ) % 24;

    gameTimeText.textContent =
        `${String(hour).padStart(2, "0")}:00`;

}

function updateSettlementUI() {

    gameDayText.textContent =
        worldState.time.day;

    settlementNameText.textContent =
        worldState.settlement.name;


    const populationCapacity =
        getPopulationCapacity();


    settlementPopulationText.textContent =
        `${worldState.settlement.population} / ${populationCapacity}`;


    resourceFoodText.textContent =
        worldState.resources.food;


    resourceWoodText.textContent =
        worldState.resources.wood;


    resourceStoneText.textContent =
        worldState.resources.stone;

}

/* =========================================================
   RENDER
   ========================================================= */

function render() {

    const dpr =
        window.devicePixelRatio || 1;


    ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    );


    drawBackground();


    if (!mapLoaded) {

        ctx.fillStyle =
            "white";


        ctx.font =
            "16px monospace";


        ctx.fillText(
            "Loading world...",
            20,
            90
        );


        return;

    }


    ctx.save();


    ctx.translate(
        -camera.x *
        camera.zoom,

        -camera.y *
        camera.zoom
    );


    ctx.scale(
        camera.zoom,
        camera.zoom
    );


    drawMap();

    drawRoads();

    drawBuildings();

    drawBuildGrid();

    drawBuildPreview();


    drawSelectedTile();

    drawTileHighlight();


    ctx.restore();

}


/* =========================================================
   GAME LOOP
   ========================================================= */

let lastTime =
    performance.now();


function gameLoop(
    currentTime
) {

    const deltaTime =
        Math.min(
            (
                currentTime -
                lastTime
            ) /
            1000,

            0.1
        );


    lastTime =
        currentTime;


    update(
        deltaTime
    );


    render();


    requestAnimationFrame(
        gameLoop
    );

}


/* =========================================================
   START
   ========================================================= */

async function startGame() {

    console.log(
        "Starting VQ Settlement..."
    );


    await loadTiledMap();

    updateSettlementUI();
    updateSaveStatus();

    requestAnimationFrame(
        gameLoop
    );

}


startGame();