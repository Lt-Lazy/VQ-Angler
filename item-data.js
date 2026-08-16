export const ITEM_DEFS = {
  rusty_sword: {
    id: "rusty_sword",
    name: "Rusty Sword",
    type: "weapon",
    equipSlot: "weapon",

    icon: "assets/items/rusty_sword.png",
    heldSprite: "assets/items/rusty_sword_held.png",
    sprites: {
      front: "assets/items/rusty_sword_down.png",
      back: "assets/items/rusty_sword_up.png",
      left: "assets/items/rusty_sword_left.png",
      right: "assets/items/rusty_sword_right.png"
    },

    description: "An old sword. Better than your fists.",
    stackable: false,
    strength: 2
  },

  apple: {
    id: "apple",
    name: "Apple",
    type: "food",
    icon: "assets/items/apple.png",
    description: "Restores a small amount of health.",
    stackable: true,
    maxStack: 50
  },

  cloth_hat: {
    id: "cloth_hat",
    name: "Cloth Hat",
    type: "armor",
    equipSlot: "head",
    icon: "assets/apparel/cloth_armor/cloth_armor_head/cloth_hat.png",
    description: "Simple headwear.",
    stackable: false,

    sprites: {
      front: {
        idle: [
          "assets/apparel/cloth_armor/cloth_armor_head/cloth_hat_down.png",
          "assets/apparel/cloth_armor/cloth_armor_head/cloth_hat_down_idle.png"
        ],
        run: [
          "assets/apparel/cloth_armor/cloth_armor_head/cloth_hat_down_run_1.png",
          "assets/apparel/cloth_armor/cloth_armor_head/cloth_hat_down_run_2.png"
        ]
      },

      back: {
        idle: [
          "assets/apparel/cloth_armor/cloth_armor_head/cloth_hat_up.png",
          "assets/apparel/cloth_armor/cloth_armor_head/cloth_hat_up_idle.png"
        ],
        run: [
          "assets/apparel/cloth_armor/cloth_armor_head/cloth_hat_up.png",
          "assets/apparel/cloth_armor/cloth_armor_head/cloth_hat_up_idle.png"
        ]
      },

      left: {
        idle: [
          "assets/apparel/cloth_armor/cloth_armor_head/cloth_hat_left.png",
          "assets/apparel/cloth_armor/cloth_armor_head/cloth_hat_left_idle.png"
        ],
        run: [
          "assets/apparel/cloth_armor/cloth_armor_head/cloth_hat_left.png",
          "assets/apparel/cloth_armor/cloth_armor_head/cloth_hat_left.png"
        ]
      },

      right: {
        idle: [
          "assets/apparel/cloth_armor/cloth_armor_head/cloth_hat_right.png",
          "assets/apparel/cloth_armor/cloth_armor_head/cloth_hat_right_idle.png"
        ],
        run: [
          "assets/apparel/cloth_armor/cloth_armor_head/cloth_hat_right.png",
          "assets/apparel/cloth_armor/cloth_armor_head/cloth_hat_right.png"
        ]
      }
    }
  },

  cloth_shirt: {
    id: "cloth_shirt",
    name: "Cloth Shirt",
    type: "armor",
    equipSlot: "chest",
    icon: "assets/apparel/cloth_armor/cloth_armor_chest/cloth_shirt.png",
    description: "Simple chestwear.",
    stackable: false,

    sprites: {
      front: {
        idle: [
          "assets/apparel/cloth_armor/cloth_armor_chest/cloth_chest_down.png",
          "assets/apparel/cloth_armor/cloth_armor_chest/cloth_chest_down_idle.png"
        ],
        run: [
          "assets/apparel/cloth_armor/cloth_armor_chest/cloth_chest_down_run_1.png",
          "assets/apparel/cloth_armor/cloth_armor_chest/cloth_chest_down_run_2.png"
        ]
      },

      back: {
        idle: [
          "assets/apparel/cloth_armor/cloth_armor_chest/cloth_chest_up.png",
          "assets/apparel/cloth_armor/cloth_armor_chest/cloth_chest_up_idle.png"
        ],
        run: [
          "assets/apparel/cloth_armor/cloth_armor_chest/cloth_chest_up.png",
          "assets/apparel/cloth_armor/cloth_armor_chest/cloth_chest_up_idle.png"
        ]
      },

      left: {
        idle: [
          "assets/apparel/cloth_armor/cloth_armor_chest/cloth_chest_left.png",
          "assets/apparel/cloth_armor/cloth_armor_chest/cloth_chest_left_idle.png"
        ],
        run: [
          "assets/apparel/cloth_armor/cloth_armor_chest/cloth_chest_left.png",
          "assets/apparel/cloth_armor/cloth_armor_chest/cloth_chest_left_run.png"
        ]
      },

      right: {
        idle: [
          "assets/apparel/cloth_armor/cloth_armor_chest/cloth_chest_right.png",
          "assets/apparel/cloth_armor/cloth_armor_chest/cloth_chest_right_idle.png"
        ],
        run: [
          "assets/apparel/cloth_armor/cloth_armor_chest/cloth_chest_right.png",
          "assets/apparel/cloth_armor/cloth_armor_chest/cloth_chest_right_run.png"
        ]
      }
    }
  },

  cloth_pants: {
    id: "cloth_pants",
    name: "Cloth Pants",
    type: "armor",
    equipSlot: "legs",
    icon: "assets/apparel/cloth_armor/cloth_armor_legs/cloth_pants.png",
    description: "Simple pants.",
    stackable: false,
    sprites: {
      front: {
        idle: [
          "assets/apparel/cloth_armor/cloth_armor_legs/cloth_legs_down.png",
          "assets/apparel/cloth_armor/cloth_armor_legs/cloth_legs_down_idle.png"
        ],
        run: [
          "assets/apparel/cloth_armor/cloth_armor_legs/cloth_legs_down_run_1.png",
          "assets/apparel/cloth_armor/cloth_armor_legs/cloth_legs_down_run_2.png"
        ]
      },

      back: {
        idle: [
          "assets/apparel/cloth_armor/cloth_armor_legs/cloth_legs_down.png",
          "assets/apparel/cloth_armor/cloth_armor_legs/cloth_legs_down_idle.png"
        ],
        run: [
          "assets/apparel/cloth_armor/cloth_armor_legs/cloth_legs_up_run_1.png",
          "assets/apparel/cloth_armor/cloth_armor_legs/cloth_legs_up_run_2.png"
        ]
      },

      left: {
        idle: [
          "assets/apparel/cloth_armor/cloth_armor_legs/cloth_legs_left.png",
          "assets/apparel/cloth_armor/cloth_armor_legs/cloth_legs_left_idle.png"
        ],
        run: [
          "assets/apparel/cloth_armor/cloth_armor_legs/cloth_legs_left.png",
          "assets/apparel/cloth_armor/cloth_armor_legs/cloth_legs_left_run.png"
        ]
      },

      right: {
        idle: [
          "assets/apparel/cloth_armor/cloth_armor_legs/cloth_legs_right.png",
          "assets/apparel/cloth_armor/cloth_armor_legs/cloth_legs_right_idle.png"
        ],
        run: [
          "assets/apparel/cloth_armor/cloth_armor_legs/cloth_legs_right.png",
          "assets/apparel/cloth_armor/cloth_armor_legs/cloth_legs_right_run.png"
        ]
      }
    }
  },

  cloth_shoes: {
    id: "cloth_shoes",
    name: "Cloth Shoes",
    type: "armor",
    equipSlot: "feet",
    icon: "assets/apparel/cloth_armor/cloth_armor_feet/cloth_shoes.png",
    description: "Simple shoes.",
    stackable: false,
    sprites: {
      front: {
        idle: [
          "assets/apparel/cloth_armor/cloth_armor_feet/cloth_feet_down.png",
          "assets/apparel/cloth_armor/cloth_armor_feet/cloth_feet_down.png"
        ],
        run: [
          "assets/apparel/cloth_armor/cloth_armor_feet/cloth_feet_down_run_1.png",
          "assets/apparel/cloth_armor/cloth_armor_feet/cloth_feet_down_run_2.png"
        ]
      },

      back: {
        idle: [
          "assets/apparel/cloth_armor/cloth_armor_feet/cloth_feet_down.png",
          "assets/apparel/cloth_armor/cloth_armor_feet/cloth_feet_down.png"
        ],
        run: [
          "assets/apparel/cloth_armor/cloth_armor_feet/cloth_feet_up_run_1.png",
          "assets/apparel/cloth_armor/cloth_armor_feet/cloth_feet_up_run_2.png"
        ]
      },

      left: {
        idle: [
          "assets/apparel/cloth_armor/cloth_armor_feet/cloth_feet_left.png",
          "assets/apparel/cloth_armor/cloth_armor_feet/cloth_feet_left.png"
        ],
        run: [
          "assets/apparel/cloth_armor/cloth_armor_feet/cloth_feet_left.png",
          "assets/apparel/cloth_armor/cloth_armor_feet/cloth_feet_left_run.png"
        ]
      },

      right: {
        idle: [
          "assets/apparel/cloth_armor/cloth_armor_feet/cloth_feet_right.png",
          "assets/apparel/cloth_armor/cloth_armor_feet/cloth_feet_right.png"
        ],
        run: [
          "assets/apparel/cloth_armor/cloth_armor_feet/cloth_feet_right.png",
          "assets/apparel/cloth_armor/cloth_armor_feet/cloth_feet_right_run.png"
        ]
      }
    }
  }
};