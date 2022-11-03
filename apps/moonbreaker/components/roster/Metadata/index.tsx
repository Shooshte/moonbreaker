import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';

import Caret from '../../common/icons/Caret';

import styles from './Metadata.module.scss';

interface Props {
  className: string;
  listID: number;
  score: number;
}

const Metadata = ({ className, listID, score }: Props) => {
  const [localScore, setLocalScore] = useState<number>(score);
  const [loadingRating, setLoadingRating] = useState(true);
  const [userRating, setUserRating] = useState(0);

  const { data: session, status } = useSession();
  const isAuthenticated = useMemo(() => status === 'authenticated', [status]);

  useEffect(() => {
    const fetchUserRating = async () => {
      try {
        setLoadingRating(true);

        const {
          data: { rating },
        } = await axios.get(`/api/roster/userRating`, {
          // TODO: updated type definition
          // @ts-expect-error - need to figure out a way to extend the session type
          params: { listID, userID: session?.user?.id },
        });

        setUserRating(rating);
      } finally {
        setLoadingRating(false);
      }
    };

    if (isAuthenticated) {
      fetchUserRating();
    }

    setLoadingRating(false);
  }, [listID, isAuthenticated, session]);

  const handleVote = async (rating: number) => {
    setLoadingRating(true);
    try {
      if (rating === userRating) {
        setUserRating(0);
        const { data } = await axios.post('/api/roster/rate', {
          rating: 0,
          listID,
        });
        setLocalScore(data.score);
      } else {
        setUserRating(rating);
        const { data } = await axios.post('/api/roster/rate', {
          rating,
          listID,
        });
        setLocalScore(data.score);
      }
    } finally {
      setLoadingRating(false);
    }
  };

  return (
    <section className={`${className} ${styles.container}`}>
      <p className={`heading-2 ${styles.score}`}>
        {loadingRating ? '?' : localScore}
      </p>
      {isAuthenticated ? (
        <>
          <button
            className={`${styles.button} ${styles.upVote}`}
            disabled={!isAuthenticated}
            onClick={() => handleVote(1)}
          >
            <Caret
              direction="up"
              fill={userRating === 1 ? '#3498DB' : '#bdc3c7'}
            />
          </button>
          <button
            className={`${styles.button} ${styles.downVote}`}
            disabled={!isAuthenticated}
            onClick={() => handleVote(-1)}
          >
            <Caret
              direction="down"
              fill={userRating === -1 ? '#3498DB' : '#bdc3c7'}
            />
          </button>
        </>
      ) : (
        <>
          <div className={styles.upVote} />
          <div className={styles.downVote} />
        </>
      )}
    </section>
  );
};

export default Metadata;
