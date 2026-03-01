import React, { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './stores/authStore';

const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const GetStarted = lazy(() => import('./pages/GetStarted'));
const CreateGroup = lazy(() => import('./pages/CreateGroup'));
const JoinGroup = lazy(() => import('./pages/JoinGroup'));
const Home = lazy(() => import('./pages/Home'));
const Groups = lazy(() => import('./pages/Groups'));
const GroupDashboard = lazy(() => import('./pages/GroupDashboard'));
const GroupSettings = lazy(() => import('./pages/GroupSettings'));
const AddExpense = lazy(() => import('./pages/AddExpense'));
const Settlement = lazy(() => import('./pages/Settlement'));
const SettlementSuccess = lazy(() => import('./pages/SettlementSuccess'));
const Activity = lazy(() => import('./pages/Activity'));
const Insights = lazy(() => import('./pages/Insights'));
const Account = lazy(() => import('./pages/Account'));
const VerifyOtp = lazy(() => import('./pages/VerifyOtp'));
const JoinInvite = lazy(() => import('./pages/JoinInvite'));
const StoryCompose = lazy(() => import('./pages/StoryCompose'));
const StoryViewer = lazy(() => import('./pages/StoryViewer'));

function ProtectedRoute({ children }) {
  const { user, loading } = useAuthStore();
  if (loading) return <div className="loading-center"><div className="spinner"></div></div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuthStore();
  if (loading) return <div className="loading-center"><div className="spinner"></div></div>;
  if (user) return <Navigate to="/home" replace />;
  return children;
}

export default function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <>
      {/* Desktop warning */}
      <div className="desktop-warning">
        <div className="desktop-warning-icon">📱</div>
        <h2>Please open Splitly on a mobile device.</h2>
        <p>This application is designed for mobile screens only.</p>
      </div>

      {/* App container */}
      <div className="app-container">
        <Suspense fallback={<div className="loading-center"><div className="spinner"></div></div>}>
          <Routes>
            {/* Public */}
            <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            <Route path="/verify-otp" element={<PublicRoute><VerifyOtp /></PublicRoute>} />
            <Route path="/join/:token" element={<JoinInvite />} />

            {/* Protected */}
            <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/get-started" element={<ProtectedRoute><GetStarted /></ProtectedRoute>} />
            <Route path="/create-group" element={<ProtectedRoute><CreateGroup /></ProtectedRoute>} />
            <Route path="/join-group" element={<ProtectedRoute><JoinGroup /></ProtectedRoute>} />
            <Route path="/groups" element={<ProtectedRoute><Groups /></ProtectedRoute>} />
            <Route path="/groups/:id" element={<ProtectedRoute><GroupDashboard /></ProtectedRoute>} />
            <Route path="/groups/:id/settings" element={<ProtectedRoute><GroupSettings /></ProtectedRoute>} />
            <Route path="/groups/:id/add-expense" element={<ProtectedRoute><AddExpense /></ProtectedRoute>} />
            <Route path="/groups/:id/settle" element={<ProtectedRoute><Settlement /></ProtectedRoute>} />
            <Route path="/groups/:id/settled" element={<ProtectedRoute><SettlementSuccess /></ProtectedRoute>} />
            <Route path="/activity" element={<ProtectedRoute><Activity /></ProtectedRoute>} />
            <Route path="/insights" element={<ProtectedRoute><Insights /></ProtectedRoute>} />
            <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
            <Route path="/story/compose" element={<ProtectedRoute><StoryCompose /></ProtectedRoute>} />
            <Route path="/story/:userId" element={<ProtectedRoute><StoryViewer /></ProtectedRoute>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </div>
    </>
  );
}

