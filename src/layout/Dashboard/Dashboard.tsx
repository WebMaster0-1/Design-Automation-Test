import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import {
  Sidebar,
  SidebarSection,
  SidebarMenuItem,
  type SidebarVariant,
  type SidebarTheme,
} from '../../components/Sidebar';
import { MetricsCard } from '../../components/Metrics';
import {
  TableContainer,
  TableElement,
  TableHead,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCell,
} from '../../components/Table';
import { ProgressBar } from '../../components/ProgressBar';
import { Badge } from '../../elements/Badge';
import { Button } from '../../elements/Button';
import { Icon } from '../../foundations/icons';
import defaultAvatar from '../../assets/avatar-marvin.png';

export interface ApprovalItem {
  id: string;
  module: string;
  itemTitle: string;
  itemSubtitle: string;
  member: string;
  submittedTime: string;
  submittedDay: string;
}

export interface ContributionProgress {
  id: string;
  label: string;
  progress: number;
  contributors: string;
  outstanding: string;
}

export interface RecentActivityItem {
  id: string;
  status: 'Approved' | 'Rejected';
  description: string;
  timestamp: string;
  category?: string;
  detail?: string;
}

const renderActivityDescription = (act: RecentActivityItem) => {
  if (act.category && act.detail) {
    return (
      <span className="fmdqui-dashboard-activity-row__description">
        <span className="fmdqui-dashboard-activity-row__category">{act.category}</span>
        <span className="fmdqui-dashboard-activity-row__detail">
          {act.detail.startsWith(' · ') ? act.detail : ` · ${act.detail}`}
        </span>
      </span>
    );
  }
  const dotIndex = act.description.indexOf(' · ');
  if (dotIndex !== -1) {
    const category = act.description.slice(0, dotIndex);
    const detail = act.description.slice(dotIndex);
    return (
      <span className="fmdqui-dashboard-activity-row__description">
        <span className="fmdqui-dashboard-activity-row__category">{category}</span>
        <span className="fmdqui-dashboard-activity-row__detail">{detail}</span>
      </span>
    );
  }
  return (
    <span className="fmdqui-dashboard-activity-row__description">
      {act.description}
    </span>
  );
};

export interface DashboardMetrics {
  awaitingApproval: {
    value: string | number;
    overdueCount?: number;
    subtext: string;
  };
  contributionsReceived: {
    value: string;
    percentage?: string;
    subtext: string;
  };
  weeklyReturns: {
    value: string | number;
    weekEnding?: string;
    subtext: string;
  };
  rejectedThisWeek: {
    value: string | number;
    subtext: string;
  };
}

export interface DashboardProps extends React.HTMLAttributes<HTMLDivElement> {
  user?: {
    name: string;
    email: string;
    avatarSrc?: string;
    onSignOut?: () => void;
  };
  sidebarVariant?: SidebarVariant;
  sidebarTheme?: SidebarTheme;
  sidebarHasShadow?: boolean;
  portalBadge?: string;
  showPortalBadge?: boolean;
  dateText?: string;
  metrics?: DashboardMetrics;
  approvals?: ApprovalItem[];
  contributions?: ContributionProgress[];
  recentActivity?: RecentActivityItem[];
  activeMenuId?: string;
  onMenuSelect?: (id: string) => void;
  onDownloadSummary?: () => void;
  onReviewApprovals?: () => void;
  onViewAllApprovals?: () => void;
  onViewContributions?: () => void;
  onReviewItem?: (id: string) => void;
  onQuickAction?: (actionKey: string) => void;
  sidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
  className?: string;
}

const DEFAULT_METRICS: DashboardMetrics = {
  awaitingApproval: {
    value: 42,
    overdueCount: 8,
    subtext: 'Older than 24 hours',
  },
  contributionsReceived: {
    value: '47 of 60',
    percentage: '78%',
    subtext: 'NIBOR, NITTY, NAFEX, MM',
  },
  weeklyReturns: {
    value: 7,
    weekEnding: 'W/E 23 Oct',
    subtext: 'Dealing members to submit',
  },
  rejectedThisWeek: {
    value: 5,
    subtext: 'Returned to inputters',
  },
};

const DEFAULT_APPROVALS: ApprovalItem[] = [
  {
    id: 'appr-1',
    module: 'NIBOR',
    itemTitle: 'Rate contribution',
    itemSubtitle: '26 Oct 2026 · 4 tenors',
    member: 'Access Bank PLC',
    submittedTime: '09:12',
    submittedDay: 'Today',
  },
  {
    id: 'appr-2',
    module: 'FX closing rate',
    itemTitle: 'Closing rate',
    itemSubtitle: '23 Oct 2026',
    member: 'Fidelity Bank PLC',
    submittedTime: '16:40',
    submittedDay: 'Yesterday',
  },
  {
    id: 'appr-3',
    module: 'Trade data',
    itemTitle: 'Weekly trade return',
    itemSubtitle: 'Week ending 23 Oct 2026',
    member: 'Zenith Bank PLC',
    submittedTime: '14:05',
    submittedDay: 'Yesterday',
  },
  {
    id: 'appr-4',
    module: 'Mutual funds',
    itemTitle: 'Fund prices (NAV)',
    itemSubtitle: '23 Oct 2026 · 3 funds',
    member: 'SFS Capital Nigeria Limited',
    submittedTime: '11:30',
    submittedDay: 'Yesterday',
  },
  {
    id: 'appr-5',
    module: 'NSS trades',
    itemTitle: 'CSCS settlement',
    itemSubtitle: 'Deal ref 25',
    member: 'Citibank Nigeria Limited',
    submittedTime: '24 Oct',
    submittedDay: '2 days ago',
  },
  {
    id: 'appr-6',
    module: 'CBN S4 refund',
    itemTitle: 'Weekly refund',
    itemSubtitle: 'Week ending 23 Oct 2026',
    member: 'Ecobank Nigeria Limited',
    submittedTime: '24 Oct',
    submittedDay: '2 days ago',
  },
];

const DEFAULT_CONTRIBUTIONS: ContributionProgress[] = [
  {
    id: 'contrib-1',
    label: 'NIBOR',
    progress: 90,
    contributors: '18 of 20 contributors',
    outstanding: '2 outstanding',
  },
  {
    id: 'contrib-2',
    label: 'NITTY',
    progress: 80,
    contributors: '12 of 15 contributors',
    outstanding: '3 outstanding',
  },
  {
    id: 'contrib-3',
    label: 'NAFEX',
    progress: 80,
    contributors: '12 of 15 contributors',
    outstanding: '3 outstanding',
  },
  {
    id: 'contrib-4',
    label: 'Money market',
    progress: 50,
    contributors: '5 of 10 contributors',
    outstanding: '5 outstanding',
  },
];

const DEFAULT_ACTIVITY: RecentActivityItem[] = [
  {
    id: 'act-1',
    status: 'Approved',
    description: 'NIBOR contribution · Access Bank PLC',
    timestamp: '09:20',
  },
  {
    id: 'act-2',
    status: 'Rejected',
    description: 'Weekly trade return · Keystone Bank Limited · "Face value missing for FX Swaps"',
    timestamp: '08:55',
  },
  {
    id: 'act-3',
    status: 'Approved',
    description: 'New user · Union Bank of Nigeria PLC',
    timestamp: 'Yesterday',
  },
];

export const Dashboard: React.FC<DashboardProps> = ({
  user = {
    name: 'Marvin Marvin Ogah',
    email: 'MSG Admin',
    avatarSrc: defaultAvatar,
  },
  sidebarVariant = '1',
  sidebarTheme = 'light',
  sidebarHasShadow = true,
  portalBadge = 'DATA REPORTING PORTAL',
  showPortalBadge = true,
  dateText = 'Monday, 26 October 2026 · Market Service Group',
  metrics = DEFAULT_METRICS,
  approvals = DEFAULT_APPROVALS,
  contributions = DEFAULT_CONTRIBUTIONS,
  recentActivity = DEFAULT_ACTIVITY,
  activeMenuId = 'dashboard',
  onMenuSelect,
  onDownloadSummary,
  onReviewApprovals,
  onViewAllApprovals,
  onViewContributions,
  onReviewItem,
  onQuickAction,
  sidebarCollapsed: propSidebarCollapsed,
  onToggleSidebar,
  className = '',
  ...props
}) => {
  const [internalSidebarCollapsed, setInternalSidebarCollapsed] = useState(false);
  const isSidebarCollapsed =
    propSidebarCollapsed !== undefined ? propSidebarCollapsed : internalSidebarCollapsed;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(max-width: 960px)');
    const handleMedia = (e: MediaQueryListEvent | MediaQueryList) => {
      if (propSidebarCollapsed === undefined) {
        setInternalSidebarCollapsed(e.matches);
      }
    };
    handleMedia(mq);
    mq.addEventListener?.('change', handleMedia);
    return () => mq.removeEventListener?.('change', handleMedia);
  }, [propSidebarCollapsed]);

  return (
    <div className={`fmdqui-dashboard-layout ${className}`.trim()} {...props}>
      {/* ─── Sidebar Navigation (Variant 1, Theme Light by default) ──────── */}
      <aside
        className={`fmdqui-dashboard-layout__sidebar ${
          isSidebarCollapsed ? 'fmdqui-dashboard-layout__sidebar--collapsed' : ''
        }`.trim()}
        onClick={() => {
          if (isSidebarCollapsed) {
            setInternalSidebarCollapsed(false);
            onToggleSidebar?.();
          }
        }}
      >
        <Sidebar
          variant={sidebarVariant}
          theme={sidebarTheme}
          hasShadow={sidebarHasShadow}
          collapsed={isSidebarCollapsed}
          onToggleCollapse={
            onToggleSidebar ??
            (() => setInternalSidebarCollapsed(!isSidebarCollapsed))
          }
          activeId={activeMenuId}
          onActiveChange={onMenuSelect}
          user={user}
          hasSearch
          searchPlaceholder="Search"
          footerSection={
            <SidebarSection title="Administration" theme={sidebarTheme}>
              <SidebarMenuItem
                id="users-members"
                theme={sidebarTheme}
                label="Users & Members"
                icon={<Icon name="users" variant="bold" size={20} />}
                counter={2}
              />
              <SidebarMenuItem
                id="reference-data"
                theme={sidebarTheme}
                label="Reference Data"
                icon={<Icon name="calendar" variant="bold" size={20} />}
              />
            </SidebarSection>
          }
        >
          {/* Top section: Overview items with divider below Approvals */}
          <SidebarSection hasTitle={false} hasDivider theme={sidebarTheme}>
            <SidebarMenuItem
              id="dashboard"
              theme={sidebarTheme}
              label="Dashboard"
              icon={<Icon name="home" variant="bold" size={20} />}
            />
            <SidebarMenuItem
              id="approvals"
              theme={sidebarTheme}
              label="Approvals"
              icon={<Icon name="check-circle" variant="bold" size={20} />}
              counter={42}
            />
          </SidebarSection>

          {/* Modules Section */}
          <SidebarSection title="Modules" theme={sidebarTheme}>
            <SidebarMenuItem
              id="benchmark-contributions"
              theme={sidebarTheme}
              label="Benchmark Contributions"
              icon={<Icon name="chart-up" variant="bold" size={20} />}
              counter={12}
            />
            <SidebarMenuItem
              id="trade-data-reporting"
              theme={sidebarTheme}
              label="Trade Data Reporting"
              icon={<Icon name="data" variant="bold" size={20} />}
              counter={14}
            />
            <SidebarMenuItem
              id="securities-settlement"
              theme={sidebarTheme}
              label="Securities & Settlement"
              icon={<Icon name="bank" variant="bold" size={20} />}
              counter={3}
            />
            <SidebarMenuItem
              id="fx-market-data"
              theme={sidebarTheme}
              label="FX Market Data"
              icon={<Icon name="coin-swap" variant="bold" size={20} />}
              counter={11}
            />
            <SidebarMenuItem
              id="prices"
              theme={sidebarTheme}
              label="Prices"
              icon={<Icon name="bar-chart-v" variant="bold" size={20} />}
            />
            <SidebarMenuItem
              id="fees-billing"
              theme={sidebarTheme}
              label="Fees & Billing"
              icon={<Icon name="receipt" variant="bold" size={20} />}
            />
            <SidebarMenuItem
              id="reports"
              theme={sidebarTheme}
              label="Reports"
              icon={<Icon name="pie-chart" variant="bold" size={20} />}
            />
          </SidebarSection>
        </Sidebar>
      </aside>

      {/* ─── Main Content Canvas ─────────────────────────────────────────── */}
      <main className="fmdqui-dashboard-layout__main">
        <div className="fmdqui-dashboard-layout__main-inner">
          {/* Top Portal Badge (Figma node 11041:684742) */}
          {showPortalBadge && portalBadge && (
            <div className="fmdqui-dashboard-layout__badge-wrap">
              <Badge color="blue" type="filled" size="lg">
                {portalBadge}
              </Badge>
            </div>
          )}

          {/* 1. Page Header (Figma node 11041:684725) */}
          <header className="fmdqui-dashboard-layout__header">
            <div className="fmdqui-dashboard-layout__title-group">
              <h1 className="fmdqui-dashboard-layout__title">Dashboard</h1>
              <p className="fmdqui-dashboard-layout__subtitle">{dateText}</p>
            </div>
            <div className="fmdqui-dashboard-layout__actions">
              <Button
                variant="secondary"
                size="sm"
                iconStyle="leading icon"
                icon={<Icon name="download" variant="bold" size={16} />}
                onClick={onDownloadSummary}
              >
                Download summary
              </Button>
              <Button
                variant="primary"
                size="sm"
                iconStyle="trailing icon"
                icon={<Icon name="arrow-right" variant="linear" size={16} />}
                onClick={onReviewApprovals}
              >
                Review approvals
              </Button>
            </div>
          </header>

          {/* 2. Top Metrics Cards (4 Columns) */}
          <section
            aria-label="Overview metrics"
            className="fmdqui-dashboard-layout__metrics-grid"
          >
            <MetricsCard
              title="Awaiting your approval"
              value={metrics.awaitingApproval.value}
              badge={
                metrics.awaitingApproval.overdueCount
                  ? {
                      label: `${metrics.awaitingApproval.overdueCount} overdue`,
                      color: 'warning',
                      type: 'filled',
                    }
                  : undefined
              }
              subtext={metrics.awaitingApproval.subtext}
              icon={
                <Icon
                  name="check-circle"
                  variant="bold"
                  size={16}
                  color="var(--color-secondary-500, #CC9933)"
                />
              }
            />
            <MetricsCard
              title="Contributions received today"
              value={metrics.contributionsReceived.value}
              badge={
                metrics.contributionsReceived.percentage
                  ? {
                      label: metrics.contributionsReceived.percentage,
                      color: 'blue',
                      type: 'filled',
                    }
                  : undefined
              }
              subtext={metrics.contributionsReceived.subtext}
              icon={
                <Icon
                  name="chart-up"
                  variant="bold"
                  size={16}
                  color="var(--color-secondary-500, #CC9933)"
                />
              }
            />
            <MetricsCard
              title="Weekly returns outstanding"
              value={metrics.weeklyReturns.value}
              badge={
                metrics.weeklyReturns.weekEnding
                  ? {
                      label: metrics.weeklyReturns.weekEnding,
                      color: 'neutral',
                      type: 'filled',
                    }
                  : undefined
              }
              subtext={metrics.weeklyReturns.subtext}
              icon={
                <Icon
                  name="data"
                  variant="bold"
                  size={16}
                  color="var(--color-secondary-500, #CC9933)"
                />
              }
            />
            <MetricsCard
              title="Rejected this week"
              value={metrics.rejectedThisWeek.value}
              hasBadge={false}
              subtext={metrics.rejectedThisWeek.subtext}
              icon={
                <Icon
                  name="flag"
                  variant="bold"
                  size={16}
                  color="var(--color-secondary-500, #CC9933)"
                />
              }
            />
          </section>

          {/* 3. Middle Content Row (Approvals Table + Contributions Progress) */}
          <section className="fmdqui-dashboard-layout__content-grid">
            {/* Left: Awaiting your approval table card */}
            <div className="fmdqui-dashboard-card fmdqui-dashboard-card--approvals">
              <div className="fmdqui-dashboard-card__header">
                <div>
                  <h3 className="fmdqui-dashboard-card__title">
                    Awaiting your approval
                  </h3>
                  <p className="fmdqui-dashboard-card__subtitle">
                    Oldest first · 42 items across 6 modules
                  </p>
                </div>
                <button
                  type="button"
                  className="fmdqui-dashboard-card__link-btn"
                  onClick={onViewAllApprovals}
                >
                  <span>View all</span>
                  <Icon name="arrow-right" variant="linear" size={14} />
                </button>
              </div>

              <TableContainer className="fmdqui-dashboard-table-container">
                <TableElement className="fmdqui-dashboard-table">
                  <TableHead>
                    <TableRow hoverable={false}>
                      <TableHeaderCell style={{ width: '136px' }}>Module</TableHeaderCell>
                      <TableHeaderCell style={{ width: '196px' }}>Item</TableHeaderCell>
                      <TableHeaderCell style={{ width: '208px' }}>Member</TableHeaderCell>
                      <TableHeaderCell style={{ width: '112px' }}>Submitted</TableHeaderCell>
                      <TableHeaderCell style={{ width: '74px' }} align="right" aria-label="Action" />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {approvals.map(item => (
                      <TableRow key={item.id}>
                        <TableCell variant="badge">
                          <Badge color="blue" type="filled" size="sm">
                            {item.module}
                          </Badge>
                        </TableCell>
                        <TableCell
                          variant="text-stack"
                          primaryText={item.itemTitle}
                          secondaryText={item.itemSubtitle}
                        />
                        <TableCell
                          variant="text"
                          text={item.member}
                          textWeight="medium"
                        />
                        <TableCell
                          variant="text-stack"
                          primaryText={item.submittedTime}
                          secondaryText={item.submittedDay}
                        />
                        <TableCell variant="actions" align="right">
                          <Button
                            variant="text"
                            buttonType="primary"
                            size="sm"
                            onClick={() => onReviewItem?.(item.id)}
                          >
                            Review
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </TableElement>
              </TableContainer>
            </div>

            {/* Right: Today's contributions card */}
            <div className="fmdqui-dashboard-card fmdqui-dashboard-card--contributions">
              <div className="fmdqui-dashboard-card__header-flush">
                <div>
                  <h3 className="fmdqui-dashboard-card__title">
                    Today&apos;s contributions
                  </h3>
                  <p className="fmdqui-dashboard-card__subtitle">
                    Received against expected contributors
                  </p>
                </div>
              </div>
              <div className="fmdqui-dashboard-card__contributions-body">
                <div className="fmdqui-dashboard-card__progress-list">
                  {contributions.map(c => (
                    <ProgressBar
                      key={c.id}
                      label={c.label}
                      progress={c.progress}
                      size="lg"
                      metadata={[c.contributors, c.outstanding]}
                      hasPercentages
                      percentagePosition="bottom"
                    />
                  ))}
                </div>
                <div className="fmdqui-dashboard-card__footer-action">
                  <button
                    type="button"
                    className="fmdqui-dashboard-card__link-btn"
                    onClick={onViewContributions}
                  >
                    <span>View contributions</span>
                    <Icon name="arrow-right" variant="linear" size={14} />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* 4. Bottom Row (Recent Activity + Quick Actions) */}
          <section className="fmdqui-dashboard-layout__activity-grid">
            {/* Left: Your recent activity */}
            <div className="fmdqui-dashboard-card fmdqui-dashboard-card--activity">
              <h3 className="fmdqui-dashboard-card__title">
                Your recent activity
              </h3>
              <div className="fmdqui-dashboard-card__activity-body">
                {recentActivity.map(act => (
                  <div key={act.id} className="fmdqui-dashboard-activity-row">
                    <Badge
                      color={act.status === 'Approved' ? 'success' : 'error'}
                      type="filled"
                      size="sm"
                    >
                      {act.status}
                    </Badge>
                    {renderActivityDescription(act)}
                    <span className="fmdqui-dashboard-activity-row__timestamp">
                      {act.timestamp}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Quick actions */}
            <div className="fmdqui-dashboard-card fmdqui-dashboard-card--quick-actions">
              <h3 className="fmdqui-dashboard-card__title">
                Quick actions
              </h3>
              <div className="fmdqui-dashboard-card__quick-actions-body">
                <div className="fmdqui-dashboard-quick-actions-grid">
                  <button
                    type="button"
                    className="fmdqui-dashboard-quick-actions-btn"
                    onClick={() => onQuickAction?.('create-user')}
                  >
                    <Icon name="user-tick" variant="bold" size={16} />
                    <span>Create user</span>
                  </button>
                  <button
                    type="button"
                    className="fmdqui-dashboard-quick-actions-btn"
                    onClick={() => onQuickAction?.('weekly-fx-rate')}
                  >
                    <Icon name="coin-swap" variant="bold" size={16} />
                    <span>Weekly FX rate</span>
                  </button>
                  <button
                    type="button"
                    className="fmdqui-dashboard-quick-actions-btn"
                    onClick={() => onQuickAction?.('add-holiday')}
                  >
                    <Icon name="calendar-tick" variant="bold" size={16} />
                    <span>Add holiday</span>
                  </button>
                  <button
                    type="button"
                    className="fmdqui-dashboard-quick-actions-btn"
                    onClick={() => onQuickAction?.('upload-data')}
                  >
                    <Icon name="upload" variant="bold" size={16} />
                    <span>Upload data</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};
