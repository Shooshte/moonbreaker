import { getRostersList } from '../lib/db/roster';

import type { GetServerSidePropsContext } from 'next';
import type { RosterListData } from '../lib/types/roster';

interface Props {
  rostersList: RosterListData[];
}

const RostersList = ({ rostersList }: Props) => {
  return (
    <section>
      <h1 className="heading-2">Saved rosters:</h1>

      {rostersList.map(({ id, name, units }) => {
        return (
          <section key={`roster-${id}`}>
            <p className="heading-3">Roster score</p>
            <p className="heading-3">{units.captain}</p>
            <p className="heading-3">{name}</p>
            {/* {units.crew.map((crew) => (
              <li className="text" key={`crew-${crew}`}>
                {crew}
              </li>
            ))} */}
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
