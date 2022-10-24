import { useMemo } from 'react';

import Unit from './Unit';

import { MAX_ROSTER_UNITS } from '../../../lib/constants';
import styles from './RosterList.module.scss';

import type { UnitListData } from '../../../lib/types/units';

interface Props {
  captainsList: UnitListData[];
  crewList: UnitListData[];
  rosterUnitsIDS: string[];
  onRemoveUnit: (unitID: string) => void;
}

type UnitData = UnitListData | undefined;

const RosterList = ({
  captainsList,
  crewList,
  onRemoveUnit,
  rosterUnitsIDS,
}: Props) => {
  const captainData: UnitListData | undefined = useMemo(() => {
    return captainsList.find((captain) =>
      rosterUnitsIDS.includes(captain.id.toString())
    );
  }, [captainsList, rosterUnitsIDS]);

  const unitsData: UnitData[] = useMemo(() => {
    const matchedUnitsData = rosterUnitsIDS
      .map((id) => {
        const unit = crewList.find((captain) => captain.id.toString() === id);
        if (unit) {
          return unit;
        }
      })
      .filter((unit) => !!unit);

    while (matchedUnitsData.length < MAX_ROSTER_UNITS - 1) {
      matchedUnitsData.push(undefined);
    }

    return matchedUnitsData;
  }, [crewList, rosterUnitsIDS]);

  return (
    <ul className={styles.container}>
      <h2 className="heading-2">
        Current roster {`(${rosterUnitsIDS.length}/${MAX_ROSTER_UNITS})`}
      </h2>
      <h3 className="heading-3">Captain</h3>
      <Unit onRemoveUnit={onRemoveUnit} unit={captainData} />
      <h3 className={`heading-3 ${styles.crewHeading}`}>Crew</h3>
      {unitsData.map((unit, index) => (
        <Unit
          key={unit ? `{unit-list-${unit.id}` : `unit-list-empty-${index}`}
          onRemoveUnit={onRemoveUnit}
          unit={unit}
        />
      ))}
    </ul>
  );
};

export default RosterList;
