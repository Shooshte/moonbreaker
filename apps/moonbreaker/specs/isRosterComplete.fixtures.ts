import type { UnitListData } from '../lib/types/units';

import type { RosterRequestData } from '../lib/types/roster';

export const COMPLETE_ROSTER: RosterRequestData = {
  name: 'Astra Rush',
  unitIDS: [197, 196, 19, 20, 191, 3, 174, 194, 185],
};

export const ROSTER_WITH_TOO_MANY_UNITS: RosterRequestData = {
  name: 'Astra Rush',
  unitIDS: [197, 196, 19, 20, 191, 171, 3, 174, 194, 185, 226, 265],
};

export const ROSTER_WITHOUT_CAPTAIN: RosterRequestData = {
  name: 'Astra Rush',
  unitIDS: [197, 196, 19, 20, 191, 171, 174, 194, 185],
};

export const ROSTER_WITHOUT_CREW: RosterRequestData = {
  name: 'Astra Rush',
  unitIDS: [197, 196, 19, 20, 191, 171, 3],
};

export const ROSTER_WITHOUT_NAME: RosterRequestData = {
  name: '',
  unitIDS: [197, 196, 19, 20, 191, 171, 3, 174, 194, 185],
};

export const captainsList: UnitListData[] = [
  {
    id: 3,
    baseDmg: 1,
    deploymentCost: null,
    health: 20,
    name: 'Astra',
    type: 'Captain',
  },
  {
    id: 14,
    baseDmg: 2,
    deploymentCost: null,
    health: 20,
    name: 'Extilior',
    type: 'Captain',
  },
  {
    id: 9,
    baseDmg: 2,
    deploymentCost: null,
    health: 20,
    name: "Zax Ja'kar",
    type: 'Captain',
  },
];

export const crewList: UnitListData[] = [
  {
    id: 107,
    baseDmg: null,
    deploymentCost: null,
    health: 10,
    name: 'Aegys Defense Dome',
    type: 'Crew',
  },
  {
    id: 169,
    baseDmg: null,
    deploymentCost: null,
    health: 12,
    name: 'Aegys Sentinel',
    type: 'Crew',
  },
  {
    id: 19,
    baseDmg: 1,
    deploymentCost: null,
    health: 5,
    name: 'Amplifier Bitol',
    type: 'Crew',
  },
  {
    id: 170,
    baseDmg: 1,
    deploymentCost: null,
    health: 6,
    name: 'Antios, Gauntlet',
    type: 'Crew',
  },
  {
    id: 171,
    baseDmg: 2,
    deploymentCost: null,
    health: 6,
    name: 'Aria',
    type: 'Crew',
  },
  {
    id: 172,
    baseDmg: null,
    deploymentCost: null,
    health: 6,
    name: 'Axl Pyro',
    type: 'Crew',
  },
  {
    id: 173,
    baseDmg: 2,
    deploymentCost: null,
    health: 7,
    name: 'Beatris, Enforcer',
    type: 'Crew',
  },
  {
    id: 20,
    baseDmg: 2,
    deploymentCost: null,
    health: 6,
    name: 'Blindsider Eztli',
    type: 'Crew',
  },
  {
    id: 174,
    baseDmg: 3,
    deploymentCost: null,
    health: 7,
    name: 'Broken Vengeance',
    type: 'Crew',
  },
  {
    id: 175,
    baseDmg: 2,
    deploymentCost: null,
    health: 8,
    name: 'Chuck & Co.',
    type: 'Crew',
  },
  {
    id: 176,
    baseDmg: 1,
    deploymentCost: null,
    health: 9,
    name: 'Crankbait',
    type: 'Crew',
  },
  {
    id: 177,
    baseDmg: 3,
    deploymentCost: null,
    health: 8,
    name: 'Crosshair',
    type: 'Crew',
  },
  {
    id: 178,
    baseDmg: 2,
    deploymentCost: null,
    health: 6,
    name: 'Deadeye',
    type: 'Crew',
  },
  {
    id: 179,
    baseDmg: null,
    deploymentCost: null,
    health: 8,
    name: 'Detonia',
    type: 'Crew',
  },
  {
    id: 180,
    baseDmg: 2,
    deploymentCost: null,
    health: 5,
    name: 'Drumdancer Tlalli',
    type: 'Crew',
  },
  {
    id: 181,
    baseDmg: null,
    deploymentCost: null,
    health: 5,
    name: 'Fatetwister Tantun',
    type: 'Crew',
  },
  {
    id: 182,
    baseDmg: null,
    deploymentCost: null,
    health: 8,
    name: 'Florio, Lancer',
    type: 'Crew',
  },
  {
    id: 183,
    baseDmg: 2,
    deploymentCost: null,
    health: 8,
    name: 'Furia',
    type: 'Crew',
  },
  {
    id: 184,
    baseDmg: 2,
    deploymentCost: null,
    health: 8,
    name: 'Jailbreak',
    type: 'Crew',
  },
  {
    id: 185,
    baseDmg: 1,
    deploymentCost: null,
    health: 6,
    name: 'Maximus',
    type: 'Crew',
  },
  {
    id: 186,
    baseDmg: 2,
    deploymentCost: null,
    health: 10,
    name: 'Micoani Thicket',
    type: 'Crew',
  },
  {
    id: 187,
    baseDmg: null,
    deploymentCost: null,
    health: 7,
    name: 'Necahual',
    type: 'Crew',
  },
  {
    id: 188,
    baseDmg: 4,
    deploymentCost: null,
    health: 10,
    name: 'Novian Bulwark',
    type: 'Crew',
  },
  {
    id: 189,
    baseDmg: null,
    deploymentCost: null,
    health: 5,
    name: 'Peacemaker Balam',
    type: 'Crew',
  },
  {
    id: 190,
    baseDmg: null,
    deploymentCost: null,
    health: 10,
    name: 'Quetzalli',
    type: 'Crew',
  },
  {
    id: 191,
    baseDmg: 3,
    deploymentCost: null,
    health: 5,
    name: 'Rickety Backfire',
    type: 'Crew',
  },
  {
    id: 192,
    baseDmg: 2,
    deploymentCost: null,
    health: 8,
    name: 'Savria, Safeguard',
    type: 'Crew',
  },
  {
    id: 193,
    baseDmg: 2,
    deploymentCost: null,
    health: 9,
    name: 'Shrapnel',
    type: 'Crew',
  },
  {
    id: 194,
    baseDmg: 1,
    deploymentCost: null,
    health: 7,
    name: 'Snareling',
    type: 'Crew',
  },
  {
    id: 195,
    baseDmg: 1,
    deploymentCost: null,
    health: 7,
    name: 'Stichy McPatchy',
    type: 'Crew',
  },
  {
    id: 196,
    baseDmg: 3,
    deploymentCost: null,
    health: 8,
    name: 'Switchback',
    type: 'Crew',
  },
  {
    id: 197,
    baseDmg: 2,
    deploymentCost: null,
    health: 5,
    name: 'Taria, Arsenal',
    type: 'Crew',
  },
  {
    id: 198,
    baseDmg: 3,
    deploymentCost: null,
    health: 7,
    name: 'Tipu',
    type: 'Crew',
  },
  {
    id: 199,
    baseDmg: null,
    deploymentCost: null,
    health: 6,
    name: 'Tona Mystic Metzli',
    type: 'Crew',
  },
  {
    id: 200,
    baseDmg: 3,
    deploymentCost: null,
    health: 9,
    name: 'Torian, Guardian',
    type: 'Crew',
  },
  {
    id: 201,
    baseDmg: 1,
    deploymentCost: null,
    health: 5,
    name: 'Toxoid',
    type: 'Crew',
  },
  {
    id: 202,
    baseDmg: null,
    deploymentCost: null,
    health: 8,
    name: 'Ursix Nectarvine',
    type: 'Crew',
  },
  {
    id: 203,
    baseDmg: 2,
    deploymentCost: null,
    health: 2,
    name: 'Ursix Scattervine',
    type: 'Crew',
  },
];
