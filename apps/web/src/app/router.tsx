import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from '../layout/AppShell';
import { PublicLayout } from '../layout/PublicLayout';
import { BillingPage } from '../pages/BillingPage';
import { DevicesPage } from '../pages/DevicesPage';
import { GraphPage } from '../pages/GraphPage';
import { InboxPage } from '../pages/InboxPage';
import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/LoginPage';
import { SearchPage } from '../pages/SearchPage';
import { SettingsPage } from '../pages/SettingsPage';
import { SignupPage } from '../pages/SignupPage';
import { PlaceholderPage } from '../pages/PlaceholderPage';

const WorkspacePage = lazy(() =>
  import('../pages/WorkspacePage').then((module) => ({ default: module.WorkspacePage })),
);

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <LandingPage /> },
      {
        path: '/pricing',
        element: <BillingPage />,
      },
      { path: '/login', element: <LoginPage /> },
      { path: '/signup', element: <SignupPage /> },
    ],
  },
  {
    path: '/app',
    element: <AppShell />,
    children: [
      { index: true, element: <WorkspacePage /> },
      { path: 'inbox', element: <InboxPage /> },
      { path: 'search', element: <SearchPage /> },
      { path: 'graph', element: <GraphPage /> },
      { path: 'devices', element: <DevicesPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'billing', element: <BillingPage /> },
    ],
  },
  {
    path: '*',
    element: (
      <PlaceholderPage title="Not found" body="That route is not part of this FLUX shell." />
    ),
  },
]);
