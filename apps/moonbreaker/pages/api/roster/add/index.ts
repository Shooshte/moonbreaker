import { authOptions } from '../../auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth/next';
import { saveDraft } from '../../../../lib/db/roster';

import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
  const session = await unstable_getServerSession(_req, res, authOptions);

  const rosterData = _req.body.rosterData;
  const patchName = 'Pre-Alpha 39919';

  console.log({ session });

  const draftData = await saveDraft({
    patchName,
    rosterData,
    userID: session.user?.id,
  });

  res.status(200).json(draftData);
};

export default handler;
