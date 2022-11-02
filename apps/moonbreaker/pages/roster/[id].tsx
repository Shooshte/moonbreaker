import type { GetServerSidePropsContext } from 'next';

const Roster = () => <div>Roster info placeholder.</div>;

export default Roster;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // const rostersList = await getRostersList({
  //   patchName: 'Pre-Alpha 39919',
  // });

  const rostersList = [];

  return {
    props: {
      rostersList,
    },
  };
}
