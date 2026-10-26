import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dropdown } from './index';
import type { DropdownOption } from './index';
import { Button } from '../../elements/Button';

const sampleAccounts: DropdownOption[] = [
  {
    id: '1',
    value: 'account-1',
    label: 'Account settings',
    sublabel: '@account',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80',
    statusColor: '#04802E',
  },
  {
    id: '2',
    value: 'account-2',
    label: 'Billing & Plans',
    sublabel: '@billing',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80',
    statusColor: '#04802E',
  },
  {
    id: '3',
    value: 'account-3',
    label: 'Team Members',
    sublabel: '@team',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80',
    statusColor: '#F3A218',
  },
  {
    id: '4',
    value: 'account-4',
    label: 'API Keys',
    sublabel: '@developer',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&h=80&q=80',
    statusColor: '#98A2B3',
  },
  {
    id: '5',
    value: 'account-5',
    label: 'Security & 2FA',
    sublabel: '@security',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&h=80&q=80',
    statusColor: '#04802E',
  },
];

const legacyMenuItems = [
  { id: '1', label: 'Edit profile', onClick: () => alert('Edit') },
  { id: '2', label: 'View settings', onClick: () => alert('Settings') },
  { id: '3', label: 'Deactivate account', disabled: true },
  { id: '4', label: 'Delete account', destructive: true, onClick: () => alert('Delete') },
];

const meta: Meta<typeof Dropdown> = {
  title: 'Components/✨ Dropdown',
  component: Dropdown,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'FMDQ Design System `Dropdown / Selectors` component. Supports 4 variant types (default, icon leading, avatar leading, status), 5 visual states (default, hover, active/extended, filled, disabled), custom options with primary and sub-labels, and backward compatibility for action button triggers.',
      },
    },
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['default', 'icon leading', 'avatar leading', 'status'],
      description: 'Variant type matching Figma',
    },
    state: {
      control: 'select',
      options: ['default', 'hover', 'active', 'filled', 'disabled'],
      description: 'Visual state matching Figma',
    },
    hasLabel: {
      control: 'boolean',
      description: 'Show/hide field label (Figma: has label)',
    },
    hasHelperText: {
      control: 'boolean',
      description: 'Show/hide helper text (Figma: has helper texts)',
    },
    disabled: {
      control: 'boolean',
    },
    extended: {
      control: 'boolean',
      description: 'Open menu state (Figma: extended)',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

// ── 1. Default (Standard Selector) ──
export const Default: Story = {
  args: {
    type: 'default',
    label: 'Label',
    placeholder: 'Placeholder',
    hasLabel: true,
    hasHelperText: false,
    options: sampleAccounts,
  },
};

// ── 2. Icon Leading ──
export const IconLeading: Story = {
  args: {
    type: 'icon leading',
    label: 'Favorite account',
    placeholder: 'Select an account',
    hasLabel: true,
    hasHelperText: true,
    helperText: 'Pick your primary operational account',
    options: sampleAccounts,
  },
};

// ── 3. Avatar Leading ──
export const AvatarLeading: Story = {
  args: {
    type: 'avatar leading',
    label: 'Assigned User',
    placeholder: 'Select a member',
    hasLabel: true,
    hasHelperText: false,
    avatarUrl: sampleAccounts[0].avatarUrl,
    options: sampleAccounts,
  },
};

// ── 4. Status Leading ──
export const StatusLeading: Story = {
  args: {
    type: 'status',
    label: 'System Status',
    placeholder: 'Select system endpoint',
    hasLabel: true,
    hasHelperText: true,
    helperText: 'Green indicator signifies live service connectivity',
    statusColor: '#04802E',
    options: sampleAccounts,
  },
};

// ── 5. Filled State ──
export const Filled: Story = {
  args: {
    type: 'default',
    label: 'Label',
    state: 'filled',
    defaultValue: 'account-1',
    hasLabel: true,
    options: sampleAccounts,
  },
};

// ── 6. Disabled State ──
export const Disabled: Story = {
  args: {
    type: 'default',
    label: 'Disabled Field',
    placeholder: 'Placeholder',
    disabled: true,
    hasLabel: true,
    hasHelperText: true,
    helperText: 'You do not have permission to modify this field',
    options: sampleAccounts,
  },
};

// ── 7. Extended / Open Menu State ──
export const ExtendedOpen: Story = {
  args: {
    type: 'default',
    label: 'Label',
    state: 'active',
    extended: true,
    defaultValue: 'account-1',
    hasLabel: true,
    hasHelperText: false,
    options: sampleAccounts,
  },
  parameters: {
    docs: {
      description: {
        story: 'Selector with the options menu expanded (`extended=true`), showing two-line option items.',
      },
    },
  },
};

// ── 8. States Comparison Matrix ──
export const StatesMatrix: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', width: '375px' }}>
      <div>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#667185', textTransform: 'uppercase' }}>
          1. Default State
        </h4>
        <Dropdown
          label="Label"
          placeholder="Placeholder"
          state="default"
          options={sampleAccounts}
        />
      </div>

      <div>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#667185', textTransform: 'uppercase' }}>
          2. Hover State (Gold-100 Border)
        </h4>
        <Dropdown
          label="Label"
          placeholder="Placeholder"
          state="hover"
          options={sampleAccounts}
        />
      </div>

      <div>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#667185', textTransform: 'uppercase' }}>
          3. Active / Focused State (Gold-400 Border + Focus Glow)
        </h4>
        <Dropdown
          label="Label"
          placeholder="Input"
          state="active"
          options={sampleAccounts}
        />
      </div>

      <div>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#667185', textTransform: 'uppercase' }}>
          4. Filled State (Selected Value)
        </h4>
        <Dropdown
          label="Label"
          state="filled"
          defaultValue="account-1"
          options={sampleAccounts}
        />
      </div>

      <div>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#667185', textTransform: 'uppercase' }}>
          5. Disabled State (Grey-100 Fill)
        </h4>
        <Dropdown
          label="Label"
          placeholder="Placeholder"
          state="disabled"
          options={sampleAccounts}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Visual matrix demonstrating all 5 states defined in the Figma design system.',
      },
    },
  },
};

// ── 9. All 4 Variant Types Gallery ──
export const TypesGallery: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 375px)', gap: '32px' }}>
      <div>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#1D326D', fontWeight: 600 }}>
          Type: Default
        </h4>
        <Dropdown
          type="default"
          label="Default Selector"
          placeholder="Placeholder"
          hasHelperText={true}
          helperText="Standard text-only selector"
          options={sampleAccounts}
        />
      </div>

      <div>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#1D326D', fontWeight: 600 }}>
          Type: Icon Leading
        </h4>
        <Dropdown
          type="icon leading"
          label="Icon Leading Selector"
          placeholder="Placeholder"
          hasHelperText={true}
          helperText="Leading icon prefix"
          options={sampleAccounts}
        />
      </div>

      <div>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#1D326D', fontWeight: 600 }}>
          Type: Avatar Leading
        </h4>
        <Dropdown
          type="avatar leading"
          label="Avatar Leading Selector"
          placeholder="Placeholder"
          hasHelperText={true}
          helperText="Leading user avatar prefix"
          avatarUrl={sampleAccounts[0].avatarUrl}
          options={sampleAccounts}
        />
      </div>

      <div>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#1D326D', fontWeight: 600 }}>
          Type: Status
        </h4>
        <Dropdown
          type="status"
          label="Status Selector"
          placeholder="Placeholder"
          hasHelperText={true}
          helperText="Online/offline status indicator dot"
          statusColor="#04802E"
          options={sampleAccounts}
        />
      </div>
    </div>
  ),
};

// ── 10. Backward-compatible Action Menu ──
export const LegacyActionMenu: Story = {
  args: {
    trigger: <Button label="Actions (Click Me)" variant="secondary" buttonType="outlined" />,
    items: legacyMenuItems,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Maintains 100% backward compatibility when a custom `trigger` prop (e.g. `<Button />`) is provided, functioning as a contextual popover menu.',
      },
    },
  },
};
