import { Routes, Route } from "react-router-dom";
import Header from "@/layouts/header";
import Footer from "@/layouts/footer";
import PortalPage from "@/pages/portal/index";
import LoginPage from "@/pages/login/index";
import RegisterPage from "@/pages/register/index";

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
    </Routes>
  );
}
