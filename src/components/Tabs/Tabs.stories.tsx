import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Tabs, TabList, Tab, TabPanel } from './Tabs';

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="tab1">
      <TabList>
        <Tab value="tab1">Account Details</Tab>
        <Tab value="tab2">Security</Tab>
        <Tab value="tab3">Notifications</Tab>
      </TabList>
      <TabPanel value="tab1">
        <p>Here you can update your account details. This content changes when you click a different tab.</p>
      </TabPanel>
      <TabPanel value="tab2">
        <p>Manage your password and security settings.</p>
      </TabPanel>
      <TabPanel value="tab3">
        <p>Configure how you receive notifications.</p>
      </TabPanel>
    </Tabs>
  )
};

export const WithDisabledTab: Story = {
  render: () => (
    <Tabs defaultValue="tab1">
      <TabList>
        <Tab value="tab1">Active Tab</Tab>
        <Tab value="tab2" disabled>Disabled Tab</Tab>
        <Tab value="tab3">Another Tab</Tab>
      </TabList>
      <TabPanel value="tab1">
        <p>This is the first tab's content.</p>
      </TabPanel>
      <TabPanel value="tab2">
        <p>This content won't be visible since the tab is disabled.</p>
      </TabPanel>
      <TabPanel value="tab3">
        <p>This is the third tab's content.</p>
      </TabPanel>
    </Tabs>
  )
};
