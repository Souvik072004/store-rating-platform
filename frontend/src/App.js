import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import PageNotFound from "./pages/PageNotFound";

const titles = {
  "/": "Login | Store Rating Platform",
  "/signup": "Sign up | Store Rating Platform",
  "/dashboard": "Dashboard | Store Rating Platform",
  "/admin": "Add Store | Store Rating Platform",
};

function DocumentTitle() {
  const { pathname } = useLocation();
  useEffect(() => {
    document.title = titles[pathname] || "Store Rating Platform";
  }, [pathname]);
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <DocumentTitle />
          <Navbar />
          <main className="app-main">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminPanel />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </main>
          <Footer />
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
