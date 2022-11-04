import { getCrewList } from '../../../../lib/db/roster';

import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
  const listID = _req.query.listID as string;

  const crew = await getCrewList({
    patchName: 'Pre-Alpha 39919',
    listID,
  });

  res.status(200).json({ crew });
};

export default handler;
