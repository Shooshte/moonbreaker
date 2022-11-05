import styles from './Pagination.module.scss';

interface Props {
  activePage: number;
  className?: string;
  onPageChange: (page: number) => void;
  pageCount: number;
}

const Pagination = ({
  className,
  activePage,
  onPageChange,
  pageCount,
}: Props) => {
  const showLeftDots = activePage > 3 && pageCount > 5;
  const showRightDots = activePage <= pageCount - 3 && pageCount > 5;

  const handlePageDown = () => {
    if (activePage > 1) {
      onPageChange(activePage - 1);
    }
  };

  const handlePageUp = () => {
    if (activePage + 1 <= pageCount) {
      onPageChange(activePage + 1);
    }
  };

  return pageCount <= 1 ? null : (
    <nav className={`${className} ${styles.container}`}>
      <ul className={styles.buttons}>
        <li onClick={handlePageDown}>
          <button className={styles.button}>&lt;</button>
        </li>
        {activePage !== 1 && (
          <li onClick={() => onPageChange(1)}>
            <button
              className={`${
                activePage === 1 ? styles.activeButton : styles.button
              }`}
            >
              1
            </button>
          </li>
        )}
        {showLeftDots && <li>...</li>}

        {activePage - 1 > 1 && (
          <li onClick={handlePageDown}>
            <button className={styles.button}>{activePage - 1}</button>
          </li>
        )}
        <li>
          <button className={styles.activeButton}>{activePage}</button>
        </li>
        {activePage + 1 < pageCount && (
          <li onClick={handlePageUp}>
            <button className={styles.button}>{activePage + 1}</button>
          </li>
        )}

        {showRightDots && <li>...</li>}
        {activePage !== pageCount && (
          <li onClick={() => onPageChange(pageCount)}>
            <button
              className={`${
                activePage === pageCount ? styles.activeButton : styles.button
              }`}
            >
              {pageCount}
            </button>
          </li>
        )}

        <li onClick={handlePageUp}>
          <button className={styles.button}>&gt;</button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
