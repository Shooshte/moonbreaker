import Image from 'next/image';

import MinusIcon from '../../../../public/icons/Minus.svg';
import styles from './Unit.module.scss';

import type { UnitListData } from '../../../../lib/types/units';

interface Props {
  onRemoveUnit: (unitID: string) => void;
  unit?: UnitListData;
}

const Unit = ({ onRemoveUnit, unit }: Props) => {
  const handleRemoveUnit = () => {
    if (unit) {
      onRemoveUnit(unit.id.toString());
    }
  };

  return (
    <li className={`heading-4 ${styles.container}`}>
      {unit ? (
        <>
          {unit?.name}
          <button className={styles.remove} onClick={handleRemoveUnit}>
            <Image alt="confirm selection" priority src={MinusIcon} />
          </button>
        </>
      ) : (
        'No unit selected'
      )}
    </li>
  );
};

export default Unit;
