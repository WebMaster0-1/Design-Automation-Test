import React, { createContext, useContext, useState } from 'react';
import './Tabs.css';

interface TabsContextType {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

export interface TabsProps {
  defaultValue: string;
  className?: string;
  children: React.ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({ defaultValue, className = '', children }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={`qasah-tabs ${className}`}>{children}</div>
    </TabsContext.Provider>
  );
};

export const TabList: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = '', children, ...props }) => (
  <div className={`qasah-tab-list ${className}`} role="tablist" {...props}>
    {children}
  </div>
);

export interface TabProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export const Tab: React.FC<TabProps> = ({ value, className = '', children, disabled, ...props }) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error('Tab must be used within Tabs');
  
  const isActive = context.activeTab === value;
  
  return (
    <button
      role="tab"
      aria-selected={isActive}
      disabled={disabled}
      className={`qasah-tab ${isActive ? 'qasah-tab--active' : ''} ${className}`}
      onClick={() => !disabled && context.setActiveTab(value)}
      {...props}
    >
      {children}
    </button>
  );
};

export const TabPanel: React.FC<React.HTMLAttributes<HTMLDivElement> & { value: string }> = ({ value, className = '', children, ...props }) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabPanel must be used within Tabs');
  
  if (context.activeTab !== value) return null;
  
  return <div className={`qasah-tab-panel ${className}`} role="tabpanel" {...props}>{children}</div>;
};
