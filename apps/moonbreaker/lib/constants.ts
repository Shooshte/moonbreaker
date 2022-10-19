type UnitType = 'Captain';
type UnitCulture = 'Methedori' | 'Smugglers';
type UnitSize = 'Large';
type UnitAttackType = 'Melee' | 'Ranged';

interface UnitInfo {
  attackType: UnitAttackType;
  baseDmg: number;
  culture: UnitCulture;
  deploymentCost: number | null;
  health: number;
  imageURL: string | null;
  size: UnitSize;
  type: UnitType;
}

interface ActiveAbility {
  cinderCost: number;
  name: string;
  text: string;
}

interface Captain {
  activeAbilities: ActiveAbility[];
  description: string;
  name: string;
  unitInfo: UnitInfo;
  uniqueAbilities: string[];
}

export const CAPTAINS: Captain[] = [
  {
    activeAbilities: [
      {
        cinderCost: 1,
        name: 'Boost Morale',
        text: 'Permanently reduce the Cost of a random Crew on Bridge by 2.',
      },
      {
        cinderCost: 2,
        name: 'Into the Breach!',
        text: 'Remove Stunned from unit.',
      },
    ],
    description:
      '12-year-old Astra is a child prodigy, exploring the Reaches and learning what it means to be a leader. She rides into battle atop her colorful creature (and best friend) named Furg.',
    name: 'Astra',
    unitInfo: {
      attackType: 'Ranged',
      baseDmg: 1,
      culture: 'Methedori',
      deploymentCost: null,
      health: 20,
      imageURL: null,
      size: 'Large',
      type: 'Captain',
    },
    uniqueAbilities: ['Captain', 'Reinforce when Astra destroys a Crew.'],
  },
  {
    activeAbilities: [
      {
        cinderCost: 1,
        name: 'Sleeper Mine',
        text: 'Create Sleeper Mine. It takes 1 turn to arm.',
      },
      {
        cinderCost: 2,
        name: 'Gravity Well',
        text: 'Move units in area together.',
      },
    ],
    description:
      'Zax is a clever, fast-talking scoundrel, swindling his way through the Reaches with a joke and a plasma blaster. He died on his last job, but he tries not to let that get him down.',
    name: "Zax Ja'kar",
    unitInfo: {
      attackType: 'Ranged',
      baseDmg: 2,
      culture: 'Smugglers',
      deploymentCost: null,
      health: 20,
      imageURL: null,
      size: 'Large',
      type: 'Captain',
    },
    uniqueAbilities: ['Captain', 'Push target on hit.'],
  },
  {
    activeAbilities: [
      {
        cinderCost: 1,
        name: 'Shield of Hope',
        text: 'Reduce next damage to unit by 1.',
      },
      {
        cinderCost: 2,
        name: 'Sword of Justice',
        text: 'Deal 3 damage to ALL units in range.',
      },
    ],
    description:
      'Originally programmed to be a mindless, remorseless killing machine called a Death Bot, feared throughout The Reaches, Extilior has become sentient and has now chosen an honorable path.',
    name: 'Extilior',
    unitInfo: {
      attackType: 'Melee',
      baseDmg: 2,
      culture: 'Methedori',
      deploymentCost: null,
      health: 20,
      imageURL: null,
      size: 'Large',
      type: 'Captain',
    },
    uniqueAbilities: [
      'Captain',
      'A random ally withing range gains Shield of Hope when a rival is destroyed.',
    ],
  },
];
