export type UnitType = 'Captain' | 'Crew';
export type UnitCulture = 'Cholek' | 'Methedori' | 'Smugglers';
export type UnitSize = 'Large' | 'Small';
export type UnitAttackType = 'Melee' | 'Ranged';

export interface UnitInfo {
  attackType: UnitAttackType | null;
  baseDmg: number | null;
  culture: UnitCulture;
  deploymentCost: number | null;
  health: number;
  imageURL: string | null;
  size: UnitSize;
  type: UnitType;
}

export interface ActiveAbility {
  cinderCost: number;
  name: string;
  text: string;
}

export interface Unit {
  activeAbilities: ActiveAbility[];
  description: string | null;
  id: number;
  name: string;
  unitInfo: UnitInfo;
  uniqueAbilities: string[];
}

export interface UnitListData
  extends Pick<
      Unit['unitInfo'],
      'baseDmg' | 'deploymentCost' | 'health' | 'type'
    >,
    Pick<Unit, 'id' | 'name'> {}
