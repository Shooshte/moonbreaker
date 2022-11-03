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

export interface RosterMetaData {
  downVotes: number;
  upVotes: number;
  score: number;
}

export interface CaptainListData {
  id: string;
  name: string;
  imageURL?: string;
}

export interface RosterListData {
  id: number;
  captain: CaptainListData;
  name: string;
  score: number;
  userRating: number;
}
