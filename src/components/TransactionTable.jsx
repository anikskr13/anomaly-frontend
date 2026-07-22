import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const generateReason = (transaction) => {
  const list = [];
  const amount = Number(transaction.amount || 0);
  const hour = transaction.hour_of_day ?? transaction.hourOfDay ?? 12;
  const frequency = transaction.frequency ?? 1;
  const isForeign = transaction.is_foreign ?? transaction.isForeign;

  if (amount > 50000) list.push('High transaction amount exceeding normal user pattern');
  if (hour < 6 || hour > 22) list.push('Transaction initiated during unusual off-peak hours');
  if (frequency > 20) list.push('Unusually high volume of transactions today');
  if (isForeign === 1 || isForeign === true) list.push('Foreign / international transaction detected');
  return list.length > 0 ? list : ['Behavioral pattern flagged by Isolation Forest model'];
};

export default function TransactionTable({ transactions, loading }) {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-20 bg-[#161b22] border border-[#30363d] rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-12 text-center">
        <div className="w-12 h-12 rounded-full bg-[#21262d] border border-[#30363d] flex items-center justify-center text-[#8b949e] mx-auto mb-3 text-lg font-bold">
          ?
        </div>
        <h3 className="text-sm font-semibold text-[#f0f6fc] mb-1">No transactions found</h3>
        <p className="text-xs text-[#8b949e]">Processed payments will appear here in real-time.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((tx, index) => {
        const isAnomaly = tx.status === 'ANOMALY';
        const isExpanded = expandedId === (tx.id || index);
        const reasons = isAnomaly ? generateReason(tx) : [];

        return (
          <motion.div
            key={tx.id || index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            className={`bg-[#161b22] rounded-xl border transition-all overflow-hidden ${
              isAnomaly
                ? 'border-l-4 border-l-[#f85149] border-[#30363d]'
                : 'border-l-4 border-l-[#3fb950] border-[#30363d]'
            }`}
          >
            {/* Card Header Row */}
            <div
              onClick={() => toggleExpand(tx.id || index)}
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-[#21262d]/50 transition-colors select-none"
            >
              {/* Left Side: Avatar + Amount */}
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-[#21262d] border border-[#30363d] flex items-center justify-center font-bold text-sm text-[#58a6ff] font-space">
                  ₹
                </div>
                <div>
                  <div className="text-base font-bold font-space text-[#f0f6fc]">
                    ₹{Number(tx.amount || 0).toLocaleString('en-IN')}
                  </div>
                  <div className="text-xs text-[#8b949e] flex items-center gap-2 mt-0.5">
                    <span>Hour: {tx.hour_of_day ?? tx.hourOfDay ?? '—'}</span>
                    <span>•</span>
                    <span>Freq: {tx.frequency ?? '—'}</span>
                    <span>•</span>
                    <span>{(tx.is_foreign ?? tx.isForeign) ? 'Foreign' : 'Domestic'}</span>
                  </div>
                </div>
              </div>

              {/* Right Side: Status Badge + Date + Toggle Arrow */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span
                    className={`inline-flex px-2.5 py-0.5 rounded text-xs font-semibold ${
                      isAnomaly
                        ? 'bg-[#f85149]/15 text-[#f85149] border border-[#f85149]/30'
                        : 'bg-[#238636]/15 text-[#3fb950] border border-[#238636]/30'
                    }`}
                  >
                    {isAnomaly ? 'ANOMALY' : 'NORMAL'}
                  </span>
                  <div className="text-[11px] text-[#8b949e] mt-1">{formatDate(tx.analyzedAt)}</div>
                </div>

                <div className="w-7 h-7 rounded-md bg-[#21262d] border border-[#30363d] flex items-center justify-center text-[#8b949e]">
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Accordion Inline Details */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="border-t border-[#30363d] bg-[#0d1117] p-4 space-y-4 text-xs"
                >
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-[#161b22] p-3 rounded-lg border border-[#30363d]">
                      <span className="text-[#8b949e]">Transaction ID</span>
                      <div className="font-space font-semibold text-[#f0f6fc] mt-1">#{tx.id || '—'}</div>
                    </div>
                    <div className="bg-[#161b22] p-3 rounded-lg border border-[#30363d]">
                      <span className="text-[#8b949e]">Time of day</span>
                      <div className="font-space font-semibold text-[#f0f6fc] mt-1">{tx.hour_of_day ?? tx.hourOfDay ?? '—'}:00</div>
                    </div>
                    <div className="bg-[#161b22] p-3 rounded-lg border border-[#30363d]">
                      <span className="text-[#8b949e]">Frequency count</span>
                      <div className="font-space font-semibold text-[#f0f6fc] mt-1">{tx.frequency ?? 1} today</div>
                    </div>
                    <div className="bg-[#161b22] p-3 rounded-lg border border-[#30363d]">
                      <span className="text-[#8b949e]">Location classification</span>
                      <div className="font-space font-semibold text-[#f0f6fc] mt-1">
                        {(tx.is_foreign ?? tx.isForeign) ? 'International' : 'Domestic'}
                      </div>
                    </div>
                  </div>

                  {/* ML Risk Analysis Box */}
                  <div className="bg-[#161b22] p-4 rounded-lg border border-[#30363d] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[#8b949e] font-medium">ML Risk Score & Analysis</span>
                      <span
                        className={`font-semibold ${
                          isAnomaly ? 'text-[#f85149]' : 'text-[#3fb950]'
                        }`}
                      >
                        {isAnomaly ? 'High Risk' : 'Low Risk'}
                      </span>
                    </div>

                    {/* Risk Bar */}
                    <div className="w-full h-2 bg-[#21262d] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isAnomaly ? 'bg-[#f85149] w-[90%]' : 'bg-[#3fb950] w-[15%]'
                        }`}
                      />
                    </div>

                    {isAnomaly && reasons.length > 0 && (
                      <div className="pt-2 border-t border-[#30363d] space-y-1.5">
                        <span className="text-[#f85149] font-medium">Why flagged:</span>
                        <ul className="space-y-1 pl-1">
                          {reasons.map((r, i) => (
                            <li key={i} className="text-[#c9d1d9] flex items-start gap-2">
                              <span className="text-[#f85149]">•</span>
                              <span>{r}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
