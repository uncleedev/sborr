import { AppRouter } from "./routes/app-router";
import { Routes, Route, Navigate } from "react-router-dom";

import SigninPage from "./pages/auth/Signin";
import DocumentPage from "./pages/protected/documents/Document";
import Layout from "./pages/protected/layout";
import ProtectedRoute from "./routes/protected-route";
import PublicRoute from "./routes/public-route";
import SessionPage from "./pages/protected/sessions/Session";
import UserPage from "./pages/protected/users/User";
import DashboardPage from "./pages/protected/dashboard/Dashboard";
import ProfilePage from "./pages/protected/profile/Profile";
import SettingPage from "./pages/protected/settings/Setting";
import InitialRoute from "./routes/initial-route";
import ResetPasswordPage from "./pages/auth/ResetPassword";
import ForgotPasswordPage from "./pages/auth/ForgotPassword";
import LayoutAuth from "./pages/auth/LayoutAuth";
import NotFoundAuth from "./pages/auth/NotFound";
import NotFoundPage from "./pages/home/NotFound";
import LegislativePage from "./pages/home/Legislative";
import LayoutHome from "./pages/home/layout";

export default function App() {
  return (
    <AppRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route element={<LayoutHome />}>
            <Route index element={<InitialRoute />} />
            <Route path="/legislatives" element={<LegislativePage />} />
          </Route>

          <Route path="auth" element={<LayoutAuth />}>
            <Route path="/auth/signin" element={<SigninPage />} />
            <Route
              path="/auth/reset-password"
              element={<ResetPasswordPage />}
            />
            <Route
              path="/auth/forgot-password"
              element={<ForgotPasswordPage />}
            />

            <Route path="*" element={<NotFoundAuth />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="protected" element={<Layout />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="documents" element={<DocumentPage />} />
            <Route path="sessions" element={<SessionPage />} />
            <Route path="users" element={<UserPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="settings" element={<SettingPage />} />
          </Route>
          <Route path="*" element={<Navigate to={"/protected/dashboard"} />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AppRouter>
  );
}
