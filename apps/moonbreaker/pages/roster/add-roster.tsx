import { useState } from 'react';
import { unstable_getServerSession } from 'next-auth/next';

import { authOptions } from '../api/auth/[...nextauth]';
import { getUnitsList } from '../../lib/db/units';

import type { GetServerSidePropsContext } from 'next';
import type { UnitListData } from '../../lib/types/units';

import Select from 'react-select';

import styles from './AddRoster.module.scss';

const AddRoster = ({ captainsList, crewList }) => {
  const [rosterName, setRosterName] = useState('');

  const handleRosterNameChange = (e) => {
    setRosterName(e.target.value);
  };

  const getOptionLabel = (option: UnitListData): string => {
    return option.name;
  };

  const getOptionValue = (option: UnitListData): string => {
    return option.id.toString();
  };

  const formatGroupLabel = (data: {
    groupName: string;
    options: UnitListData[];
  }) => {
    return <div>{data.groupName}</div>;
  };

  return (
    <form className={styles.container} name="roster" id="roster">
      <label htmlFor="name">Roster name:</label>
      <input
        id="name"
        name="name"
        onChange={handleRosterNameChange}
        required
        type="text"
        value={rosterName}
      />

      <Select
        getOptionLabel={getOptionLabel}
        getOptionValue={getOptionValue}
        options={[
          { groupName: 'Captains', options: captainsList },
          { groupName: 'Crew', options: crewList },
        ]}
        formatGroupLabel={formatGroupLabel}
      />
    </form>
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
