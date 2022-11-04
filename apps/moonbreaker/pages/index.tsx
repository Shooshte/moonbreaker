import Link from 'next/link';
import { unstable_getServerSession } from 'next-auth/next';

import Captain from '../components/index/Captain';
import Metadata from '../components/roster/Metadata';

import { authOptions } from './api/auth/[...nextauth]';
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
      {rostersList.map(({ captain, id, name, score }) => {
        return (
          <li className={styles.rosterContainer} key={`roster-${id}`}>
            <Metadata className={styles.score} listID={id} score={score} />
            <Captain className={styles.captain} captain={captain} />
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

  const rostersList = await getRostersList({
    // TODO remove hardcoded patch value and move to reading current patch from .env
    patchName: 'Pre-Alpha 39919',
    // TODO: updated type definition
    // @ts-expect-error - need to figure out a way to extend the session type
    userID: session?.user?.id,
  });

  return {
    props: {
      rostersList,
    },
  };
}

export default RostersList;
