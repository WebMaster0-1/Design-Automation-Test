import type { Meta, StoryObj } from '@storybook/react-vite';
import { Radio } from './Radio';

const meta: Meta<typeof Radio> = {
    title: 'Elements/Radio',
    component: Radio,
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
type Story = StoryObj<typeof Radio>;

export const Default: Story = {
    args: {
        value: 'option1',
        label: 'Standard delivery',
    },
};

export const Checked: Story = {
    args: {
        value: 'option2',
        label: 'Express delivery',
        defaultChecked: true,
    },
};

export const WithHelperText: Story = {
    args: {
        value: 'option3',
        label: 'International shipping',
        helperText: 'Delivery times may vary between 7-14 business days.',
    },
};

export const ErrorState: Story = {
    args: {
        value: 'option4',
        label: 'Invalid option',
        error: true,
        errorMessage: 'This shipping method is not available for your region.',
    },
};

export const Disabled: Story = {
    args: {
        value: 'option5',
        label: 'Same-day delivery',
        disabled: true,
        helperText: 'Not available after 2 PM.',
    },
};

export const DisabledChecked: Story = {
    args: {
        value: 'option6',
        label: 'Digital download',
        disabled: true,
        defaultChecked: true,
    },
};
