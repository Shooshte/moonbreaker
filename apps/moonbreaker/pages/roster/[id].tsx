import { useRouter } from 'next/router';

import { getRosterInfo, getRosterMetaData } from '../../lib/db/roster';

import Metadata from '../../components/roster/Metadata';

import type { GetServerSidePropsContext } from 'next';
import type { RosterMetaData } from '../../lib/types/roster';
import type { UnitListData } from '../../lib/types/units';

import styles from './roster.module.scss';

interface Props {
  metaData: RosterMetaData;
  name: string;
  units: UnitListData[];
}

const Roster = ({ metaData, name, units }: Props) => {
  const router = useRouter();
  const listID = parseInt(router.query.id as string);

  return (
    <section className={styles.container}>
      <h1 className={`${styles.units} heading-4`}>Roster units</h1>
      <h1 className={`${styles.name} heading-4`}>{name}</h1>
      <Metadata
        className={styles.metaData}
        listID={listID}
        score={metaData.score}
      />
      {/* This is a placeholder element for when descriptions will be added */}
      <div className={styles.description}></div>
    </section>
  );
};

export default Roster;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const listID = parseInt(context.params.id as string);

  const { name, units } = await getRosterInfo({
    listID,
  });

  const metaData = await getRosterMetaData({ listID });

  return {
    props: {
      metaData,
      name,
      units,
    },
  };
}
