import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import authService from './services/authService';
import Login from './pages/Login';
import Register from "./pages/Register";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Labeling from "./pages/Labeling";
import Historique from "./pages/Historique";
import Profil from "./pages/Profil";

function ProtectedRoute() {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard"  element={<Dashboard />} />
            <Route path="/labeling"   element={<Labeling />} />
            <Route path="/historique" element={<Historique />} />
            <Route path="/profil"     element={<Profil />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}