import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { SearchResults } from './SearchResults';

const meta: Meta<typeof SearchResults> = {
  title: 'Components/🔍 Search Results',
  component: SearchResults,
  parameters: {
    docs: {
      description: {
        component:
          'Search results panel that opens under the sidebar search field. Built from Dropdown / menu item headers (borders=false) and Dropdown / menu item (type=icon). Results are grouped by module; the matching part of each label is SemiBold; the keyboard-focused row shows ↵.',
      },
    },
  },
  argTypes: {
    state: {
      control: 'select',
      options: ['results', 'recent', 'no results'],
      description: 'Figma `state` variant',
      table: { category: 'Variant' },
    },
    query: {
      control: 'text',
      description: 'Current search query used for highlighting matches',
      table: { category: 'Data' },
    },
    footerHint: {
      control: 'text',
      description: 'Custom footer hint text',
      table: { category: 'Content' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof SearchResults>;

export const Playground: Story = {
  args: {
    state: 'results',
    query: 'upload',
  },
};

export const StateResults: Story = {
  name: 'State = Results',
  args: {
    state: 'results',
    query: 'upload',
  },
};

export const StateRecent: Story = {
  name: 'State = Recent',
  args: {
    state: 'recent',
  },
};

export const StateNoResults: Story = {
  name: 'State = No Results',
  args: {
    state: 'no results',
    query: 'uplod',
    noResultsMessage: 'Try a module or page name, like NIBOR.',
  },
};

export const Interactive: Story = {
  render: () => {
    const [query, setQuery] = useState('upl');
    const [focusedIndex, setFocusedIndex] = useState(0);

    const allItems = [
      { id: '1', module: 'Trade Data Reporting', label: 'Uploads', iconName: 'folder' },
      { id: '2', module: 'Trade Data Reporting', label: 'Search uploaded data', iconName: 'folder' },
      { id: '3', module: 'FX Market Data', label: 'R-FXT upload', iconName: 'coin-swap' },
      { id: '4', module: 'Benchmark Contributions', label: 'NIBOR submission', iconName: 'clock' },
    ];

    const filtered = query.trim()
      ? allItems.filter(item =>
          item.label.toLowerCase().includes(query.trim().toLowerCase()) ||
          item.module.toLowerCase().includes(query.trim().toLowerCase())
        )
      : [];

    // Group filtered items by module
    const groups = filtered.reduce<Record<string, typeof filtered>>((acc, item) => {
      acc[item.module] = acc[item.module] || [];
      acc[item.module].push(item);
      return acc;
    }, {});

    let flatIndex = 0;
    const groupList = Object.entries(groups).map(([module, items]) => ({
      module,
      items: items.map(it => {
        const isFocused = flatIndex === focusedIndex;
        flatIndex++;
        return {
          ...it,
          isFocused,
          shortcutKey: isFocused ? '↵' : undefined,
        };
      }),
    }));

    const state =
      !query.trim()
        ? 'recent'
        : groupList.length > 0
        ? 'results'
        : 'no results';

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 240 }}>
        <input
          type="text"
          value={query}
          onChange={e => {
            setQuery(e.target.value);
            setFocusedIndex(0);
          }}
          placeholder="Search modules..."
          style={{
            padding: '8px 12px',
            borderRadius: 8,
            border: '1px solid #D0D5DD',
            fontSize: 14,
            outline: 'none',
          }}
        />
        <SearchResults
          state={state}
          query={query}
          groups={groupList}
          onItemSelect={item => alert(`Selected: ${item.label}`)}
        />
      </div>
    );
  },
};
