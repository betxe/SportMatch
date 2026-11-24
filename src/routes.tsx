import { Navigate, Route, Routes } from 'react-router-dom';
import { OnboardingPlayerCard } from './screens/OnboardingPlayerCard';
import { Home } from './screens/Home';
import { SessionDetail } from './screens/SessionDetail';
import { CreateSession } from './screens/CreateSession';
import { MyGames } from './screens/MyGames';
import { MyPlayerCard } from './screens/MyPlayerCard';
import { useApp } from './state/store';
import type { ReactNode } from 'react';

function RequireOnboarded({ children }: { children: ReactNode }) {
  const { state } = useApp();
  if (!state.profile.onboarded) return <Navigate to="/" replace />;
  return children;
}

function OnboardingGate() {
  const { state } = useApp();
  if (state.profile.onboarded) return <Navigate to="/home" replace />;
  return <OnboardingPlayerCard mode="create" />;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<OnboardingGate />} />
      <Route
        path="/home"
        element={
          <RequireOnboarded>
            <Home />
          </RequireOnboarded>
        }
      />
      <Route
        path="/session/:id"
        element={
          <RequireOnboarded>
            <SessionDetail />
          </RequireOnboarded>
        }
      />
      <Route
        path="/create"
        element={
          <RequireOnboarded>
            <CreateSession />
          </RequireOnboarded>
        }
      />
      <Route
        path="/games"
        element={
          <RequireOnboarded>
            <MyGames />
          </RequireOnboarded>
        }
      />
      <Route
        path="/card"
        element={
          <RequireOnboarded>
            <MyPlayerCard />
          </RequireOnboarded>
        }
      />
      <Route
        path="/card/edit"
        element={
          <RequireOnboarded>
            <OnboardingPlayerCard mode="edit" />
          </RequireOnboarded>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
