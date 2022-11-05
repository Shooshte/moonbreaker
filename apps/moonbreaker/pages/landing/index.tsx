import Link from 'next/link';
import { unstable_getServerSession } from 'next-auth/next';

import Captain from '../../components/landing/Captain';
import Crew from '../../components/landing/Crew';
import Metadata from '../../components/roster/Metadata';

import { authOptions } from '../api/auth/[...nextauth]';
import { getRostersCount, getRostersList } from '../../lib/db/roster';

import type { GetServerSidePropsContext } from 'next';
import type { RosterListData } from '../../lib/types/roster';

import styles from './index.module.scss';

const DISPLAYED_ROSTERS = 5;

interface Props {
  rostersCount: number;
  rostersList: RosterListData[];
}

const RostersList = ({ rostersCount, rostersList }: Props) => {
  console.log({ rostersCount });

  return (
    <ul className={styles.container}>
      {rostersList.map(({ captain, id, name, score }) => {
        return (
          <li className={styles.rosterContainer} key={`roster-${id}`}>
            <Metadata className={styles.score} listID={id} score={score} />
            <Captain className={styles.captain} captain={captain} />
            <Crew className={styles.crew} listID={id} />
            <Link href={`/roster/${encodeURIComponent(id)}`}>
              <a className={`heading-3 ${styles.name}`}>{name}</a>
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  const pageNumber = parseInt(context?.query?.page as string) || 1;
  const skip = (pageNumber - 1) * DISPLAYED_ROSTERS;

  const rostersCount = await getRostersCount({ patchName: 'Pre-Alpha 39919' });
  const rostersList = await getRostersList({
    limit: DISPLAYED_ROSTERS,
    // TODO remove hardcoded patch value and move to reading current patch from .env
    patchName: 'Pre-Alpha 39919',
    skip,
    // TODO: updated type definition
    // @ts-expect-error - need to figure out a way to extend the session type
    userID: session?.user?.id,
  });

  return {
    props: {
      rostersCount,
      rostersList,
    },
  };
}

export default RostersList;
