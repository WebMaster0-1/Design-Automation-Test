import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
    title: 'Elements/Button',
    component: Button,
    parameters: {
        layout: 'centered',
    },
    tags: [],
    argTypes: {
        variant: {
            control: 'select',
            options: ['primary', 'secondary', 'destructive', 'grey', 'text', 'success', 'warning', 'info'],
        },
        size: {
            control: 'radio',
            options: ['sm', 'lg'],
        },
        iconStyle: {
            control: 'select',
            options: ['none', 'leading icon', 'trailing icon', 'icon-only'],
        },
        outline: {
            control: 'boolean',
        },
    },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
    args: {
        variant: 'primary',
        label: 'Button',
        size: 'sm',
    },
};

export const LargeGradient: Story = {
    args: {
        variant: 'primary',
        label: 'Large Button',
        size: 'lg',
    },
};

export const Secondary: Story = {
    args: {
        variant: 'secondary',
        label: 'Button',
    },
};

export const Destructive: Story = {
    args: {
        variant: 'destructive',
        label: 'Delete',
    },
};

export const GreyRounded: Story = {
    args: {
        variant: 'grey',
        label: 'Select',
    },
};

export const TextButton: Story = {
    args: {
        variant: 'text',
        label: 'Click me',
    },
};

export const Success: Story = {
    args: {
        variant: 'success',
        label: 'Confirmed',
    },
};

export const LeadingIcon: Story = {
    args: {
        label: 'Download',
        iconStyle: 'leading icon',
    },
};

export const IconOnly: Story = {
    args: {
        iconStyle: 'icon-only',
        'aria-label': 'Next',
    },
};

export const TrailingIcon: Story = {
    args: {
        variant: 'primary',
        label: 'Trailing Icon',
        iconStyle: 'trailing icon',
        icon: <span>→</span>,
    },
};
