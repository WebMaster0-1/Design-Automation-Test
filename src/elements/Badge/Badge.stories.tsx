import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from './Badge';

const meta: Meta<typeof Badge> = {
  title: 'Elements/Badge',
  component: Badge,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    children: 'Pending',
    variant: 'warning',
  },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px' }}>
      <Badge variant="primary">Primary</Badge>
      <Badge variant="success">Completed</Badge>
      <Badge variant="warning">Pending</Badge>
      <Badge variant="destructive">Failed</Badge>
      <Badge variant="info">Info</Badge>
      <Badge variant="grey">Draft</Badge>
    </div>
  )
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <Badge size="sm">Small</Badge>
      <Badge size="md">Medium</Badge>
      <Badge size="lg">Large</Badge>
    </div>
  )
};

export const Rounded: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px' }}>
      <Badge variant="success" rounded>Completed</Badge>
      <Badge variant="warning" rounded>Pending</Badge>
    </div>
  )
};
