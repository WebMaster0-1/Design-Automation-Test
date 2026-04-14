import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
    title: 'Elements/Input',
    component: Input,
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        variant: {
            control: 'radio',
            options: ['default', 'error'],
        },
        size: {
            control: 'radio',
            options: ['sm', 'lg'],
        },
        disabled: {
            control: 'boolean',
        },
        fullWidth: {
            control: 'boolean',
        },
    },
    args: {
        placeholder: 'Enter text here...',
    }
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
    args: {
        variant: 'default',
        size: 'sm',
    },
};

export const Large: Story = {
    args: {
        variant: 'default',
        size: 'lg',
    },
};

export const WithHelperText: Story = {
    args: {
        helperText: 'We will never share your email address.',
    },
};

export const ErrorState: Story = {
    args: {
        variant: 'error',
        errorMessage: 'This field is required.',
        defaultValue: 'Invalid input',
    },
};

export const Disabled: Story = {
    args: {
        disabled: true,
        defaultValue: 'Not allowed to edit',
        helperText: 'You do not have permission to edit this field.'
    },
};

export const WithLeadingIcon: Story = {
    args: {
        leadingIcon: <span>🔍</span>,
        placeholder: 'Search...',
    },
};

export const WithTrailingIcon: Story = {
    args: {
        trailingIcon: <span>ℹ️</span>,
    },
};

export const FullWidth: Story = {
    parameters: {
        layout: 'padded',
    },
    args: {
        fullWidth: true,
    },
};
