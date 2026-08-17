import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from '../layout/AppShell';
import { PublicLayout } from '../layout/PublicLayout';
import { DevicesPage } from '../pages/DevicesPage';
import { InboxPage } from '../pages/InboxPage';
import { LandingPage } from '../pages/LandingPage';
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
        element: (
          <PlaceholderPage
            title="Pricing"
            body="Subscriptions come later. This phase is the visual product shell."
          />
        ),
      },
      {
        path: '/login',
        element: (
          <PlaceholderPage
            title="Log in"
            body="Authentication is not wired yet. The workspace is open for the visual demo."
          />
        ),
      },
      {
        path: '/signup',
        element: (
          <PlaceholderPage
            title="Sign up"
            body="Accounts will arrive with the Supabase auth phase."
          />
        ),
      },
    ],
  },
  {
    path: '/app',
    element: <AppShell />,
    children: [
      { index: true, element: <WorkspacePage /> },
      { path: 'inbox', element: <InboxPage /> },
      {
        path: 'search',
        element: (
          <PlaceholderPage
            title="Search"
            body="Semantic search is a later layer. This route is reserved."
          />
        ),
      },
      {
        path: 'graph',
        element: (
          <PlaceholderPage
            title="Graph"
            body="The knowledge graph is not live. The workspace canvas is conceptual only."
          />
        ),
      },
      { path: 'devices', element: <DevicesPage /> },
      {
        path: 'settings',
        element: (
          <PlaceholderPage
            title="Settings"
            body="Preferences, privacy, and account controls will live here."
          />
        ),
      },
      {
        path: 'billing',
        element: (
          <PlaceholderPage
            title="Billing"
            body="Stripe is intentionally out of scope for this phase."
          />
        ),
      },
    ],
  },
]);
