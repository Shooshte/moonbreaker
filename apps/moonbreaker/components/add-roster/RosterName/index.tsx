import styles from './RosterName.module.scss';

import type { ChangeEvent } from 'react';

interface Props {
  name: string;
  onNameChange: (name: string) => void;
}

const RosterName = ({ name, onNameChange }: Props) => {
  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    onNameChange(event.target.value);
  };

  return (
    <>
      <h2 className={`heading-3 ${styles.heading}`}>Roster name</h2>
      <input
        className={`heading-4 ${styles.input}`}
        type="text"
        value={name}
        onChange={handleNameChange}
      />
    </>
  );
};

export default RosterName;
