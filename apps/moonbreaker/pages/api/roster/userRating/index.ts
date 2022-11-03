import { getRosterUserRating } from '../../../../lib/db/roster';

import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
  const listID = parseInt(_req.query.listID as string);
  const userID = _req.query.userID as string;

  const rating = await getRosterUserRating({
    userID,
    listID,
  });

  res.status(200).json({ rating: rating });
};

export default handler;
