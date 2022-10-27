import type { UnitListData } from './units';

export interface RosterRequestData {
  id?: string;
  name: string;
  unitIDS: number[];
}

export interface RosterData {
  id: string;
  name: string;
  units: UnitListData[];
}

export interface RosterListData {
  id: number;
  name: string;
  units: {
    captain: string;
    crew: string[];
  };
}
