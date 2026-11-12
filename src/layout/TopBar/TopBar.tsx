import React, { useState, useEffect, useRef, useCallback, forwardRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import './TopBar.css';
import { Icon } from '../../foundations/icons';
import { Avatar, type AvatarStatus } from '../../elements/Avatar';
import {
  NotificationPanel,
  type NotificationPanelProps,
  type NotificationItemProps,
} from '../../components/NotificationPanel';
import {
  SidebarAccountMenu,
  type SidebarAccountMenuItem,
} from '../../components/Sidebar';

export type AppTopBarActiveTab = 'home' | 'activity' | 'users' | 'requests' | 'none';

export interface AppTopBarProps extends HTMLAttributes<HTMLDivElement> {
  /** Figma `active` variant: 'home' | 'activity' | 'users' | 'requests' | 'none' */
  active?: AppTopBarActiveTab;
  /** Callback when the active tab changes */
  onActiveTabChange?: (tab: AppTopBarActiveTab) => void;
  /** User name displayed in profile trigger. Default: 'Halima Yusuf' */
  name?: string;
  /** User role displayed in profile trigger. Default: 'Surveillance Officer' */
  role?: string;
  /** User avatar image URL. If omitted, initials are used */
  avatarSrc?: string;
  /** User avatar initials. Default: derived from name or 'HY' */
  avatarInitials?: string;
  /** User status for avatar. Default: 'online' */
  userStatus?: AvatarStatus;
  /** Figma `has notifications` boolean property. Default: true */
  hasNotifications?: boolean;
  /** Figma `has admin menu` boolean property. Default: true */
  hasAdminMenu?: boolean;
  /** Unread notification badge count. Default: 3 */
  unreadCount?: number;
  /** Fourth tab label: 'My Requests' | 'Authorisations'. Default: 'My Requests' */
  fourthTabLabel?: 'My Requests' | 'Authorisations';
  /** Whether the notification dropdown panel is open. Controlled */
  isNotificationOpen?: boolean;
  /** Default open state for notifications when uncontrolled */
  defaultNotificationOpen?: boolean;
  /** Callback when notification panel visibility toggles */
  onNotificationToggle?: (open: boolean) => void;
  /** Whether the profile account menu is open. Controlled */
  isAccountMenuOpen?: boolean;
  /** Default open state for account menu when uncontrolled */
  defaultAccountMenuOpen?: boolean;
  /** Callback when account menu visibility toggles */
  onAccountMenuToggle?: (open: boolean) => void;
  /** Custom notification items passed to NotificationPanel */
  notifications?: NotificationItemProps[];
  /** Props forwarded to the NotificationPanel */
  notificationPanelProps?: Partial<NotificationPanelProps>;
  /** Custom menu items for the profile SidebarAccountMenu */
  accountMenuItems?: SidebarAccountMenuItem[];
  /** Callback when a profile menu item is clicked */
  onAccountMenuItemClick?: (key: string) => void;
  /** Callback when user signs out */
  onSignOut?: () => void;
  /** Slot escape hatches for backward compatibility */
  leftContent?: ReactNode;
  centerContent?: ReactNode;
  rightContent?: ReactNode;
}

export type TopBarProps = AppTopBarProps;

export const AppTopBar = forwardRef<HTMLDivElement, AppTopBarProps>(
  (
    {
      active: propActive = 'home',
      onActiveTabChange,
      name = 'Halima Yusuf',
      role = 'Surveillance Officer',
      avatarSrc,
      avatarInitials,
      userStatus = 'online',
      hasNotifications = true,
      hasAdminMenu = true,
      unreadCount = 3,
      fourthTabLabel = 'My Requests',
      isNotificationOpen: propIsNotificationOpen,
      defaultNotificationOpen = false,
      onNotificationToggle,
      isAccountMenuOpen: propIsAccountMenuOpen,
      defaultAccountMenuOpen = false,
      onAccountMenuToggle,
      notifications,
      notificationPanelProps,
      accountMenuItems,
      onAccountMenuItemClick,
      onSignOut,
      leftContent,
      centerContent,
      rightContent,
      className = '',
      ...props
    },
    ref
  ) => {
    // Tab state
    const [internalActive, setInternalActive] = useState<AppTopBarActiveTab>(propActive);
    const activeTab = propActive !== undefined ? propActive : internalActive;

    const handleTabClick = (tab: AppTopBarActiveTab) => {
      setInternalActive(tab);
      onActiveTabChange?.(tab);
    };

    // Notification dropdown state
    const [internalNotifOpen, setInternalNotifOpen] = useState(defaultNotificationOpen);
    const isNotifOpen = propIsNotificationOpen !== undefined ? propIsNotificationOpen : internalNotifOpen;

    // Account menu dropdown state
    const [internalAccountOpen, setInternalAccountOpen] = useState(defaultAccountMenuOpen);
    const isAccountOpen = propIsAccountMenuOpen !== undefined ? propIsAccountMenuOpen : internalAccountOpen;

    const toggleNotif = useCallback((open?: boolean) => {
      const next = open !== undefined ? open : !isNotifOpen;
      setInternalNotifOpen(next);
      onNotificationToggle?.(next);
      if (next && isAccountOpen) {
        setInternalAccountOpen(false);
        onAccountMenuToggle?.(false);
      }
    }, [isNotifOpen, isAccountOpen, onNotificationToggle, onAccountMenuToggle]);

    const toggleAccount = useCallback((open?: boolean) => {
      const next = open !== undefined ? open : !isAccountOpen;
      setInternalAccountOpen(next);
      onAccountMenuToggle?.(next);
      if (next && isNotifOpen) {
        setInternalNotifOpen(false);
        onNotificationToggle?.(false);
      }
    }, [isAccountOpen, isNotifOpen, onAccountMenuToggle, onNotificationToggle]);

    // Outside-click & Escape dismissal
    const notifWrapRef = useRef<HTMLDivElement>(null);
    const accountWrapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (!isNotifOpen && !isAccountOpen) return;

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          if (isNotifOpen) toggleNotif(false);
          if (isAccountOpen) toggleAccount(false);
        }
      };

      const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as Node;
        if (isNotifOpen && notifWrapRef.current && !notifWrapRef.current.contains(target)) {
          toggleNotif(false);
        }
        if (isAccountOpen && accountWrapRef.current && !accountWrapRef.current.contains(target)) {
          toggleAccount(false);
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isNotifOpen, isAccountOpen, toggleNotif, toggleAccount]);

    // Derive avatar initials
    const computedInitials =
      avatarInitials ??
      name
        .split(' ')
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    // If custom legacy slot props were passed (e.g. DrpLayout), render in slot mode
    if (leftContent || centerContent || rightContent) {
      return (
        <div ref={ref} className={`fmdqui-topbar fmdqui-app-topbar ${className}`.trim()} {...props}>
          <div className="fmdqui-topbar__left">{leftContent}</div>
          <div className="fmdqui-topbar__center">{centerContent}</div>
          <div className="fmdqui-topbar__right">{rightContent}</div>
        </div>
      );
    }

    const tabs: Array<{ key: AppTopBarActiveTab; label: string; icon: string }> = [
      { key: 'home', label: 'Home', icon: 'home-alt' },
      { key: 'activity', label: 'Activity', icon: 'activity' },
      { key: 'users', label: 'Users', icon: 'profile-2user' },
      { key: 'requests', label: fourthTabLabel, icon: 'document-text' },
    ];

    return (
      <header
        ref={ref}
        role="banner"
        className={`fmdqui-topbar fmdqui-app-topbar ${className}`.trim()}
        {...props}
      >
        {/* ── Left Section: Admin Menu Line Tabs ── */}
        <div className="fmdqui-app-topbar__left">
          {hasAdminMenu && (
            <nav className="fmdqui-app-topbar__nav" aria-label="Admin Navigation">
              {tabs.map(tab => {
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => handleTabClick(tab.key)}
                    className={`fmdqui-app-topbar__tab ${
                      isActive ? 'fmdqui-app-topbar__tab--active' : ''
                    }`}
                  >
                    <Icon
                      name={tab.icon}
                      variant={isActive ? 'bold' : 'linear'}
                      size={20}
                      className="fmdqui-app-topbar__tab-icon"
                    />
                    <span className="fmdqui-app-topbar__tab-label">{tab.label}</span>
                    <span className="fmdqui-app-topbar__tab-indicator" />
                  </button>
                );
              })}
            </nav>
          )}
        </div>

        {/* ── Right Section: Notifications & Account Menu ── */}
        <div className="fmdqui-app-topbar__right">
          {/* Notifications Bell */}
          {hasNotifications && (
            <div className="fmdqui-app-topbar__notif-wrap" ref={notifWrapRef}>
              <button
                type="button"
                aria-label={`Notifications (${unreadCount} unread)`}
                aria-haspopup="dialog"
                aria-expanded={isNotifOpen}
                onClick={() => toggleNotif()}
                className={`fmdqui-app-topbar__bell-btn ${
                  isNotifOpen ? 'fmdqui-app-topbar__bell-btn--active' : ''
                }`}
              >
                <Icon name="bell" variant="linear" size={20} />
                {unreadCount > 0 && (
                  <span className="fmdqui-app-topbar__bell-badge">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown Panel */}
              {isNotifOpen && (
                <div className="fmdqui-app-topbar__notif-popover">
                  <NotificationPanel
                    notifications={notifications}
                    onMarkAllAsRead={() => {
                      notificationPanelProps?.onMarkAllAsRead?.();
                    }}
                    onViewAllAlerts={() => {
                      notificationPanelProps?.onViewAllAlerts?.();
                      toggleNotif(false);
                    }}
                    onNotificationClick={item => {
                      notificationPanelProps?.onNotificationClick?.(item);
                    }}
                    {...notificationPanelProps}
                  />
                </div>
              )}
            </div>
          )}

          {/* Vertical Divider */}
          <div className="fmdqui-app-topbar__divider" aria-hidden="true" />

          {/* Account Menu Profile Trigger */}
          <div className="fmdqui-app-topbar__account-wrap" ref={accountWrapRef}>
            <button
              type="button"
              aria-label="User Account Menu"
              aria-haspopup="menu"
              aria-expanded={isAccountOpen}
              onClick={() => toggleAccount()}
              className={`fmdqui-app-topbar__account-trigger ${
                isAccountOpen ? 'fmdqui-app-topbar__account-trigger--active' : ''
              }`}
            >
              <div className="fmdqui-app-topbar__avatar-box">
                {avatarSrc ? (
                  <Avatar
                    type="Image"
                    size="md"
                    imageUrl={avatarSrc}
                    statusIcon={userStatus}
                  />
                ) : (
                  <div className="fmdqui-app-topbar__initials-avatar">
                    {computedInitials}
                  </div>
                )}
              </div>

              <div className="fmdqui-app-topbar__user-info">
                <span className="fmdqui-app-topbar__user-name">{name}</span>
                <span className="fmdqui-app-topbar__user-role">{role}</span>
              </div>

              <Icon
                name="chevron-down"
                variant="linear"
                size={20}
                className={`fmdqui-app-topbar__chevron ${
                  isAccountOpen ? 'fmdqui-app-topbar__chevron--open' : ''
                }`}
              />
            </button>

            {/* Profile Dropdown Popover (SidebarAccountMenu) */}
            {isAccountOpen && (
              <div className="fmdqui-app-topbar__account-popover">
                <SidebarAccountMenu
                  isOpen={isAccountOpen}
                  onClose={() => toggleAccount(false)}
                  user={{
                    name,
                    email: role,
                    status: userStatus,
                    avatarSrc,
                  }}
                  items={accountMenuItems}
                  showHeader={true}
                  hasBackdrop={false}
                  onItemClick={key => {
                    onAccountMenuItemClick?.(key);
                    if (key === 'logout') onSignOut?.();
                    toggleAccount(false);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </header>
    );
  }
);

AppTopBar.displayName = 'AppTopBar';

/**
 * TopBar: Base export that supports both AppTopBar Figma specification
 * and legacy slot-based composition (`leftContent`, `rightContent`).
 */
export const TopBar: React.FC<TopBarProps> = props => {
  return <AppTopBar {...props} />;
};

TopBar.displayName = 'TopBar';
