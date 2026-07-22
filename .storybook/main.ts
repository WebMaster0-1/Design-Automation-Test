import { fileURLToPath } from 'url';
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "staticDirs": ["../public"],
  "addons": ["@storybook/addon-links", "@storybook/addon-docs"],
  "framework": "@storybook/react-vite",
  viteFinal: async (config) => {
    // Remove vite-plugin-dts inherited from vite.config.ts — declaration
    // rollup is only meaningful for the library build and fails in Storybook.
    config.plugins = (config.plugins ?? [])
      .flat()
      .filter((plugin) => !(plugin && 'name' in plugin && plugin.name === 'vite:dts'));
    config.plugins.push({
      name: 'resolve-file-url-imports',
      resolveId(id: string) {
        if (id.startsWith('file://')) {
          return fileURLToPath(id);
        }
      },
    });
    return config;
  },
};
export default config;
