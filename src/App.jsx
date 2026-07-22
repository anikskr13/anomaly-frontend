import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import PaymentPage from './pages/PaymentPage';
import HistoryPage from './pages/HistoryPage';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-navy">
        <Navbar />
        <Routes>
          <Route path="/" element={<PaymentPage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Routes>
      </div>
    </Router>
  );
}
