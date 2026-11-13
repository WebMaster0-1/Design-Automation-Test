import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { AppTopBar } from './TopBar';
import type { NotificationItemProps } from '../../components/NotificationPanel';

const meta: Meta<typeof AppTopBar> = {
  title: 'Layout/🔝 TopBar',
  component: AppTopBar,
  parameters: {
    docs: {
      description: {
        component:
          'Product top bar beside the Sidebar (1168 wide at 1440). Left: admin menu as Line tabs (Home, Activity, Users, My Requests). Right: notifications bell with unread count (opens NotificationPanel) and profile account menu (opens SidebarAccountMenu). Fixed on scroll.',
      },
    },
  },
  argTypes: {
    active: {
      control: 'select',
      options: ['home', 'activity', 'users', 'requests', 'none'],
      description: 'Active line tab — Figma `active` variant',
      table: { category: 'Variant' },
    },
    name: {
      control: 'text',
      description: 'User display name',
      table: { category: 'Profile' },
    },
    role: {
      control: 'text',
      description: 'User display role / title',
      table: { category: 'Profile' },
    },
    hasNotifications: {
      control: 'boolean',
      description: 'Figma `has notifications` boolean property',
      table: { category: 'Variant' },
    },
    hasAdminMenu: {
      control: 'boolean',
      description: 'Figma `has admin menu` boolean property',
      table: { category: 'Variant' },
    },
    unreadCount: {
      control: 'number',
      description: 'Unread notification count badge on bell',
      table: { category: 'Notifications' },
    },
    fourthTabLabel: {
      control: 'select',
      options: ['My Requests', 'Authorisations'],
      description: 'Rename 4th tab for authorisers',
      table: { category: 'Content' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof AppTopBar>;

export const Playground: Story = {
  args: {
    active: 'home',
    name: 'Halima Yusuf',
    role: 'Surveillance Officer',
    hasNotifications: true,
    hasAdminMenu: true,
    unreadCount: 3,
    fourthTabLabel: 'My Requests',
  },
  render: args => (
    <div style={{ backgroundColor: '#F9FAFB', minHeight: '300px', padding: '24px 0' }}>
      <AppTopBar {...args} />
    </div>
  ),
};

export const ActiveHome: Story = {
  name: 'Active = Home',
  args: {
    active: 'home',
  },
  render: args => (
    <div style={{ backgroundColor: '#F9FAFB', minHeight: '120px' }}>
      <AppTopBar {...args} />
    </div>
  ),
};

export const ActiveActivity: Story = {
  name: 'Active = Activity',
  args: {
    active: 'activity',
  },
  render: args => (
    <div style={{ backgroundColor: '#F9FAFB', minHeight: '120px' }}>
      <AppTopBar {...args} />
    </div>
  ),
};

export const ActiveUsers: Story = {
  name: 'Active = Users',
  args: {
    active: 'users',
  },
  render: args => (
    <div style={{ backgroundColor: '#F9FAFB', minHeight: '120px' }}>
      <AppTopBar {...args} />
    </div>
  ),
};

export const ActiveRequests: Story = {
  name: 'Active = My Requests',
  args: {
    active: 'requests',
  },
  render: args => (
    <div style={{ backgroundColor: '#F9FAFB', minHeight: '120px' }}>
      <AppTopBar {...args} />
    </div>
  ),
};

export const WithNotificationsOpen: Story = {
  name: 'Popovers / Notifications Open',
  args: {
    active: 'home',
    isNotificationOpen: true,
    unreadCount: 3,
  },
  render: args => (
    <div style={{ backgroundColor: '#F9FAFB', minHeight: '600px', padding: '24px 0' }}>
      <AppTopBar {...args} />
    </div>
  ),
};

export const WithAccountMenuOpen: Story = {
  name: 'Popovers / Account Menu Open',
  args: {
    active: 'home',
    isAccountMenuOpen: true,
  },
  render: args => (
    <div style={{ backgroundColor: '#F9FAFB', minHeight: '520px', padding: '24px 0' }}>
      <AppTopBar {...args} />
    </div>
  ),
};

export const Interactive: Story = {
  name: 'Interactive Full TopBar',
  render: () => {
    const [notifications, setNotifications] = useState<NotificationItemProps[]>([
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
    ]);

    const unreadCount = notifications.filter(n => n.state === 'unread').length;

    const handleMarkAll = () => {
      setNotifications(prev => prev.map(n => ({ ...n, state: 'read' })));
    };

    const handleNotificationClick = (item: NotificationItemProps) => {
      setNotifications(prev =>
        prev.map(n => (n.id === item.id ? { ...n, state: 'read' } : n))
      );
    };

    return (
      <div style={{ backgroundColor: '#F9FAFB', minHeight: '620px', padding: '24px' }}>
        <AppTopBar
          name="Halima Yusuf"
          role="Surveillance Officer"
          unreadCount={unreadCount}
          notifications={notifications}
          notificationPanelProps={{
            hasMarkAllAsRead: true,
            onMarkAllAsRead: handleMarkAll,
            onNotificationClick: handleNotificationClick,
            onViewAllAlerts: () => alert('Navigating to Alerts page...'),
          }}
          onAccountMenuItemClick={key => {
            alert(`Account menu clicked: ${key}`);
          }}
          onSignOut={() => alert('Signing out...')}
        />

        <div style={{ marginTop: '48px', padding: '24px', background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E4E7EC' }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 600 }}>Interactive TopBar Demonstration</h3>
          <p style={{ margin: 0, color: '#667185', fontSize: '14px' }}>
            Click the <strong>Notifications bell</strong> to open the Notification Panel. Click items to mark them read or use <strong>Mark all as read</strong>. Click the <strong>Profile avatar</strong> to toggle the Sidebar Account Menu. All dropdowns support click-outside and Escape key dismissal.
          </p>
        </div>
      </div>
    );
  },
};
