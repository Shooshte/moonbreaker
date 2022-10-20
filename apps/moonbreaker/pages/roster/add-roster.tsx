import { useState } from 'react';
import { unstable_getServerSession } from 'next-auth/next';

import { authOptions } from '../api/auth/[...nextauth]';
import { getUnitsList } from '../../lib/db/units';

import type { GetServerSidePropsContext } from 'next';
import type { UnitListData } from '../../lib/types/units';

import UnitSelect from '../../components/roster/add-roster/UnitSelect';

import styles from './AddRoster.module.scss';

const AddRoster = ({ captainsList, crewList }) => {
  const [rosterUnitsIDS, setRosterUnitsIDS] = useState<string[]>([]);

  const handleConfirm = (selectedUnitID: string) => {
    const newUnits = [...rosterUnitsIDS, selectedUnitID];
    setRosterUnitsIDS(newUnits);
  };

  return (
    <section className={styles.container}>
      <UnitSelect
        captainsList={captainsList}
        crewList={crewList}
        onConfirm={handleConfirm}
        rosterUnitsIDS={rosterUnitsIDS}
      />
      {rosterUnitsIDS.map((id) => (
        <div key={id}>{id}</div>
      ))}
    </section>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const sortByName = (a: UnitListData, b: UnitListData) => {
    const aLowercase = a.name.toLowerCase();
    const bLowercase = b.name.toLowerCase();

    if (aLowercase < bLowercase) {
      return -1;
    }
    if (aLowercase > bLowercase) {
      return 1;
    }
    return 0;
  };

  const unitsList = await getUnitsList({ patchName: 'Pre-Alpha 39919' });

  const captainsList = unitsList
    .filter((unit) => unit.type === 'Captain')
    .sort(sortByName);
  const crewList = unitsList
    .filter((unit) => unit.type === 'Crew')
    .sort(sortByName);

  return {
    props: {
      captainsList,
      crewList,
    },
  };
}

export default AddRoster;
