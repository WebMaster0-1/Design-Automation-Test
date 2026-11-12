import React, { forwardRef, useState } from 'react';
import './NotificationPanel.css';
import { MiscIcon, type MiscIconColor } from '../../elements/Icon/MiscIcon';
import { Button } from '../../elements/Button';
import { EmptyState } from '../../layout/EmptyState';
import { Tabs, TabList, Tab } from '../Tabs';

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
          type="Round"
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
    iconName: 'chart',
    iconColor: 'Error',
  },
  {
    id: 'n2',
    state: 'unread',
    title: 'Unsettled trades above limit',
    description: 'DMB 6 has 4 trades past T+2 worth ₦1.2b.',
    meta: 'Settlement · 18 mins ago',
    iconName: 'money',
    iconColor: 'Warning',
  },
  {
    id: 'n3',
    state: 'unread',
    title: 'Request approved',
    description: 'Ngozi Eze approved your Price deviation alert.',
    meta: 'My Requests · 1 hr ago',
    iconName: 'check-circle',
    iconColor: 'Success',
  },
  {
    id: 'n4',
    state: 'read',
    title: 'RFQ response below 90%',
    description: 'DMB 2 responded to 82% of RFQs today.',
    meta: 'Alerts · 3 hrs ago',
    iconName: 'clock',
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

        {/* 2. Tabs (reusing Tabs, TabList, Tab from design system) */}
        {hasTabs && (
          <Tabs
            style="Line"
            value={activeTab}
            onValueChange={val => handleTabClick(val as 'all' | 'unread')}
            className="fmdqui-notification-panel__tabs-root"
          >
            <TabList className="fmdqui-notification-panel__tabs">
              <Tab
                value="all"
                hasNumberTag
                numberTag={totalCount}
                className="fmdqui-notification-panel__tab"
              >
                All
              </Tab>
              <Tab
                value="unread"
                hasNumberTag
                numberTag={unreadCount}
                className="fmdqui-notification-panel__tab"
              >
                Unread
              </Tab>
            </TabList>
          </Tabs>
        )}

        {/* 3. List or Empty State */}
        <div className="fmdqui-notification-panel__body">
          {isEmpty ? (
            <div className="fmdqui-notification-panel__empty">
              <EmptyState
                type="notifications"
                title="You’re all caught up"
                description="New alerts and approvals will show here."
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
