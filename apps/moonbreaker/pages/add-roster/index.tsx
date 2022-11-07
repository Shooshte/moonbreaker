import axios from 'axios';
import { useMemo, useState } from 'react';
import { unstable_getServerSession } from 'next-auth/next';
import Head from 'next/head';

import { authOptions } from '../api/auth/[...nextauth]';
import { getUnitsByType } from '../../lib/db/units';
import { isRosterComplete } from '../../lib/utils/roster';

import type { GetServerSidePropsContext } from 'next';
import type { RosterRequestData } from '../..//lib/types/roster';

import RosterList from '../../components/add-roster/RosterList';
import RosterName from '../../components/add-roster/RosterName';
import UnitSelect from '../../components/add-roster/UnitSelect';
import SaveRoster from '../../components/add-roster/SaveRoster';

import { MAX_ROSTER_UNITS } from '../..//lib/constants';
import styles from './AddRoster.module.scss';

const AddRoster = ({ captainsList, crewList }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [rosterName, setRosterName] = useState('');
  const [rosterUnitsIDS, setRosterUnitsIDS] = useState<string[]>([]);

  const canPublish = useMemo(() => {
    const { isComplete } = isRosterComplete({
      captainsList,
      crewList,
      roster: {
        name: rosterName,
        unitIDS: rosterUnitsIDS.map((id) => parseInt(id)),
      },
    });

    return isComplete;
  }, [captainsList, crewList, rosterName, rosterUnitsIDS]);

  const handleAddUnit = (selectedUnitID: string) => {
    if (rosterUnitsIDS.length <= MAX_ROSTER_UNITS) {
      const newUnits = [...rosterUnitsIDS, selectedUnitID];
      setRosterUnitsIDS(newUnits);
    }
  };

  // TODO: handle error state
  // TODO: handle success state
  const handlePublish = async () => {
    setIsSaving(true);

    try {
      const rosterData: RosterRequestData = {
        name: rosterName,
        unitIDS: rosterUnitsIDS.map((id) => parseInt(id)),
      };

      const { data } = await axios.post('/api/roster/publish', { rosterData });
      const { name, units } = data;

      const newUnitIDS = units.map((unit) => unit.id.toString());

      setRosterName(name);
      setRosterUnitsIDS(newUnitIDS);
    } finally {
      setIsSaving(false);
    }
  };

  // TODO: handle error state
  const handleDraft = async () => {
    setIsSaving(true);
    try {
      const rosterData: RosterRequestData = {
        name: rosterName,
        unitIDS: rosterUnitsIDS.map((id) => parseInt(id)),
      };

      const { data } = await axios.post('/api/roster/addDraft', { rosterData });
      const { name, units } = data;

      const newUnitIDS = units.map((unit) => unit.id.toString());

      setRosterName(name);
      setRosterUnitsIDS(newUnitIDS);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveUnit = (unitID: string) => {
    const newUnits = rosterUnitsIDS.filter((id) => id !== unitID);
    setRosterUnitsIDS(newUnits);
  };

  return (
    <>
      <Head>
        <title>Add Roster | Roster Breaker</title>
        <meta
          content="Create a draft or publish a roster list on Roster Breaker."
          name="description"
        />
      </Head>
      <section className={styles.container}>
        <h1 className="heading-1">Add new roster</h1>
        <UnitSelect
          captainsList={captainsList}
          crewList={crewList}
          onConfirm={handleAddUnit}
          rosterUnitsIDS={rosterUnitsIDS}
        />
        <RosterList
          captainsList={captainsList}
          crewList={crewList}
          onRemoveUnit={handleRemoveUnit}
          rosterUnitsIDS={rosterUnitsIDS}
        />
        <RosterName name={rosterName} onNameChange={setRosterName} />
        <SaveRoster
          canPublish={canPublish}
          onPublish={handlePublish}
          onSaveDraft={handleDraft}
          isSaving={isSaving}
        />
      </section>
    </>
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

  const { captainsList, crewList } = await getUnitsByType({
    patchName: 'Pre-Alpha 39919',
  });

  return {
    props: {
      captainsList,
      crewList,
    },
  };
}

export default AddRoster;
