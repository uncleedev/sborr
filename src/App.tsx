import { AppRouter } from "./routes/app-router";
import { Routes, Route } from "react-router-dom";

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

export default function App() {
  return (
    <AppRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route index element={<SigninPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="documents" element={<DocumentPage />} />
            <Route path="sessions" element={<SessionPage />} />
            <Route path="users" element={<UserPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="settings" element={<SettingPage />} />
          </Route>
        </Route>
      </Routes>
    </AppRouter>
  );
}
