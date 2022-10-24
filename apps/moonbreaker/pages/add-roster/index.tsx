import axios from 'axios';
import { useMemo, useState } from 'react';
import { unstable_getServerSession } from 'next-auth/next';

import { authOptions } from '../api/auth/[...nextauth]';
import { getUnitsList } from '../../lib/db/units';

import type { GetServerSidePropsContext } from 'next';
import type { UnitListData } from '../../lib/types/units';
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
    // TODO: add validation for unique roster composition

    // In order to save, a roster needs to have:
    // - 1 Captain
    // - 9 Crew
    // - Unique name
    // - Unique composition

    if (rosterName.trim().length === 0) {
      return false;
    }

    const captain = captainsList.find((captain) =>
      rosterUnitsIDS.includes(captain.id.toString())
    );

    if (!captain) {
      return false;
    }

    const crew = crewList.filter((unit) =>
      rosterUnitsIDS.includes(unit.id.toString())
    );

    if (crew.length !== MAX_ROSTER_UNITS - 1) {
      return false;
    }

    return true;
  }, [captainsList, crewList, rosterName, rosterUnitsIDS]);

  const handleAddUnit = (selectedUnitID: string) => {
    if (rosterUnitsIDS.length <= MAX_ROSTER_UNITS) {
      const newUnits = [...rosterUnitsIDS, selectedUnitID];
      setRosterUnitsIDS(newUnits);
    }
  };

  const handlePublish = () => {
    console.log('handle publish');
  };

  const handleDraft = async () => {
    setIsSaving(true);

    try {
      const rosterData: RosterRequestData = {
        name: rosterName,
        unitIDS: rosterUnitsIDS.map((id) => parseInt(id)),
      };

      const { data } = await axios.post('/api/roster/add', { rosterData });
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
