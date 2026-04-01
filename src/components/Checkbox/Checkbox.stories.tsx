import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './Checkbox';

const meta: Meta<typeof Checkbox> = {
    title: 'Components/Checkbox',
    component: Checkbox,
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        disabled: {
            control: 'boolean',
        },
        error: {
            control: 'boolean',
        },
    },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
    args: {
        label: 'I accept the terms and conditions',
    },
};

export const Checked: Story = {
    args: {
        label: 'Subscribe to newsletter',
        defaultChecked: true,
    },
};

export const WithHelperText: Story = {
    args: {
        label: 'Enable notifications',
        helperText: 'You will receive email updates about your account activity.',
    },
};

export const ErrorState: Story = {
    args: {
        label: 'I acknowledge the risk warning',
        error: true,
        errorMessage: 'You must acknowledge the risk warning to proceed.',
    },
};

export const Disabled: Story = {
    args: {
        label: 'Save payment details',
        disabled: true,
    },
};

export const DisabledChecked: Story = {
    args: {
        label: 'Basic subscription plan',
        disabled: true,
        defaultChecked: true,
    },
};
