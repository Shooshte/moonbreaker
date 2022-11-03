import Link from 'next/link';
import Metadata from '../components/roster/Metadata';

import { getRostersList } from '../lib/db/roster';

import type { GetServerSidePropsContext } from 'next';
import type { RosterListData } from '../lib/types/roster';

import styles from './index.module.scss';

interface Props {
  rostersList: RosterListData[];
}

const RostersList = ({ rostersList }: Props) => {
  return (
    <ul className={styles.container}>
      <h1 className="heading-1">Saved rosters</h1>
      {rostersList.map(({ id, metaData, name, units }) => {
        return (
          <li className={styles.rosterContainer} key={`roster-${id}`}>
            <Metadata
              className={styles.score}
              listID={id}
              metaData={metaData}
            />
            <p className={`heading-2 ${styles.captain}`}>{units.captain}</p>
            <Link
              className={`heading-2 ${styles.name}`}
              href={`/roster/${encodeURIComponent(id)}`}
            >
              {name}
            </Link>
            <ul className={styles.crew}>
              {units.crew.map((crew) => (
                <li className="text" key={`crew-${crew}`}>
                  {crew}
                </li>
              ))}
            </ul>
          </li>
        );
      })}
    </ul>
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
