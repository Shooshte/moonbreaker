import { authOptions } from '../../auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth/next';

import { getRosterMetaData, rateRoster } from '../../../../lib/db/roster';

import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
  const session = await unstable_getServerSession(_req, res, authOptions);

  const listID = parseInt(_req.body.listID);
  const rating = parseInt(_req.body.rating);

  await rateRoster({
    // TODO: updated type definition
    // @ts-expect-error - need to figure out a way to extend the session type
    userID: session.user?.id,
    listID,
    rating,
  });

  const metaData = await getRosterMetaData({ listID });
  res.status(200).json(metaData);
};

export default handler;
