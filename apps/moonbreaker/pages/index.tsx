import { getRostersList } from '../lib/db/roster';

import type { GetServerSidePropsContext } from 'next';
import type { RosterListData } from '../lib/types/roster';

import styles from './index.module.scss';

interface Props {
  rostersList: RosterListData[];
}

const RostersList = ({ rostersList }: Props) => {
  return (
    <section className={styles.container}>
      <h1 className="heading-2">Saved rosters:</h1>

      {rostersList.map(({ id, name, units }) => {
        return (
          <section className={styles.rosterContainer} key={`roster-${id}`}>
            <p className={`heading-3 ${styles.score}`}>Roster score</p>
            <p className={`heading-3 ${styles.captain}`}>{units.captain}</p>
            <p className={`heading-3 ${styles.name}`}>{name}</p>
            <ul className={styles.crew}>
              {units.crew.map((crew) => (
                <li className="text" key={`crew-${crew}`}>
                  {crew}
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </section>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const rostersList = await getRostersList({
    patchName: 'Pre-Alpha 39919',
  });

  return {
    props: {
      rostersList,
    },
  };
}

export default RostersList;
