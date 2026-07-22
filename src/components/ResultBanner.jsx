import { motion, AnimatePresence } from 'framer-motion';

export default function ResultBanner({ result, onClose }) {
  if (!result) return null;

  const isAnomaly = result.status === 'ANOMALY';
  const analyzedAt = result.analyzedAt
    ? new Date(result.analyzedAt).toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
    : new Date().toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });

  const reasons = isAnomaly
    ? (() => {
        const list = [];
        const amt = Number(result.amount || 0);
        const hr = result.hour_of_day ?? result.hourOfDay ?? 12;
        const freq = result.frequency ?? 1;
        const isForeign = result.is_foreign ?? result.isForeign;

        if (amt > 50000) list.push('High transaction amount exceeding normal thresholds');
        if (hr < 6 || hr > 22) list.push('Unusual time of transaction');
        if (freq > 20) list.push('High frequency of transactions today');
        if (isForeign === 1 || isForeign === true) list.push('International / foreign location detected');
        return list.length > 0 ? list : ['Behavior pattern flagged by isolation forest model'];
      })()
    : [];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm">
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className={`w-full max-w-lg rounded-t-2xl sm:rounded-2xl border overflow-hidden shadow-2xl p-6 ${
            isAnomaly
              ? 'bg-[#161b22] border-[#f85149]/40 text-[#f0f6fc]'
              : 'bg-[#161b22] border-[#238636]/40 text-[#f0f6fc]'
          }`}
        >
          {/* Header Icon */}
          <div className="flex items-center justify-between pb-4 border-b border-[#30363d]">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  isAnomaly ? 'bg-[#f85149]/15 border border-[#f85149]/30 text-[#f85149]' : 'bg-[#238636]/15 border border-[#238636]/30 text-[#3fb950]'
                }`}
              >
                {isAnomaly ? (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                ) : (
                  <motion.svg
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 400, delay: 0.1 }}
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </motion.svg>
                )}
              </div>
              <div>
                <h3 className="text-base font-bold">
                  {isAnomaly ? 'Suspicious transaction flagged' : 'Transaction approved'}
                </h3>
                <p className="text-xs text-[#8b949e]">
                  {isAnomaly
                    ? 'Our ML risk engine detected abnormal parameters.'
                    : 'Payment was processed successfully with low risk score.'}
                </p>
              </div>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="text-[#8b949e] hover:text-[#c9d1d9] p-1 rounded-md hover:bg-[#21262d]"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Amount Display */}
          <div className="py-5 text-center bg-[#0d1117] rounded-xl my-4 border border-[#30363d]">
            <div className="text-xs text-[#8b949e] mb-1">Transaction amount</div>
            <div className="text-3xl font-bold font-space text-[#f0f6fc]">
              ₹{Number(result.amount || 0).toLocaleString('en-IN')}
            </div>
            {result.merchant && (
              <div className="text-xs text-[#c9d1d9] mt-1 font-medium">To: {result.merchant}</div>
            )}
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs mb-4">
            <div className="bg-[#0d1117] p-3 rounded-lg border border-[#30363d]">
              <span className="text-[#8b949e]">Status</span>
              <div className="mt-1">
                <span
                  className={`inline-flex px-2 py-0.5 rounded text-xs font-semibold ${
                    isAnomaly
                      ? 'bg-[#f85149]/15 text-[#f85149] border border-[#f85149]/30'
                      : 'bg-[#238636]/15 text-[#3fb950] border border-[#238636]/30'
                  }`}
                >
                  {isAnomaly ? 'ANOMALY' : 'NORMAL'}
                </span>
              </div>
            </div>
            <div className="bg-[#0d1117] p-3 rounded-lg border border-[#30363d]">
              <span className="text-[#8b949e]">Time</span>
              <div className="mt-1 font-medium text-[#c9d1d9] truncate">{analyzedAt}</div>
            </div>
          </div>

          {/* Risk Reasons if Anomaly */}
          {isAnomaly && reasons.length > 0 && (
            <div className="bg-[#f85149]/10 border border-[#f85149]/20 rounded-xl p-3.5 space-y-2">
              <div className="text-xs font-medium text-[#f85149] flex items-center gap-1.5">
                <span>⚠️ Risk factors identified:</span>
              </div>
              <ul className="space-y-1.5 text-xs text-[#f0f6fc]">
                {reasons.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-[#c9d1d9]">
                    <span className="text-[#f85149]">•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Dismiss CTA for Normal transaction */}
          {!isAnomaly && (
            <button
              onClick={onClose}
              className="w-full mt-4 py-2.5 rounded-lg text-sm font-medium transition-all bg-[#1f6feb] text-white hover:bg-[#388bfd]"
            >
              Done
            </button>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
