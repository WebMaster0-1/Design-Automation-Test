import React, { forwardRef, useState } from 'react';
import './NotificationPanel.css';
import { MiscIcon, type MiscIconColor } from '../../elements/Icon/MiscIcon';
import { Badge } from '../../elements/Badge';
import { Button } from '../../elements/Button';
import { EmptyState } from '../../layout/EmptyState';

export type NotificationItemState = 'unread' | 'read';
export type NotificationPanelState = 'default' | 'empty';

export interface NotificationItemProps extends React.HTMLAttributes<HTMLDivElement> {
  id?: string;
  /** Figma `state` variant: 'unread' | 'read' */
  state?: NotificationItemState;
  /** Title text */
  title: string;
  /** Optional secondary description text */
  description?: string;
  /** Meta information (e.g. "Alerts · 2 mins ago") */
  meta?: string;
  /** Whether the description row is displayed. Default: true */
  hasDescription?: boolean;
  /** MiscIcon icon name (default: 'alert-triangle' or 'bell') */
  iconName?: string;
  /** MiscIcon color variant: 'Error' | 'Warning' | 'Success' | 'Primary' | 'Gray' */
  iconColor?: MiscIconColor;
  /** Click handler */
  onItemClick?: () => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  state = 'unread',
  title,
  description,
  meta,
  hasDescription = true,
  iconName = 'alert-triangle',
  iconColor = 'Error',
  onItemClick,
  className = '',
  ...rest
}) => {
  return (
    <div
      role="listitem"
      tabIndex={0}
      onClick={onItemClick}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onItemClick?.();
        }
      }}
      className={`fmdqui-notification-item fmdqui-notification-item--${state} ${className}`.trim()}
      {...rest}
    >
      <div className="fmdqui-notification-item__icon-wrap">
        <MiscIcon
          size="sm"
          color={iconColor}
          icon={iconName}
          iconVariant="bold"
          tabIndex={-1}
          aria-hidden="true"
        />
      </div>

      <div className="fmdqui-notification-item__content">
        <div className="fmdqui-notification-item__title-row">
          <span className="fmdqui-notification-item__title">{title}</span>
          {state === 'unread' && <span className="fmdqui-notification-item__dot" aria-label="Unread" />}
        </div>

        {hasDescription && description && (
          <p className="fmdqui-notification-item__description">{description}</p>
        )}

        {meta && <span className="fmdqui-notification-item__meta">{meta}</span>}
      </div>
    </div>
  );
};

NotificationItem.displayName = 'NotificationItem';

export interface NotificationPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Figma `state` variant: 'default' | 'empty' */
  state?: NotificationPanelState;
  /** Whether to show 'All' and 'Unread' line tabs */
  hasTabs?: boolean;
  /** Whether to show the bottom footer with 'View all alerts' */
  hasFooter?: boolean;
  /** Whether to show the 'Mark all as read' text button in header */
  hasMarkAllAsRead?: boolean;
  /** Active tab when controlled: 'all' | 'unread' */
  activeTab?: 'all' | 'unread';
  /** Default active tab when uncontrolled */
  defaultActiveTab?: 'all' | 'unread';
  /** Callback on tab change */
  onTabChange?: (tab: 'all' | 'unread') => void;
  /** List of notifications */
  notifications?: NotificationItemProps[];
  /** Callback when 'Mark all as read' is clicked */
  onMarkAllAsRead?: () => void;
  /** Callback when 'View all alerts' footer is clicked */
  onViewAllAlerts?: () => void;
  /** Callback when an individual notification is clicked */
  onNotificationClick?: (item: NotificationItemProps) => void;
}

const DEFAULT_NOTIFICATIONS: NotificationItemProps[] = [
  {
    id: 'n1',
    state: 'unread',
    title: 'Market spread alert triggered',
    description: 'NIGB 15.45 06/21/38 spread widened to 1.2%, above the 0.8% threshold.',
    meta: 'Alerts · 2 mins ago',
    iconName: 'alert-triangle',
    iconColor: 'Error',
  },
  {
    id: 'n2',
    state: 'unread',
    title: 'New trade submission awaiting review',
    description: 'Stanbic IBTC Bank submitted FGN Bond 2027 (₦2,500,000,000.00).',
    meta: 'Trades · 14 mins ago',
    iconName: 'folder',
    iconColor: 'Warning',
  },
  {
    id: 'n3',
    state: 'unread',
    title: 'Daily closing rates published',
    description: 'Official NIBOR and NIFEX benchmarks have been finalized.',
    meta: 'Benchmarks · 1 hour ago',
    iconName: 'chart-bar',
    iconColor: 'Primary',
  },
  {
    id: 'n4',
    state: 'read',
    title: 'User authorization approved',
    description: 'Surveillance Officer access granted for Halima Yusuf.',
    meta: 'Admin · Yesterday',
    iconName: 'shield-tick',
    iconColor: 'Success',
  },
  {
    id: 'n5',
    state: 'read',
    title: 'Weekly compliance report generated',
    description: 'Download the comprehensive surveillance digest for Week 45.',
    meta: 'Reports · 2 days ago',
    iconName: 'book',
    iconColor: 'Gray',
  },
];

export const NotificationPanel = forwardRef<HTMLDivElement, NotificationPanelProps>(
  (
    {
      state = 'default',
      hasTabs = true,
      hasFooter = true,
      hasMarkAllAsRead = false,
      activeTab: propActiveTab,
      defaultActiveTab = 'all',
      onTabChange,
      notifications = DEFAULT_NOTIFICATIONS,
      onMarkAllAsRead,
      onViewAllAlerts,
      onNotificationClick,
      className = '',
      ...rest
    },
    ref
  ) => {
    const [internalTab, setInternalTab] = useState<'all' | 'unread'>(defaultActiveTab);
    const activeTab = propActiveTab !== undefined ? propActiveTab : internalTab;

    const handleTabClick = (tab: 'all' | 'unread') => {
      setInternalTab(tab);
      onTabChange?.(tab);
    };

    const unreadCount = notifications.filter(n => n.state === 'unread').length;
    const totalCount = notifications.length;

    const displayedNotifications =
      activeTab === 'unread'
        ? notifications.filter(n => n.state === 'unread')
        : notifications;

    const isEmpty = state === 'empty' || (displayedNotifications.length === 0 && state !== 'default');

    return (
      <div
        ref={ref}
        role="dialog"
        aria-label="Notifications"
        className={`fmdqui-notification-panel fmdqui-notification-panel--${state} ${className}`.trim()}
        {...rest}
      >
        {/* 1. Header */}
        <div className="fmdqui-notification-panel__header">
          <h3 className="fmdqui-notification-panel__title">Notifications</h3>
          {hasMarkAllAsRead && (
            <Button
              variant="text"
              size="sm"
              onClick={onMarkAllAsRead}
              className="fmdqui-notification-panel__mark-btn"
            >
              Mark all as read
            </Button>
          )}
        </div>

        {/* 2. Tabs */}
        {hasTabs && (
          <div className="fmdqui-notification-panel__tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'all'}
              onClick={() => handleTabClick('all')}
              className={`fmdqui-notification-panel__tab ${
                activeTab === 'all' ? 'fmdqui-notification-panel__tab--active' : ''
              }`}
            >
              <span className="fmdqui-notification-panel__tab-label">All</span>
              <Badge
                type="filled"
                size="sm"
                color={activeTab === 'all' ? 'blue' : 'neutral'}
              >
                {totalCount}
              </Badge>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'unread'}
              onClick={() => handleTabClick('unread')}
              className={`fmdqui-notification-panel__tab ${
                activeTab === 'unread' ? 'fmdqui-notification-panel__tab--active' : ''
              }`}
            >
              <span className="fmdqui-notification-panel__tab-label">Unread</span>
              <Badge
                type="filled"
                size="sm"
                color={activeTab === 'unread' ? 'blue' : 'neutral'}
              >
                {unreadCount}
              </Badge>
            </button>
          </div>
        )}

        {/* 3. List or Empty State */}
        <div className="fmdqui-notification-panel__body">
          {isEmpty ? (
            <div className="fmdqui-notification-panel__empty">
              <EmptyState
                type="notifications"
                title="No notifications"
                description="You're all caught up! Check back later."
              />
            </div>
          ) : (
            <div className="fmdqui-notification-panel__list" role="list">
              {displayedNotifications.map(item => (
                <NotificationItem
                  key={item.id}
                  {...item}
                  onItemClick={() => {
                    item.onItemClick?.();
                    onNotificationClick?.(item);
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* 4. Footer */}
        {hasFooter && (
          <div className="fmdqui-notification-panel__footer">
            <Button
              variant="text"
              size="sm"
              onClick={onViewAllAlerts}
              className="fmdqui-notification-panel__footer-btn"
            >
              View all alerts
            </Button>
          </div>
        )}
      </div>
    );
  }
);

NotificationPanel.displayName = 'NotificationPanel';
