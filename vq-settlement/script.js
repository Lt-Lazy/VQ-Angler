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

const marketHallButton =
    document.getElementById(
        "tool-market-hall"
    );

const gameDayText =
    document.getElementById("game-day");

const gameTimeText =
    document.getElementById("game-time");

const timePauseButton =
    document.getElementById(
        "time-pause-button"
    );

const timeSpeedRealButton =
    document.getElementById(
        "time-speed-real"
    );

const timeSpeed1Button =
    document.getElementById(
        "time-speed-1"
    );

const timeSpeed2Button =
    document.getElementById(
        "time-speed-2"
    );

const timeSpeed5Button =
    document.getElementById(
        "time-speed-5"
    );

const timeSpeed10Button =
    document.getElementById(
        "time-speed-10"
    );

const buildingInfoPopup =
    document.getElementById(
        "building-info-popup"
    );

const buildingInfoTitle =
    document.getElementById(
        "building-info-title"
    );

const buildingInfoContent =
    document.getElementById(
        "building-info-content"
    );

const buildCategoryResourcesButton =
    document.getElementById(
        "build-category-resources"
    );

const lumberMillButton =
    document.getElementById(
        "tool-lumber-mill"
    );

const stoneQuarryButton =
    document.getElementById(
        "tool-stone-quarry"
    );

const peopleToolbarButton =
    document.getElementById(
        "toolbar-people"
    );

const peopleMenuLayer =
    document.getElementById(
        "people-menu-layer"
    );

const peopleMenuTitle =
    document.getElementById(
        "people-menu-title"
    );

const peopleMenuBackButton =
    document.getElementById(
        "people-menu-back"
    );

const peopleMenuCloseButton =
    document.getElementById(
        "people-menu-close"
    );

const peopleMenuSearchWrap =
    document.getElementById(
        "people-menu-search-wrap"
    );

const peopleMenuSearchInput =
    document.getElementById(
        "people-menu-search"
    );

const peopleMenuContent =
    document.getElementById(
        "people-menu-content"
    );

const economyToolbarButton =
    document.getElementById(
        "toolbar-economy"
    );

const economyMenuLayer =
    document.getElementById(
        "economy-menu-layer"
    );

const economyMenuCloseButton =
    document.getElementById(
        "economy-menu-close"
    );

const economyMenuContent =
    document.getElementById(
        "economy-menu-content"
    );


let activeInfoBuildingId =
    null;

let buildingInfoSignature =
    null;

let peopleMenuOpen =
    false;

let peopleMenuView =
    "families";

let selectedPeopleFamilyId =
    null;

let selectedPeopleSettlerId =
    null;

let peopleMenuSignature =
    null;

let peopleMenuRefreshAccumulator =
    0;

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

const NAMES_URL =
    "assets/data/names.json";


let nameData = {

    male: [],

    female: [],

    surnames: []

};


let tiledMap = null;

let mapWidth = 0;
let mapHeight = 0;

let tileWidth = 32;
let tileHeight = 32;

let mapLoaded = false;


const loadedTilesets = [];

const LUMBER_TREE_GROW_MIN_HOURS =
    72;

const LUMBER_TREE_GROW_MAX_HOURS =
    168;

const LUMBER_WOOD_PER_TREE =
    5;

const QUARRY_HARVEST_INTERVAL_HOURS =
    2;

const QUARRY_STONE_PER_HARVEST =
    3;

const WORK_START_HOUR =
    8;

const WORK_END_HOUR =
    16;

const LUMBER_HARVEST_INTERVAL_HOURS =
    2;

const FARM_HARVEST_INTERVAL_HOURS =
    2;

const FARM_FOOD_PER_HARVEST =
    2;

const MARKET_HALL_FOOD_CAPACITY =
    100;

const HOUSEHOLD_FOOD_DAYS =
    3;

const SETTLEMENT_CENTER_FOOD_CAPACITY =
    30;

const HOUSEHOLD_REFILL_THRESHOLD_DAYS =
    2;

const NPC_GRASS_MOVE_SPEED =
    3;

const NPC_ROAD_MOVE_SPEED =
    4.5

const NPC_COMMUTE_BUFFER_MINUTES =
    5;

const GAME_MINUTES_PER_DAY =
    1440;

const WORK_SHIFT_DURATION_MINUTES =
    (
        WORK_END_HOUR -
        WORK_START_HOUR
    ) * 60;


const NPC_STATE_HOME =
    "HOME";

const NPC_STATE_COMMUTING_TO_WORK =
    "COMMUTING_TO_WORK";

const NPC_STATE_WORKING =
    "WORKING";

const NPC_STATE_COMMUTING_HOME =
    "COMMUTING_HOME";

const NPC_STATE_BLOCKED =
    "BLOCKED";

const NPC_ROUTE_RETRY_MINUTES =
    15;

const NPC_STATE_WANDERING =
    "WANDERING";


const NPC_VISUAL_OFFSET_MAX =
    0.10;


/*
    Barn kan være ute mellom
    09:00 og 19:00.

    En simulation-day begynner
    08:00, derfor er disse offsets.
*/

const CHILD_WANDER_START_OFFSET_MINUTES =
    60;

const CHILD_WANDER_END_OFFSET_MINUTES =
    660;


const CHILD_WANDER_RADIUS_MIN =
    4;

const CHILD_WANDER_RADIUS_MAX =
    7;


const CHILD_WANDER_FIRST_DELAY_MAX_MINUTES =
    30;


const CHILD_WANDER_PAUSE_MIN_MINUTES =
    20;

const CHILD_WANDER_PAUSE_MAX_MINUTES =
    60;


const BLOCKED_WANDER_RADIUS =
    3;

const BLOCKED_WANDER_PAUSE_MIN_MINUTES =
    5;

const BLOCKED_WANDER_PAUSE_MAX_MINUTES =
    20;


const WANDER_ROUTE_ATTEMPTS =
    12;

let economyMenuOpen =
    false;

let economyMenuSignature =
    null;

let economyMenuRefreshAccumulator =
    0;

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

        housingCapacity: 5,


        foodStorageCapacity:
            SETTLEMENT_CENTER_FOOD_CAPACITY

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

        jobType:
            "Farmer",

        workerSlots:
            1

    },

    marketHall: {

        name: "Market Hall",

        label: "MARKET",

        width: 2,
        height: 2,

        cost: {

            wood: 40

        },

        jobType:
            "Market Worker",

        workerSlots:
            3,

        foodStorageCapacity:
            MARKET_HALL_FOOD_CAPACITY

    },

    lumberMill: {

        name: "Lumber Mill",

        label: "LUMBER",

        width: 1,
        height: 1,

        cost: {

            wood: 30

        },

        jobType:
            "Lumberjack",

        workerSlots:
            1,

        forestryRadius:
            2

    },

    stoneQuarry: {

        name: "Stone Quarry",

        label: "QUARRY",

        width: 2,
        height: 2,

        cost: {

            wood: 40

        },

        jobType:
            "Stonecutter",

        workerSlots:
            1

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

    production: {

        foodToday: 0,

        foodWastedToday: 0,

        woodToday: 0,

        stoneToday: 0,

        manualWoodToday: 0

    },

    foodStatus: {

        /*
            shortageActive betyr nå:
            folk fikk faktisk ikke nok
            mat til dagens måltid.
        */

        shortageActive: false,

        shortageAmount: 0,

        lastRequired: 0,

        lastConsumed: 0,

        consecutiveShortageDays: 0,

        distributionShortageActive:
            false,

        unfilledHouseholdFood:
            0,

        householdsUnableToRefill:
            0,

        hungryHouseholds:
            0,

        hungryResidents:
            0

    },

    time: {

        day: 1,

        elapsed: 0,

        lastProcessedHourIndex: null

    },


    buildings: [],

    settlers: [],
    nextSettlerId: 1,
    families: [],
    nextFamilyId: 1,

    roads: {},
    grownTrees: {},

    removedNature: {}

};

const npcRuntime =
    new Map();

let navigationRevision =
    0;


function markNavigationChanged() {

    navigationRevision +=
        1;

}

let buildModeActive =
    false;

let activeBuildCategory =
    null;

let buildMode = null;

let harvestMode = null;

const SECONDS_PER_DAY =
    60;

const REAL_TIME_SCALE =
    1 / 1440;

let timeScale =
    1;

let lastRunningTimeScale =
    1;

const MIN_FOOD_FOR_POPULATION_GROWTH =
    10;

const MIN_WORKING_AGE =
    16;

const SAVE_KEY =
    "vq-settlement-save-v1";


let settingsOpen =
    false;

let namingSettlement =
    false;

function updateTimeControlsUI() {

    timePauseButton.classList.toggle(
        "active",
        timeScale === 0
    );

    timeSpeedRealButton.classList.toggle(
        "active",
        timeScale === REAL_TIME_SCALE
    );


    timeSpeed1Button.classList.toggle(
        "active",
        timeScale === 1
    );

    timeSpeed2Button.classList.toggle(
        "active",
        timeScale === 2
    );

    timeSpeed5Button.classList.toggle(
        "active",
        timeScale === 5
    );


    timeSpeed10Button.classList.toggle(
        "active",
        timeScale === 10
    );


    timePauseButton.textContent =
        timeScale === 0
            ? "Play"
            : "Pause";

}

function setTimeScale(
    newTimeScale
) {

    if (
        newTimeScale !== 0 &&
        newTimeScale !== REAL_TIME_SCALE &&
        newTimeScale !== 1 &&
        newTimeScale !== 2 &&
        newTimeScale !== 5 &&
        newTimeScale !== 10
    ) {

        return;

    }


    if (
        newTimeScale > 0
    ) {

        lastRunningTimeScale =
            newTimeScale;

    }


    timeScale =
        newTimeScale;


    updateTimeControlsUI();

}

timePauseButton.addEventListener(
    "click",
    () => {

        if (
            timeScale === 0
        ) {

            setTimeScale(
                lastRunningTimeScale
            );

        }
        else {

            setTimeScale(
                0
            );

        }

    }
);

timeSpeedRealButton.addEventListener(
    "click",
    () => {

        setTimeScale(
            REAL_TIME_SCALE
        );

    }
);

timeSpeed1Button.addEventListener(
    "click",
    () => {

        setTimeScale(
            1
        );

    }
);

timeSpeed2Button.addEventListener(
    "click",
    () => {

        setTimeScale(
            2
        );

    }
);

timeSpeed5Button.addEventListener(
    "click",
    () => {

        setTimeScale(
            5
        );

    }
);

timeSpeed10Button.addEventListener(
    "click",
    () => {

        setTimeScale(
            10
        );

    }
);

function getEffectiveTimeScale() {

    if (
        settingsOpen ||
        namingSettlement ||
        buildModeActive
    ) {

        return 0;

    }

    return timeScale;

}

/* =========================================================
   HELP FUNCTIONS
   ========================================================= */

function randomInteger(
    min,
    max
) {

    return Math.floor(
        Math.random() *
        (max - min + 1)
    ) + min;

}

function getStableNpcVisualOffset(
    settlerId
) {

    /*
        Pseudo-random basert på ID.

        Dermed får NPC-en samme offset
        etter reload også.
    */

    const seedX =
        Math.sin(
            settlerId *
            12.9898
        ) *
        43758.5453;


    const seedY =
        Math.sin(
            (
                settlerId +
                37
            ) *
            78.233
        ) *
        43758.5453;


    const randomX =
        seedX -
        Math.floor(
            seedX
        );


    const randomY =
        seedY -
        Math.floor(
            seedY
        );


    return {

        x:
            (
                randomX *
                2 -
                1
            ) *
            NPC_VISUAL_OFFSET_MAX,

        y:
            (
                randomY *
                2 -
                1
            ) *
            NPC_VISUAL_OFFSET_MAX

    };

}

function getLoadedTileByName(
    name
) {

    for (
        const tileset
        of loadedTilesets
    ) {

        for (
            const tile
            of tileset.tiles.values()
        ) {

            if (
                tile.properties.name ===
                name
            ) {

                return tile;

            }

        }

    }


    return null;

}


function drawGrownTrees() {

    const treeTile =
        getLoadedTileByName(
            "tree"
        );


    if (!treeTile) {
        return;
    }


    for (
        const key
        of Object.keys(
            worldState.grownTrees
        )
    ) {

        if (
            worldState.grownTrees[key] !==
            true
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


        ctx.drawImage(
            treeTile.image,

            x * tileWidth,

            y * tileHeight,

            treeTile.width,

            treeTile.height
        );

    }

}

function getAbsoluteGameHourIndex() {

    const hoursIntoDay =
        Math.floor(
            (
                worldState.time.elapsed /
                SECONDS_PER_DAY
            ) *
            24
        );


    return (
        (
            worldState.time.day - 1
        ) *
        24
    ) + hoursIntoDay;

}


function getClockHourFromIndex(
    hourIndex
) {

    return (
        8 +
        (
            hourIndex %
            24
        )
    ) % 24;

}


function isLumberHarvestHour(
    hour
) {

    /*
        Arbeidet starter 08:00.

        Første ferdige tre kommer
        etter to timers arbeid,
        altså 10:00.
    */

    if (
        hour <= WORK_START_HOUR ||
        hour > WORK_END_HOUR
    ) {

        return false;

    }


    return (
        (
            hour -
            WORK_START_HOUR
        ) %
        LUMBER_HARVEST_INTERVAL_HOURS
    ) === 0;

}


function processLumberHarvest(
    hour
) {

    if (
        !isLumberHarvestHour(
            hour
        )
    ) {

        return;

    }


    let woodProduced =
        0;


    for (
        const building
        of worldState.buildings
    ) {

        if (
            building.type !==
            "lumberMill"
        ) {

            continue;

        }


        const workers =
            getActiveBuildingWorkers(
                building.id
            );


        /*
            Ingen Lumberjack =
            ingen hogst.
        */

        if (
            workers.length <= 0
        ) {

            continue;

        }


        if (
            !building.treeGrowth ||
            typeof building.treeGrowth !==
            "object"
        ) {

            building.treeGrowth =
                {};

        }


        const availableTrees =
            getLumberZoneTiles(
                building
            ).filter(
                tile =>
                    hasTreeAt(
                        tile.x,
                        tile.y
                    )
            );


        if (
            availableTrees.length <= 0
        ) {

            continue;

        }


        /*
            Velg ett tilfeldig tre.
        */

        const tree =
            availableTrees[
                Math.floor(
                    Math.random() *
                    availableTrees.length
                )
            ];


        removeTreeAt(
            tree.x,
            tree.y
        );


        const key =
            getTileKey(
                tree.x,
                tree.y
            );


        /*
            Den tomme plassen får
            senere en ny growth timer.
        */

        delete building.treeGrowth[
            key
        ];


        /*
            Wood går direkte til
            settlement storage.
        */

        worldState.resources.wood +=
            LUMBER_WOOD_PER_TREE;


        worldState.production.woodToday +=
            LUMBER_WOOD_PER_TREE;


        woodProduced +=
            LUMBER_WOOD_PER_TREE;


        console.log(
            `${String(hour).padStart(2, "0")}:00 - Lumberjack cut a tree. +${LUMBER_WOOD_PER_TREE} Wood`
        );

    }


    if (
        woodProduced > 0
    ) {

        updateSettlementUI();

    }

}


function processLumberTreeGrowthHour() {

    for (
        const building
        of worldState.buildings
    ) {

        if (
            building.type !==
            "lumberMill"
        ) {

            continue;

        }


        if (
            !building.treeGrowth ||
            typeof building.treeGrowth !==
            "object"
        ) {

            building.treeGrowth =
                {};

        }


        const tiles =
            getLumberZoneTiles(
                building
            );


        for (
            const tile
            of tiles
        ) {

            /*
                Eksisterende tre trenger
                ingen growth timer.
            */

            if (
                hasTreeAt(
                    tile.x,
                    tile.y
                )
            ) {

                continue;

            }


            /*
                Stein, vann, vei,
                bygning osv.
            */

            if (
                !canGrowTreeAt(
                    tile.x,
                    tile.y
                )
            ) {

                continue;

            }


            const key =
                getTileKey(
                    tile.x,
                    tile.y
                );


            /*
                Ny ledig tile får sin
                egen tilfeldige veksttid.
            */

            if (
                !Number.isFinite(
                    building.treeGrowth[
                        key
                    ]
                )
            ) {

                building.treeGrowth[
                    key
                ] =
                    randomInteger(
                        LUMBER_TREE_GROW_MIN_HOURS,
                        LUMBER_TREE_GROW_MAX_HOURS
                    );


                continue;

            }


            building.treeGrowth[
                key
            ] -=
                1;


            /*
                Ferdig utvokst.
            */

            if (
                building.treeGrowth[
                    key
                ] <= 0
            ) {

                worldState.grownTrees[
                    key
                ] =
                    true;


                delete building.treeGrowth[
                    key
                ];

                markNavigationChanged();

            }

        }

    }

}

function isFarmHarvestHour(
    hour
) {

    /*
        Første harvest kommer
        etter to timers arbeid:
        10:00.
    */

    if (
        hour <= WORK_START_HOUR ||
        hour > WORK_END_HOUR
    ) {

        return false;

    }


    return (
        (
            hour -
            WORK_START_HOUR
        ) %
        FARM_HARVEST_INTERVAL_HOURS
    ) === 0;

}


function processFarmHarvest(
    hour
) {

    if (
        !isFarmHarvestHour(
            hour
        )
    ) {

        return;

    }


    let foodProduced =
        0;


    let foodStored =
        0;


    let foodLost =
        0;


    for (
        const building
        of worldState.buildings
    ) {

        if (
            building.type !==
            "farm"
        ) {

            continue;

        }


        const workers =
            getActiveBuildingWorkers(
                building.id
            );


        if (
            workers.length <= 0
        ) {

            continue;

        }


        const result =
            storeFoodInDepots(
                FARM_FOOD_PER_HARVEST
            );


        /*
            Production teller det farmen
            faktisk produserte, også hvis
            lageret var fullt.
        */

        worldState.production
            .foodToday +=
                FARM_FOOD_PER_HARVEST;


        worldState.production
            .foodWastedToday +=
                result.lost;


        foodProduced +=
            FARM_FOOD_PER_HARVEST;


        foodStored +=
            result.stored;


        foodLost +=
            result.lost;


        console.log(
            `${String(hour).padStart(2, "0")}:00 - Farm produced ${FARM_FOOD_PER_HARVEST} Food. Stored ${result.stored}, lost ${result.lost}.`
        );

    }


    if (
        foodProduced > 0
    ) {

        updateSettlementUI();

    }

}

function isQuarryHarvestHour(
    hour
) {

    if (
        hour <= WORK_START_HOUR ||
        hour > WORK_END_HOUR
    ) {

        return false;

    }


    return (
        (
            hour -
            WORK_START_HOUR
        ) %
        QUARRY_HARVEST_INTERVAL_HOURS
    ) === 0;

}


function processQuarryHarvest(
    hour
) {

    if (
        !isQuarryHarvestHour(
            hour
        )
    ) {

        return;

    }


    let stoneProduced =
        0;


    for (
        const building
        of worldState.buildings
    ) {

        if (
            building.type !==
            "stoneQuarry"
        ) {

            continue;

        }


        const workers =
            getActiveBuildingWorkers(
                building.id
            );


        /*
            Ingen Stonecutter på jobb =
            ingen produksjon.
        */

        if (
            workers.length <= 0
        ) {

            continue;

        }


        worldState.resources.stone +=
            QUARRY_STONE_PER_HARVEST;


        /*
            Economy-systemet fra
            forrige steg.
        */

        worldState.production.stoneToday +=
            QUARRY_STONE_PER_HARVEST;


        stoneProduced +=
            QUARRY_STONE_PER_HARVEST;


        console.log(
            `${String(hour).padStart(2, "0")}:00 - Quarry produced stone. +${QUARRY_STONE_PER_HARVEST} Stone`
        );

    }


    if (
        stoneProduced > 0
    ) {

        updateSettlementUI();

    }

}

function processGameHours() {

    const currentHourIndex =
        getAbsoluteGameHourIndex();


    /*
        Første gang:
        start fra nåværende klokkeslett.

        Dette hindrer at gamle timer
        kjøres på nytt når save lastes.
    */

    if (
        !Number.isInteger(
            worldState.time
                .lastProcessedHourIndex
        )
    ) {

        worldState.time
            .lastProcessedHourIndex =
                currentHourIndex;

        return;

    }


    while (
        worldState.time
            .lastProcessedHourIndex <
        currentHourIndex
    ) {

        worldState.time
            .lastProcessedHourIndex +=
                1;


        const hour =
            getClockHourFromIndex(
                worldState.time
                    .lastProcessedHourIndex
            );

        processFarmHarvest(
            hour
        );

        processLumberHarvest(
            hour
        );

        processQuarryHarvest(
            hour
        );

        processLumberTreeGrowthHour();

    }

}

function hasTreeAt(
    x,
    y
) {

    const key =
        getTileKey(
            x,
            y
        );


    if (
        worldState.grownTrees[key] ===
        true
    ) {

        return true;

    }


    if (
        isNatureRemoved(
            x,
            y
        )
    ) {

        return false;

    }


    return (
        getTileName(
            "nature",
            x,
            y
        ) === "tree"
    );

}


function removeTreeAt(
    x,
    y
) {

    const key =
        getTileKey(
            x,
            y
        );


    if (
        worldState.grownTrees[key] ===
        true
    ) {

        delete worldState.grownTrees[
            key
        ];

        markNavigationChanged();

        return;

    }


    if (
        getTileName(
            "nature",
            x,
            y
        ) === "tree"
    ) {

        removeNatureAt(
            x,
            y
        );

    }

}

function getLumberZoneTiles(
    building
) {

    const zone =
        getLumberZoneBounds(
            building
        );


    const tiles =
        [];


    for (
        let y = zone.minY;
        y <= zone.maxY;
        y++
    ) {

        for (
            let x = zone.minX;
            x <= zone.maxX;
            x++
        ) {

            tiles.push({
                x,
                y
            });

        }

    }


    return tiles;

}

function canGrowTreeAt(
    x,
    y
) {

    /*
        Bygninger blokkerer.
    */

    if (
        tileHasBuilding(
            x,
            y
        )
    ) {

        return false;

    }

    if (
        isLumberMillEntranceTile(
            x,
            y
        )
    ) {

        return false;

    }

    /*
        Roads blokkerer tree growth.
    */

    if (
        tileHasRoad(
            x,
            y
        )
    ) {

        return false;

    }


    /*
        Water blokkerer.
    */

    if (
        getTileName(
            "water",
            x,
            y
        )
    ) {

        return false;

    }


    /*
        Eksisterende stein / annen nature
        blokkerer growth.

        Et eksisterende tree er derimot OK.
    */

    if (
        !isNatureRemoved(
            x,
            y
        )
    ) {

        const nature =
            getTileName(
                "nature",
                x,
                y
            );


        if (
            nature &&
            nature !== "tree"
        ) {

            return false;

        }

    }


    return true;

}

function generateAgeForRelation(
    relation
) {

    if (
        relation === "Son" ||
        relation === "Daughter"
    ) {

        return randomInteger(
            2,
            15
        );

    }


    if (
        relation === "Father" ||
        relation === "Mother"
    ) {

        return randomInteger(
            25,
            55
        );

    }


    return randomInteger(
        18,
        60
    );

}


function canSettlerWork(
    settler
) {

    return (
        settler.age >=
        MIN_WORKING_AGE
    );

}

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

function getRandomArrayItem(
    array
) {

    if (
        !Array.isArray(array) ||
        array.length === 0
    ) {

        return null;

    }


    const index =
        Math.floor(
            Math.random() *
            array.length
        );


    return array[index];

}


function getRandomGender() {

    return (
        Math.random() < 0.5
            ? "male"
            : "female"
    );

}


function generateSettlerIdentity(
    id,
    gender = null,
    lastName = null
) {

    const selectedGender =
        gender ||
        getRandomGender();


    const firstNamePool =
        selectedGender === "female"
            ? nameData.female
            : nameData.male;


    const firstName =
        getRandomArrayItem(
            firstNamePool
        ) ||
        `Settler ${id}`;


    const selectedLastName =
        lastName ||
        getRandomArrayItem(
            nameData.surnames
        ) ||
        "";


    const fullName =
        selectedLastName
            ? `${firstName} ${selectedLastName}`
            : firstName;


    return {

        gender:
            selectedGender,

        firstName:
            firstName,

        lastName:
            selectedLastName,

        fullName:
            fullName

    };

}

function openSettingsMenu() {

    closePeopleMenu();

    closeEconomyMenu();

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

    marketHallButton.classList.remove(
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

    lumberMillButton.classList.remove(
        "active"
    );

    stoneQuarryButton.classList.remove(
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

buildCategoryResourcesButton.addEventListener(
    "click",
    () => {

        openBuildCategory(
            "resources"
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

        production: {
            ...worldState.production
        },

        foodStatus: {
            ...worldState.foodStatus
        },

        roads: {
            ...worldState.roads
        },

        grownTrees: {
            ...worldState.grownTrees
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

        settlers:
            worldState.settlers.map(
                settler => ({
                    ...settler
                })
            ),

        nextSettlerId:
            worldState.nextSettlerId,

        families:
            worldState.families.map(
                family => ({
                    ...family,

                    memberIds: [
                        ...family.memberIds
                    ]
                })
            ),

        nextFamilyId:
            worldState.nextFamilyId,

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

        const legacySavedFood =
            Number.isFinite(
                saveData.resources?.food
            )
                ? saveData.resources.food
                : 0;

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

            elapsed: 0,

            lastProcessedHourIndex: null

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

        worldState.production = {

            foodToday: 0,

            foodWastedToday: 0,

            woodToday: 0,

            stoneToday: 0,

            manualWoodToday: 0

        };


        if (
            saveData.production &&
            typeof saveData.production ===
            "object"
        ) {

            worldState.production = {
                ...worldState.production,
                ...saveData.production
            };

        }

        worldState.foodStatus = {

            shortageActive: false,

            shortageAmount: 0,

            lastRequired: 0,

            lastConsumed: 0,

            consecutiveShortageDays: 0,

            distributionShortageActive:
                false,

            unfilledHouseholdFood:
                0,

            householdsUnableToRefill:
                0,

            hungryHouseholds:
                0,

            hungryResidents:
                0

        };


        if (
            saveData.foodStatus &&
            typeof saveData.foodStatus ===
            "object"
        ) {

            worldState.foodStatus = {
                ...worldState.foodStatus,
                ...saveData.foodStatus
            };

        }

        worldState.roads =
            saveData.roads &&
            typeof saveData.roads === "object"
                ? {
                    ...saveData.roads
                }
                : {};

        worldState.grownTrees =
            saveData.grownTrees &&
            typeof saveData.grownTrees === "object"
                ? {
                    ...saveData.grownTrees
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

        for (
            const building
            of worldState.buildings
        ) {

            if (
                building.type !==
                    "settlementCenter" &&
                building.type !==
                    "marketHall"
            ) {

                continue;

            }


            if (
                !Number.isFinite(
                    building.foodStorage
                )
            ) {

                building.foodStorage =
                    0;

            }

        }


        worldState.settlers =
            Array.isArray(
                saveData.settlers
            )
                ? saveData.settlers.map(
                    settler => ({
                        ...settler
                    })
                )
                : [];

        for (
            const settler
            of worldState.settlers
        ) {

            if (
                !settler.firstName ||
                !settler.gender
            ) {

                const identity =
                    generateSettlerIdentity(
                        settler.id
                    );


                settler.firstName =
                    identity.firstName;

                settler.lastName =
                    identity.lastName;

                settler.name =
                    identity.fullName;

                settler.gender =
                    identity.gender;

            }

            if (
                !Number.isFinite(
                    settler.age
                )
            ) {

                settler.age =
                    generateAgeForRelation(
                        settler.relation
                    );

            }

        }

        for (
            const building
            of worldState.buildings
        ) {

            if (
                building.type !==
                "lumberMill"
            ) {

                continue;

            }


            if (
                Number.isInteger(
                    building.entranceX
                ) &&
                Number.isInteger(
                    building.entranceY
                )
            ) {

                continue;

            }


            const entrance =
                findLumberMillEntrance(
                    building.x,
                    building.y
                );


            if (entrance) {

                building.entranceX =
                    entrance.x;


                building.entranceY =
                    entrance.y;

            }

        }

        worldState.nextSettlerId =
            Number.isInteger(
                saveData.nextSettlerId
            )
                ? saveData.nextSettlerId
                : 1;

        for (
            const settler
            of worldState.settlers
        ) {

            if (
                settler.id >=
                worldState.nextSettlerId
            ) {

                worldState.nextSettlerId =
                    settler.id + 1;

            }

        }

        worldState.families =
            Array.isArray(
                saveData.families
            )
                ? saveData.families.map(
                    family => ({
                        ...family,

                        memberIds:
                            Array.isArray(
                                family.memberIds
                            )
                                ? [...family.memberIds]
                                : []
                    })
                )
                : [];


        worldState.nextFamilyId =
            Number.isInteger(
                saveData.nextFamilyId
            )
                ? saveData.nextFamilyId
                : 1;

        for (
            const family
            of worldState.families
        ) {

            if (
                !Number.isFinite(
                    family.foodStorage
                )
            ) {

                family.foodStorage =
                    0;

            }

            if (
                family.id >=
                worldState.nextFamilyId
            ) {

                worldState.nextFamilyId =
                    family.id + 1;

            }

        }

        /*
            Migrer Food fra gamle saves.

            Gamle saves hadde maten direkte
            i resources.food og ikke i
            fysiske lagre.
        */

        if (
            getTotalFoodAvailable() === 0 &&
            legacySavedFood > 0
        ) {

            storeFoodInDepots(
                legacySavedFood
            );

        }


        syncLegacyFoodResource();

        npcRuntime.clear();

        normalizeJobAssignments();

        syncPopulationCount();

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

        marketHallButton.disabled =
            !worldState.settlement.founded;

        roadButton.disabled =
            !worldState.settlement.founded;

        lumberMillButton.disabled =
            !worldState.settlement.founded;

        stoneQuarryButton.disabled =
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

        elapsed: 0,

        lastProcessedHourIndex: null

    };

    worldState.resources = {

        food: 0,

        wood: 0,

        stone: 0

    };

    worldState.production = {

        foodToday: 0,

        foodWastedToday: 0,

        woodToday: 0,

        stoneToday: 0,

        manualWoodToday: 0

    };

    worldState.foodStatus = {

        shortageActive: false,

        shortageAmount: 0,

        lastRequired: 0,

        lastConsumed: 0,

        consecutiveShortageDays: 0,

        distributionShortageActive:
            false,

        unfilledHouseholdFood:
            0,

        householdsUnableToRefill:
            0,

        hungryHouseholds:
            0,

        hungryResidents:
            0

    };

    worldState.roads =
        {};

    worldState.grownTrees =
        {};

    worldState.buildings =
        [];

    worldState.settlers =
        [];

    worldState.nextSettlerId =
        1;

    worldState.families =
        [];

    worldState.nextFamilyId =
        1;

    worldState.removedNature =
        {};

 
    npcRuntime.clear();

    setTimeScale(
        1
    );

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

    marketHallButton.disabled =
        true;

    roadButton.disabled =
        true;

    lumberMillButton.disabled =
        true;

    stoneQuarryButton.disabled =
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

async function loadNameData() {

    try {

        const namesURL =
            new URL(
                NAMES_URL,
                window.location.href
            ).href;


        const loaded =
            await loadJSON(
                namesURL
            );


        nameData.male =
            Array.isArray(loaded.male)
                ? loaded.male
                : [];


        nameData.female =
            Array.isArray(loaded.female)
                ? loaded.female
                : [];


        nameData.surnames =
            Array.isArray(loaded.surnames)
                ? loaded.surnames
                : [];


        console.log(
            "Names loaded:",
            nameData
        );

    }
    catch (error) {

        console.error(
            "Could not load names:",
            error
        );

    }

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


    const key =
        getTileKey(
            x,
            y
        );


    const grownTree =
        worldState.grownTrees[key] === true;


    const nature =
        grownTree
            ? "tree"
            : (
                isNatureRemoved(x, y)
                    ? null
                    : getTileName(
                        "nature",
                        x,
                        y
                    )
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
   PEOPLE MENU
   ========================================================= */

function escapeHTML(
    value
) {

    return String(
        value ?? ""
    )
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            "\"",
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );

}


function getSettlerById(
    settlerId
) {

    return (
        worldState.settlers.find(
            settler =>
                settler.id ===
                settlerId
        ) || null
    );

}


function getFamilyMembers(
    family
) {

    if (!family) {
        return [];
    }


    const members =
        [];


    for (
        const memberId
        of family.memberIds
    ) {

        const settler =
            getSettlerById(
                memberId
            );


        if (settler) {

            members.push(
                settler
            );

        }

    }


    return members;

}


function getPeopleBuildingName(
    buildingId
) {

    if (
        buildingId === null ||
        buildingId === undefined
    ) {

        return "None";

    }


    const building =
        getBuildingById(
            buildingId
        );


    if (!building) {

        return "Unknown";

    }


    const def =
        BUILDING_DEFS[
            building.type
        ];


    return (
        def?.name ||
        building.type
    );

}


function getSettlerPeopleStatus(
    settler
) {

    const runtime =
        npcRuntime.get(
            settler.id
        );


    if (!runtime) {

        return "At home";

    }


    return getSettlerWorkStatus(
        settler
    );

}


function openPeopleMenu() {

    if (
        settingsOpen ||
        namingSettlement ||
        buildModeActive
    ) {

        return;

    }

    closeEconomyMenu();

    closeBuildingInfo();

    cancelHarvestMode();


    peopleMenuOpen =
        true;


    peopleMenuView =
        "families";


    selectedPeopleFamilyId =
        null;


    selectedPeopleSettlerId =
        null;


    peopleMenuSearchInput.value =
        "";


    peopleMenuSignature =
        null;


    peopleMenuRefreshAccumulator =
        0;


    peopleToolbarButton.classList.add(
        "active"
    );


    peopleMenuLayer.classList.add(
        "open"
    );


    renderPeopleMenu();

}


function closePeopleMenu() {

    peopleMenuOpen =
        false;


    selectedPeopleFamilyId =
        null;


    selectedPeopleSettlerId =
        null;


    peopleMenuSignature =
        null;


    peopleToolbarButton.classList.remove(
        "active"
    );


    peopleMenuLayer.classList.remove(
        "open"
    );

}


function renderPeopleFamilyList() {

    peopleMenuTitle.textContent =
        "People";


    peopleMenuBackButton.hidden =
        true;


    peopleMenuSearchWrap.hidden =
        false;


    const search =
        peopleMenuSearchInput
            .value
            .trim()
            .toLowerCase();


    const families =
        [...worldState.families]
            .filter(
                family => {

                    if (!search) {
                        return true;
                    }


                    return (
                        family.lastName
                            .toLowerCase()
                            .includes(
                                search
                            )
                    );

                }
            )
            .sort(
                (a, b) =>
                    a.lastName.localeCompare(
                        b.lastName
                    )
            );


    if (
        families.length === 0
    ) {

        peopleMenuContent.innerHTML =
            `
            <div class="people-menu-empty">
                No families found.
            </div>
            `;


        return;

    }


    let html =
        "";


    for (
        const family
        of families
    ) {

        const members =
            getFamilyMembers(
                family
            );


        const memberText =
            members.length === 1
                ? "1 member"
                : `${members.length} members`;


        html +=
            `
            <button
                class="people-list-entry"
                data-family-id="${family.id}"
            >

                <span class="people-entry-name">
                    ${escapeHTML(
                        family.lastName
                    )} Family
                </span>

                <span class="people-entry-secondary">
                    ${memberText}
                </span>

            </button>
            `;

    }


    peopleMenuContent.innerHTML =
        html;

}


function renderPeopleFamilyView() {

    const family =
        getFamilyById(
            selectedPeopleFamilyId
        );


    if (!family) {

        peopleMenuView =
            "families";


        selectedPeopleFamilyId =
            null;


        renderPeopleMenu();

        return;

    }


    peopleMenuTitle.textContent =
        `${family.lastName} Family`;


    peopleMenuBackButton.hidden =
        false;


    peopleMenuSearchWrap.hidden =
        true;


    const members =
        getFamilyMembers(
            family
        );


    let html =
        `
        <div class="people-info-section">

            <div>
                <span class="people-info-label">
                    Family:
                </span>

                ${escapeHTML(
                    family.lastName
                )}
            </div>

            <div>
                <span class="people-info-label">
                    Home:
                </span>

                ${escapeHTML(
                    getPeopleBuildingName(
                        family.homeId
                    )
                )}
            </div>

            <div>
                <span class="people-info-label">
                    Arrived:
                </span>

                Day ${family.foundedDay}
            </div>

            <div>
                <span class="people-info-label">
                    Members:
                </span>

                ${members.length}
            </div>

        </div>
        `;


    if (
        members.length === 0
    ) {

        html +=
            `
            <div class="people-menu-empty">
                No family members.
            </div>
            `;

    }


    for (
        const settler
        of members
    ) {

        const relation =
            settler.relation ||
            "Member";


        html +=
            `
            <button
                class="people-list-entry"
                data-settler-id="${settler.id}"
            >

                <span class="people-entry-name">
                    ${escapeHTML(
                        settler.name
                    )}
                </span>

                <span class="people-entry-secondary">
                    ${escapeHTML(
                        relation
                    )}<br>
                    Age ${settler.age}
                </span>

            </button>
            `;

    }


    peopleMenuContent.innerHTML =
        html;

}


function renderPeopleSettlerView() {

    const settler =
        getSettlerById(
            selectedPeopleSettlerId
        );


    if (!settler) {

        peopleMenuView =
            "families";


        selectedPeopleSettlerId =
            null;


        renderPeopleMenu();

        return;

    }


    const family =
        getFamilyById(
            settler.familyId
        );


    peopleMenuTitle.textContent =
        settler.name;


    peopleMenuBackButton.hidden =
        false;


    peopleMenuSearchWrap.hidden =
        true;


    const job =
        settler.job ||
        (
            canSettlerWork(
                settler
            )
                ? "Unemployed"
                : "Child"
        );


    const workplace =
        settler.workplaceId !==
        null
            ? getPeopleBuildingName(
                settler.workplaceId
            )
            : "None";


    const home =
        getPeopleBuildingName(
            settler.homeId
        );


    const familyName =
        family
            ? `${family.lastName} Family`
            : "None";


    const status =
        getSettlerPeopleStatus(
            settler
        );


    peopleMenuContent.innerHTML =
        `
        <div class="people-info-section">

            <div>
                <span class="people-info-label">
                    Name:
                </span>

                ${escapeHTML(
                    settler.name
                )}
            </div>

            <div>
                <span class="people-info-label">
                    Age:
                </span>

                ${settler.age}
            </div>

            <div>
                <span class="people-info-label">
                    Gender:
                </span>

                ${escapeHTML(
                    settler.gender
                )}
            </div>

            <div>
                <span class="people-info-label">
                    Family:
                </span>

                ${escapeHTML(
                    familyName
                )}
            </div>

            <div>
                <span class="people-info-label">
                    Family role:
                </span>

                ${escapeHTML(
                    settler.relation ||
                    "Member"
                )}
            </div>

        </div>


        <div class="people-info-section">

            <div>
                <span class="people-info-label">
                    Home:
                </span>

                ${escapeHTML(
                    home
                )}
            </div>

            <div>
                <span class="people-info-label">
                    Job:
                </span>

                ${escapeHTML(
                    job
                )}
            </div>

            <div>
                <span class="people-info-label">
                    Workplace:
                </span>

                ${escapeHTML(
                    workplace
                )}
            </div>

            <div>
                <span class="people-info-label">
                    Status:
                </span>

                ${escapeHTML(
                    status
                )}
            </div>

            <div>
                <span class="people-info-label">
                    Arrived:
                </span>

                Day ${settler.arrivedDay}
            </div>

        </div>
        `;

}


function renderPeopleMenu() {

    if (!peopleMenuOpen) {
        return;
    }


    if (
        peopleMenuView ===
        "family"
    ) {

        renderPeopleFamilyView();

    }
    else if (
        peopleMenuView ===
        "settler"
    ) {

        renderPeopleSettlerView();

    }
    else {

        renderPeopleFamilyList();

    }


    peopleMenuSignature =
        getPeopleMenuSignature();

}


function getPeopleMenuSignature() {

    const familyData =
        worldState.families.map(
            family => [

                family.id,

                family.lastName,

                family.homeId,

                family.foundedDay,

                family.memberIds.join(
                    ","
                )

            ]
        );


    const settlerData =
        worldState.settlers.map(
            settler => {

                const runtime =
                    npcRuntime.get(
                        settler.id
                    );


                return [

                    settler.id,

                    settler.name,

                    settler.age,

                    settler.familyId,

                    settler.homeId,

                    settler.relation,

                    settler.job,

                    settler.workplaceId,

                    runtime
                        ? runtime.state
                        : null,

                    runtime
                        ? runtime.blockedFromState
                        : null

                ];

            }
        );


    return JSON.stringify({

        view:
            peopleMenuView,

        familyId:
            selectedPeopleFamilyId,

        settlerId:
            selectedPeopleSettlerId,

        search:
            peopleMenuSearchInput.value,

        families:
            familyData,

        settlers:
            settlerData

    });

}


function refreshPeopleMenu(
    deltaTime
) {

    if (!peopleMenuOpen) {
        return;
    }


    peopleMenuRefreshAccumulator +=
        deltaTime;


    /*
        Fire ganger i sekundet holder
        mer enn nok for denne typen UI.
    */

    if (
        peopleMenuRefreshAccumulator <
        0.25
    ) {

        return;

    }


    peopleMenuRefreshAccumulator =
        0;


    const newSignature =
        getPeopleMenuSignature();


    if (
        newSignature ===
        peopleMenuSignature
    ) {

        return;

    }


    renderPeopleMenu();

}


peopleToolbarButton.addEventListener(
    "click",
    () => {

        if (peopleMenuOpen) {

            closePeopleMenu();

        }
        else {

            openPeopleMenu();

        }

    }
);


peopleMenuCloseButton.addEventListener(
    "click",
    () => {

        closePeopleMenu();

    }
);


peopleMenuBackButton.addEventListener(
    "click",
    () => {

        if (
            peopleMenuView ===
            "settler"
        ) {

            peopleMenuView =
                "family";


            selectedPeopleSettlerId =
                null;

        }
        else if (
            peopleMenuView ===
            "family"
        ) {

            peopleMenuView =
                "families";


            selectedPeopleFamilyId =
                null;

        }


        peopleMenuSignature =
            null;


        renderPeopleMenu();

    }
);


peopleMenuSearchInput.addEventListener(
    "input",
    () => {

        peopleMenuSignature =
            null;


        renderPeopleMenu();

    }
);


peopleMenuContent.addEventListener(
    "click",
    (event) => {

        const familyButton =
            event.target.closest(
                "[data-family-id]"
            );


        if (familyButton) {

            selectedPeopleFamilyId =
                Number(
                    familyButton.dataset.familyId
                );


            selectedPeopleSettlerId =
                null;


            peopleMenuView =
                "family";


            peopleMenuSignature =
                null;


            renderPeopleMenu();

            return;

        }


        const settlerButton =
            event.target.closest(
                "[data-settler-id]"
            );


        if (settlerButton) {

            selectedPeopleSettlerId =
                Number(
                    settlerButton.dataset.settlerId
                );


            peopleMenuView =
                "settler";


            peopleMenuSignature =
                null;


            renderPeopleMenu();

        }

    }
);

/* =========================================================
   ECONOMY MENU
   ========================================================= */

function openEconomyMenu() {

    if (
        settingsOpen ||
        namingSettlement ||
        buildModeActive
    ) {

        return;

    }


    closePeopleMenu();

    closeBuildingInfo();

    cancelHarvestMode();


    economyMenuOpen =
        true;


    economyMenuSignature =
        null;


    economyMenuRefreshAccumulator =
        0;


    economyToolbarButton.classList.add(
        "active"
    );


    economyMenuLayer.classList.add(
        "open"
    );


    renderEconomyMenu();

}


function closeEconomyMenu() {

    economyMenuOpen =
        false;


    economyMenuSignature =
        null;


    economyToolbarButton.classList.remove(
        "active"
    );


    economyMenuLayer.classList.remove(
        "open"
    );

}


function getEconomyMenuSignature() {

    return JSON.stringify({

        population:
            getPopulation(),

        totalFood:
            getTotalFoodAvailable(),

        marketFood:
            getTotalMarketFood(),

        centerFood:
            getTotalCenterFood(),

        householdFood:
            getTotalHouseholdFood(),

        wood:
            worldState.resources.wood,

        stone:
            worldState.resources.stone,

        production:
            worldState.production,

        foodStatus:
            worldState.foodStatus

    });

}


function renderEconomyMenu() {

    if (!economyMenuOpen) {
        return;
    }


    const population =
        getPopulation();


    const foodProduced =
        worldState.production
            .foodToday;


    const foodWasted =
        worldState.production
            .foodWastedToday || 0;


    const foodBalance =
        foodProduced -
        population;


    const marketFood =
        getTotalMarketFood();


    const marketCapacity =
        getTotalMarketFoodCapacity();


    const centerFood =
        getTotalCenterFood();


    const centerCapacity =
        getTotalCenterFoodCapacity();


    const householdFood =
        getTotalHouseholdFood();


    const householdCapacity =
        getTotalHouseholdFoodCapacity();


    const totalFood =
        getTotalFoodAvailable();


    let foodStatusText =
        "Stable";


    let foodStatusClass =
        "economy-positive";


    if (
        worldState.foodStatus
            .shortageActive
    ) {

        foodStatusText =
            "HUNGER";


        foodStatusClass =
            "economy-negative";

    }
    else if (
        worldState.foodStatus
            .distributionShortageActive
    ) {

        foodStatusText =
            "SUPPLY SHORTAGE";


        foodStatusClass =
            "economy-negative";

    }


    const balanceClass =
        foodBalance >= 0
            ? "economy-positive"
            : "economy-negative";


    const woodProduced =
        worldState.production
            .woodToday;


    const manualWood =
        worldState.production
            .manualWoodToday;


    const totalWood =
        woodProduced +
        manualWood;


    const stoneProduced =
        worldState.production
            .stoneToday;


    economyMenuContent.innerHTML =
        `
        <div class="economy-resource">

            <div class="economy-resource-title">
                Population
            </div>

            Residents:
            ${population}

            <br>

            Food consumption:
            ${population} / day

        </div>


        <div class="economy-resource">

            <div class="economy-resource-title">
                Food
            </div>

            Status:
            <span class="${foodStatusClass}">
                ${foodStatusText}
            </span>

            <br><br>

            Total food:
            ${totalFood}

            <br>

            Settlement Center:
            ${centerFood}
            /
            ${centerCapacity}

            <br>

            Market Hall:
            ${marketFood}
            /
            ${marketCapacity}

            <br>

            Households:
            ${householdFood}
            /
            ${householdCapacity}

            <br><br>

            Produced today:
            <span class="economy-positive">
                +${foodProduced}
            </span>

            <br>

            Food wasted today:
            <span class="${
                foodWasted > 0
                    ? "economy-negative"
                    : ""
            }">
                ${foodWasted}
            </span>

            <br>

            Consumption / day:
            <span class="economy-negative">
                -${population}
            </span>

            <br>

            Production balance:
            <span class="${balanceClass}">
                ${foodBalance >= 0 ? "+" : ""}
                ${foodBalance}
            </span>

            <br><br>

            Last daily meal:
            ${worldState.foodStatus.lastConsumed}
            /
            ${worldState.foodStatus.lastRequired}

            <br>

            Hungry residents:
            ${worldState.foodStatus.hungryResidents}

            <br>

            Households unable to refill:
            ${worldState.foodStatus.householdsUnableToRefill}

            <br>

            Missing household food:
            ${worldState.foodStatus.unfilledHouseholdFood}

            <br>

            Consecutive hunger days:
            ${worldState.foodStatus.consecutiveShortageDays}

        </div>


        <div class="economy-resource">

            <div class="economy-resource-title">
                Wood
            </div>

            Stored:
            ${worldState.resources.wood}

            <br>

            Lumber Mills today:
            <span class="economy-positive">
                +${woodProduced}
            </span>

            <br>

            Gathered manually:
            <span class="economy-positive">
                +${manualWood}
            </span>

            <br>

            Total gained today:
            <span class="economy-positive">
                +${totalWood}
            </span>

        </div>


        <div class="economy-resource">

            <div class="economy-resource-title">
                Stone
            </div>

            Stored:
            ${worldState.resources.stone}

            <br>

            Produced today:
            <span class="economy-positive">
                +${stoneProduced}
            </span>

        </div>
        `;


    economyMenuSignature =
        getEconomyMenuSignature();

}


function refreshEconomyMenu(
    deltaTime
) {

    if (!economyMenuOpen) {
        return;
    }


    economyMenuRefreshAccumulator +=
        deltaTime;


    if (
        economyMenuRefreshAccumulator <
        0.25
    ) {

        return;

    }


    economyMenuRefreshAccumulator =
        0;


    const signature =
        getEconomyMenuSignature();


    if (
        signature ===
        economyMenuSignature
    ) {

        return;

    }


    renderEconomyMenu();

}


economyToolbarButton.addEventListener(
    "click",
    () => {

        if (economyMenuOpen) {

            closeEconomyMenu();

        }
        else {

            openEconomyMenu();

        }

    }
);


economyMenuCloseButton.addEventListener(
    "click",
    () => {

        closeEconomyMenu();

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

    const normalItems =
        document.querySelectorAll(
            ".normal-toolbar-item"
        );


    for (
        const item
        of normalItems
    ) {

        item.hidden =
            buildModeActive;

    }


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

        buildCategoryResourcesButton.hidden =
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

    closePeopleMenu();

    closeEconomyMenu();

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

lumberMillButton.addEventListener(
    "click",
    () => {

        if (
            !worldState.settlement.founded
        ) {

            return;

        }


        if (
            buildMode ===
            "lumberMill"
        ) {

            cancelBuildMode();

            return;

        }


        activateBuildMode(
            "lumberMill",
            lumberMillButton
        );

    }
);

stoneQuarryButton.addEventListener(
    "click",
    () => {

        if (
            !worldState.settlement.founded
        ) {

            return;

        }


        if (
            buildMode ===
            "stoneQuarry"
        ) {

            cancelBuildMode();

            return;

        }


        activateBuildMode(
            "stoneQuarry",
            stoneQuarryButton
        );

    }
);

marketHallButton.addEventListener(
    "click",
    () => {

        if (
            !worldState.settlement.founded
        ) {

            return;

        }


        if (
            buildMode ===
            "marketHall"
        ) {

            cancelBuildMode();

            return;

        }


        activateBuildMode(
            "marketHall",
            marketHallButton
        );

    }
);

function cancelBuildMode() {

    buildMode = null;

    farmButton.classList.remove(
        "active"
    );

    marketHallButton.classList.remove(
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

    lumberMillButton.classList.remove(
        "active"
    );

    stoneQuarryButton.classList.remove(
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


    worldState.production.manualWoodToday +=
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

            if (peopleMenuOpen) {

                closePeopleMenu();

                return;

            }

            if (economyMenuOpen) {

                closeEconomyMenu();

                return;

            }

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

        /*
            Under bygging brukes høyreklikk
            fortsatt til å avbryte verktøyet.
        */

        if (buildMode) {

            cancelBuildMode();

            closeBuildingInfo();

            return;

        }

        if (harvestMode) {

            cancelHarvestMode();

            closeBuildingInfo();

            return;

        }

        /*

            Building info brukes kun
            i vanlig spillmodus.
        */

        if (buildModeActive) {

            closeBuildingInfo();

            return;

        }

        const building =
            getBuildingAtTile(
                mouse.tileX,
                mouse.tileY
            );


        if (!building) {

            closeBuildingInfo();

            return;

        }

        openBuildingInfo(
            building,
            mouse.screenX,
            mouse.screenY
        );

    }
);

document.addEventListener(
    "mousedown",
    (event) => {

        /*
            Venstreklikk hvor som helst
            lukker Building Info.
        */

        if (
            event.button === 0 &&
            activeInfoBuildingId !== null
        ) {

            closeBuildingInfo();

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

function getBuildingAtTile(
    tileX,
    tileY
) {

    return (
        worldState.buildings.find(
            building =>
                buildingOccupiesTile(
                    building,
                    tileX,
                    tileY
                )
        ) || null
    );

}

function closeBuildingInfo() {

    activeInfoBuildingId =
        null;


    buildingInfoSignature =
        null;


    buildingInfoPopup.classList.remove(
        "open"
    );

}

function renderBuildingInfoContent(
    building
) {

    const def =
        BUILDING_DEFS[
            building.type
        ];


    if (!def) {
        return;
    }


    buildingInfoTitle.textContent =
        def.name;


    const residents =
        worldState.settlers.filter(
            settler =>
                settler.homeId ===
                building.id
        );


    let html =
        "";


    /* =============================================
       RESIDENTS
       ============================================= */

    if (
        def.housingCapacity
    ) {

        html +=
            `Residents: ${residents.length} / ${def.housingCapacity}`;


        if (
            residents.length > 0
        ) {

            const familyGroups =
                new Map();


            for (
                const settler
                of residents
            ) {

                const familyId =
                    settler.familyId ??
                    `single-${settler.id}`;


                if (
                    !familyGroups.has(
                        familyId
                    )
                ) {

                    familyGroups.set(
                        familyId,
                        []
                    );

                }


                familyGroups
                    .get(familyId)
                    .push(settler);

            }


            for (
                const [
                    familyId,
                    members
                ]
                of familyGroups
            ) {

                html +=
                    `<div class="building-info-family">`;


                if (
                    typeof familyId ===
                    "number"
                ) {

                    const family =
                        getFamilyById(
                            familyId
                        );


                    const familyName =
                        family
                            ? `${family.lastName} Family`
                            : "Family";


                    html +=
                        `<div class="building-info-family-name">${familyName}</div>`;

                }
                else {

                    html +=
                        `<div class="building-info-family-name">Resident</div>`;

                }


                for (
                    const settler
                    of members
                ) {

                    const relation =
                        settler.relation
                            ? ` — ${settler.relation}`
                            : "";


                    const age =
                        Number.isFinite(
                            settler.age
                        )
                            ? ` — Age ${settler.age}`
                            : "";


                    html +=
                        `
                        <div class="building-info-resident">
                            ${settler.name}
                            <span class="building-info-relation">
                                ${relation}${age}
                            </span>
                        </div>
                        `;

                }


                html +=
                    `</div>`;

            }

        }
        else {

            html +=
                "<br><br>No residents.";

        }

    }


    /* =============================================
       PLACEHOLDERS
       ============================================= */


    html +=
        "<br><br>Built: -";


    if (
        building.type ===
            "marketHall" ||
        building.type ===
            "settlementCenter"
    ) {

        const storedFood =
            Number.isFinite(
                building.foodStorage
            )
                ? building.foodStorage
                : 0;


        const capacity =
            getFoodStorageCapacity(
                building
            );


        html +=
            `<br>Food Storage: ${storedFood} / ${capacity}`;

    }
    else {

        html +=
            "<br>Food Storage: -";

    }


    html +=
        "<br>Happiness: -";


    /* =============================================
       WORKPLACE
       ============================================= */

    if (
        def.workerSlots
    ) {

        const workers =
            getBuildingWorkers(
                building.id
            );


        const activeWorkers =
            getActiveBuildingWorkers(
                building.id
            );


        html +=
            `<br><br>Workers: ${workers.length} / ${def.workerSlots}`;


        html +=
            `<br>At work: ${activeWorkers.length}`;


        if (
            workers.length === 0
        ) {

            html +=
                `
                <div class="building-info-resident">
                    No workers assigned.
                </div>
                `;

        }


        for (
            const worker
            of workers
        ) {

            const status =
                getSettlerWorkStatus(
                    worker
                );


            html +=
                `
                <div class="building-info-family">

                    <div class="building-info-resident">
                        ${worker.name} — ${worker.job}
                    </div>

                    <div class="building-info-relation">
                        Status: ${status}
                    </div>

                </div>
                `;

        }

    }


    buildingInfoContent.innerHTML =
        html;

}

function getBuildingInfoSignature(
    building
) {

    const def =
        BUILDING_DEFS[
            building.type
        ];


    if (!def) {
        return "";
    }


    const parts = [

        building.id,

        building.type,

        Number.isFinite(
            building.foodStorage
        )
            ? building.foodStorage
            : "NO_FOOD_STORAGE"

    ];


    /*
        Residents.
    */

    const residents =
        getBuildingResidents(
            building.id
        );


    for (
        const resident
        of residents
    ) {

        parts.push(
            `R:${resident.id}:${resident.homeId}:${resident.age}`
        );

    }


    /*
        Workers og deres faktiske
        runtime-status.
    */

    if (
        def.workerSlots
    ) {

        const workers =
            getBuildingWorkers(
                building.id
            );


        for (
            const worker
            of workers
        ) {

            const runtime =
                npcRuntime.get(
                    worker.id
                );


            parts.push(
                [
                    "W",
                    worker.id,
                    worker.workplaceId,
                    worker.job,

                    runtime
                        ? runtime.state
                        : "NO_RUNTIME",

                    runtime
                        ? runtime.blockedFromState
                        : "NO_BLOCK_STATE",

                    runtime &&
                    runtime.commutePlan
                        ? "HAS_ROUTE"
                        : "NO_ROUTE"

                ].join(":")
            );

        }

    }


    return parts.join(
        "|"
    );

}

function refreshOpenBuildingInfo() {

    if (
        activeInfoBuildingId ===
        null
    ) {

        return;

    }


    const building =
        getBuildingById(
            activeInfoBuildingId
        );


    /*
        Hvis bygningen en dag blir
        slettet mens vinduet er åpent.
    */

    if (!building) {

        closeBuildingInfo();

        return;

    }


    const newSignature =
        getBuildingInfoSignature(
            building
        );


    /*
        Ingenting har endret seg.
        Ikke gjør noe med DOM-en.
    */

    if (
        newSignature ===
        buildingInfoSignature
    ) {

        return;

    }


    buildingInfoSignature =
        newSignature;


    renderBuildingInfoContent(
        building
    );

}

function openBuildingInfo(
    building,
    screenX,
    screenY
) {

    const def =
        BUILDING_DEFS[
            building.type
        ];


    if (!def) {
        return;
    }


    /*
        Høyreklikk samme bygning
        igjen lukker popupen.
    */

    if (
        activeInfoBuildingId ===
        building.id
    ) {

        closeBuildingInfo();

        return;

    }


    activeInfoBuildingId =
        building.id;


    /*
        Tving første render.
    */

    buildingInfoSignature =
        null;


    renderBuildingInfoContent(
        building
    );


    buildingInfoPopup.style.left =
        `${screenX + 12}px`;


    buildingInfoPopup.style.top =
        `${screenY + 12}px`;


    buildingInfoPopup.classList.add(
        "open"
    );


    buildingInfoSignature =
        getBuildingInfoSignature(
            building
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

    markNavigationChanged();

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
                Vanlige bygninger kan ikke bygges
                inne i en Lumber Mill forestry zone.
            */

            if (
                tileInsideLumberZone(
                    x,
                    y
                )
            ) {

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

    let validPlacement;


    if (
        type === "lumberMill"
    ) {

        validPlacement =
            canPlaceLumberMill(
                def,
                x,
                y
            );

    }
    else if (
        type === "stoneQuarry"
    ) {

        validPlacement =
            canPlaceStoneQuarry(
                def,
                x,
                y
            );

    }
    else {

        validPlacement =
            canPlaceBuilding(
                def,
                x,
                y
            );

    }


    if (!validPlacement) {

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

    if (
        type === "marketHall" ||
        type === "settlementCenter"
    ) {

        building.foodStorage =
            0;

    }

    if (
        type === "lumberMill"
    ) {

        building.treeGrowth =
            {};


        const entrance =
            findLumberMillEntrance(
                x,
                y
            );


        building.entranceX =
            entrance.x;


        building.entranceY =
            entrance.y;

    }


    worldState.buildings.push(
        building
    );

    markNavigationChanged();

    if (
        type === "stoneQuarry"
    ) {

        for (
            let offsetY = 0;
            offsetY < def.height;
            offsetY++
        ) {

            for (
                let offsetX = 0;
                offsetX < def.width;
                offsetX++
            ) {

                const stoneX =
                    x +
                    offsetX;


                const stoneY =
                    y +
                    offsetY;


                if (
                    tileHasNaturalStone(
                        stoneX,
                        stoneY
                    )
                ) {

                    removeNatureAt(
                        stoneX,
                        stoneY
                    );

                }

            }

        }

    }

    assignAvailableJobs();

    assignHomesToUnhousedSettlers();

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


        /*
            Startmaten ligger fysisk
            i Settlement Center.
        */

        building.foodStorage =
            25;


        const foundingFamily =
            createFamily(
                5,
                building.id
            );


        /*
            Første familie fyller opp
            hjemmelageret fra Center.
        */

        refillFamilyFoodStorage(
            foundingFamily
        );


        syncLegacyFoodResource();

        settlementCenterButton.disabled =
            true;

        houseButton.disabled =
            false;

        farmButton.disabled =
            false;

        marketHallButton.disabled =
            false;

        roadButton.disabled =
            false;

        lumberMillButton.disabled =
            false;

        stoneQuarryButton.disabled =
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

function getLumberZoneBounds(
    buildingOrX,
    y = null
) {

    const x =
        typeof buildingOrX === "object"
            ? buildingOrX.x
            : buildingOrX;


    const centerY =
        typeof buildingOrX === "object"
            ? buildingOrX.y
            : y;


    return {

        minX:
            x - 2,

        maxX:
            x + 2,

        minY:
            centerY - 2,

        maxY:
            centerY + 2

    };

}


function tileInsideLumberZone(
    tileX,
    tileY
) {

    for (
        const building
        of worldState.buildings
    ) {

        if (
            building.type !==
            "lumberMill"
        ) {

            continue;

        }


        const zone =
            getLumberZoneBounds(
                building
            );


        if (
            tileX >= zone.minX &&
            tileX <= zone.maxX &&
            tileY >= zone.minY &&
            tileY <= zone.maxY
        ) {

            return true;

        }

    }


    return false;

}


function lumberZonesOverlap(
    x,
    y
) {

    const newZone =
        getLumberZoneBounds(
            x,
            y
        );


    for (
        const building
        of worldState.buildings
    ) {

        if (
            building.type !==
            "lumberMill"
        ) {

            continue;

        }


        const zone =
            getLumberZoneBounds(
                building
            );


        const overlaps =
            !(
                newZone.maxX < zone.minX ||
                newZone.minX > zone.maxX ||
                newZone.maxY < zone.minY ||
                newZone.minY > zone.maxY
            );


        if (overlaps) {
            return true;
        }

    }


    return false;

}

function findLumberMillEntrance(
    x,
    y
) {

    const candidates = [

        {
            x:
                x,

            y:
                y + 1
        },

        {
            x:
                x + 1,

            y:
                y
        },

        {
            x:
                x - 1,

            y:
                y
        },

        {
            x:
                x,

            y:
                y - 1
        }

    ];


    for (
        const tile
        of candidates
    ) {

        const info =
            getTileInfo(
                tile.x,
                tile.y
            );


        if (!info) {
            continue;
        }


        if (
            info.hasWater
        ) {

            continue;

        }


        /*
            Stein eller annen nature
            er ikke gyldig inngang.

            Eksisterende tree godtas ikke
            heller akkurat nå.
        */

        if (
            info.hasNature
        ) {

            continue;

        }


        if (
            tileHasBuilding(
                tile.x,
                tile.y
            )
        ) {

            continue;

        }


        return tile;

    }


    return null;

}

function isLumberMillEntranceTile(
    x,
    y
) {

    for (
        const building
        of worldState.buildings
    ) {

        if (
            building.type !==
            "lumberMill"
        ) {

            continue;

        }


        if (
            building.entranceX === x &&
            building.entranceY === y
        ) {

            return true;

        }

    }


    return false;

}

function canPlaceLumberMill(
    def,
    x,
    y
) {

    /*
        Selve bygningen må stå på
        en vanlig gyldig tile.
    */

    if (
        !canPlaceBuilding(
            def,
            x,
            y
        )
    ) {

        return false;

    }


    const zone =
        getLumberZoneBounds(
            x,
            y
        );


    /*
        Hele 5x5-området må være
        innenfor kartet.
    */

    if (
        zone.minX < 0 ||
        zone.minY < 0 ||
        zone.maxX >= mapWidth ||
        zone.maxY >= mapHeight
    ) {

        return false;

    }


    /*
        Ingen bygninger kan eksistere
        inne i forestry-området.
    */

    for (
        let tileY = zone.minY;
        tileY <= zone.maxY;
        tileY++
    ) {

        for (
            let tileX = zone.minX;
            tileX <= zone.maxX;
            tileX++
        ) {

            if (
                tileHasBuilding(
                    tileX,
                    tileY
                )
            ) {

                return false;

            }

        }

    }


    /*
        To forestry-områder kan
        ikke overlappe.
    */

    if (
        lumberZonesOverlap(
            x,
            y
        )
    ) {

        return false;

    }

    const entrance =
        findLumberMillEntrance(
            x,
            y
        );


    if (!entrance) {

        return false;

    }

    return true;

}

function tileHasNaturalStone(
    x,
    y
) {

    if (
        isNatureRemoved(
            x,
            y
        )
    ) {

        return false;

    }


    return (
        getTileName(
            "nature",
            x,
            y
        ) === "stone"
    );

}


function canPlaceStoneQuarry(
    def,
    startX,
    startY
) {

    let foundStone =
        false;


    for (
        let offsetY = 0;
        offsetY < def.height;
        offsetY++
    ) {

        for (
            let offsetX = 0;
            offsetX < def.width;
            offsetX++
        ) {

            const x =
                startX +
                offsetX;


            const y =
                startY +
                offsetY;


            const tile =
                getTileInfo(
                    x,
                    y
                );


            if (!tile) {

                return false;

            }


            if (
                tile.hasWater
            ) {

                return false;

            }


            if (
                tileHasBuilding(
                    x,
                    y
                ) ||
                tileHasRoad(
                    x,
                    y
                ) ||
                tileInsideLumberZone(
                    x,
                    y
                )
            ) {

                return false;

            }


            /*
                Trær og annen nature
                blokkerer Quarry.

                Stone er det eneste
                nature-elementet vi tillater.
            */

            if (
                tile.hasNature
            ) {

                if (
                    tile.nature !==
                    "stone"
                ) {

                    return false;

                }


                foundStone =
                    true;

            }

        }

    }


    /*
        Minst én stone-tile må ligge
        under footprinten.
    */

    return foundStone;

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
        buildMode === "lumberMill"
    ) {

        const def =
            BUILDING_DEFS.lumberMill;


        const valid =
            canPlaceLumberMill(
                def,
                mouse.tileX,
                mouse.tileY
            ) &&
            canAffordBuilding(
                def
            );


        const zoneX =
            (
                mouse.tileX - 2
            ) *
            tileWidth;


        const zoneY =
            (
                mouse.tileY - 2
            ) *
            tileHeight;


        ctx.fillStyle =
            valid
                ? "rgba(100, 200, 80, 0.16)"
                : "rgba(220, 50, 50, 0.16)";


        ctx.strokeStyle =
            valid
                ? "rgba(140, 255, 120, 0.9)"
                : "rgba(255, 80, 80, 0.9)";


        ctx.fillRect(
            zoneX,
            zoneY,
            tileWidth * 5,
            tileHeight * 5
        );


        ctx.lineWidth =
            2 /
            camera.zoom;


        ctx.strokeRect(
            zoneX,
            zoneY,
            tileWidth * 5,
            tileHeight * 5
        );


        /*
            Selve mill-bygningen.
        */

        ctx.fillStyle =
            valid
                ? "rgba(70, 220, 90, 0.55)"
                : "rgba(220, 50, 50, 0.55)";


        ctx.fillRect(
            mouse.tileX *
            tileWidth,

            mouse.tileY *
            tileHeight,

            tileWidth,

            tileHeight
        );


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


    const validPlacement =
        buildMode ===
            "stoneQuarry"
            ? canPlaceStoneQuarry(
                def,
                mouse.tileX,
                mouse.tileY
            )
            : canPlaceBuilding(
                def,
                mouse.tileX,
                mouse.tileY
            );


    const valid =
        validPlacement &&
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


function removeNatureAt(
    x,
    y
) {

    const key =
        getTileKey(
            x,
            y
        );


    if (
        worldState.removedNature[
            key
        ] === true
    ) {

        return;

    }


    worldState.removedNature[
        key
    ] =
        true;


    markNavigationChanged();

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
   DRAW SETTLERS
   ========================================================= */

function drawSettlers() {

    for (
        const settler
        of worldState.settlers
    ) {

        const runtime =
            npcRuntime.get(
                settler.id
            );


        if (!runtime) {
            continue;
        }

        if (
            runtime.state !==
                NPC_STATE_COMMUTING_TO_WORK &&
            runtime.state !==
                NPC_STATE_COMMUTING_HOME &&
            runtime.state !==
                NPC_STATE_BLOCKED &&
            runtime.state !==
                NPC_STATE_WANDERING
        ) {

            continue;

        }


        if (
            !Number.isFinite(
                runtime.x
            ) ||
            !Number.isFinite(
                runtime.y
            )
        ) {

            continue;

        }

        const worldX =
            (
                runtime.x +
                (
                    runtime.renderOffsetX ||
                    0
                )
            ) *
            tileWidth;


        const worldY =
            (
                runtime.y +
                (
                    runtime.renderOffsetY ||
                    0
                )
            ) *
            tileHeight;


        /*
            Placeholder-NPC.
            Senere byttes denne med sprite.
        */

        const size =
            9;


        ctx.fillStyle =
            "#f0d27a";


        ctx.fillRect(
            worldX -
                size / 2,

            worldY -
                size / 2,

            size,
            size
        );


        ctx.strokeStyle =
            "#222";


        ctx.lineWidth =
            1 /
            camera.zoom;


        ctx.strokeRect(
            worldX -
                size / 2,

            worldY -
                size / 2,

            size,
            size
        );

    }

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

    worldState.production.foodToday =
        0;

    worldState.production.foodWastedToday =
        0;

    worldState.production.woodToday =
        0;

    worldState.production.stoneToday =
        0;

    worldState.production.manualWoodToday =
        0;


    let totalRequired =
        0;


    let totalConsumed =
        0;


    let totalMissing =
        0;


    let hungryHouseholds =
        0;


    /*
        Hver familie spiser fra sitt
        eget pantry.
    */

    for (
        const family
        of worldState.families
    ) {

        if (
            !Number.isFinite(
                family.foodStorage
            )
        ) {

            family.foodStorage =
                0;

        }


        const required =
            getFamilyDailyFoodNeed(
                family
            );


        const consumed =
            Math.min(
                required,
                family.foodStorage
            );


        const missing =
            Math.max(
                0,
                required -
                consumed
            );


        family.foodStorage -=
            consumed;


        totalRequired +=
            required;


        totalConsumed +=
            consumed;


        totalMissing +=
            missing;


        if (
            missing > 0
        ) {

            hungryHouseholds +=
                1;

        }

    }


    /*
        Faktisk hunger.
    */

    worldState.foodStatus.lastRequired =
        totalRequired;


    worldState.foodStatus.lastConsumed =
        totalConsumed;


    worldState.foodStatus.shortageAmount =
        totalMissing;


    worldState.foodStatus.shortageActive =
        totalMissing > 0;


    worldState.foodStatus.hungryHouseholds =
        hungryHouseholds;


    worldState.foodStatus.hungryResidents =
        totalMissing;


    if (
        worldState.foodStatus.shortageActive
    ) {

        worldState.foodStatus
            .consecutiveShortageDays +=
                1;

    }
    else {

        worldState.foodStatus
            .consecutiveShortageDays =
                0;

    }


    /*
        Etter dagens måltid prøver
        husholdene å fylle opp igjen.

        Foreløpig skjer dette automatisk.

        Neste steg erstatter dette med
        faktiske NPC-turer til Market/
        Settlement Center.
    */

    refillAllHouseholdsFromDepots();


    /*
        Immigration vurderes først etter
        at matforsyningen er vurdert.
    */

    processPopulationGrowth();


    syncLegacyFoodResource();


    if (
        worldState.foodStatus.shortageActive
    ) {

        console.log(
            `Day ${worldState.time.day}: Hunger! ${totalConsumed}/${totalRequired} meals available. ${totalMissing} resident(s) missed food.`
        );

    }
    else if (
        worldState.foodStatus
            .distributionShortageActive
    ) {

        console.log(
            `Day ${worldState.time.day}: Food supply shortage. Households could not fully refill their food storage.`
        );

    }
    else {

        console.log(
            `Day ${worldState.time.day}: ${totalConsumed}/${totalRequired} Food consumed.`
        );

    }


    updateSettlementUI();

}

function getPopulation() {

    return worldState.settlers.length;

}


function syncPopulationCount() {

    /*
        Beholder population-feltet foreløpig
        for kompatibilitet med resten av spillet.
    */

    worldState.settlement.population =
        getPopulation();

}

function createSettler(
    options = {}
) {

    const id =
        worldState.nextSettlerId;


    worldState.nextSettlerId +=
        1;


    const identity =
        generateSettlerIdentity(
            id,
            options.gender || null,
            options.lastName || null
        );


    const settler = {

        id:
            id,

        firstName:
            identity.firstName,

        lastName:
            identity.lastName,

        name:
            identity.fullName,

        gender:
            identity.gender,

        homeId:
            options.homeId ?? null,

        familyId:
            options.familyId ?? null,

        relation:
            options.relation ?? null,

        age:
            options.age ??
            generateAgeForRelation(
                options.relation ?? null
            ),

        job:
            null,

        workplaceId:
            null,

        arrivedDay:
            worldState.time.day

    };


    worldState.settlers.push(
        settler
    );


    assignHomeToSettler(
        settler
    );


    syncPopulationCount();


    console.log(
        "Settler created:",
        settler
    );


    return settler;

}

function getBuildingWorkers(
    buildingId
) {

    return worldState.settlers.filter(
        settler =>
            settler.workplaceId ===
            buildingId
    );

}

function getActiveBuildingWorkers(
    buildingId
) {

    return worldState.settlers.filter(
        settler => {

            if (
                settler.workplaceId !==
                buildingId
            ) {

                return false;

            }


            const runtime =
                npcRuntime.get(
                    settler.id
                );


            return (
                runtime &&
                runtime.state ===
                    NPC_STATE_WORKING
            );

        }
    );

}

function getSettlerWorkStatus(
    settler
) {

    const runtime =
        npcRuntime.get(
            settler.id
        );


    if (!runtime) {

        return "Not at work";

    }


    if (
        runtime.state ===
        NPC_STATE_BLOCKED
    ) {

        if (
            runtime.blockedFromState ===
            NPC_STATE_COMMUTING_TO_WORK
        ) {

            return "Route blocked - wandering";

        }


        if (
            runtime.blockedFromState ===
            NPC_STATE_COMMUTING_HOME
        ) {

            return "Route blocked going home";

        }


        return "Route blocked";

    }


    if (
        settler.workplaceId !== null &&
        !runtime.commutePlan &&
        runtime.state ===
            NPC_STATE_HOME
    ) {

        return "No route to work";

    }


    if (
        runtime.state ===
        NPC_STATE_WORKING
    ) {

        return "At work";

    }


    if (
        runtime.state ===
        NPC_STATE_COMMUTING_TO_WORK
    ) {

        if (
            Number.isFinite(
                runtime.currentShiftStart
            ) &&
            getAbsoluteGameMinute() >
                runtime.currentShiftStart
        ) {

            return "Late - on the way";

        }


        return "On the way";

    }


    if (
        runtime.state ===
        NPC_STATE_COMMUTING_HOME
    ) {

        return "Going home";

    }


    if (
        runtime.state ===
        NPC_STATE_HOME
    ) {

        return "At home";

    }

    if (
        runtime.state ===
        NPC_STATE_WANDERING
    ) {

        return "Wandering";

    }

    return "Unknown";

}

function getBuildingFreeWorkerSlots(
    building
) {

    const def =
        BUILDING_DEFS[
            building.type
        ];


    if (
        !def ||
        !def.workerSlots
    ) {

        return 0;

    }


    const workers =
        getBuildingWorkers(
            building.id
        );


    return Math.max(
        0,
        def.workerSlots -
        workers.length
    );

}


function assignAvailableJobs() {

    /*
        Finn voksne uten jobb.
    */

    const unemployed =
        worldState.settlers.filter(
            settler =>
                canSettlerWork(settler) &&
                settler.workplaceId === null
        );


    for (
        const settler
        of unemployed
    ) {

        for (
            const building
            of worldState.buildings
        ) {

            const def =
                BUILDING_DEFS[
                    building.type
                ];


            if (
                !def ||
                !def.workerSlots ||
                !def.jobType
            ) {

                continue;

            }


            if (
                getBuildingFreeWorkerSlots(
                    building
                ) <= 0
            ) {

                continue;

            }


            settler.job =
                def.jobType;


            settler.workplaceId =
                building.id;


            console.log(
                `${settler.name} is now working as ${def.jobType}.`
            );


            break;

        }

    }

}

function normalizeJobAssignments() {

    const usedSlots =
        new Map();


    for (
        const settler
        of worldState.settlers
    ) {

        /*
            Barn skal aldri ha jobb.
        */

        if (
            !canSettlerWork(
                settler
            )
        ) {

            settler.job =
                null;

            settler.workplaceId =
                null;

            continue;

        }


        /*
            Ingen jobb fra før.
        */

        if (
            settler.workplaceId ===
            null
        ) {

            continue;

        }


        const building =
            worldState.buildings.find(
                building =>
                    building.id ===
                    settler.workplaceId
            );


        const def =
            building
                ? BUILDING_DEFS[
                    building.type
                ]
                : null;


        /*
            Workplace finnes ikke lenger
            eller tilbyr ikke denne jobben.
        */

        if (
            !building ||
            !def ||
            !def.workerSlots ||
            !def.jobType
        ) {

            settler.job =
                null;

            settler.workplaceId =
                null;

            continue;

        }


        const currentWorkers =
            usedSlots.get(
                building.id
            ) || 0;


        /*
            Workplace er allerede fullt.
        */

        if (
            currentWorkers >=
            def.workerSlots
        ) {

            settler.job =
                null;

            settler.workplaceId =
                null;

            continue;

        }


        /*
            Sørg også for at jobbtittelen
            stemmer med workplace.
        */

        settler.job =
            def.jobType;


        usedSlots.set(
            building.id,
            currentWorkers + 1
        );

    }


    /*
        Settlers som akkurat mistet en
        ugyldig jobb kan fylle andre
        ledige arbeidsplasser.
    */

    assignAvailableJobs();

}

function getFamilyById(
    familyId
) {

    return (
        worldState.families.find(
            family =>
                family.id === familyId
        ) || null
    );

}

/* =========================================================
   FOOD STORAGE
   ========================================================= */

function getFoodStorageCapacity(
    building
) {

    if (!building) {
        return 0;
    }


    const def =
        BUILDING_DEFS[
            building.type
        ];


    return (
        def?.foodStorageCapacity ||
        0
    );

}


function getFoodDepotBuildings() {

    /*
        Market Hall brukes først.

        Settlement Center fungerer
        som mindre reserve-lager.
    */

    const markets =
        worldState.buildings.filter(
            building =>
                building.type ===
                "marketHall"
        );


    const centers =
        worldState.buildings.filter(
            building =>
                building.type ===
                "settlementCenter"
        );


    return [
        ...markets,
        ...centers
    ];

}


function getFamilyFoodCapacity(
    family
) {

    if (!family) {
        return 0;
    }


    const members =
        getFamilyMembers(
            family
        );


    return (
        members.length *
        HOUSEHOLD_FOOD_DAYS
    );

}


function getFamilyDailyFoodNeed(
    family
) {

    if (!family) {
        return 0;
    }


    return getFamilyMembers(
        family
    ).length;

}


function getTotalMarketFood() {

    let total =
        0;


    for (
        const building
        of worldState.buildings
    ) {

        if (
            building.type !==
            "marketHall"
        ) {

            continue;

        }


        total +=
            Number.isFinite(
                building.foodStorage
            )
                ? building.foodStorage
                : 0;

    }


    return total;

}


function getTotalMarketFoodCapacity() {

    let total =
        0;


    for (
        const building
        of worldState.buildings
    ) {

        if (
            building.type !==
            "marketHall"
        ) {

            continue;

        }


        total +=
            getFoodStorageCapacity(
                building
            );

    }


    return total;

}


function getTotalCenterFood() {

    let total =
        0;


    for (
        const building
        of worldState.buildings
    ) {

        if (
            building.type !==
            "settlementCenter"
        ) {

            continue;

        }


        total +=
            Number.isFinite(
                building.foodStorage
            )
                ? building.foodStorage
                : 0;

    }


    return total;

}


function getTotalCenterFoodCapacity() {

    let total =
        0;


    for (
        const building
        of worldState.buildings
    ) {

        if (
            building.type !==
            "settlementCenter"
        ) {

            continue;

        }


        total +=
            getFoodStorageCapacity(
                building
            );

    }


    return total;

}


function getTotalHouseholdFood() {

    let total =
        0;


    for (
        const family
        of worldState.families
    ) {

        total +=
            Number.isFinite(
                family.foodStorage
            )
                ? family.foodStorage
                : 0;

    }


    return total;

}


function getTotalHouseholdFoodCapacity() {

    let total =
        0;


    for (
        const family
        of worldState.families
    ) {

        total +=
            getFamilyFoodCapacity(
                family
            );

    }


    return total;

}


function getTotalFoodAvailable() {

    return (
        getTotalMarketFood() +
        getTotalCenterFood() +
        getTotalHouseholdFood()
    );

}


function syncLegacyFoodResource() {

    /*
        resources.food beholdes foreløpig
        for save-kompatibilitet.

        Det er IKKE lenger et ekte lager.
    */

    worldState.resources.food =
        getTotalFoodAvailable();

}


function storeFoodInDepots(
    amount
) {

    let remaining =
        Math.max(
            0,
            amount
        );


    let stored =
        0;


    const depots =
        getFoodDepotBuildings();


    for (
        const building
        of depots
    ) {

        if (
            remaining <= 0
        ) {

            break;

        }


        if (
            !Number.isFinite(
                building.foodStorage
            )
        ) {

            building.foodStorage =
                0;

        }


        const capacity =
            getFoodStorageCapacity(
                building
            );


        const freeSpace =
            Math.max(
                0,
                capacity -
                building.foodStorage
            );


        const amountToStore =
            Math.min(
                remaining,
                freeSpace
            );


        building.foodStorage +=
            amountToStore;


        remaining -=
            amountToStore;


        stored +=
            amountToStore;

    }


    syncLegacyFoodResource();


    return {

        stored:
            stored,

        lost:
            remaining

    };

}


function takeFoodFromDepots(
    amount
) {

    let remaining =
        Math.max(
            0,
            amount
        );


    let taken =
        0;


    /*
        Foretrekk Market Hall.

        Hvis den er tom brukes
        Settlement Center.
    */

    const depots =
        getFoodDepotBuildings();


    for (
        const building
        of depots
    ) {

        if (
            remaining <= 0
        ) {

            break;

        }


        if (
            !Number.isFinite(
                building.foodStorage
            )
        ) {

            building.foodStorage =
                0;

        }


        const amountToTake =
            Math.min(
                remaining,
                building.foodStorage
            );


        building.foodStorage -=
            amountToTake;


        remaining -=
            amountToTake;


        taken +=
            amountToTake;

    }


    return taken;

}


function refillFamilyFoodStorage(
    family
) {

    if (!family) {
        return 0;
    }


    if (
        !Number.isFinite(
            family.foodStorage
        )
    ) {

        family.foodStorage =
            0;

    }


    const dailyNeed =
        getFamilyDailyFoodNeed(
            family
        );


    if (
        dailyNeed <= 0
    ) {

        return 0;

    }


    const refillThreshold =
        dailyNeed *
        HOUSEHOLD_REFILL_THRESHOLD_DAYS;


    /*
        Har familien fortsatt mer enn
        to dager med mat, trenger de
        ikke hente noe.
    */

    if (
        family.foodStorage >
        refillThreshold
    ) {

        return 0;

    }


    const capacity =
        getFamilyFoodCapacity(
            family
        );


    const wanted =
        Math.max(
            0,
            capacity -
            family.foodStorage
        );


    const received =
        takeFoodFromDepots(
            wanted
        );


    family.foodStorage +=
        received;


    syncLegacyFoodResource();


    return received;

}


function refillAllHouseholdsFromDepots() {

    let totalWanted =
        0;


    let totalReceived =
        0;


    let householdsUnableToRefill =
        0;


    for (
        const family
        of worldState.families
    ) {

        const dailyNeed =
            getFamilyDailyFoodNeed(
                family
            );


        if (
            dailyNeed <= 0
        ) {

            continue;

        }


        if (
            !Number.isFinite(
                family.foodStorage
            )
        ) {

            family.foodStorage =
                0;

        }


        const threshold =
            dailyNeed *
            HOUSEHOLD_REFILL_THRESHOLD_DAYS;


        if (
            family.foodStorage >
            threshold
        ) {

            continue;

        }


        const capacity =
            getFamilyFoodCapacity(
                family
            );


        const wanted =
            Math.max(
                0,
                capacity -
                family.foodStorage
            );


        totalWanted +=
            wanted;


        const received =
            takeFoodFromDepots(
                wanted
            );


        family.foodStorage +=
            received;


        totalReceived +=
            received;


        if (
            received <
            wanted
        ) {

            householdsUnableToRefill +=
                1;

        }

    }


    worldState.foodStatus
        .unfilledHouseholdFood =
            Math.max(
                0,
                totalWanted -
                totalReceived
            );


    worldState.foodStatus
        .householdsUnableToRefill =
            householdsUnableToRefill;


    worldState.foodStatus
        .distributionShortageActive =
            (
                totalWanted > 0 &&
                totalReceived <
                    totalWanted
            );


    syncLegacyFoodResource();

}


function getMarketHalls() {

    return worldState.buildings.filter(
        building =>
            building.type ===
            "marketHall"
    );

}


function getTotalMarketFood() {

    let total =
        0;


    for (
        const building
        of getMarketHalls()
    ) {

        total +=
            Number.isFinite(
                building.foodStorage
            )
                ? building.foodStorage
                : 0;

    }


    return total;

}


function getTotalMarketFoodCapacity() {

    return (
        getMarketHalls().length *
        MARKET_HALL_FOOD_CAPACITY
    );

}

function getTotalHouseholdFood() {

    let total =
        0;


    for (
        const family
        of worldState.families
    ) {

        total +=
            Number.isFinite(
                family.foodStorage
            )
                ? family.foodStorage
                : 0;

    }


    return total;

}

function getTotalHouseholdFoodCapacity() {

    let total =
        0;


    for (
        const family
        of worldState.families
    ) {

        total +=
            getFamilyFoodCapacity(
                family
            );

    }


    return total;

}

function findHomeForFamily(
    familySize
) {

    for (
        const building
        of worldState.buildings
    ) {

        const freeHousing =
            getBuildingFreeHousing(
                building
            );


        if (
            freeHousing >= familySize
        ) {

            return building;

        }

    }


    return null;

}


function getLargestAvailableHome() {

    let largest =
        0;


    for (
        const building
        of worldState.buildings
    ) {

        const freeHousing =
            getBuildingFreeHousing(
                building
            );


        largest =
            Math.max(
                largest,
                freeHousing
            );

    }


    return largest;

}


function createFamily(
    size,
    homeId
) {

    const familyId =
        worldState.nextFamilyId;


    worldState.nextFamilyId +=
        1;


    const lastName =
        getRandomArrayItem(
            nameData.surnames
        ) ||
        `Family${familyId}`;


    const family = {

        id:
            familyId,

        lastName:
            lastName,

        homeId:
            homeId,

        memberIds: [],

        foundedDay:
            worldState.time.day,

        foodStorage:
            0

    };


    worldState.families.push(
        family
    );

    /*
        Én person = single household.
    */

    if (
        size === 1
    ) {

        const gender =
            getRandomGender();


        const settler =
            createSettler({

                gender:
                    gender,

                lastName:
                    lastName,

                familyId:
                    familyId,

                homeId:
                    homeId,

                relation:
                    "Head"

            });


        family.memberIds.push(
            settler.id
        );

        assignAvailableJobs();

        return family;

    }

    /*
        To voksne.
    */

    const father =
        createSettler({

            gender:
                "male",

            lastName:
                lastName,

            familyId:
                familyId,

            homeId:
                homeId,

            relation:
                "Father"

        });

    family.memberIds.push(
        father.id
    );

    const mother =
        createSettler({

            gender:
                "female",

            lastName:
                lastName,

            familyId:
                familyId,

            homeId:
                homeId,

            relation:
                "Mother"

        });

    family.memberIds.push(
        mother.id
    );

    /*
        Eventuelle barn.
    */

    for (
        let i = 2;
        i < size;
        i++
    ) {

        const gender =
            getRandomGender();


        const child =
            createSettler({

                gender:
                    gender,

                lastName:
                    lastName,

                familyId:
                    familyId,

                homeId:
                    homeId,

                relation:
                    gender === "male"
                        ? "Son"
                        : "Daughter"

            });

        family.memberIds.push(
            child.id
        );

    }

    assignAvailableJobs();

    console.log(
        `${lastName} family created:`,
        family
    );


    return family;

}



function processPopulationGrowth() {

    /*
        Ingen nye familier flytter inn
        på en dag der settlementet ikke
        klarte å mate dagens befolkning.
    */

    if (
        worldState.foodStatus
            .shortageActive ||
        worldState.foodStatus
            .distributionShortageActive
    ) {

        console.log(
            "Immigration stopped because of food shortage."
        );

        return;

    }

    const largestAvailableHome =
        getLargestAvailableHome();

    /*
        Ingen ledig bolig.
    */

    if (
        largestAvailableHome <= 0
    ) {

        return;

    }

    /*
        Krev fortsatt litt mat
        før nye folk flytter inn.
    */

    if (
        getTotalFoodAvailable() <
        MIN_FOOD_FOR_POPULATION_GROWTH
    ) {

        return;

    }

    /*
        Household kan bestå av
        1 til 5 personer.

        Det blir aldri større enn
        boligen vi faktisk har plass i.
    */

    const maxFamilySize =
        Math.min(
            5,
            largestAvailableHome
        );

    const familySize =
        1 +
        Math.floor(
            Math.random() *
            maxFamilySize
        );

    const home =
        findHomeForFamily(
            familySize
        );

    if (!home) {
        return;
    }

    const family =
        createFamily(
            familySize,
            home.id
        );

    refillFamilyFoodStorage(
        family
    );


    console.log(
        `${family.lastName} family has arrived with ${familySize} member(s).`
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

    processGameHours();


}

function update(
    deltaTime
) {

    updateMouseWorldPosition();

    updateDebugUI();

    const effectiveTimeScale =
        getEffectiveTimeScale();


    const simulationDeltaTime =
        deltaTime *
        effectiveTimeScale;


    if (
        simulationDeltaTime > 0
    ) {

        updateSimulation(
            simulationDeltaTime
        );


        updateSettlerMovement(
            simulationDeltaTime
        );

    }

    updateClockUI();

    refreshOpenBuildingInfo();

    refreshPeopleMenu(
        deltaTime
    );

    refreshEconomyMenu(
        deltaTime
    );

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

function getBuildingResidents(
    buildingId
) {

    return worldState.settlers.filter(
        settler =>
            settler.homeId === buildingId
    );

}


function getBuildingFreeHousing(
    building
) {

    const def =
        BUILDING_DEFS[
            building.type
        ];


    if (
        !def ||
        !def.housingCapacity
    ) {

        return 0;

    }


    const residents =
        getBuildingResidents(
            building.id
        );


    return Math.max(
        0,
        def.housingCapacity -
        residents.length
    );

}

function assignHomeToSettler(
    settler
) {

    /*
        Har allerede et hjem.
    */

    if (
        settler.homeId !== null
    ) {

        return true;

    }

    for (
        const building
        of worldState.buildings
    ) {

        const freeHousing =
            getBuildingFreeHousing(
                building
            );

        if (
            freeHousing <= 0
        ) {

            continue;

        }

        settler.homeId =
            building.id;

        console.log(
            `${settler.name} moved into ${building.type} #${building.id}`
        );

        return true;

    }

    console.log(
        `${settler.name} has no home.`
    );

    return false;

}

function assignHomesToUnhousedSettlers() {

    for (
        const settler
        of worldState.settlers
    ) {

        if (
            settler.homeId === null
        ) {

            assignHomeToSettler(
                settler
            );

        }

    }

}

function getBuildingById(
    buildingId
) {

    return (
        worldState.buildings.find(
            building =>
                building.id === buildingId
        ) || null
    );

}

function getAbsoluteGameMinute() {

    const minutesIntoDay =
        Math.floor(
            (
                worldState.time.elapsed /
                SECONDS_PER_DAY
            ) *
            GAME_MINUTES_PER_DAY
        );


    return (
        (
            worldState.time.day - 1
        ) *
        GAME_MINUTES_PER_DAY
    ) + minutesIntoDay;

}

function getCurrentGameClock() {

    const dayProgress =
        worldState.time.elapsed /
        SECONDS_PER_DAY;


    const minutesPassed =
        Math.floor(
            dayProgress *
            24 *
            60
        );


    const startMinutes =
        8 * 60;


    const clockMinutes =
        (
            startMinutes +
            minutesPassed
        ) %
        (
            24 * 60
        );


    const hour =
        Math.floor(
            clockMinutes /
            60
        );


    const minute =
        clockMinutes %
        60;


    return {

        hour:
            hour,

        minute:
            minute,

        clockMinutes:
            clockMinutes

    };

}


function getCurrentGameHour() {

    return (
        getCurrentGameClock()
            .hour
    );

}

function getNpcMoveSpeedForTile(
    x,
    y
) {

    if (
        tileHasRoad(
            x,
            y
        )
    ) {

        return NPC_ROAD_MOVE_SPEED;

    }


    return NPC_GRASS_MOVE_SPEED;

}

function isNpcWalkableTile(
    x,
    y
) {

    if (
        x < 0 ||
        y < 0 ||
        x >= mapWidth ||
        y >= mapHeight
    ) {

        return false;

    }


    const tile =
        getTileInfo(
            x,
            y
        );


    if (!tile) {
        return false;
    }


    if (
        tile.hasWater ||
        tile.hasNature
    ) {

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


    return true;

}


function getBuildingAccessTiles(
    building
) {

    const tiles =
        [];

    if (
        building.type ===
            "lumberMill" &&
        Number.isInteger(
            building.entranceX
        ) &&
        Number.isInteger(
            building.entranceY
        )
    ) {

        if (
            isNpcWalkableTile(
                building.entranceX,
                building.entranceY
            )
        ) {

            return [
                {
                    x:
                        building.entranceX,

                    y:
                        building.entranceY
                }
            ];

        }

    }


    const used =
        new Set();


    function addTile(
        x,
        y
    ) {

        const key =
            getTileKey(
                x,
                y
            );


        if (
            used.has(key)
        ) {

            return;

        }


        used.add(key);


        if (
            !isNpcWalkableTile(
                x,
                y
            )
        ) {

            return;

        }


        tiles.push({
            x,
            y
        });

    }


    /*
        Tiles over og under bygningen.
    */

    for (
        let x = building.x;
        x <
        building.x +
        building.width;
        x++
    ) {

        addTile(
            x,
            building.y - 1
        );


        addTile(
            x,
            building.y +
            building.height
        );

    }


    /*
        Tiles på venstre og høyre side.
    */

    for (
        let y = building.y;
        y <
        building.y +
        building.height;
        y++
    ) {

        addTile(
            building.x - 1,
            y
        );


        addTile(
            building.x +
            building.width,
            y
        );

    }


    return tiles;

}


function getBestBuildingAccessTile(
    building,
    fromX,
    fromY
) {

    const tiles =
        getBuildingAccessTiles(
            building
        );


    if (
        tiles.length === 0
    ) {

        return null;

    }


    tiles.sort(
        (a, b) => {

            const distanceA =
                Math.abs(
                    a.x - fromX
                ) +
                Math.abs(
                    a.y - fromY
                );


            const distanceB =
                Math.abs(
                    b.x - fromX
                ) +
                Math.abs(
                    b.y - fromY
                );


            return (
                distanceA -
                distanceB
            );

        }
    );


    return tiles[0];

}


function findNpcPath(
    startX,
    startY,
    targetX,
    targetY,
    bounds = null
) {

    if (
        startX === targetX &&
        startY === targetY
    ) {

        return [];

    }


    const startKey =
        getTileKey(
            startX,
            startY
        );


    const targetKey =
        getTileKey(
            targetX,
            targetY
        );


    const queue = [
        {
            x:
                startX,

            y:
                startY
        }
    ];


    let queueIndex =
        0;


    const visited =
        new Set([
            startKey
        ]);


    const cameFrom =
        new Map();


    const positions =
        new Map();


    positions.set(
        startKey,
        {
            x:
                startX,

            y:
                startY
        }
    );


    const directions = [

        {
            x: 1,
            y: 0
        },

        {
            x: -1,
            y: 0
        },

        {
            x: 0,
            y: 1
        },

        {
            x: 0,
            y: -1
        }

    ];


    while (
        queueIndex <
        queue.length
    ) {

        const current =
            queue[
                queueIndex
            ];


        queueIndex +=
            1;


        for (
            const direction
            of directions
        ) {

            const nextX =
                current.x +
                direction.x;


            const nextY =
                current.y +
                direction.y;

            if (
                bounds &&
                (
                    nextX <
                        bounds.minX ||
                    nextX >
                        bounds.maxX ||
                    nextY <
                        bounds.minY ||
                    nextY >
                        bounds.maxY
                )
            ) {

                continue;

            }


            const nextKey =
                getTileKey(
                    nextX,
                    nextY
                );


            if (
                visited.has(
                    nextKey
                )
            ) {

                continue;

            }


            if (
                !isNpcWalkableTile(
                    nextX,
                    nextY
                )
            ) {

                continue;

            }


            visited.add(
                nextKey
            );


            cameFrom.set(
                nextKey,
                getTileKey(
                    current.x,
                    current.y
                )
            );


            positions.set(
                nextKey,
                {
                    x:
                        nextX,

                    y:
                        nextY
                }
            );


            if (
                nextKey ===
                targetKey
            ) {

                const path =
                    [];


                let key =
                    targetKey;


                while (
                    key !==
                    startKey
                ) {

                    const position =
                        positions.get(
                            key
                        );


                    path.push(
                        position
                    );


                    key =
                        cameFrom.get(
                            key
                        );

                }


                path.reverse();


                return path;

            }


            queue.push({
                x:
                    nextX,

                y:
                    nextY
            });

        }

    }


    return null;

}

function findNpcRouteBetweenBuildings(
    fromBuilding,
    toBuilding
) {

    const startTiles =
        getBuildingAccessTiles(
            fromBuilding
        );


    const targetTiles =
        getBuildingAccessTiles(
            toBuilding
        );


    if (
        startTiles.length === 0 ||
        targetTiles.length === 0
    ) {

        return null;

    }


    const targetKeys =
        new Set(
            targetTiles.map(
                tile =>
                    getTileKey(
                        tile.x,
                        tile.y
                    )
            )
        );


    /*
        Dijkstra.

        Cost er faktisk reisetid,
        ikke bare antall tiles.
    */

    const open =
        [];


    const bestCost =
        new Map();


    const cameFrom =
        new Map();


    const positions =
        new Map();


    for (
        const tile
        of startTiles
    ) {

        const key =
            getTileKey(
                tile.x,
                tile.y
            );


        open.push({

            x:
                tile.x,

            y:
                tile.y,

            cost:
                0

        });


        bestCost.set(
            key,
            0
        );


        positions.set(
            key,
            {
                x:
                    tile.x,

                y:
                    tile.y
            }
        );

    }


    const directions = [

        {
            x: 1,
            y: 0
        },

        {
            x: -1,
            y: 0
        },

        {
            x: 0,
            y: 1
        },

        {
            x: 0,
            y: -1
        }

    ];


    while (
        open.length > 0
    ) {

        /*
            Laveste travel cost først.
        */

        open.sort(
            (a, b) =>
                a.cost -
                b.cost
        );


        const current =
            open.shift();


        const currentKey =
            getTileKey(
                current.x,
                current.y
            );


        /*
            Fant arbeidsplassen.
        */

        if (
            targetKeys.has(
                currentKey
            )
        ) {

            const route =
                [];


            let key =
                currentKey;


            while (key) {

                route.push(
                    positions.get(
                        key
                    )
                );


                key =
                    cameFrom.get(
                        key
                    );

            }


            route.reverse();


            return route;

        }


        for (
            const direction
            of directions
        ) {

            const nextX =
                current.x +
                direction.x;


            const nextY =
                current.y +
                direction.y;


            if (
                !isNpcWalkableTile(
                    nextX,
                    nextY
                )
            ) {

                continue;

            }


            const nextKey =
                getTileKey(
                    nextX,
                    nextY
                );


            /*
                Kostnaden for én tile
                er tiden det tar å gå dit.
            */

            const speed =
                getNpcMoveSpeedForTile(
                    nextX,
                    nextY
                );


            const stepCost =
                1 /
                speed;


            const newCost =
                current.cost +
                stepCost;


            const oldCost =
                bestCost.get(
                    nextKey
                );


            if (
                oldCost !== undefined &&
                newCost >= oldCost
            ) {

                continue;

            }


            bestCost.set(
                nextKey,
                newCost
            );


            cameFrom.set(
                nextKey,
                currentKey
            );


            positions.set(
                nextKey,
                {
                    x:
                        nextX,

                    y:
                        nextY
                }
            );


            open.push({

                x:
                    nextX,

                y:
                    nextY,

                cost:
                    newCost

            });

        }

    }


    return null;

}

function getNpcRouteSimulationSeconds(
    route
) {

    if (
        !route ||
        route.length <= 1
    ) {

        return 0;

    }


    let seconds =
        0;


    for (
        let i = 1;
        i < route.length;
        i++
    ) {

        const tile =
            route[i];


        const speed =
            getNpcMoveSpeedForTile(
                tile.x,
                tile.y
            );


        seconds +=
            1 /
            speed;

    }


    return seconds;

}

function getNpcRouteGameMinutes(
    route
) {

    const simulationSeconds =
        getNpcRouteSimulationSeconds(
            route
        );


    const gameMinutesPerSimulationSecond =
        GAME_MINUTES_PER_DAY /
        SECONDS_PER_DAY;


    return Math.ceil(
        simulationSeconds *
        gameMinutesPerSimulationSecond
    );

}

function getWanderBounds(
    anchorX,
    anchorY,
    radius
) {

    return {

        minX:
            Math.max(
                0,
                anchorX -
                radius -
                1
            ),

        maxX:
            Math.min(
                mapWidth - 1,
                anchorX +
                radius +
                1
            ),

        minY:
            Math.max(
                0,
                anchorY -
                radius -
                1
            ),

        maxY:
            Math.min(
                mapHeight - 1,
                anchorY +
                radius +
                1
            )

    };

}


function findRandomWanderRoute(
    runtime
) {

    if (
        !Number.isFinite(
            runtime.x
        ) ||
        !Number.isFinite(
            runtime.y
        ) ||
        !Number.isInteger(
            runtime.wanderAnchorX
        ) ||
        !Number.isInteger(
            runtime.wanderAnchorY
        ) ||
        !Number.isInteger(
            runtime.wanderRadius
        )
    ) {

        return null;

    }


    const startX =
        Math.floor(
            runtime.x
        );


    const startY =
        Math.floor(
            runtime.y
        );


    const anchorX =
        runtime.wanderAnchorX;


    const anchorY =
        runtime.wanderAnchorY;


    const radius =
        runtime.wanderRadius;


    const bounds =
        getWanderBounds(
            anchorX,
            anchorY,
            radius
        );


    for (
        let attempt = 0;
        attempt <
            WANDER_ROUTE_ATTEMPTS;
        attempt++
    ) {

        const targetX =
            randomInteger(
                Math.max(
                    0,
                    anchorX -
                    radius
                ),
                Math.min(
                    mapWidth - 1,
                    anchorX +
                    radius
                )
            );


        const targetY =
            randomInteger(
                Math.max(
                    0,
                    anchorY -
                    radius
                ),
                Math.min(
                    mapHeight - 1,
                    anchorY +
                    radius
                )
            );


        /*
            Hold området omtrent
            sirkelformet.
        */

        const anchorDistance =
            Math.hypot(
                targetX -
                    anchorX,
                targetY -
                    anchorY
            );


        if (
            anchorDistance >
            radius
        ) {

            continue;

        }


        if (
            targetX ===
                startX &&
            targetY ===
                startY
        ) {

            continue;

        }


        if (
            !isNpcWalkableTile(
                targetX,
                targetY
            )
        ) {

            continue;

        }


        const path =
            findNpcPath(
                startX,
                startY,
                targetX,
                targetY,
                bounds
            );


        if (
            !path ||
            path.length === 0
        ) {

            continue;

        }


        return [

            {
                x:
                    startX,

                y:
                    startY
            },

            ...path

        ];

    }


    return null;

}


function chooseNextWanderPath(
    runtime,
    currentMinute,
    pauseMin,
    pauseMax
) {

    const route =
        findRandomWanderRoute(
            runtime
        );


    if (!route) {

        runtime.path =
            [];


        runtime.nextWanderDecisionMinute =
            currentMinute +
            randomInteger(
                pauseMin,
                pauseMax
            );


        return false;

    }


    runtime.path =
        route
            .slice(1)
            .map(
                tile => ({
                    x:
                        tile.x,

                    y:
                        tile.y
                })
            );


    return true;

}

function getSimulationDayStartMinute(
    currentMinute
) {

    return (
        Math.floor(
            currentMinute /
            GAME_MINUTES_PER_DAY
        ) *
        GAME_MINUTES_PER_DAY
    );

}

function isChildWanderTime(
    currentMinute
) {

    const dayStart =
        getSimulationDayStartMinute(
            currentMinute
        );


    const minuteIntoDay =
        currentMinute -
        dayStart;


    return (
        minuteIntoDay >=
            CHILD_WANDER_START_OFFSET_MINUTES &&
        minuteIntoDay <
            CHILD_WANDER_END_OFFSET_MINUTES
    );

}

function startChildWandering(
    settler,
    runtime,
    currentMinute
) {

    const home =
        getBuildingById(
            settler.homeId
        );


    if (!home) {

        return false;

    }


    const accessTiles =
        getBuildingAccessTiles(
            home
        );


    if (
        accessTiles.length === 0
    ) {

        runtime.nextWanderDecisionMinute =
            currentMinute +
            30;


        return false;

    }


    const spawnTile =
        accessTiles[
            randomInteger(
                0,
                accessTiles.length - 1
            )
        ];


    runtime.state =
        NPC_STATE_WANDERING;


    runtime.x =
        spawnTile.x +
        0.5;


    runtime.y =
        spawnTile.y +
        0.5;


    runtime.path =
        [];


    runtime.wanderAnchorX =
        Math.floor(
            home.x +
            home.width /
            2
        );


    runtime.wanderAnchorY =
        Math.floor(
            home.y +
            home.height /
            2
        );


    runtime.wanderRadius =
        randomInteger(
            CHILD_WANDER_RADIUS_MIN,
            CHILD_WANDER_RADIUS_MAX
        );


    runtime.wanderReturningHome =
        false;


    runtime.nextWanderDecisionMinute =
        currentMinute;


    chooseNextWanderPath(
        runtime,
        currentMinute,
        CHILD_WANDER_PAUSE_MIN_MINUTES,
        CHILD_WANDER_PAUSE_MAX_MINUTES
    );


    return true;

}

function finishWanderingSettlerAtHome(
    runtime
) {

    runtime.state =
        NPC_STATE_HOME;


    runtime.x =
        null;


    runtime.y =
        null;


    runtime.path =
        [];


    clearSettlerWanderState(
        runtime
    );

}

function tryGiveWanderingSettlerHomePath(
    settler,
    runtime,
    currentMinute
) {

    const home =
        getBuildingById(
            settler.homeId
        );


    if (!home) {

        return false;

    }


    if (
        !Number.isFinite(
            runtime.x
        ) ||
        !Number.isFinite(
            runtime.y
        )
    ) {

        finishWanderingSettlerAtHome(
            runtime
        );


        return true;

    }


    const route =
        findNpcRouteFromTileToBuilding(
            Math.floor(
                runtime.x
            ),
            Math.floor(
                runtime.y
            ),
            home
        );


    if (!route) {

        runtime.path =
            [];


        runtime.wanderReturningHome =
            true;


        runtime.nextWanderDecisionMinute =
            currentMinute +
            NPC_ROUTE_RETRY_MINUTES;


        return false;

    }


    /*
        NPC står allerede ved
        husets access tile.
    */

    if (
        route.length <= 1
    ) {

        finishWanderingSettlerAtHome(
            runtime
        );


        return true;

    }


    runtime.path =
        route
            .slice(1)
            .map(
                tile => ({
                    x:
                        tile.x,

                    y:
                        tile.y
                })
            );


    runtime.wanderReturningHome =
        true;


    return true;

}

function updateChildWander(
    settler,
    runtime,
    currentMinute,
    deltaTime
) {

    const wanderTime =
        isChildWanderTime(
            currentMinute
        );


    /* =============================================
       HOME
       ============================================= */

    if (
        runtime.state ===
        NPC_STATE_HOME
    ) {

        if (!wanderTime) {

            runtime.nextWanderDecisionMinute =
                null;


            return;

        }


        /*
            Ikke la alle barna gå ut
            på nøyaktig samme minutt.
        */

        if (
            !Number.isFinite(
                runtime.nextWanderDecisionMinute
            )
        ) {

            runtime.nextWanderDecisionMinute =
                currentMinute +
                randomInteger(
                    0,
                    CHILD_WANDER_FIRST_DELAY_MAX_MINUTES
                );


            return;

        }


        if (
            currentMinute <
            runtime.nextWanderDecisionMinute
        ) {

            return;

        }


        startChildWandering(
            settler,
            runtime,
            currentMinute
        );


        return;

    }


    if (
        runtime.state !==
        NPC_STATE_WANDERING
    ) {

        return;

    }


    /* =============================================
       SKAL HJEM
       ============================================= */

    if (
        !wanderTime ||
        runtime.wanderReturningHome
    ) {

        runtime.wanderReturningHome =
            true;


        /*
            Trenger ny hjem-rute.
        */

        if (
            runtime.path.length === 0
        ) {

            if (
                Number.isFinite(
                    runtime.nextWanderDecisionMinute
                ) &&
                currentMinute <
                    runtime.nextWanderDecisionMinute
            ) {

                return;

            }


            const gotHomePath =
                tryGiveWanderingSettlerHomePath(
                    settler,
                    runtime,
                    currentMinute
                );


            if (
                runtime.state ===
                NPC_STATE_HOME
            ) {

                return;

            }


            if (!gotHomePath) {
                return;
            }

        }


        if (
            runtime.path.length > 0
        ) {

            const nextTile =
                runtime.path[0];


            if (
                !isNpcWalkableTile(
                    nextTile.x,
                    nextTile.y
                )
            ) {

                runtime.path =
                    [];


                runtime.nextWanderDecisionMinute =
                    currentMinute +
                    5;


                return;

            }

        }


        const arrived =
            moveSettlerAlongPath(
                runtime,
                deltaTime
            );


        if (arrived) {

            finishWanderingSettlerAtHome(
                runtime
            );

        }


        return;

    }


    /* =============================================
       VANLIG WANDERING
       ============================================= */

    if (
        runtime.path.length > 0
    ) {

        const nextTile =
            runtime.path[0];


        if (
            !isNpcWalkableTile(
                nextTile.x,
                nextTile.y
            )
        ) {

            runtime.path =
                [];


            runtime.nextWanderDecisionMinute =
                currentMinute +
                randomInteger(
                    5,
                    15
                );


            return;

        }


        const arrived =
            moveSettlerAlongPath(
                runtime,
                deltaTime
            );


        if (arrived) {

            runtime.nextWanderDecisionMinute =
                currentMinute +
                randomInteger(
                    CHILD_WANDER_PAUSE_MIN_MINUTES,
                    CHILD_WANDER_PAUSE_MAX_MINUTES
                );

        }


        return;

    }


    /*
        NPC står og ser seg rundt /
        leker / gjør ingenting litt.
    */

    if (
        Number.isFinite(
            runtime.nextWanderDecisionMinute
        ) &&
        currentMinute <
            runtime.nextWanderDecisionMinute
    ) {

        return;

    }


    chooseNextWanderPath(
        runtime,
        currentMinute,
        CHILD_WANDER_PAUSE_MIN_MINUTES,
        CHILD_WANDER_PAUSE_MAX_MINUTES
    );

}

function buildSettlerCommutePlan(
    settler
) {

    if (
        settler.homeId === null ||
        settler.workplaceId === null
    ) {

        return null;

    }


    const home =
        getBuildingById(
            settler.homeId
        );


    const workplace =
        getBuildingById(
            settler.workplaceId
        );


    if (
        !home ||
        !workplace
    ) {

        return null;

    }


    const route =
        findNpcRouteBetweenBuildings(
            home,
            workplace
        );


    if (!route) {

        console.warn(
            `${settler.name} cannot find a route to work.`
        );

        return null;

    }


    const distanceTiles =
        Math.max(
            0,
            route.length - 1
        );


    /*
        NPC_MOVE_SPEED er tiles per
        simulation-second.

        Regn dette om til game-minutter.
    */

    const simulationSeconds =
        getNpcRouteSimulationSeconds(
            route
        );

    const gameMinutesPerSimulationSecond =
        GAME_MINUTES_PER_DAY /
        SECONDS_PER_DAY;


    const travelMinutes =
        Math.ceil(
            simulationSeconds *
            gameMinutesPerSimulationSecond
        );


    return {

        homeId:
            settler.homeId,

        workplaceId:
            settler.workplaceId,

        route:
            route,

        distanceTiles:
            distanceTiles,

        travelMinutes:
            travelMinutes

    };

}

function refreshSettlerCommutePlan(
    settler,
    runtime
) {

    const hadPlan =
        runtime.commutePlan !==
        null;


    const plan =
        buildSettlerCommutePlan(
            settler
        );


    runtime.commutePlan =
        plan;


    runtime.lastRouteCheckDay =
        worldState.time.day;


    runtime.lastRouteCheckRevision =
        navigationRevision;


    /*
        Ny rute dukket opp etter
        at NPC-en tidligere var fast.
    */

    if (
        !hadPlan &&
        plan
    ) {

        console.log(
            `${settler.name} found a route to work.`
        );

    }


    return plan;

}


function ensureSettlerRuntime(
    settler
) {

    const visualOffset =
        getStableNpcVisualOffset(
            settler.id
        );

    let runtime =
        npcRuntime.get(
            settler.id
        );


    /*
        Runtime finnes allerede,
        men Home eller Work kan ha endret seg.
    */

    if (runtime) {

        if (
            runtime.homeId !==
                settler.homeId ||
            runtime.workplaceId !==
                settler.workplaceId
        ) {

            runtime =
                null;


            npcRuntime.delete(
                settler.id
            );

        }
        else {

            return runtime;

        }

    }


    const commutePlan =
        buildSettlerCommutePlan(
            settler
        );


    const currentMinute =
        getAbsoluteGameMinute();


    const currentDayStart =
        Math.floor(
            currentMinute /
            GAME_MINUTES_PER_DAY
        ) *
        GAME_MINUTES_PER_DAY;


    const currentShiftEnd =
        currentDayStart +
        WORK_SHIFT_DURATION_MINUTES;


    let state =
        NPC_STATE_HOME;


    let currentShiftStart =
        null;


    /*
        Hvis vi f.eks. loader spillet
        midt i arbeidsdagen, antar vi at
        ansatte allerede er på jobb.
    */

    if (
        commutePlan &&
        currentMinute >=
            currentDayStart &&
        currentMinute <
            currentShiftEnd
    ) {

        state =
            NPC_STATE_WORKING;


        currentShiftStart =
            currentDayStart;

    }


    runtime = {

        state:
            state,

        x:
            null,

        y:
            null,

        path: [],

        renderOffsetX:
            visualOffset.x,

        renderOffsetY:
            visualOffset.y,

        wanderAnchorX:
            null,

        wanderAnchorY:
            null,

        wanderRadius:
            null,

        nextWanderDecisionMinute:
            null,

        wanderReturningHome:
            false,

        homeId:
            settler.homeId,

        workplaceId:
            settler.workplaceId,

        commutePlan:
            commutePlan,

        currentShiftStart:
            currentShiftStart,

        /*
            Husk når vi sist
            undersøkte ruten.
        */

        lastRouteCheckDay:
            worldState.time.day,

        lastRouteCheckRevision:
            navigationRevision

    };


    npcRuntime.set(
        settler.id,
        runtime
    );


    return runtime;

}

function clearSettlerWanderState(
    runtime
) {

    runtime.wanderAnchorX =
        null;

    runtime.wanderAnchorY =
        null;

    runtime.wanderRadius =
        null;

    runtime.nextWanderDecisionMinute =
        null;

    runtime.wanderReturningHome =
        false;

}

function startSettlerCommuteToWork(
    runtime,
    shiftStart
) {

    const plan =
        runtime.commutePlan;


    if (
        !plan ||
        plan.route.length === 0
    ) {

        return false;

    }


    const route =
        plan.route;


    runtime.state =
        NPC_STATE_COMMUTING_TO_WORK;


    runtime.currentShiftStart =
        shiftStart;


    runtime.x =
        route[0].x +
        0.5;


    runtime.y =
        route[0].y +
        0.5;


    runtime.path =
        route
            .slice(1)
            .map(
                tile => ({
                    x: tile.x,
                    y: tile.y
                })
            );

    clearSettlerWanderState(
        runtime
    );

    return true;

}


function startSettlerCommuteHome(
    runtime
) {

    const plan =
        runtime.commutePlan;


    if (
        !plan ||
        plan.route.length === 0
    ) {

        return false;

    }


    const route =
        [
            ...plan.route
        ].reverse();


    runtime.state =
        NPC_STATE_COMMUTING_HOME;


    runtime.x =
        route[0].x +
        0.5;


    runtime.y =
        route[0].y +
        0.5;


    runtime.path =
        route
            .slice(1)
            .map(
                tile => ({
                    x: tile.x,
                    y: tile.y
                })
            );

    clearSettlerWanderState(
        runtime
    );

    return true;

}

function moveSettlerAlongPath(
    runtime,
    deltaTime
) {

    let timeRemaining =
        deltaTime;


    while (
        timeRemaining > 0 &&
        runtime.path.length > 0
    ) {

        const nextTile =
            runtime.path[0];


        const targetX =
            nextTile.x +
            0.5;


        const targetY =
            nextTile.y +
            0.5;


        const deltaX =
            targetX -
            runtime.x;


        const deltaY =
            targetY -
            runtime.y;


        const distance =
            Math.hypot(
                deltaX,
                deltaY
            );


        const speed =
            getNpcMoveSpeedForTile(
                nextTile.x,
                nextTile.y
            );


        const timeNeeded =
            distance /
            speed;


        /*
            Vi rekker helt fram til
            neste tile denne framen.
        */

        if (
            timeNeeded <=
            timeRemaining
        ) {

            runtime.x =
                targetX;


            runtime.y =
                targetY;


            runtime.path.shift();


            timeRemaining -=
                timeNeeded;


            continue;

        }


        /*
            Vi kommer bare deler
            av veien.
        */

        const movement =
            speed *
            timeRemaining;


        runtime.x +=
            (
                deltaX /
                distance
            ) *
            movement;


        runtime.y +=
            (
                deltaY /
                distance
            ) *
            movement;


        timeRemaining =
            0;

    }


    return (
        runtime.path.length === 0
    );

}

function findNpcRouteFromTileToBuilding(
    startX,
    startY,
    targetBuilding
) {

    const targetTiles =
        getBuildingAccessTiles(
            targetBuilding
        );


    if (
        targetTiles.length === 0
    ) {

        return null;

    }


    let bestRoute =
        null;


    let bestTime =
        Infinity;


    for (
        const target
        of targetTiles
    ) {

        const route =
            findNpcPath(
                startX,
                startY,
                target.x,
                target.y
            );


        if (!route) {
            continue;
        }


        const fullRoute = [

            {
                x:
                    startX,

                y:
                    startY
            },

            ...route

        ];


        const travelTime =
            getNpcRouteSimulationSeconds(
                fullRoute
            );


        if (
            travelTime <
            bestTime
        ) {

            bestTime =
                travelTime;


            bestRoute =
                fullRoute;

        }

    }


    return bestRoute;

}

function rerouteSettler(
    runtime
) {

    let targetBuilding =
        null;


    if (
        runtime.state ===
        NPC_STATE_COMMUTING_TO_WORK
    ) {

        targetBuilding =
            getBuildingById(
                runtime.workplaceId
            );

    }
    else if (
        runtime.state ===
        NPC_STATE_COMMUTING_HOME
    ) {

        targetBuilding =
            getBuildingById(
                runtime.homeId
            );

    }


    if (!targetBuilding) {

        return false;

    }


    const currentX =
        Math.floor(
            runtime.x
        );


    const currentY =
        Math.floor(
            runtime.y
        );


    const route =
        findNpcRouteFromTileToBuilding(
            currentX,
            currentY,
            targetBuilding
        );


    if (
        !route ||
        route.length === 0
    ) {

        return false;

    }


    runtime.path =
        route
            .slice(1)
            .map(
                tile => ({
                    x:
                        tile.x,

                    y:
                        tile.y
                })
            );


    return true;

}

function setSettlerBlocked(
    runtime,
    previousState,
    currentMinute
) {

    runtime.state =
        NPC_STATE_BLOCKED;


    runtime.blockedFromState =
        previousState;


    runtime.path =
        [];


    runtime.nextRouteRetryMinute =
        currentMinute;


    runtime.lastBlockedRouteRevision =
        navigationRevision;


    /*
        Husk hvor NPC-en opprinnelig
        ble sittende fast.

        Wandering får ikke dra langt
        fra dette området.
    */

    if (
        Number.isFinite(
            runtime.x
        ) &&
        Number.isFinite(
            runtime.y
        )
    ) {

        runtime.wanderAnchorX =
            Math.floor(
                runtime.x
            );


        runtime.wanderAnchorY =
            Math.floor(
                runtime.y
            );


        runtime.wanderRadius =
            BLOCKED_WANDER_RADIUS;


        runtime.nextWanderDecisionMinute =
            currentMinute +
                randomInteger(
                    5,
                    15
                );

    }

}

function updateBlockedWander(
    runtime,
    currentMinute,
    deltaTime
) {

    if (
        !Number.isFinite(
            runtime.x
        ) ||
        !Number.isFinite(
            runtime.y
        )
    ) {

        return;

    }


    if (
        !Number.isInteger(
            runtime.wanderAnchorX
        ) ||
        !Number.isInteger(
            runtime.wanderAnchorY
        )
    ) {

        runtime.wanderAnchorX =
            Math.floor(
                runtime.x
            );


        runtime.wanderAnchorY =
            Math.floor(
                runtime.y
            );


        runtime.wanderRadius =
            BLOCKED_WANDER_RADIUS;

    }


    /*
        Har en lokal wander-path.
    */

    if (
        runtime.path.length > 0
    ) {

        const nextTile =
            runtime.path[0];


        if (
            !isNpcWalkableTile(
                nextTile.x,
                nextTile.y
            )
        ) {

            runtime.path =
                [];


            runtime.nextWanderDecisionMinute =
                currentMinute +
                5;


            return;

        }


        const arrived =
            moveSettlerAlongPath(
                runtime,
                deltaTime
            );


        if (arrived) {

            runtime.nextWanderDecisionMinute =
                currentMinute +
                randomInteger(
                    BLOCKED_WANDER_PAUSE_MIN_MINUTES,
                    BLOCKED_WANDER_PAUSE_MAX_MINUTES
                );

        }


        return;

    }


    /*
        Stå litt stille før
        neste lokale tur.
    */

    if (
        Number.isFinite(
            runtime.nextWanderDecisionMinute
        ) &&
        currentMinute <
            runtime.nextWanderDecisionMinute
    ) {

        return;

    }


    chooseNextWanderPath(
        runtime,
        currentMinute,
        BLOCKED_WANDER_PAUSE_MIN_MINUTES,
        BLOCKED_WANDER_PAUSE_MAX_MINUTES
    );

}

function startSettlerRouteFromCurrentPosition(
    runtime,
    targetBuilding,
    nextState
) {

    if (
        !targetBuilding ||
        !Number.isFinite(
            runtime.x
        ) ||
        !Number.isFinite(
            runtime.y
        )
    ) {

        return null;

    }


    const currentX =
        Math.floor(
            runtime.x
        );


    const currentY =
        Math.floor(
            runtime.y
        );


    const route =
        findNpcRouteFromTileToBuilding(
            currentX,
            currentY,
            targetBuilding
        );


    if (
        !route ||
        route.length === 0
    ) {

        return null;

    }


    runtime.state =
        nextState;


    runtime.path =
        route
            .slice(1)
            .map(
                tile => ({
                    x:
                        tile.x,

                    y:
                        tile.y
                })
            );


    runtime.blockedFromState =
        null;


    runtime.nextRouteRetryMinute =
        null;


    clearSettlerWanderState(
        runtime
    );


    return route;

}

function tryRecoverBlockedSettler(
    settler,
    runtime,
    currentMinute
) {

    /*
        Ikke kjør pathfinding hver frame.

        Prøv dersom:
        - kartet har endret seg
        - eller 15 game-minutter har gått.
    */

    const navigationChanged =
        runtime.lastBlockedRouteRevision !==
        navigationRevision;


    const retryDue =
        !Number.isFinite(
            runtime.nextRouteRetryMinute
        ) ||
        currentMinute >=
            runtime.nextRouteRetryMinute;


    if (
        !navigationChanged &&
        !retryDue
    ) {

        return;

    }


    runtime.lastBlockedRouteRevision =
        navigationRevision;


    runtime.nextRouteRetryMinute =
        currentMinute +
        NPC_ROUTE_RETRY_MINUTES;


    const home =
        getBuildingById(
            settler.homeId
        );


    const workplace =
        getBuildingById(
            settler.workplaceId
        );


    /*
        Dersom NPC-en ble blokkert
        på vei TIL jobb, prøv først
        å fortsette til jobb.
    */

    if (
        runtime.blockedFromState ===
            NPC_STATE_COMMUTING_TO_WORK &&
        workplace &&
        Number.isFinite(
            runtime.currentShiftStart
        )
    ) {

        const shiftEnd =
            runtime.currentShiftStart +
            WORK_SHIFT_DURATION_MINUTES;


        /*
            Arbeidsdagen må fortsatt
            være i gang.
        */

        if (
            currentMinute <
            shiftEnd
        ) {

            const routeToWork =
                findNpcRouteFromTileToBuilding(
                    Math.floor(
                        runtime.x
                    ),
                    Math.floor(
                        runtime.y
                    ),
                    workplace
                );


            if (
                routeToWork &&
                routeToWork.length > 0
            ) {

                const travelMinutes =
                    getNpcRouteGameMinutes(
                        routeToWork
                    );


                /*
                    Ikke dra videre dersom
                    arbeidsdagen rekker å slutte
                    før NPC-en kommer fram.
                */

                if (
                    currentMinute +
                        travelMinutes <
                    shiftEnd
                ) {

                    runtime.state =
                        NPC_STATE_COMMUTING_TO_WORK;


                    runtime.path =
                        routeToWork
                            .slice(1)
                            .map(
                                tile => ({
                                    x:
                                        tile.x,

                                    y:
                                        tile.y
                                })
                            );


                    runtime.blockedFromState =
                        null;


                    runtime.nextRouteRetryMinute =
                        null;

                    clearSettlerWanderState(
                        runtime
                    );


                    return;

                }

            }

        }

    }


    /*
        Kan ikke fortsette til jobb,
        eller arbeidsdagen er ferdig.

        Prøv å komme hjem.
    */

    if (home) {

        const routeHome =
            startSettlerRouteFromCurrentPosition(
                runtime,
                home,
                NPC_STATE_COMMUTING_HOME
            );


        if (routeHome) {

            return;

        }

    }


    /*
        Ingen vei verken videre
        eller hjem.

        NPC-en blir stående og prøver
        igjen senere.
    */

}

function updateSettlerMovement(
    deltaTime
) {

    if (
        !worldState.settlement.founded
    ) {

        return;

    }


    const currentMinute =
        getAbsoluteGameMinute();


    for (
        const settler
        of worldState.settlers
    ) {

        const runtime =
            ensureSettlerRuntime(
                settler
            );


        if (!runtime) {
            continue;
        }


        /* =============================================
           INGEN JOBB
           ============================================= */

        if (
            settler.workplaceId ===
            null
        ) {

            /*
                Barn bruker Wander-systemet.

                Voksne uten jobb holder seg
                foreløpig hjemme.
            */

            if (
                !canSettlerWork(
                    settler
                ) &&
                settler.homeId !==
                    null
            ) {

                updateChildWander(
                    settler,
                    runtime,
                    currentMinute,
                    deltaTime
                );


                continue;

            }


            runtime.state =
                NPC_STATE_HOME;


            runtime.x =
                null;


            runtime.y =
                null;


            runtime.path =
                [];


            clearSettlerWanderState(
                runtime
            );


            continue;

        }


        /* =============================================
           HOME
           ============================================= */

        if (
            runtime.state ===
            NPC_STATE_HOME
        ) {

            /*
                Ruten kontrolleres igjen når:

                - ny dag starter
                - navigationRevision endres
            */

            const routeNeedsRefresh =
                runtime.lastRouteCheckDay !==
                    worldState.time.day ||
                runtime.lastRouteCheckRevision !==
                    navigationRevision;


            if (
                routeNeedsRefresh
            ) {

                refreshSettlerCommutePlan(
                    settler,
                    runtime
                );

            }


            /*
                Fortsatt ingen rute.

                NPC-en er trygt hjemme og
                prøver igjen senere.
            */

            if (
                !runtime.commutePlan
            ) {

                runtime.x =
                    null;


                runtime.y =
                    null;


                continue;

            }


            const plan =
                runtime.commutePlan;


            let shiftStart =
                Math.floor(
                    currentMinute /
                    GAME_MINUTES_PER_DAY
                ) *
                GAME_MINUTES_PER_DAY;


            let shiftEnd =
                shiftStart +
                WORK_SHIFT_DURATION_MINUTES;


            /*
                Dagens arbeidstid er over.
            */

            if (
                currentMinute >=
                shiftEnd
            ) {

                shiftStart +=
                    GAME_MINUTES_PER_DAY;


                shiftEnd =
                    shiftStart +
                    WORK_SHIFT_DURATION_MINUTES;

            }


            /*
                Vi er allerede inne i arbeidsdagen,
                men NPC-en rekker ikke jobb før
                arbeidsdagen slutter.

                Vent til neste dag.
            */

            if (
                currentMinute >=
                    shiftStart &&
                currentMinute +
                    plan.travelMinutes >=
                    shiftEnd
            ) {

                shiftStart +=
                    GAME_MINUTES_PER_DAY;


                shiftEnd =
                    shiftStart +
                    WORK_SHIFT_DURATION_MINUTES;

            }


            const departureMinute =
                shiftStart -
                plan.travelMinutes -
                NPC_COMMUTE_BUFFER_MINUTES;


            if (
                currentMinute >=
                    departureMinute &&
                currentMinute <
                    shiftEnd
            ) {

                startSettlerCommuteToWork(
                    runtime,
                    shiftStart
                );

            }


            continue;

        }


        /* =============================================
           BLOCKED
           ============================================= */

        if (
            runtime.state ===
            NPC_STATE_BLOCKED
        ) {

            /*
                Først forsøker NPC-en fortsatt
                å løse det egentlige problemet.
            */

            tryRecoverBlockedSettler(
                settler,
                runtime,
                currentMinute
            );


            /*
                Recovery kan ha funnet
                jobb/hjem-rute.
            */

            if (
                runtime.state !==
                NPC_STATE_BLOCKED
            ) {

                continue;

            }


            /*
                Fortsatt blocked:
                gå litt rundt lokalt mens
                NPC-en venter på neste retry.
            */

            updateBlockedWander(
                runtime,
                currentMinute,
                deltaTime
            );


            continue;

        }


        /* =============================================
           COMMUTING TO WORK
           ============================================= */

        if (
            runtime.state ===
            NPC_STATE_COMMUTING_TO_WORK
        ) {

            /*
                Arbeidsdagen har rukket å bli
                ferdig mens NPC-en fortsatt går.

                Ikke gå helt fram til jobb bare
                for å snu med en gang.
            */

            if (
                Number.isFinite(
                    runtime.currentShiftStart
                )
            ) {

                const shiftEnd =
                    runtime.currentShiftStart +
                    WORK_SHIFT_DURATION_MINUTES;


                if (
                    currentMinute >=
                    shiftEnd
                ) {

                    const home =
                        getBuildingById(
                            settler.homeId
                        );


                    const routeHome =
                        startSettlerRouteFromCurrentPosition(
                            runtime,
                            home,
                            NPC_STATE_COMMUTING_HOME
                        );


                    if (!routeHome) {

                        setSettlerBlocked(
                            runtime,
                            NPC_STATE_COMMUTING_HOME,
                            currentMinute
                        );

                    }


                    continue;

                }

            }


            /*
                Neste tile har blitt blokkert.
            */

            if (
                runtime.path.length > 0
            ) {

                const nextTile =
                    runtime.path[0];


                if (
                    !isNpcWalkableTile(
                        nextTile.x,
                        nextTile.y
                    )
                ) {

                    const rerouted =
                        rerouteSettler(
                            runtime
                        );


                    if (!rerouted) {

                        setSettlerBlocked(
                            runtime,
                            NPC_STATE_COMMUTING_TO_WORK,
                            currentMinute
                        );


                        continue;

                    }

                }

            }


            const arrived =
                moveSettlerAlongPath(
                    runtime,
                    deltaTime
                );


            if (arrived) {

                runtime.state =
                    NPC_STATE_WORKING;


                runtime.x =
                    null;


                runtime.y =
                    null;


                runtime.path =
                    [];

            }


            continue;

        }


        /* =============================================
           WORKING
           ============================================= */

        if (
            runtime.state ===
            NPC_STATE_WORKING
        ) {

            /*
                Safety dersom runtime av en eller
                annen grunn mangler shiftStart.
            */

            if (
                !Number.isFinite(
                    runtime.currentShiftStart
                )
            ) {

                runtime.currentShiftStart =
                    Math.floor(
                        currentMinute /
                        GAME_MINUTES_PER_DAY
                    ) *
                    GAME_MINUTES_PER_DAY;

            }


            const shiftEnd =
                runtime.currentShiftStart +
                WORK_SHIFT_DURATION_MINUTES;


            if (
                currentMinute >=
                shiftEnd
            ) {

                startSettlerCommuteHome(
                    runtime
                );

            }


            continue;

        }


        /* =============================================
           COMMUTING HOME
           ============================================= */

        if (
            runtime.state ===
            NPC_STATE_COMMUTING_HOME
        ) {

            if (
                runtime.path.length > 0
            ) {

                const nextTile =
                    runtime.path[0];


                if (
                    !isNpcWalkableTile(
                        nextTile.x,
                        nextTile.y
                    )
                ) {

                    const rerouted =
                        rerouteSettler(
                            runtime
                        );


                    if (!rerouted) {

                        setSettlerBlocked(
                            runtime,
                            NPC_STATE_COMMUTING_HOME,
                            currentMinute
                        );


                        continue;

                    }

                }

            }


            const arrived =
                moveSettlerAlongPath(
                    runtime,
                    deltaTime
                );


            if (arrived) {

                runtime.state =
                    NPC_STATE_HOME;


                runtime.x =
                    null;


                runtime.y =
                    null;


                runtime.path =
                    [];


                runtime.currentShiftStart =
                    null;


                runtime.blockedFromState =
                    null;


                runtime.nextRouteRetryMinute =
                    null;


                /*
                    Lag fersk arbeidsrute
                    for neste arbeidsdag.
                */

                refreshSettlerCommutePlan(
                    settler,
                    runtime
                );

            }


            continue;

        }


        /* =============================================
           SAFETY FALLBACK
           ============================================= */

        /*
            Dersom en ugyldig state på et tidspunkt
            havner i runtime-data, skal ikke NPC-en
            bli permanent ødelagt.
        */

        console.warn(
            `${settler.name} had invalid NPC state:`,
            runtime.state
        );


        runtime.state =
            NPC_STATE_HOME;


        runtime.x =
            null;


        runtime.y =
            null;


        runtime.path =
            [];


        runtime.currentShiftStart =
            null;


        refreshSettlerCommutePlan(
            settler,
            runtime
        );

    }

}

function updateClockUI() {

    const clock =
        getCurrentGameClock();


    const hourText =
        String(
            clock.hour
        ).padStart(
            2,
            "0"
        );


    const minuteText =
        String(
            clock.minute
        ).padStart(
            2,
            "0"
        );


    gameTimeText.textContent =
        `${hourText}:${minuteText}`;

}

function updateSettlementUI() {

    gameDayText.textContent =
        worldState.time.day;

    settlementNameText.textContent =
        worldState.settlement.name;


    const populationCapacity =
        getPopulationCapacity();


    settlementPopulationText.textContent =
        `${getPopulation()} / ${populationCapacity}`;


    syncLegacyFoodResource();


    resourceFoodText.textContent =
        getTotalFoodAvailable();


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

    drawGrownTrees();

    drawRoads();

    drawBuildings();

    drawSettlers();

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

    await loadNameData();
    await loadTiledMap();

    updateSettlementUI();
    updateSaveStatus();
    updateTimeControlsUI();

    requestAnimationFrame(
        gameLoop
    );

}


startGame();