import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TransactionTable from '../components/TransactionTable';
import { getAllTransactions, getAnomalies } from '../api/anomalyApi';

export default function HistoryPage() {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTransactions = async (filterType) => {
    setLoading(true);
    setError(null);
    try {
      let data;
      if (filterType === 'anomalies') {
        data = await getAnomalies();
      } else {
        data = await getAllTransactions();
      }
      setTransactions(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Could not connect to server. Make sure the backend is running.');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(filter);
  }, [filter]);

  // Compute summary stats
  const totalVolume = transactions.reduce((acc, t) => acc + (Number(t.amount) || 0), 0);
  const anomalyCount = transactions.filter((t) => t.status === 'ANOMALY').length;
  const normalCount = transactions.filter((t) => t.status !== 'ANOMALY').length;

  const tabs = [
    { key: 'all', label: 'All transactions' },
    { key: 'anomalies', label: 'Anomalies only' },
  ];

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-xl font-bold text-[#f0f6fc]">Transaction history</h1>
        <p className="text-xs text-[#8b949e] mt-1">Audit log of all evaluated payment transactions</p>
      </motion.div>

      {/* Top Summary Stat Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4">
          <div className="text-2xl font-bold font-space text-[#f0f6fc]">
            ₹{totalVolume.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-[#8b949e] mt-1">Total volume</div>
        </div>

        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4">
          <div className="text-2xl font-bold font-space text-[#3fb950]">
            {normalCount}
          </div>
          <div className="text-xs text-[#8b949e] mt-1">Normal transactions</div>
        </div>

        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4">
          <div className="text-2xl font-bold font-space text-[#f85149]">
            {anomalyCount}
          </div>
          <div className="text-xs text-[#8b949e] mt-1">Anomalies detected</div>
        </div>
      </div>

      {/* Filter Tabs & Refresh */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 bg-[#161b22] p-1 rounded-lg border border-[#30363d]">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                filter === tab.key
                  ? 'bg-[#21262d] text-[#f0f6fc] border border-[#30363d]'
                  : 'text-[#8b949e] hover:text-[#c9d1d9]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => fetchTransactions(filter)}
          className="px-3 py-1.5 rounded-lg bg-[#161b22] border border-[#30363d] text-[#8b949e] hover:text-[#f0f6fc] text-xs font-medium flex items-center gap-1.5 transition-all"
        >
          <svg className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Error display */}
      {error && (
        <div className="p-3.5 rounded-lg bg-[#f85149]/10 border border-[#f85149]/30 text-xs text-[#f85149]">
          {error}
        </div>
      )}

      {/* Card List */}
      <TransactionTable transactions={transactions} loading={loading} />
    </div>
  );
}
