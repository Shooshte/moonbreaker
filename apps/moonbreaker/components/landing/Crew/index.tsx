import axios from 'axios';
import { useEffect, useRef, useState } from 'react';

import Image from 'next/image';

import ListPlaceHolder from '../../../public/icons/CrewListPlaceholder.svg';
import styles from './Crew.module.scss';

import type { RosterListData } from '../../../lib/types/roster';

interface Props {
  className?: string;
  listID: number;
}

const Crew = ({ className, listID }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [crew, setCrew] = useState<RosterListData[]>([]);
  const [loadingCrew, setLoadingCrew] = useState(true);

  useEffect(() => {
    const containerWidth = containerRef.current.clientWidth;

    if (containerWidth) {
      // TODO: handle error state
      const loadCrewData = async () => {
        setLoadingCrew(true);
        const { data } = await axios.get(`/api/roster/crewList`, {
          params: { listID },
        });
        setCrew(data.crew);
        setLoadingCrew(false);
      };

      loadCrewData();
    }
  }, [listID]);

  return (
    <section className={`${className} ${styles.crew}`} ref={containerRef}>
      {loadingCrew ? (
        <>
          <Image
            alt="crew list placeholder"
            height={91}
            width={175}
            src={ListPlaceHolder}
          />
          <Image
            alt="crew list placeholder"
            height={91}
            width={175}
            src={ListPlaceHolder}
          />
        </>
      ) : (
        <ul className={styles.list}>
          {crew.map(({ name, id }) => (
            <li
              className={`text ${styles.name}`}
              key={`list-${listID}-unit-${id}`}
            >
              {name}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default Crew;
