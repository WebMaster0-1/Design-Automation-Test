import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Pagination } from './Pagination';

const meta: Meta<typeof Pagination> = {
  title: 'Components/📄 Pagination',
  component: Pagination,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    currentPage: { control: { type: 'number', min: 1, max: 20 } },
    totalPages: { control: { type: 'number', min: 1, max: 50 } },
    type: {
      control: 'radio',
      options: ['numbers', 'indicator', 'both'],
    },
    orientation: {
      control: 'radio',
      options: ['full width', 'centre aligned', 'right aligned'],
    },
    prevLabel: { control: 'text' },
    nextLabel: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

export const Default: Story = {
  render: (args) => {
    const [page, setPage] = useState(args.currentPage || 1);
    return (
      <div style={{ width: '720px', padding: '24px', background: '#FFFFFF', borderRadius: '12px' }}>
        <Pagination
          {...args}
          currentPage={page}
          onPageChange={(p) => setPage(p)}
        />
      </div>
    );
  },
  args: {
    currentPage: 3,
    totalPages: 12,
    totalItems: 120,
    pageSize: 10,
    type: 'numbers',
    orientation: 'full width',
  },
};

export const IndicatorOnly: Story = {
  render: () => {
    const [page, setPage] = useState(1);
    return (
      <div style={{ width: '640px', padding: '24px', background: '#FFFFFF', borderRadius: '12px' }}>
        <Pagination
          currentPage={page}
          totalPages={30}
          totalItems={300}
          pageSize={10}
          type="indicator"
          orientation="full width"
          onPageChange={(p) => setPage(p)}
        />
      </div>
    );
  },
};

export const TableFooterDemo: Story = {
  render: () => {
    const [page, setPage] = useState(1);
    return (
      <div
        style={{
          width: '760px',
          background: '#FFFFFF',
          border: '1px solid #E4E7EC',
          borderRadius: '12px',
          padding: '16px 24px',
        }}
      >
        <div style={{ paddingBottom: '16px', color: '#101928', fontWeight: 600 }}>
          Dealing Member Trade Register (Page {page})
        </div>
        <Pagination
          currentPage={page}
          totalPages={8}
          totalItems={78}
          pageSize={10}
          type="both"
          orientation="full width"
          onPageChange={(p) => setPage(p)}
        />
      </div>
    );
  },
};
