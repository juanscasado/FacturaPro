import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import Header from "./components/Header";
import AlanubeMonitor from "./components/AlanubeMonitor";
import NotFound from "./components/NotFound";
import './App.css';
import './custom.css';
import Clients from "./components/Clients";
import Invoices from "./components/Invoices";
import Profile from "./components/Profile";

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <main className="App-main">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/monitor" element={<AlanubeMonitor />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App;
