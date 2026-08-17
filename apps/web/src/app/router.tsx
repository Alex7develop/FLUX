import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from '../layout/AppShell';
import { PublicLayout } from '../layout/PublicLayout';
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
      {
        path: 'inbox',
        element: (
          <PlaceholderPage
            title="Inbox"
            body="Everything that enters FLUX will land here after transfer and understanding."
          />
        ),
      },
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
      {
        path: 'devices',
        element: (
          <PlaceholderPage
            title="Devices"
            body="Pairing and device presence will be added with signaling and WebRTC."
          />
        ),
      },
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
