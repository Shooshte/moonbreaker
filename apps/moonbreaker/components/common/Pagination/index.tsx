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
  const handlePageDown = () => {
    if (activePage > 1) {
      handlePageChange(activePage - 1);
    }
  };

  const handlePageUp = () => {
    if (activePage + 1 <= pageCount) {
      handlePageChange(activePage + 1);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (isNaN(newPage)) {
      return;
    }

    if (activePage !== newPage) {
      onPageChange(newPage);
    }
  };

  const getPaginationButtons = (): string[] => {
    if (pageCount <= 4) {
      const pages = [...new Array(pageCount)].map((_, index) =>
        (index + 1).toString()
      );
      return pages;
    }

    const pages = ['1'];

    if (activePage >= 4) {
      pages.push('...');
    }

    if (activePage + 1 > pageCount) {
      pages.push((activePage - 2).toString());
    }

    if (activePage - 1 > 1) {
      pages.push((activePage - 1).toString());
    }

    if (activePage !== 1) {
      pages.push(activePage.toString());
    }

    if (activePage + 1 <= pageCount) {
      pages.push((activePage + 1).toString());
    }

    if (activePage - 1 <= 0) {
      pages.push((activePage + 2).toString());
    }

    if (activePage + 2 < pageCount) {
      pages.push('...');
    }

    if (activePage + 1 < pageCount) {
      pages.push(pageCount.toString());
    }

    return pages;
  };

  const paginationButtons = getPaginationButtons();

  return pageCount <= 1 ? null : (
    <nav className={`${className} ${styles.container}`}>
      <ul className={styles.buttons}>
        <li
          aria-label="<"
          className={styles.button}
          onClick={handlePageDown}
          role="button"
        >
          &lt;
        </li>

        {paginationButtons.map((pageNumber) => {
          const parsedPageNumber = parseInt(pageNumber);
          const isActive = activePage === parsedPageNumber;

          return (
            <li
              aria-label={pageNumber}
              className={isActive ? styles.activeButton : styles.button}
              key={`page-${pageNumber}`}
              role="button"
              onClick={() => handlePageChange(parsedPageNumber)}
            >
              {pageNumber}
            </li>
          );
        })}

        <li
          aria-label=">"
          className={styles.button}
          onClick={handlePageUp}
          role="button"
        >
          &gt;
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
