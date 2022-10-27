import type { RosterRequestData } from '../../lib/types/roster';
import type { UnitListData } from '../../lib/types/units';

// In order to save, a roster needs these inputs:
// - Name that is not an empty string
// - 1 Captain
// - 9 Crew
export const isRosterComplete = ({
  captainsList,
  crewList,
  roster,
}: {
  captainsList: UnitListData[];
  crewList: UnitListData[];
  roster: RosterRequestData;
}): {
  isComplete: boolean;
  error?: string;
} => {
  if (!roster.name) {
    return {
      isComplete: false,
      error: 'Roster name is required.',
    };
  }

  const hasCaptain = captainsList.find((captain) =>
    roster.unitIDS.includes(captain.id)
  );

  if (!hasCaptain) {
    return {
      isComplete: false,
      error: 'Roster does not have a captain.',
    };
  }

  const crewNumber = crewList.filter((crew) =>
    roster.unitIDS.includes(crew.id)
  ).length;

  if (crewNumber !== 9) {
    return {
      isComplete: false,
      error: 'Roster does not have 9 crew members.',
    };
  }

  return {
    isComplete: true,
  };
};