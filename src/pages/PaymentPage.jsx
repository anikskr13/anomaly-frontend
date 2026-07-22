import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PaymentCard from '../components/PaymentCard';
import ResultBanner from '../components/ResultBanner';
import { analyzeTransaction, getAllTransactions } from '../api/anomalyApi';

export default function PaymentPage() {
  const [form, setForm] = useState({
    merchant: '',
    amount: '',
    hour_of_day: 12,
    frequency: 1,
    is_foreign: 0,
    category: 'Shopping',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayType, setOverlayType] = useState('normal');
  const [error, setError] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);

  // Fetch recent transactions for sidebar
  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const data = await getAllTransactions();
        if (Array.isArray(data)) {
          setRecentTransactions(data.slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to load recent sidebar transactions:', err);
      }
    };
    fetchRecent();
  }, [result]);

  const handleSubmit = async () => {
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const payload = {
        amount: Number(form.amount),
        hour_of_day: Number(form.hour_of_day),
        frequency: Number(form.frequency),
        is_foreign: form.is_foreign,
      };

      const response = await analyzeTransaction(payload);
      const txResult = response.results ? response.results[0] : (Array.isArray(response) ? response[0] : response);

      const isAnomaly = txResult.status === 'ANOMALY';
      setOverlayType(isAnomaly ? 'anomaly' : 'normal');

      setShowOverlay(true);

      setTimeout(() => {
        setShowOverlay(false);
        setResult({ ...txResult, amount: form.amount, merchant: form.merchant });
        setLoading(false);
      }, 1200);
    } catch (err) {
      setLoading(false);
      setError('Could not connect to server. Make sure the backend is running.');
      console.error('API Error:', err);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recent';
    const d = new Date(dateStr);
    return d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar (40% / 5 cols) */}
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-5 space-y-6"
        >
          {/* Header & Status Card */}
          <div className="bg-[#161b22] rounded-xl border border-[#30363d] p-5 space-y-4">
            <div>
              <h1 className="text-xl font-bold text-[#f0f6fc]">
                Transaction Security Portal
              </h1>
              <p className="text-xs text-[#8b949e] mt-1">
                Real-time isolation forest anomaly detection for instant payments.
              </p>
            </div>

            {/* Live Model Status */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#0d1117] border border-[#30363d]">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3fb950] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#3fb950]"></span>
                </span>
                <span className="text-xs font-medium text-[#c9d1d9]">ML model active</span>
              </div>
              <span className="text-[11px] font-space text-[#58a6ff] bg-[#1f6feb]/10 px-2 py-0.5 rounded border border-[#1f6feb]/20">
                v1.4 IsolationForest
              </span>
            </div>
          </div>

          {/* Recent Mini-cards */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-normal text-[#8b949e]">Recent transactions</span>
              <span className="text-xs text-[#58a6ff]">Live feed</span>
            </div>

            {recentTransactions.length === 0 ? (
              <div className="bg-[#161b22] rounded-xl border border-[#30363d] p-4 text-center text-xs text-[#8b949e]">
                No recent transactions processed yet.
              </div>
            ) : (
              recentTransactions.map((tx, idx) => {
                const isAnomaly = tx.status === 'ANOMALY';
                return (
                  <div
                    key={tx.id || idx}
                    className={`bg-[#161b22] rounded-xl border p-3.5 flex items-center justify-between transition-all ${
                      isAnomaly ? 'border-l-4 border-l-[#f85149] border-[#30363d]' : 'border-l-4 border-l-[#3fb950] border-[#30363d]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#21262d] border border-[#30363d] flex items-center justify-center font-bold text-xs text-[#58a6ff] font-space">
                        ₹
                      </div>
                      <div>
                        <div className="text-xs font-bold font-space text-[#f0f6fc]">
                          ₹{Number(tx.amount || 0).toLocaleString('en-IN')}
                        </div>
                        <div className="text-[11px] text-[#8b949e]">
                          Freq: {tx.frequency} • Hour: {tx.hour_of_day ?? tx.hourOfDay ?? '—'}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded ${
                          isAnomaly ? 'bg-[#f85149]/15 text-[#f85149]' : 'bg-[#238636]/15 text-[#3fb950]'
                        }`}
                      >
                        {isAnomaly ? 'ANOMALY' : 'NORMAL'}
                      </span>
                      <div className="text-[10px] text-[#8b949e] mt-0.5">{formatDate(tx.analyzedAt)}</div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>

        {/* Right Payment Form (60% / 7 cols) */}
        <motion.div
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-7"
        >
          <PaymentCard
            form={form}
            setForm={setForm}
            onSubmit={handleSubmit}
            loading={loading}
          />

          {/* Error message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 p-3.5 rounded-lg bg-[#f85149]/10 border border-[#f85149]/30 text-xs text-[#f85149] flex items-center justify-between"
              >
                <span>{error}</span>
                <button onClick={() => setError(null)} className="text-[#f85149]/70 hover:text-[#f85149]">
                  ✕
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Result Bottom Sheet Modal */}
      <ResultBanner result={result} onClose={() => setResult(null)} />

      {/* Processing Animation Overlay */}
      <AnimatePresence>
        {showOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          >
            {overlayType === 'normal' ? (
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0.6 }}
                  animate={{ scale: [0.8, 1.1, 1] }}
                  transition={{ duration: 0.4 }}
                  className="w-20 h-20 mx-auto rounded-full bg-[#238636]/20 border border-[#3fb950] flex items-center justify-center text-[#3fb950] mb-3"
                >
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </motion.div>
                <div className="text-sm font-semibold text-[#f0f6fc]">Analyzing transaction pattern...</div>
                <div className="text-xs text-[#3fb950] mt-1 font-medium">Low risk pattern detected</div>
              </div>
            ) : (
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0.6 }}
                  animate={{ scale: [0.8, 1.15, 1] }}
                  transition={{ duration: 0.4 }}
                  className="w-20 h-20 mx-auto rounded-full bg-[#f85149]/20 border border-[#f85149] flex items-center justify-center text-[#f85149] mb-3"
                >
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                </motion.div>
                <div className="text-sm font-semibold text-[#f0f6fc]">Analyzing transaction pattern...</div>
                <div className="text-xs text-[#f85149] mt-1 font-medium">Anomaly detected</div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
