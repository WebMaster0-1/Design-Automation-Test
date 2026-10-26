import React from 'react';
import './Pagination.css';

export type PaginationType = 'numbers' | 'indicator' | 'both';
export type PaginationOrientation = 'full width' | 'centre aligned' | 'right aligned';

export interface PaginationProps {
  /** Current active page (1-indexed) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Total items count for entries indicator */
  totalItems?: number;
  /** Items displayed per page */
  pageSize?: number;
  /** Callback fired when page is changed */
  onPageChange: (page: number) => void;
  /** Pagination presentation type: 'numbers' | 'indicator' | 'both' */
  type?: PaginationType;
  /** Alignment: 'full width' | 'centre aligned' | 'right aligned' */
  orientation?: PaginationOrientation;
  /** Label for previous button */
  prevLabel?: string;
  /** Label for next button */
  nextLabel?: string;
  /** Custom class name */
  className?: string;
  /** Custom inline style */
  style?: React.CSSProperties;
}

const ArrowLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M10 12L6 8L10 4"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M6 12L10 8L6 4"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  type = 'numbers',
  orientation = 'full width',
  prevLabel = 'Previous',
  nextLabel = 'Next',
  className = '',
  style,
}) => {
  const safeCurrent = Math.max(1, Math.min(currentPage, Math.max(1, totalPages)));

  // Generate page items array with ellipsis
  const getPageNumbers = (): (number | string)[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (safeCurrent <= 4) {
      return [1, 2, 3, 4, 5, '...', totalPages];
    }

    if (safeCurrent >= totalPages - 3) {
      return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, '...', safeCurrent - 1, safeCurrent, safeCurrent + 1, '...', totalPages];
  };

  const pages = getPageNumbers();
  const isFirst = safeCurrent <= 1;
  const isLast = safeCurrent >= totalPages;

  const normalizedOrientationClass =
    orientation === 'centre aligned'
      ? 'fmdqui-pagination--center'
      : orientation === 'right aligned'
      ? 'fmdqui-pagination--right'
      : 'fmdqui-pagination--full-width';

  const indicatorText = totalItems && pageSize
    ? `Showing ${(safeCurrent - 1) * pageSize + 1}–${Math.min(safeCurrent * pageSize, totalItems)} of ${totalItems}`
    : `Page ${safeCurrent} of ${totalPages}`;

  return (
    <nav
      className={`fmdqui-pagination ${normalizedOrientationClass} ${className}`.trim()}
      style={style}
      aria-label="Pagination Navigation"
    >
      {/* ── Previous Button ── */}
      <button
        type="button"
        className="fmdqui-pagination__nav-btn"
        disabled={isFirst}
        onClick={() => onPageChange(safeCurrent - 1)}
        aria-label="Go to previous page"
      >
        <ArrowLeftIcon />
        <span>{prevLabel}</span>
      </button>

      {/* ── Center Content ── */}
      <div className="fmdqui-pagination__center">
        {(type === 'indicator' || type === 'both') && (
          <span className="fmdqui-pagination__indicator">{indicatorText}</span>
        )}

        {(type === 'numbers' || type === 'both') && (
          <ul className="fmdqui-pagination__pages-list">
            {pages.map((p, idx) =>
              p === '...' ? (
                <li key={`ellipsis-${idx}`} className="fmdqui-pagination__ellipsis">
                  …
                </li>
              ) : (
                <li key={`page-${p}`}>
                  <button
                    type="button"
                    className={`fmdqui-pagination__page-btn ${
                      p === safeCurrent ? 'fmdqui-pagination__page-btn--active' : ''
                    }`}
                    onClick={() => onPageChange(Number(p))}
                    aria-current={p === safeCurrent ? 'page' : undefined}
                    aria-label={`Go to page ${p}`}
                  >
                    {p}
                  </button>
                </li>
              )
            )}
          </ul>
        )}
      </div>

      {/* ── Next Button ── */}
      <button
        type="button"
        className="fmdqui-pagination__nav-btn"
        disabled={isLast}
        onClick={() => onPageChange(safeCurrent + 1)}
        aria-label="Go to next page"
      >
        <span>{nextLabel}</span>
        <ArrowRightIcon />
      </button>
    </nav>
  );
};
