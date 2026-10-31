import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Dropdown,
  DropdownSection,
  DropdownHeader,
  DropdownItem,
} from './Dropdown';
import { Icon } from '../../foundations/icons';

const meta: Meta<typeof Dropdown> = {
  title: 'Components/🔽 Dropdown',
  component: Dropdown,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'FMDQ Design System standalone `Dropdown / Menu` component matching Figma `2190:52619` and `2159:51455`. Supports 3 trigger variants (Default Button with chevron, Avatar, Icon-only button), 4 states (default, hover, active/extended, disabled), multi-section popover menus with headers, keyboard shortcuts, toggle indicators, and destructive actions.',
      },
    },
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['default', 'avatar', 'icon-only'],
      description: 'Trigger type variant matching Figma',
    },
    state: {
      control: 'select',
      options: ['default', 'hover', 'active', 'disabled'],
      description: 'Trigger visual state',
    },
    extended: {
      control: 'boolean',
      description: 'Whether the popover menu is open',
    },
    label: {
      control: 'text',
      description: 'Button text for default trigger',
    },
    align: {
      control: 'radio',
      options: ['left', 'right'],
      description: 'Alignment of the popover menu',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the dropdown trigger',
    },
  },
  args: {
    type: 'default',
    state: 'default',
    extended: true,
    label: 'Account Menu',
    align: 'left',
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

const sampleSections = [
  {
    header: {
      title: 'David Eno',
      subtitle: 'david.e@fmdq.ui',
      borders: true,
    },
    items: [
      {
        id: '1',
        type: 'icon' as const,
        icon: <Icon name="user" variant="linear" size={16} />,
        label: 'View profile',
        shortcut: '⌘P',
      },
      {
        id: '2',
        type: 'icon' as const,
        icon: <Icon name="settings-2" variant="linear" size={16} />,
        label: 'Account settings',
        shortcut: '⌘S',
      },
      {
        id: '3',
        type: 'icon' as const,
        icon: <Icon name="bell" variant="linear" size={16} />,
        label: 'Notifications',
        hasCheckbox: true,
        selected: true,
      },
    ],
    hasDivider: true,
  },
  {
    header: {
      title: 'Preferences',
      borders: false,
    },
    items: [
      {
        id: '4',
        type: 'icon' as const,
        icon: <Icon name="brush" variant="linear" size={16} />,
        label: 'Display theme',
      },
      {
        id: '5',
        type: 'icon' as const,
        icon: <Icon name="sign-out" variant="linear" size={16} />,
        label: 'Log out',
        shortcut: '⌘Q',
        destructive: true,
      },
    ],
  },
];

// ── 1. Interactive Playground ──
export const Playground: Story = {
  render: (args) => (
    <div style={{ minHeight: '380px', padding: '20px' }}>
      <Dropdown {...args} sections={sampleSections} />
    </div>
  ),
};

// ── 2. All Figma Variants Matrix ──
export const AllFigmaVariantsMatrix: Story = {
  name: 'Canvas / All Figma Variants Matrix',
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', padding: '24px' }}>
      <div>
        <h3 style={{ margin: '0 0 8px 0', fontFamily: 'var(--font-family-primary)' }}>
          Figma &quot;Dropdown / Menu&quot; (Node 2190:52619)
        </h3>
        <p style={{ margin: 0, color: 'var(--color-neutral-500)', fontSize: '14px' }}>
          Demonstrates all 3 trigger types (Default Button, Avatar, and Icon-only) in both collapsed and extended states.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '48px', alignItems: 'flex-start' }}>
        {/* Variant 1: Default Button Trigger */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-neutral-500)' }}>
            1. Button Trigger (`type=&quot;default&quot;`)
          </span>
          <div style={{ minHeight: '360px' }}>
            <Dropdown
              type="default"
              label="Options"
              extended={true}
              sections={sampleSections}
            />
          </div>
        </div>

        {/* Variant 2: Avatar Trigger */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-neutral-500)' }}>
            2. Avatar Trigger (`type=&quot;avatar&quot;`)
          </span>
          <div style={{ minHeight: '360px' }}>
            <Dropdown
              type="avatar"
              extended={true}
              sections={sampleSections}
            />
          </div>
        </div>

        {/* Variant 3: Icon-only Trigger */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-neutral-500)' }}>
            3. Icon-only Trigger (`type=&quot;icon-only&quot;`)
          </span>
          <div style={{ minHeight: '360px' }}>
            <Dropdown
              type="icon-only"
              extended={true}
              sections={sampleSections}
            />
          </div>
        </div>
      </div>
    </div>
  ),
};

// ── 3. Menu Items Atoms Showcase (Figma 2159:51455) ──
export const MenuItemsShowcase: Story = {
  name: 'Items / Menu Item States & Types',
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '280px' }}>
      <div>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#667185', textTransform: 'uppercase' }}>
          Menu Item Types & States (Figma 2159:51455)
        </h4>
      </div>

      <div style={{ border: '1px solid var(--color-neutral-200)', borderRadius: '8px', padding: '4px 0', backgroundColor: '#FFFFFF' }}>
        <DropdownItem label="Default Item" shortcut="⌘K" />
        <DropdownItem
          type="icon"
          icon={<Icon name="settings-2" variant="linear" size={16} />}
          label="With Leading Icon"
          shortcut="⌘S"
        />
        <DropdownItem
          type="avatar"
          label="David Eno"
          shortcut="Admin"
        />
        <DropdownItem
          type="icon"
          icon={<Icon name="check" variant="linear" size={16} />}
          label="Selected State"
          selected
        />
        <DropdownItem
          type="icon"
          icon={<Icon name="lock" variant="linear" size={16} />}
          label="Disabled State"
          disabled
        />
        <DropdownItem
          type="icon"
          icon={<Icon name="trash" variant="linear" size={16} />}
          label="Destructive Action"
          destructive
          shortcut="⌘⌫"
        />
      </div>
    </div>
  ),
};

// ── 4. Declarative Compound Subcomponents ──
export const CompoundComposition: Story = {
  name: 'Composition / Declarative Subcomponents',
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ minHeight: '380px' }}>
      <Dropdown label="Manage Member" extended={true}>
        <DropdownSection
          header={
            <DropdownHeader
              title="Member Administration"
              subtitle="Access Bank PLC • Dealing Member"
              borders
            />
          }
          hasDivider
        >
          <DropdownItem
            type="icon"
            icon={<Icon name="user" variant="linear" size={16} />}
            label="Edit Permissions"
            shortcut="⌘E"
          />
          <DropdownItem
            type="icon"
            icon={<Icon name="refresh" variant="linear" size={16} />}
            label="Reset 2FA Token"
          />
        </DropdownSection>

        <DropdownSection>
          <DropdownItem
            type="icon"
            icon={<Icon name="close" variant="linear" size={16} />}
            label="Revoke Trading Rights"
            destructive
          />
        </DropdownSection>
      </Dropdown>
    </div>
  ),
};
