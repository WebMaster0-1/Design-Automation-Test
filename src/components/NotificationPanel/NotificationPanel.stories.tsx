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
    hasMarkAllAsRead: false,
  },
};

export const StateDefault: Story = {
  name: 'State = Default',
  args: {
    state: 'default',
    hasTabs: true,
    hasFooter: true,
    hasMarkAllAsRead: false,
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

export const WithMarkAllAsRead: Story = {
  args: {
    state: 'default',
    hasTabs: true,
    hasFooter: true,
    hasMarkAllAsRead: true,
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
          iconName="chart"
          iconColor="Error"
        />
      </div>

      <div>
        <h4 style={{ margin: '0 0 8px 0', fontSize: 13, color: '#667185' }}>State = Read (no dot, white background)</h4>
        <NotificationItem
          state="read"
          title="RFQ response below 90%"
          description="DMB 2 responded to 82% of RFQs today."
          meta="Alerts · 3 hrs ago"
          iconName="clock"
          iconColor="Gray"
        />
      </div>

      <div>
        <h4 style={{ margin: '0 0 8px 0', fontSize: 13, color: '#667185' }}>Without Description</h4>
        <NotificationItem
          state="unread"
          title="System maintenance scheduled"
          hasDescription={false}
          meta="System · 3 hours ago"
          iconName="settings"
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
