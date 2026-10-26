import React, { useState, useMemo, forwardRef } from 'react';
import './Table.css';
import { Checkbox, Radio, Switch } from '../../elements/FormControl';
import { Avatar, type AvatarSize } from '../../elements/Avatar';
import { Badge, type BadgeColor, type BadgeType } from '../../elements/Badge';
import { Chip } from '../../elements/Chip';
import { Pagination } from '../Pagination';

// ─── Inline SVG Icons ─────────────────────────────────────────────────────────

const ChevronUpIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path d="M2.5 7.5L6 4L9.5 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChevronsUpDownIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path d="M3 4.5L6 2L9 4.5M3 7.5L6 10L9 7.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const DotsVerticalIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M8 4.25C8.41421 4.25 8.75 3.91421 8.75 3.5C8.75 3.08579 8.41421 2.75 8 2.75C7.58579 2.75 7.25 3.08579 7.25 3.5C7.25 3.91421 7.58579 4.25 8 4.25Z" fill="currentColor" stroke="currentColor" strokeWidth="0.5"/>
    <path d="M8 8.75C8.41421 8.75 8.75 8.41421 8.75 8C8.75 7.58579 8.41421 7.25 8 7.25C7.58579 7.25 7.25 7.58579 7.25 8C7.25 8.41421 7.58579 8.75 8 8.75Z" fill="currentColor" stroke="currentColor" strokeWidth="0.5"/>
    <path d="M8 13.25C8.41421 13.25 8.75 12.9142 8.75 12.5C8.75 12.0858 8.41421 11.75 8 11.75C7.58579 11.75 7.25 12.0858 7.25 12.5C7.25 12.9142 7.58579 13.25 8 13.25Z" fill="currentColor" stroke="currentColor" strokeWidth="0.5"/>
  </svg>
);

const StarIcon = ({ filled = true }: { filled?: boolean }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill={filled ? "currentColor" : "none"} aria-hidden="true">
    <path
      d="M7 1.75L8.62228 5.03781L12.25 5.56434L9.625 8.12328L10.2446 11.7357L7 10.0298L3.75544 11.7357L4.375 8.12328L1.75 5.56434L5.37772 5.03781L7 1.75Z"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ─── Base Structural Components ───────────────────────────────────────────────

export const TableContainer: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <div className={`fmdqui-table-container ${className}`} {...props}>
    {children}
  </div>
);

export interface TableElementProps extends React.TableHTMLAttributes<HTMLTableElement> {
  variant?: 'default' | 'striped';
  density?: 'default' | 'compact';
}

export const TableElement: React.FC<TableElementProps> = ({
  variant = 'default',
  density = 'default',
  className = '',
  children,
  ...props
}) => {
  const classes = [
    'fmdqui-table',
    variant === 'striped' ? 'fmdqui-table--striped' : '',
    density === 'compact' ? 'fmdqui-table--compact' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <table className={classes} {...props}>
      {children}
    </table>
  );
};

export const TableHead: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <thead className={`fmdqui-table-head ${className}`} {...props}>
    {children}
  </thead>
);

export const TableBody: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <tbody className={`fmdqui-table-body ${className}`} {...props}>
    {children}
  </tbody>
);

// ─── TableRow Component ───────────────────────────────────────────────────────

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  selected?: boolean;
  hoverable?: boolean;
  animate?: boolean;
  disabled?: boolean;
}

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  (
    {
      selected = false,
      hoverable = true,
      animate = false,
      disabled = false,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const classes = [
      'fmdqui-table-row',
      selected ? 'fmdqui-table-row--selected' : '',
      hoverable ? 'fmdqui-table-row--hoverable' : '',
      animate ? 'fmdqui-table-row--animate' : '',
      disabled ? 'fmdqui-table-row--disabled' : '',
      props.onClick ? 'fmdqui-table-row--clickable' : '',
      className,
    ].filter(Boolean).join(' ');

    return (
      <tr ref={ref} className={classes} aria-selected={selected} {...props}>
        {children}
      </tr>
    );
  }
);
TableRow.displayName = 'TableRow';

// ─── TableHeaderCell Component ────────────────────────────────────────────────

export type TableSortDirection = 'asc' | 'desc' | 'none' | null;

export interface TableHeaderCellProps
  extends React.ThHTMLAttributes<HTMLTableHeaderCellElement> {
  checkbox?: boolean;
  checked?: boolean;
  indeterminate?: boolean;
  onCheckboxChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  sortable?: boolean;
  sortDirection?: TableSortDirection;
  onSort?: () => void;
  align?: 'left' | 'center' | 'right';
  hasSeparator?: boolean;
}

export const TableHeaderCell = forwardRef<HTMLTableHeaderCellElement, TableHeaderCellProps>(
  (
    {
      checkbox = false,
      checked = false,
      indeterminate,
      onCheckboxChange,
      sortable = false,
      sortDirection = 'none',
      onSort,
      align = 'left',
      hasSeparator = true,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const checkboxRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
      if (checkboxRef.current && indeterminate !== undefined) {
        checkboxRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    const classes = [
      'fmdqui-table-header-cell',
      `fmdqui-table-header-cell--align-${align}`,
      !hasSeparator ? 'fmdqui-table-header-cell--no-separator' : '',
      className,
    ].filter(Boolean).join(' ');

    const renderSortIcon = () => {
      if (sortDirection === 'asc') {
        return (
          <span className="fmdqui-table-header-cell__sort-icon fmdqui-table-header-cell__sort-icon--active">
            <ChevronUpIcon />
          </span>
        );
      }
      if (sortDirection === 'desc') {
        return (
          <span className="fmdqui-table-header-cell__sort-icon fmdqui-table-header-cell__sort-icon--active">
            <ChevronDownIcon />
          </span>
        );
      }
      return (
        <span className="fmdqui-table-header-cell__sort-icon">
          <ChevronsUpDownIcon />
        </span>
      );
    };

    return (
      <th ref={ref} className={classes} {...props}>
        <div className="fmdqui-table-header-cell__content">
          {checkbox && (
            <span className="fmdqui-table-header-cell__checkbox-wrap">
              <Checkbox
                ref={checkboxRef}
                checked={checked}
                onChange={onCheckboxChange}
                aria-label="Select all rows"
              />
            </span>
          )}

          {sortable ? (
            <button
              type="button"
              className="fmdqui-table-header-cell__sort-btn"
              onClick={onSort}
            >
              <span>{children}</span>
              {renderSortIcon()}
            </button>
          ) : (
            children && <span>{children}</span>
          )}
        </div>
      </th>
    );
  }
);
TableHeaderCell.displayName = 'TableHeaderCell';

// Alias for backwards compatibility
export const TableHeader = TableHeaderCell;

// ─── TableCell Component (Granular with all Figma variants) ───────────────────

export type TableCellVariant =
  | 'text'
  | 'text-stack'
  | 'avatar-text'
  | 'avatar-group'
  | 'control'
  | 'badge'
  | 'chip'
  | 'progress'
  | 'actions'
  | 'more-menu'
  | 'rating'
  | 'custom';

export interface AvatarGroupItem {
  src?: string;
  initials?: string;
  name?: string;
}

export interface TableCellProps
  extends React.TdHTMLAttributes<HTMLTableDataCellElement> {
  variant?: TableCellVariant;
  align?: 'left' | 'center' | 'right';
  selected?: boolean;
  hasSeparator?: boolean;

  // Variant: 'text'
  text?: React.ReactNode;
  textWeight?: 'regular' | 'medium' | 'semibold';
  muted?: boolean;

  // Variant: 'text-stack' & 'avatar-text'
  primaryText?: React.ReactNode;
  secondaryText?: React.ReactNode;

  // Variant: 'avatar-text'
  avatar?: React.ReactNode;
  avatarSrc?: string;
  avatarInitials?: string;
  avatarSize?: AvatarSize;

  // Variant: 'avatar-group'
  avatars?: AvatarGroupItem[];
  maxAvatars?: number;

  // Variant: 'control'
  controlType?: 'checkbox' | 'radio' | 'switch';
  controlChecked?: boolean;
  onControlChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  controlDisabled?: boolean;
  controlAriaLabel?: string;

  // Variant: 'badge'
  badgeColor?: BadgeColor;
  badgeType?: BadgeType;
  badgeText?: React.ReactNode;

  // Variant: 'chip'
  chipLabel?: string;
  onChipClose?: (e: React.MouseEvent) => void;

  // Variant: 'progress'
  progress?: number | string;
  progressLabel?: React.ReactNode;
  progressColor?: 'primary' | 'success' | 'warning' | 'error';
  showPercentage?: boolean;

  // Variant: 'actions'
  actions?: React.ReactNode;

  // Variant: 'more-menu'
  onMenuClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  menuAriaLabel?: string;

  // Variant: 'rating'
  rating?: number;
  maxRating?: number;
}

export const TableCell = forwardRef<HTMLTableDataCellElement, TableCellProps>(
  (
    {
      variant = 'custom',
      align = 'left',
      selected = false,
      hasSeparator = true,
      text,
      textWeight = 'regular',
      muted = false,
      primaryText,
      secondaryText,
      avatar,
      avatarSrc,
      avatarInitials,
      avatarSize = 'sm',
      avatars = [],
      maxAvatars = 4,
      controlType = 'checkbox',
      controlChecked = false,
      onControlChange,
      controlDisabled = false,
      controlAriaLabel,
      badgeColor = 'blue',
      badgeType = 'filled',
      badgeText,
      chipLabel,
      onChipClose,
      progress = 0,
      progressLabel,
      progressColor = 'primary',
      showPercentage = true,
      actions,
      onMenuClick,
      menuAriaLabel = 'Row actions',
      rating = 0,
      maxRating = 5,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const classes = [
      'fmdqui-table-cell',
      `fmdqui-table-cell--align-${align}`,
      selected ? 'fmdqui-table-cell--selected' : '',
      !hasSeparator ? 'fmdqui-table-cell--no-separator' : '',
      className,
    ].filter(Boolean).join(' ');

    const renderContent = () => {
      // 1. Plain Text
      if (variant === 'text') {
        const textWeightClass =
          textWeight === 'semibold'
            ? 'fmdqui-table-cell__text--semibold'
            : textWeight === 'medium'
            ? 'fmdqui-table-cell__text--medium'
            : '';
        return (
          <div
            className={`fmdqui-table-cell__text ${textWeightClass} ${
              muted ? 'fmdqui-table-cell__text--muted' : ''
            }`}
          >
            {text ?? children}
          </div>
        );
      }

      // 2. Text Stack (Heading + Subtitle)
      if (variant === 'text-stack') {
        return (
          <div className="fmdqui-table-cell__text-stack">
            <div className="fmdqui-table-cell__primary-text">{primaryText ?? children}</div>
            {secondaryText && (
              <div className="fmdqui-table-cell__secondary-text">{secondaryText}</div>
            )}
          </div>
        );
      }

      // 3. Avatar + Text
      if (variant === 'avatar-text') {
        const renderedAvatar = avatar || (
          <Avatar
            size={avatarSize}
            type={avatarSrc ? 'Image' : avatarInitials ? 'Initials' : 'Icon'}
            imageUrl={avatarSrc}
            initials={avatarInitials}
          />
        );

        return (
          <div className="fmdqui-table-cell__avatar-text">
            <span className="fmdqui-table-cell__avatar-wrapper">{renderedAvatar}</span>
            <div className="fmdqui-table-cell__text-stack">
              <div className="fmdqui-table-cell__primary-text">{primaryText ?? children}</div>
              {secondaryText && (
                <div className="fmdqui-table-cell__secondary-text">{secondaryText}</div>
              )}
            </div>
          </div>
        );
      }

      // 4. Avatar Group
      if (variant === 'avatar-group') {
        const visibleAvatars = avatars.slice(0, maxAvatars);
        const remainingCount = avatars.length - maxAvatars;

        return (
          <div className="fmdqui-table-cell__avatar-group">
            {visibleAvatars.map((item, idx) => (
              <div key={idx} className="fmdqui-table-cell__avatar-group-item">
                <Avatar
                  size="xs"
                  type={item.src ? 'Image' : item.initials ? 'Initials' : 'Icon'}
                  imageUrl={item.src}
                  initials={item.initials}
                />
              </div>
            ))}
            {remainingCount > 0 && (
              <div className="fmdqui-table-cell__avatar-group-more">
                +{remainingCount}
              </div>
            )}
          </div>
        );
      }

      // 5. Form Control
      if (variant === 'control') {
        return (
          <span className="fmdqui-table-cell__control">
            {controlType === 'radio' ? (
              <Radio
                checked={controlChecked}
                onChange={onControlChange}
                disabled={controlDisabled}
                aria-label={controlAriaLabel || 'Select row'}
              />
            ) : controlType === 'switch' ? (
              <Switch
                checked={controlChecked}
                onChange={onControlChange}
                disabled={controlDisabled}
                aria-label={controlAriaLabel || 'Toggle status'}
              />
            ) : (
              <Checkbox
                checked={controlChecked}
                onChange={onControlChange}
                disabled={controlDisabled}
                aria-label={controlAriaLabel || 'Select row'}
              />
            )}
          </span>
        );
      }

      // 6. Badge
      if (variant === 'badge') {
        return (
          <span className="fmdqui-table-cell__badge-wrap">
            {children ? (
              children
            ) : (
              <Badge color={badgeColor} type={badgeType}>
                {badgeText}
              </Badge>
            )}
          </span>
        );
      }

      // 7. Chip
      if (variant === 'chip') {
        return (
          <span className="fmdqui-table-cell__chip-wrap">
            {children ? (
              children
            ) : (
              <Chip
                label={chipLabel || ''}
                onClose={onChipClose}
                hasCloseButton={!!onChipClose}
              />
            )}
          </span>
        );
      }

      // 8. Progress
      if (variant === 'progress') {
        const numericProgress = typeof progress === 'string' ? parseFloat(progress) : progress;
        const clampedProgress = Math.min(Math.max(numericProgress, 0), 100);

        return (
          <div className="fmdqui-table-cell__progress-wrap">
            {(progressLabel || showPercentage) && (
              <div className="fmdqui-table-cell__progress-header">
                {progressLabel && (
                  <span className="fmdqui-table-cell__progress-label">{progressLabel}</span>
                )}
                {showPercentage && (
                  <span className="fmdqui-table-cell__progress-value">
                    {Math.round(clampedProgress)}%
                  </span>
                )}
              </div>
            )}
            <div className="fmdqui-table-cell__progress-track">
              <div
                className={`fmdqui-table-cell__progress-bar fmdqui-table-cell__progress-bar--${progressColor}`}
                style={{ width: `${clampedProgress}%` }}
              />
            </div>
          </div>
        );
      }

      // 9. Actions
      if (variant === 'actions') {
        return <div className="fmdqui-table-cell__actions">{actions ?? children}</div>;
      }

      // 10. More Menu (Three-dots button)
      if (variant === 'more-menu') {
        return (
          <button
            type="button"
            className="fmdqui-table-cell__more-menu-btn"
            onClick={onMenuClick}
            aria-label={menuAriaLabel}
          >
            <DotsVerticalIcon />
          </button>
        );
      }

      // 11. Rating
      if (variant === 'rating') {
        return (
          <div className="fmdqui-table-cell__rating" aria-label={`Rating: ${rating} of ${maxRating}`}>
            {Array.from({ length: maxRating }).map((_, i) => (
              <StarIcon key={i} filled={i < rating} />
            ))}
          </div>
        );
      }

      // Default / Custom
      return children;
    };

    return (
      <td ref={ref} className={classes} {...props}>
        {renderContent()}
      </td>
    );
  }
);
TableCell.displayName = 'TableCell';

// ─── Dedicated Named Cell Atoms (For clear JSX syntax) ────────────────────────

export const TextCell: React.FC<TableCellProps> = (props) => (
  <TableCell variant="text" {...props} />
);

export const TextStackCell: React.FC<TableCellProps> = (props) => (
  <TableCell variant="text-stack" {...props} />
);

export const AvatarCell: React.FC<TableCellProps> = (props) => (
  <TableCell variant="avatar-text" {...props} />
);

export const AvatarGroupCell: React.FC<TableCellProps> = (props) => (
  <TableCell variant="avatar-group" {...props} />
);

export const ControlCell: React.FC<TableCellProps> = (props) => (
  <TableCell variant="control" {...props} />
);

export const BadgeCell: React.FC<TableCellProps> = (props) => (
  <TableCell variant="badge" {...props} />
);

export const ChipCell: React.FC<TableCellProps> = (props) => (
  <TableCell variant="chip" {...props} />
);

export const ProgressCell: React.FC<TableCellProps> = (props) => (
  <TableCell variant="progress" {...props} />
);

export const ActionCell: React.FC<TableCellProps> = (props) => (
  <TableCell variant="actions" {...props} />
);

export const MoreMenuCell: React.FC<TableCellProps> = (props) => (
  <TableCell variant="more-menu" {...props} />
);

// ─── Composed Data Table Implementation ───────────────────────────────────────

export interface ColumnDef<T> {
  header: React.ReactNode;
  accessorKey?: keyof T;
  id?: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  cell?: (info: { row: T; getValue: () => unknown; index: number }) => React.ReactNode;
}

export interface TableProps<T = Record<string, unknown>> extends React.TableHTMLAttributes<HTMLTableElement> {
  data?: T[];
  columns?: ColumnDef<T>[];
  pagination?: boolean;
  defaultPageSize?: number;
  pageSize?: number;
  totalItems?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  variant?: 'striped' | 'default';
  density?: 'default' | 'compact';
  emptyMessage?: React.ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  selectable?: boolean;
  selectedRowKeys?: string[];
  onSelectionChange?: (keys: string[]) => void;
  getRowId?: (row: T, index: number) => string;
}

export function Table<T extends object = Record<string, unknown>>({
  data,
  columns,
  pagination = false,
  defaultPageSize = 10,
  pageSize: controlledPageSize,
  totalItems: controlledTotalItems,
  currentPage: controlledCurrentPage,
  onPageChange: controlledOnPageChange,
  variant = 'default',
  density = 'default',
  emptyMessage,
  emptyTitle = 'No results found',
  emptyDescription = 'There is currently no data to display.',
  selectable = false,
  selectedRowKeys = [],
  onSelectionChange,
  getRowId,
  className = '',
  children,
  ...props
}: TableProps<T>) {
  // Internal pagination state (if not controlled externally)
  const [internalPage, setInternalPage] = useState(1);
  const activePage = controlledCurrentPage ?? internalPage;
  const pageSize = controlledPageSize ?? defaultPageSize;

  // Sorting state
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<TableSortDirection>('none');

  // Helper for row ID
  const resolveRowId = (row: T, index: number): string => {
    if (getRowId) return getRowId(row, index);
    if ('id' in row && row.id) return String(row.id);
    return String(index);
  };

  // If using as a manual compound component without data/columns props
  if (!data || !columns) {
    return (
      <TableContainer>
        <div className="fmdqui-table-scroll-wrapper">
          <TableElement variant={variant} density={density} className={className} {...props}>
            {children}
          </TableElement>
        </div>
      </TableContainer>
    );
  }

  // Handle sorting
  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortDir === 'asc') setSortDir('desc');
      else if (sortDir === 'desc') {
        setSortDir('none');
        setSortKey(null);
      } else {
        setSortDir('asc');
      }
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  // Sorted and Paginated Data
  const sortedData = useMemo(() => {
    if (!sortKey || sortDir === 'none') return data;
    return [...data].sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[sortKey];
      const bVal = (b as Record<string, unknown>)[sortKey];
      if (aVal === bVal) return 0;
      if (aVal === undefined || aVal === null) return 1;
      if (bVal === undefined || bVal === null) return -1;
      const compare = (aVal as number | string) < (bVal as number | string) ? -1 : 1;
      return sortDir === 'asc' ? compare : -compare;
    });
  }, [data, sortKey, sortDir]);

  const totalItems = controlledTotalItems ?? data.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  const paginatedData = useMemo(() => {
    if (!pagination || controlledCurrentPage !== undefined) return sortedData;
    const startIdx = (activePage - 1) * pageSize;
    return sortedData.slice(startIdx, startIdx + pageSize);
  }, [sortedData, pagination, controlledCurrentPage, activePage, pageSize]);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (controlledOnPageChange) {
      controlledOnPageChange(newPage);
    } else {
      setInternalPage(newPage);
    }
  };

  // Selection logic
  const allCurrentRowIds = paginatedData.map((row, idx) => resolveRowId(row, idx));
  const isAllSelected =
    allCurrentRowIds.length > 0 &&
    allCurrentRowIds.every((id) => selectedRowKeys.includes(id));
  const isPartiallySelected =
    allCurrentRowIds.some((id) => selectedRowKeys.includes(id)) && !isAllSelected;

  const toggleSelectAll = () => {
    if (!onSelectionChange) return;
    if (isAllSelected) {
      onSelectionChange(selectedRowKeys.filter((id) => !allCurrentRowIds.includes(id)));
    } else {
      const combined = Array.from(new Set([...selectedRowKeys, ...allCurrentRowIds]));
      onSelectionChange(combined);
    }
  };

  const toggleSelectRow = (id: string) => {
    if (!onSelectionChange) return;
    if (selectedRowKeys.includes(id)) {
      onSelectionChange(selectedRowKeys.filter((k) => k !== id));
    } else {
      onSelectionChange([...selectedRowKeys, id]);
    }
  };

  const totalColSpan = columns.length + (selectable ? 1 : 0);

  return (
    <TableContainer>
      <div className="fmdqui-table-scroll-wrapper">
        <TableElement variant={variant} density={density} className={className} {...props}>
          <TableHead>
            <TableRow>
              {selectable && (
                <TableHeaderCell
                  checkbox
                  checked={isAllSelected}
                  indeterminate={isPartiallySelected}
                  onCheckboxChange={toggleSelectAll}
                  style={{ width: '48px' }}
                />
              )}
              {columns.map((col, idx) => {
                const columnKey = (col.accessorKey as string) || col.id || String(idx);
                const isColumnSorted = sortKey === columnKey;
                return (
                  <TableHeaderCell
                    key={columnKey}
                    align={col.align}
                    sortable={col.sortable}
                    sortDirection={isColumnSorted ? sortDir : 'none'}
                    onSort={col.sortable ? () => handleSort(columnKey) : undefined}
                  >
                    {col.header}
                  </TableHeaderCell>
                );
              })}
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIndex) => {
                const rowId = resolveRowId(row, rowIndex);
                const isSelected = selectedRowKeys.includes(rowId);

                return (
                  <TableRow key={rowId} selected={isSelected}>
                    {selectable && (
                      <TableCell
                        variant="control"
                        controlType="checkbox"
                        controlChecked={isSelected}
                        onControlChange={() => toggleSelectRow(rowId)}
                        style={{ width: '48px' }}
                      />
                    )}
                    {columns.map((col, colIndex) => {
                      const value = col.accessorKey
                        ? (row as Record<string, unknown>)[col.accessorKey as string]
                        : undefined;
                      return (
                        <TableCell
                          key={col.id || (col.accessorKey as string) || colIndex}
                          align={col.align}
                        >
                          {col.cell
                            ? col.cell({ row, getValue: () => value, index: rowIndex })
                            : (value as React.ReactNode)}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
            ) : (
              <TableRow hoverable={false}>
                <TableCell colSpan={totalColSpan} className="fmdqui-table-empty">
                  {emptyMessage ?? (
                    <>
                      <div className="fmdqui-table-empty__title">{emptyTitle}</div>
                      <div className="fmdqui-table-empty__desc">{emptyDescription}</div>
                    </>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </TableElement>
      </div>

      {pagination && totalPages > 1 && (
        <div className="fmdqui-table-footer">
          <Pagination
            currentPage={activePage}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            type="both"
            orientation="full width"
          />
        </div>
      )}
    </TableContainer>
  );
}
