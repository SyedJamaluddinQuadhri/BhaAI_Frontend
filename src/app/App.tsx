import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useState } from "react";
import { AppShell } from "../components/layout/AppShell";
import { MobileNavigation } from "../components/layout/MobileNavigation";
import { AppRoutes } from "./routes";
import { Providers } from "./providers";
import { LoginPage } from "../features/auth/pages/LoginPage";
import { SignupPage } from "../features/auth/pages/SignupPage";
import { authService } from "../services/auth/auth.service";

function Protected() {
  const [session] = useState(() => authService.getSession());
  if (!session) return <Navigate to="/login" replace />;
  return (
    <>
      <AppShell>
        <AppRoutes />
      </AppShell>
      <MobileNavigation />
    </>
  );
}

export function App() {
  return (
    <Providers>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="*" element={<Protected />} />
        </Routes>
      </BrowserRouter>
    </Providers>
  );
}
