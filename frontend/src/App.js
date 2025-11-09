import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, ProtectedRoute, PublicRoute } from "./context/AuthContext";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import Header from "./components/Header";
import AlanubeMonitor from "./components/AlanubeMonitor";
import NotFound from "./components/NotFound";
import LandingPage from "./components/LandingPage";
import PricingPage from "./components/PricingPage";
import TutorialPage from "./components/TutorialPage";
import TestRoutes from "./components/TestRoutes";
import './App.css';
import './custom.css';
import Clients from "./components/Clients";
import Invoices from "./components/Invoices";
import Profile from "./components/Profile";

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Router>
          <Routes>
            {/* Páginas Públicas (sin Header) */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/tutorial" element={<TutorialPage />} />
            <Route path="/test" element={<TestRoutes />} />
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            <Route path="/register" element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } />
            
            {/* Páginas Privadas (con Header) */}
            <Route path="/app/*" element={
              <ProtectedRoute>
                <Header />
                <main className="App-main">
                  <Routes>
                    <Route path="/" element={<Navigate to="/app/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/clients" element={<Clients />} />
                    <Route path="/invoices" element={<Invoices />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/monitor" element={<AlanubeMonitor />} />
                  </Routes>
                </main>
              </ProtectedRoute>
            } />
            
            {/* Redireccionamiento de rutas legacy */}
            <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
            <Route path="/clients" element={<Navigate to="/app/clients" replace />} />
            <Route path="/invoices" element={<Navigate to="/app/invoices" replace />} />
            <Route path="/profile" element={<Navigate to="/app/profile" replace />} />
            <Route path="/monitor" element={<Navigate to="/app/monitor" replace />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;
