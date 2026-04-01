import type { Meta } from '@storybook/react';
import { Heading, Text, Label } from './index';

const meta: Meta = {
  title: 'Components/Typography',
  parameters: {
    layout: 'padded',
  },
};

export default meta;

export const Headings = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
    <Heading level={1}>Heading 1</Heading>
    <Heading level={2}>Heading 2</Heading>
    <Heading level={3}>Heading 3</Heading>
    <Heading level={4}>Heading 4</Heading>
    <Heading level={5}>Heading 5</Heading>
    <Heading level={6}>Heading 6</Heading>
  </div>
);

export const Texts = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
    <Text size="lg">Large Text - FMDQ UI is the React implementation of the FMDQ Design System.</Text>
    <Text size="md">Medium Text (Default) - FMDQ UI is the React implementation of the FMDQ Design System.</Text>
    <Text size="sm">Small Text - FMDQ UI is the React implementation of the FMDQ Design System.</Text>
  </div>
);

export const TextWeights = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
    <Text weight="regular">Regular Weight</Text>
    <Text weight="medium">Medium Weight</Text>
    <Text weight="semibold">Semibold Weight</Text>
    <Text weight="bold">Bold Weight</Text>
  </div>
);

export const Labels = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
    <Label size="md">Medium Label</Label>
    <Label size="sm">Small Label</Label>
  </div>
);
