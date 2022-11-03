import Image from 'next/image';

import styles from './Captain.module.scss';

import type { CaptainListData } from '../../../lib/types/roster';

interface Props {
  captain: CaptainListData;
  className?: string;
}

const Captain = ({ captain, className }: Props) => {
  return (
    <div className={`${className} ${styles.container}`}>
      {captain.imageURL ? (
        <Image alt={captain.name} layout="fill" src={captain.imageURL} />
      ) : (
        <p className="heading-4">{captain.name}</p>
      )}
    </div>
  );
};

export default Captain;
