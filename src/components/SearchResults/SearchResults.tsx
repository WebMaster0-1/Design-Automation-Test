import React, { forwardRef, type ReactNode } from 'react';
import './SearchResults.css';
import {
  DropdownMenuItemHeader,
  DropdownMenuItem,
} from '../Dropdowns';
import { Icon } from '../../foundations/icons';
import { highlightSearchMatch } from './searchResultsUtils';

export type SearchResultsState = 'results' | 'recent' | 'no results';

export interface SearchResultItem {
  id: string;
  label: string;
  iconName?: string;
  isFocused?: boolean;
  shortcutKey?: string;
  onClick?: () => void;
}

export interface SearchResultGroup {
  module: string;
  items: SearchResultItem[];
}

export interface SearchResultsProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Figma `state` variant: 'results' | 'recent' | 'no results' */
  state?: SearchResultsState;
  /** Current search query string. Used for match highlighting and 'no results' header */
  query?: string;
  /** Grouped results for `state="results"`. Module title becomes the section header */
  groups?: SearchResultGroup[];
  /** Flat list of recent items for `state="recent"` */
  recentItems?: SearchResultItem[];
  /** Subtitle message for `state="no results"`. Default: "Try a module or page name, like NIBOR." */
  noResultsMessage?: string;
  /** Custom footer hint text. Defaults per state if omitted */
  footerHint?: ReactNode;
  /** Callback when an item is clicked */
  onItemSelect?: (item: SearchResultItem) => void;
}

export const SearchResults = forwardRef<HTMLDivElement, SearchResultsProps>(
  (
    {
      state = 'results',
      query = '',
      groups,
      recentItems,
      noResultsMessage = 'Try a module or page name, like NIBOR.',
      footerHint,
      onItemSelect,
      className = '',
      ...rest
    },
    ref
  ) => {
    // Default footer hint copy from Figma per state
    const defaultHint =
      state === 'results'
        ? '↑↓ to move · ↵ to open · esc to close'
        : state === 'recent'
        ? 'Search modules and pages by name'
        : 'esc to close';

    const effectiveHint = footerHint ?? defaultHint;

    // Default mock data matching Figma master component if none provided
    const defaultGroups: SearchResultGroup[] = [
      {
        module: 'Trade Data Reporting',
        items: [
          {
            id: 'uploads',
            label: 'Uploads',
            iconName: 'folder',
            isFocused: true,
            shortcutKey: '↵',
          },
          {
            id: 'search-data',
            label: 'Search uploaded data',
            iconName: 'folder',
            isFocused: false,
          },
        ],
      },
      {
        module: 'FX Market Data',
        items: [
          {
            id: 'rfxt-upload',
            label: 'R-FXT upload',
            iconName: 'coin-swap',
            isFocused: false,
          },
        ],
      },
    ];

    const defaultRecent: SearchResultItem[] = [
      {
        id: 'nibor',
        label: 'NIBOR',
        iconName: 'clock',
        isFocused: true,
        shortcutKey: '↵',
      },
      {
        id: 'reconciliation',
        label: 'Reconciliation',
        iconName: 'clock',
        isFocused: false,
      },
      {
        id: 'closing-rate',
        label: 'Closing rate',
        iconName: 'clock',
        isFocused: false,
      },
    ];

    const effectiveGroups = groups ?? defaultGroups;
    const effectiveRecent = recentItems ?? defaultRecent;

    const renderMenuItem = (item: SearchResultItem) => {
      const isFocused = !!item.isFocused;
      return (
        <DropdownMenuItem
          key={item.id}
          type="icon"
          state={isFocused ? 'focused' : 'default'}
          menuText={highlightSearchMatch(item.label, query || (state === 'results' ? 'upload' : ''))}
          icon={
            item.iconName ? (
              <Icon
                name={item.iconName}
                variant="bold"
                size={20}
                className="fmdqui-search-results__item-icon"
              />
            ) : undefined
          }
          hasCommandMenu={isFocused}
          shortcutKey={item.shortcutKey ?? (isFocused ? '↵' : undefined)}
          showShortcutModifier={false}
          hasCheckbox={false}
          onClick={() => {
            item.onClick?.();
            onItemSelect?.(item);
          }}
        />
      );
    };

    return (
      <div
        ref={ref}
        role="region"
        aria-label="Search results"
        className={`fmdqui-search-results fmdqui-search-results--state-${state.replace(/\s+/g, '-')} ${className}`.trim()}
        {...rest}
      >
        {/* 1. Results State */}
        {state === 'results' && (
          <div className="fmdqui-search-results__body">
            {effectiveGroups.map((group, groupIdx) => (
              <div key={group.module} className="fmdqui-search-results__group">
                {groupIdx > 0 && <div className="fmdqui-search-results__divider" />}
                <DropdownMenuItemHeader
                  borders={false}
                  headerStyle="label"
                  hasSupportingTexts={false}
                  title={group.module}
                  className="fmdqui-search-results__group-header"
                />
                <ul className="fmdqui-search-results__list" role="menu">
                  {group.items.map(renderMenuItem)}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* 2. Recent State */}
        {state === 'recent' && (
          <div className="fmdqui-search-results__body">
            <div className="fmdqui-search-results__group">
              <DropdownMenuItemHeader
                borders={false}
                headerStyle="label"
                hasSupportingTexts={false}
                title="Recent"
                className="fmdqui-search-results__group-header"
              />
              <ul className="fmdqui-search-results__list" role="menu">
                {effectiveRecent.map(renderMenuItem)}
              </ul>
            </div>
          </div>
        )}

        {/* 3. No Results State */}
        {state === 'no results' && (
          <div className="fmdqui-search-results__body">
            <DropdownMenuItemHeader
              borders={false}
              hasSupportingTexts={true}
              title={`No results for “${query || 'uplod'}”`}
              subtitle={noResultsMessage}
              className="fmdqui-search-results__empty-header"
            />
          </div>
        )}

        {/* Divider above footer */}
        <div className="fmdqui-search-results__divider" />

        {/* Footer Hint */}
        <div className="fmdqui-search-results__footer">
          <span className="fmdqui-search-results__hint">{effectiveHint}</span>
        </div>
      </div>
    );
  }
);

SearchResults.displayName = 'SearchResults';
