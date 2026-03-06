import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
    title: 'FMDQ DS/Button',
    component: Button,
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        variant: { control: 'select', options: ['primary', 'secondary'] },
        size: { control: 'select', options: ['sm', 'lg'] },
        state: { control: 'select', options: ['default', 'hover', 'focused', 'de-activated'] },
        iconStyle: { control: 'select', options: ['none', 'leading', 'trailing', 'icon-only'] },
    },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
    args: {
        variant: 'primary',
        label: "My name is marvin",
    },
};

export const Secondary: Story = {
    args: {
        variant: 'secondary',
        label: 'Label',
    },
};

export const Hover: Story = {
    args: {
        variant: 'primary',
        label: 'Hover State',
        state: 'hover',
    },
};

export const Focused: Story = {
    args: {
        variant: 'primary',
        label: 'Focused State',
        state: 'focused',
    },
};

export const Disabled: Story = {
    args: {
        variant: 'primary',
        label: 'Disabled',
        state: 'de-activated',
    },
};

export const LeadingIcon: Story = {
    args: {
        variant: 'primary',
        label: 'Leading Icon',
        iconStyle: 'leading',
        icon: <span>★</span>,
    },
};

export const TrailingIcon: Story = {
    args: {
        variant: 'primary',
        label: 'Trailing Icon',
        iconStyle: 'trailing',
        icon: <span>→</span>,
    },
};

export const IconOnly: Story = {
    args: {
        variant: 'primary',
        iconStyle: 'icon-only',
        icon: <span>★</span>,
    },
};
