import React from 'react';
import DashboardDark from './DashboardDark';
import DashboardClassic from './DashboardClassic';
import DashboardFun from './DashboardFun';
import DashboardCoastal from './DashboardCoastal';

const Dashboard = (props) => {
  const { dashboardVersion, currentTier, onUpgradeRequest } = props;

  switch (dashboardVersion) {
    case 'classic':
      return <DashboardClassic {...props} />;
    case 'fun':
      return <DashboardFun {...props} />;
    case 'coastal':
      return <DashboardCoastal {...props} />;
    case 'dark':
    default:
      return <DashboardDark {...props} />;
  }
};

export default Dashboard;
