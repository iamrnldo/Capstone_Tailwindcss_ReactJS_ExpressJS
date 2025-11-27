import { Routes, Route } from "react-router-dom";
import Header from "@/layouts/header";
import Footer from "@/layouts/footer";
import PortalPage from "@/pages/portal";
import LoginPage from "@/pages/login";
import RegisterPage from "@/pages/register";
import Dashboard from "@/pages/dashboard"; // Add this import
import ProtectedRoute from "@/components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <Header />
            <PortalPage />
            <Footer />
          </>
        }
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Header />
            <Dashboard /> {/* Changed from PortalPage to Dashboard */}
            <Footer />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
