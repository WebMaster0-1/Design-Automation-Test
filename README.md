# @fmdq/ui

FMDQ Reusable UI Component Library — a standardized React component system designed to ensure consistency, scalability, and efficiency across FMDQ digital platforms.

## Installation

Install the library and its peer dependencies via npm:

```bash
npm install @fmdq/ui react react-dom
```

## Setup

For the UI styles to apply properly across your Vite/React project, you must import the global FMDQ styles mapping in your application entry point (e.g. `main.tsx` or `App.tsx`):

```tsx
import '@fmdq/ui/style.css';
```

## Quick Start

Import components directly from `@fmdq/ui`:

```tsx
import { Button, Input } from '@fmdq/ui';

export default function CustomForm() {
  return (
    <form>
      <Input placeholder="Enter trade quantity..." />
      <Button variant="primary">Submit Data</Button>
    </form>
  );
}
```

## Design System Portal (Storybook)

The library ships with an extensive interactive design system and documentation portal built on Storybook. This portal provides isolated testing, full API property documentation, usage catalogs, and developer playgrounds.

To run the design system portal locally:

```bash
npm run storybook
```

Alternatively, to build the static representation of the portal:

```bash
npm run build-storybook
```

## Features

- **Brand Accurate**: Built explicitly mimicking the internal FMDQ Figma design language.
- **Enterprise Scale**: Includes layouts (TopBar, AppLayout, PageHeader) to rapidly scaffold complex SaaS applications.
- **Vite & TS Setup**: Fully bundled via Vite with comprehensive TypeScript definitions emitted.
- **Accessible & Tested**: (Ongoing) Storybook integrated testing and coverage.
