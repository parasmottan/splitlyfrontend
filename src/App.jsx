import React, { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './stores/authStore';
import { SplitlyLogoHorizontal } from './components/SplitlyLogo';
import {
  AppSkeleton,
  DashboardSkeleton,
  GroupDetailSkeleton,
  SettingsSkeleton,
  TextSkeleton,
  AuthSkeleton,
  GroupListSkeleton,
  ActivitySkeleton,
  ActionSkeleton
} from './components/Skeletons';

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
const AccountSettings = lazy(() => import('./pages/AccountSettings'));
const PaymentMethods = lazy(() => import('./pages/PaymentMethods'));
const NotificationSettings = lazy(() => import('./pages/NotificationSettings'));
const HelpSupport = lazy(() => import('./pages/HelpSupport'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsConditions = lazy(() => import('./pages/TermsConditions'));

function LazyRoute({ children, fallback: Fallback = AppSkeleton }) {
  return (
    <Suspense fallback={<Fallback />}>
      {children}
    </Suspense>
  );
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuthStore();
  if (loading) return <AppSkeleton />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuthStore();
  if (loading) return <AppSkeleton />;
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
        <SplitlyLogoHorizontal height={32} />
        <p style={{ marginTop: 8 }}>Please open on a mobile device.</p>
      </div>

      {/* App container */}
      <div className="app-container">
        <Routes>
          {/* Public */}
          <Route path="/" element={<PublicRoute><LazyRoute fallback={AppSkeleton}><Landing /></LazyRoute></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><LazyRoute fallback={AuthSkeleton}><Login /></LazyRoute></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><LazyRoute fallback={AuthSkeleton}><Register /></LazyRoute></PublicRoute>} />
          <Route path="/verify-otp" element={<PublicRoute><LazyRoute fallback={AuthSkeleton}><VerifyOtp /></LazyRoute></PublicRoute>} />
          <Route path="/join/:token" element={<LazyRoute fallback={AuthSkeleton}><JoinInvite /></LazyRoute>} />

          {/* Protected */}
          <Route path="/home" element={<ProtectedRoute><LazyRoute fallback={DashboardSkeleton}><Home /></LazyRoute></ProtectedRoute>} />
          <Route path="/get-started" element={<ProtectedRoute><LazyRoute fallback={AuthSkeleton}><GetStarted /></LazyRoute></ProtectedRoute>} />
          <Route path="/create-group" element={<ProtectedRoute><LazyRoute fallback={AuthSkeleton}><CreateGroup /></LazyRoute></ProtectedRoute>} />
          <Route path="/join-group" element={<ProtectedRoute><LazyRoute fallback={AuthSkeleton}><JoinGroup /></LazyRoute></ProtectedRoute>} />
          <Route path="/groups" element={<ProtectedRoute><LazyRoute fallback={GroupListSkeleton}><Groups /></LazyRoute></ProtectedRoute>} />
          <Route path="/groups/:id" element={<ProtectedRoute><LazyRoute fallback={GroupDetailSkeleton}><GroupDashboard /></LazyRoute></ProtectedRoute>} />
          <Route path="/groups/:id/settings" element={<ProtectedRoute><LazyRoute fallback={SettingsSkeleton}><GroupSettings /></LazyRoute></ProtectedRoute>} />
          <Route path="/groups/:id/add-expense" element={<ProtectedRoute><LazyRoute fallback={ActionSkeleton}><AddExpense /></LazyRoute></ProtectedRoute>} />
          <Route path="/groups/:id/settle" element={<ProtectedRoute><LazyRoute fallback={ActionSkeleton}><Settlement /></LazyRoute></ProtectedRoute>} />
          <Route path="/groups/:id/settled" element={<ProtectedRoute><LazyRoute fallback={ActionSkeleton}><SettlementSuccess /></LazyRoute></ProtectedRoute>} />
          <Route path="/activity" element={<ProtectedRoute><LazyRoute fallback={ActivitySkeleton}><Activity /></LazyRoute></ProtectedRoute>} />
          <Route path="/insights" element={<ProtectedRoute><LazyRoute fallback={ActivitySkeleton}><Insights /></LazyRoute></ProtectedRoute>} />
          <Route path="/account" element={<ProtectedRoute><LazyRoute fallback={SettingsSkeleton}><Account /></LazyRoute></ProtectedRoute>} />
          <Route path="/story/compose" element={<ProtectedRoute><LazyRoute fallback={AppSkeleton}><StoryCompose /></LazyRoute></ProtectedRoute>} />
          <Route path="/story/:userId" element={<ProtectedRoute><LazyRoute fallback={AppSkeleton}><StoryViewer /></LazyRoute></ProtectedRoute>} />
          <Route path="/account/settings" element={<ProtectedRoute><LazyRoute fallback={SettingsSkeleton}><AccountSettings /></LazyRoute></ProtectedRoute>} />
          <Route path="/account/payment-methods" element={<ProtectedRoute><LazyRoute fallback={SettingsSkeleton}><PaymentMethods /></LazyRoute></ProtectedRoute>} />
          <Route path="/account/notifications" element={<ProtectedRoute><LazyRoute fallback={SettingsSkeleton}><NotificationSettings /></LazyRoute></ProtectedRoute>} />
          <Route path="/account/help" element={<ProtectedRoute><LazyRoute fallback={SettingsSkeleton}><HelpSupport /></LazyRoute></ProtectedRoute>} />
          <Route path="/privacy" element={<LazyRoute fallback={TextSkeleton}><PrivacyPolicy /></LazyRoute>} />
          <Route path="/terms" element={<LazyRoute fallback={TextSkeleton}><TermsConditions /></LazyRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
}

