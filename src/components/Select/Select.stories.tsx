import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './Select';

const meta: Meta<typeof Select> = {
    title: 'Components/Select',
    component: Select,
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
        options: [
            { value: 'ngn', label: 'Nigerian Naira (NGN)' },
            { value: 'usd', label: 'US Dollar (USD)' },
            { value: 'gbp', label: 'British Pound (GBP)' },
            { value: 'eur', label: 'Euro (EUR)' },
        ],
    }
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {
    args: {
        variant: 'default',
        size: 'sm',
        placeholder: 'Select a currency',
    },
};

export const Large: Story = {
    args: {
        variant: 'default',
        size: 'lg',
        placeholder: 'Select a currency',
    },
};

export const WithPreselectedOption: Story = {
    args: {
        defaultValue: 'usd',
    },
};

export const WithHelperText: Story = {
    args: {
        placeholder: 'Select preferred language',
        options: [
            { value: 'en', label: 'English' },
            { value: 'fr', label: 'French' },
        ],
        helperText: 'This will update the interface language.',
    },
};

export const ErrorState: Story = {
    args: {
        variant: 'error',
        placeholder: 'Select an account type',
        options: [
            { value: 'savings', label: 'Savings' },
            { value: 'current', label: 'Current' },
        ],
        errorMessage: 'Please select an account type to proceed.',
    },
};

export const Disabled: Story = {
    args: {
        disabled: true,
        placeholder: 'Action unavailable',
        options: [],
        helperText: 'You do not have permission to change this.'
    },
};

export const WithDisabledOptions: Story = {
    args: {
        placeholder: 'Select a subscription plan',
        options: [
            { value: 'basic', label: 'Basic Plan' },
            { value: 'pro', label: 'Pro Plan (Sold Out)', disabled: true },
            { value: 'enterprise', label: 'Enterprise Plan' },
        ],
    },
};

export const FullWidth: Story = {
    parameters: {
        layout: 'padded',
    },
    args: {
        fullWidth: true,
        placeholder: 'Select a long option that fills the container',
    },
};
