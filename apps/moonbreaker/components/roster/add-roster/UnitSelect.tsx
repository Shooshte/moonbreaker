import { useMemo, useRef, useState } from 'react';

import Image from 'next/image';
import Select from 'react-select';

import CheckIcon from '../../../public/icons/Check.svg';
import styles from './UnitSelect.module.scss';

import type { FormEvent } from 'react';
import type { UnitListData } from '../../../lib/types/units';

interface Props {
  captainsList: UnitListData[];
  crewList: UnitListData[];
  onConfirm: (selectedUnitID: string) => void;
  rosterUnitsIDS: string[];
}

const getUnitLabel = (unit: UnitListData): string => {
  return unit.name;
};

const getUnitValue = (unit: UnitListData): string => {
  return unit.id.toString();
};

const GroupLabel = (data: { groupName: string; options: UnitListData[] }) => {
  return <div>{data.groupName}</div>;
};

const UnitSelect = ({
  captainsList = [],
  crewList = [],
  onConfirm,
  rosterUnitsIDS = [],
}: Props) => {
  const [selectedUnit, setSelectedUnit] = useState<UnitListData | null>(null);
  const unitSelect = useRef(null);
  const submitButton = useRef(null);

  const handleUnitChange = (unit: UnitListData | null) => {
    setSelectedUnit(unit);
    submitButton.current.focus();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onConfirm(selectedUnit.id.toString());
    setSelectedUnit(null);
  };

  const isOptionDisabled = (option: UnitListData) => {
    if (rosterUnitsIDS.length <= 0) {
      return false;
    }
    if (option.type === 'Captain') {
      return captainsList.some((captain) =>
        rosterUnitsIDS.includes(captain.id.toString())
      );
    }

    return rosterUnitsIDS.includes(option.id.toString());
  };

  const unitOptions = useMemo(() => {
    return [
      { groupName: 'Captains', options: captainsList },
      { groupName: 'Crew', options: crewList },
    ];
  }, [captainsList, crewList]);

  return (
    <form
      className={styles.container}
      name="unit-select"
      onSubmit={handleSubmit}
    >
      <Select
        className={styles.select}
        formatGroupLabel={GroupLabel}
        getOptionLabel={getUnitLabel}
        getOptionValue={getUnitValue}
        isOptionDisabled={isOptionDisabled}
        isSearchable={true}
        onChange={handleUnitChange}
        options={unitOptions}
        placeholder="Select a unit."
        ref={unitSelect}
        value={selectedUnit}
      />
      <button
        className={styles.submit}
        disabled={!selectedUnit}
        ref={submitButton}
        type="submit"
      >
        <Image alt="confirm selection" priority src={CheckIcon} />
      </button>
    </form>
  );
};

export default UnitSelect;
