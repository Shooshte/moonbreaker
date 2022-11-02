import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/router';

import type { RosterMetaData } from '../../../lib/types/roster';

interface Props {
  className: string;
  metaData: RosterMetaData;
}

const Metadata = ({ className, metaData }: Props) => {
  const [localMetaData, setLocalMetaData] = useState(metaData);

  const router = useRouter();
  const listID = router.query.id;

  const handleVote = async (rating: number) => {
    const { data } = await axios.post('/api/roster/rate', { rating, listID });
    setLocalMetaData(data);
  };

  return (
    <section className={className}>
      <h1 className="heading-5">User Score:</h1>
      <p className="heading-2">{localMetaData.score}</p>
      <button onClick={() => handleVote(1)}>Upvote</button>
      <button onClick={() => handleVote(-1)}>Downvote</button>
    </section>
  );
};

export default Metadata;
