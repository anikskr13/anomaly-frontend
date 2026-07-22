import { motion, AnimatePresence } from 'framer-motion';

const generateReason = (transaction) => {
  const list = [];
  const amount = Number(transaction.amount || 0);
  const hour = transaction.hour_of_day ?? transaction.hourOfDay ?? 12;
  const frequency = transaction.frequency ?? 1;
  const isForeign = transaction.is_foreign ?? transaction.isForeign;

  if (amount > 50000) list.push('High transaction amount exceeding normal thresholds');
  if (hour < 6 || hour > 22) list.push('Unusual time of transaction');
  if (frequency > 20) list.push('High frequency of transactions today');
  if (isForeign === 1 || isForeign === true) list.push('Foreign location detected');
  return list.length > 0 ? list : ['Pattern flagged by ML model'];
};

export default function TransactionDetailPanel({ transaction, onClose }) {
  if (!transaction) return null;

  const isAnomaly = transaction.status === 'ANOMALY';
  const reasons = isAnomaly ? generateReason(transaction) : [];

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <AnimatePresence>
      {transaction && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-96 bg-[#161b22] border-l border-[#30363d] shadow-2xl p-6 overflow-y-auto text-xs text-[#c9d1d9]"
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#30363d] mb-4">
              <h2 className="text-sm font-bold text-[#f0f6fc]">Transaction details</h2>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-md bg-[#21262d] border border-[#30363d] flex items-center justify-center text-[#8b949e] hover:text-[#f0f6fc]"
              >
                ✕
              </button>
            </div>

            <div className="mb-4">
              <div className="text-[#8b949e]">Transaction ID</div>
              <div className="text-xl font-bold font-space text-[#f0f6fc] mt-0.5">#{transaction.id || '—'}</div>
            </div>

            <div className="mb-5">
              <span
                className={`inline-flex px-2.5 py-1 rounded text-xs font-semibold ${
                  isAnomaly ? 'bg-[#f85149]/15 text-[#f85149] border border-[#f85149]/30' : 'bg-[#238636]/15 text-[#3fb950] border border-[#238636]/30'
                }`}
              >
                {isAnomaly ? 'ANOMALY DETECTED' : 'NORMAL TRANSACTION'}
              </span>
            </div>

            <div className="space-y-4">
              <div className="bg-[#0d1117] rounded-lg border border-[#30363d] divide-y divide-[#30363d]">
                <div className="p-3 flex justify-between">
                  <span className="text-[#8b949e]">Amount</span>
                  <span className="font-space font-bold text-[#f0f6fc]">₹{Number(transaction.amount || 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="p-3 flex justify-between">
                  <span className="text-[#8b949e]">Hour of day</span>
                  <span>{transaction.hour_of_day ?? transaction.hourOfDay ?? '—'}:00</span>
                </div>
                <div className="p-3 flex justify-between">
                  <span className="text-[#8b949e]">Frequency count</span>
                  <span>{transaction.frequency ?? '—'}</span>
                </div>
                <div className="p-3 flex justify-between">
                  <span className="text-[#8b949e]">Foreign transaction</span>
                  <span>{(transaction.is_foreign ?? transaction.isForeign) ? 'Yes' : 'No'}</span>
                </div>
                <div className="p-3 flex justify-between">
                  <span className="text-[#8b949e]">Analyzed at</span>
                  <span>{formatDate(transaction.analyzedAt)}</span>
                </div>
              </div>

              {isAnomaly && reasons.length > 0 && (
                <div className="bg-[#f85149]/10 border border-[#f85149]/30 p-3.5 rounded-lg space-y-2">
                  <span className="text-[#f85149] font-medium">Why flagged:</span>
                  <ul className="space-y-1">
                    {reasons.map((r, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-[#c9d1d9]">
                        <span className="text-[#f85149]">•</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
