import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import {
  NotificationPanel,
  NotificationItem,
  type NotificationItemProps,
} from './NotificationPanel';

const meta: Meta<typeof NotificationPanel> = {
  title: 'Components/🔔 Notification Panel',
  component: NotificationPanel,
  parameters: {
    docs: {
      description: {
        component:
          'Notification panel that opens from the App top bar bell. Composes Line Tabs (All / Unread), Notification Item rows, and EmptyState (Notifications).',
      },
    },
  },
  argTypes: {
    state: {
      control: 'select',
      options: ['default', 'empty'],
      description: 'Figma `state` variant',
      table: { category: 'Variant' },
    },
    hasTabs: {
      control: 'boolean',
      description: 'Show All / Unread Line Tabs with counts',
      table: { category: 'Variant' },
    },
    hasFooter: {
      control: 'boolean',
      description: 'Show View all alerts footer button',
      table: { category: 'Variant' },
    },
    hasMarkAllAsRead: {
      control: 'boolean',
      description: 'Show Mark all as read header button',
      table: { category: 'Variant' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof NotificationPanel>;

export const Playground: Story = {
  args: {
    state: 'default',
    hasTabs: true,
    hasFooter: true,
    hasMarkAllAsRead: true,
  },
};

export const StateDefault: Story = {
  name: 'State = Default',
  args: {
    state: 'default',
    hasTabs: true,
    hasFooter: true,
    hasMarkAllAsRead: true,
  },
};

export const StateEmpty: Story = {
  name: 'State = Empty',
  args: {
    state: 'empty',
    hasTabs: true,
    hasFooter: true,
    hasMarkAllAsRead: false,
  },
};

export const NotificationItemVariants: Story = {
  name: 'Elements / Notification Item',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 400 }}>
      <div>
        <h4 style={{ margin: '0 0 8px 0', fontSize: 13, color: '#667185' }}>State = Unread (with dot & Grey/50 fill)</h4>
        <NotificationItem
          state="unread"
          title="Market spread alert triggered"
          description="NIGB 15.45 06/21/38 spread widened to 1.2%, above the 0.8% threshold."
          meta="Alerts · 2 mins ago"
          iconName="alert-triangle"
          iconColor="Error"
        />
      </div>

      <div>
        <h4 style={{ margin: '0 0 8px 0', fontSize: 13, color: '#667185' }}>State = Read (no dot, white background)</h4>
        <NotificationItem
          state="read"
          title="User authorization approved"
          description="Surveillance Officer access granted for Halima Yusuf."
          meta="Admin · Yesterday"
          iconName="shield-tick"
          iconColor="Success"
        />
      </div>

      <div>
        <h4 style={{ margin: '0 0 8px 0', fontSize: 13, color: '#667185' }}>Without Description</h4>
        <NotificationItem
          state="unread"
          title="System maintenance scheduled"
          hasDescription={false}
          meta="System · 3 hours ago"
          iconName="info-circle"
          iconColor="Primary"
        />
      </div>
    </div>
  ),
};

export const Interactive: Story = {
  render: () => {
    const [notifications, setNotifications] = useState<NotificationItemProps[]>([
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
    ]);

    const handleMarkAll = () => {
      setNotifications(prev => prev.map(n => ({ ...n, state: 'read' })));
    };

    const handleItemClick = (item: NotificationItemProps) => {
      setNotifications(prev =>
        prev.map(n => (n.id === item.id ? { ...n, state: 'read' } : n))
      );
    };

    return (
      <NotificationPanel
        hasMarkAllAsRead={true}
        notifications={notifications}
        onMarkAllAsRead={handleMarkAll}
        onNotificationClick={handleItemClick}
        onViewAllAlerts={() => alert('Navigate to alerts page')}
      />
    );
  },
};
