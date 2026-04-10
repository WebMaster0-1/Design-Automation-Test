import type { Preview } from '@storybook/react-vite'

const preview: Preview = {
  parameters: {
    options: {
      storySort: {
        order: [
          'Welcome',
          'Getting Started',
          'Catalog',
          'MCP',
          'Playground',
          'Foundations', // Colors, Spacing, Typography
          'Components',  // Basic elements like Button, Input
          'Layout',      // Structural components like TopBar, PageHeader
          'Changelog',
          'Migration Guide',
          'Contributing',
        ],
      },
    },
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  },
};

export default preview;