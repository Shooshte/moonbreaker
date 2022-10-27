import { isRosterComplete } from '../lib/utils/roster';
import {
  captainsList,
  crewList,
  COMPLETE_ROSTER,
  ROSTER_WITHOUT_CAPTAIN,
  ROSTER_WITHOUT_CREW,
  ROSTER_WITHOUT_NAME,
} from './isRosterComplete.fixtures';

describe('isRosterComplete', () => {
  it('should return true when roster is valid', () => {
    expect(
      isRosterComplete({ captainsList, crewList, roster: COMPLETE_ROSTER })
    ).toEqual({ isComplete: true });
  });
  it('should return false when roster unit IDS do not include a captain', () => {
    expect(
      isRosterComplete({
        captainsList,
        crewList,
        roster: ROSTER_WITHOUT_CAPTAIN,
      })
    ).toEqual({
      isComplete: false,
      error: 'Roster does not have a captain.',
    });
  });
  it('should return false when roster unit IDS do not include 9 crew members', () => {
    expect(
      isRosterComplete({ captainsList, crewList, roster: ROSTER_WITHOUT_CREW })
    ).toEqual({
      isComplete: false,
      error: 'Roster does not have 9 crew members.',
    });
  });
  it('should return false when roster name is an empty string', () => {
    expect(
      isRosterComplete({ captainsList, crewList, roster: ROSTER_WITHOUT_NAME })
    ).toEqual({
      isComplete: false,
      error: 'Roster name is required.',
    });
  });
});
