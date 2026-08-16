export const NPC_DEFS = {
  villager: {
    id: "villager",
    name: "Villager",
    type: "npc",
    sprites: {
        front: "assets/creatures/npc/male/male_down.png",
        back: "assets/creatures/npc/male/male_up.png",
        left: "assets/creatures/npc/male/male_left.png",
        right: "assets/creatures/npc/male/male_right.png"
    },
    hp: 1,
    interactable: true,
    hostile: false,

    movement: {
        mode: "wander",
        radius: 120,
        speed: 0.35,
        pauseMin: 1000,
        pauseMax: 3500
    },

    dialogue: [
      "Hello traveler.",
      "Be careful near the old dungeon."
    ]
  },

  snake: {
    id: "snake",
    name: "Snake",
    type: "enemy",
    texture: "assets/creatures/enemies/snake/poisetle.png",

    hp: 10,
    attackDamage: 6,
    attackRange: 70,
    attackCooldown: 1400,

    graveSprite: "assets/creatures/enemies/snake/gravestone_snake.png",
    graveOpenSprite: "assets/ui/gravestone-loot.png",
    graveWidth: 30,
    graveHeight: 30,

    loot: [
      { itemId: "apple", amount: 1 },
      { itemId: "rusty_sword", amount: 1, chance: 0.25 }
    ],

    interactable: false,
    hostile: true,

    movement: {
      mode: "wander",
      radius: 120,
      speed: 0.35,
      pauseMin: 1000,
      pauseMax: 3500
    },

    dialogue: [
      "SssSSss!"
    ]
  }
};