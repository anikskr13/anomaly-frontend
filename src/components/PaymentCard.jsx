import { motion } from 'framer-motion';
import SampleButtons from './SampleButtons';

const categories = ['Shopping', 'Food & Dining', 'Travel', 'Entertainment', 'Utilities'];

export default function PaymentCard({ form, setForm, onSubmit, loading, loadingText }) {
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSampleSelect = (sample) => {
    setForm({
      merchant: sample.merchant,
      amount: sample.amount,
      hour_of_day: sample.hour_of_day,
      frequency: sample.frequency,
      is_foreign: sample.is_foreign,
      category: sample.category,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  const getHourLabel = (hour) => {
    if (hour === 0) return '12:00 AM';
    if (hour === 12) return '12:00 PM';
    if (hour < 12) return `${hour}:00 AM`;
    return `${hour - 12}:00 PM`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full bg-[#161b22] rounded-xl border border-[#30363d] p-6 shadow-sm"
    >
      {/* From Account Header */}
      <div className="flex items-center justify-between pb-5 border-b border-[#30363d] mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#21262d] border border-[#30363d] flex items-center justify-center font-bold text-white text-sm">
            AK
          </div>
          <div>
            <div className="text-sm font-semibold text-[#f0f6fc]">Savings Account •••• 4821</div>
            <div className="text-xs text-[#8b949e]">Available balance: <span className="font-space text-[#c9d1d9] font-medium">₹2,45,000</span></div>
          </div>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-md bg-[#238636]/15 text-[#3fb950] border border-[#238636]/30 font-medium">
          Verified
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Large Centered Amount Input */}
        <div className="text-center py-2">
          <label className="block text-xs font-normal text-[#8b949e] mb-2">Enter payment amount</label>
          <div className="inline-flex items-center justify-center gap-1.5">
            <span className="text-3xl font-bold text-[#8b949e] font-space">₹</span>
            <input
              type="number"
              value={form.amount || ''}
              onChange={(e) => handleChange('amount', e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="0"
              min="0"
              required
              className="w-48 text-center text-4xl font-bold font-space text-[#f0f6fc] bg-transparent border-b-2 border-[#30363d] focus:border-[#1f6feb] focus:outline-none transition-colors py-1 placeholder-[#484f58]"
            />
          </div>
        </div>

        {/* Merchant & Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-xs font-normal text-[#8b949e]">Merchant name</label>
            <input
              type="text"
              value={form.merchant}
              onChange={(e) => handleChange('merchant', e.target.value)}
              placeholder="e.g. Swiggy, Amazon"
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#0d1117] border border-[#30363d] text-[#f0f6fc] text-sm focus:border-[#1f6feb] focus:outline-none transition-colors placeholder-[#484f58]"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-normal text-[#8b949e]">Category</label>
            <select
              value={form.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#0d1117] border border-[#30363d] text-[#f0f6fc] text-sm focus:border-[#1f6feb] focus:outline-none transition-colors cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-[#161b22]">
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Time of Transaction */}
        <div className="space-y-2 bg-[#0d1117] p-3.5 rounded-lg border border-[#30363d]">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#8b949e]">Time of transaction</span>
            <span className="font-space text-[#58a6ff] font-medium bg-[#1f6feb]/15 px-2 py-0.5 rounded border border-[#1f6feb]/30">
              {getHourLabel(form.hour_of_day)}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="23"
            value={form.hour_of_day}
            onChange={(e) => handleChange('hour_of_day', Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-[11px] text-[#484f58]">
            <span>12 AM</span>
            <span>6 AM</span>
            <span>12 PM</span>
            <span>6 PM</span>
            <span>11 PM</span>
          </div>
        </div>

        {/* Frequency & Foreign Toggle */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-xs font-normal text-[#8b949e]">Transactions today</label>
            <input
              type="number"
              value={form.frequency}
              onChange={(e) => handleChange('frequency', Number(e.target.value))}
              placeholder="1"
              min="0"
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#0d1117] border border-[#30363d] text-[#f0f6fc] text-sm font-space focus:border-[#1f6feb] focus:outline-none transition-colors placeholder-[#484f58]"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-normal text-[#8b949e]">Foreign transaction</label>
            <div className="flex items-center gap-3 h-[42px] px-3.5 rounded-lg bg-[#0d1117] border border-[#30363d]">
              <div
                className={`toggle-switch ${form.is_foreign ? 'active' : ''}`}
                onClick={() => handleChange('is_foreign', form.is_foreign ? 0 : 1)}
                role="switch"
                aria-checked={!!form.is_foreign}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleChange('is_foreign', form.is_foreign ? 0 : 1);
                  }
                }}
              />
              <span className={`text-xs font-medium ${form.is_foreign ? 'text-[#58a6ff]' : 'text-[#8b949e]'}`}>
                {form.is_foreign ? 'Yes (International)' : 'No (Domestic)'}
              </span>
            </div>
          </div>
        </div>

        {/* Preset Chips */}
        <SampleButtons onSelect={handleSampleSelect} />

        {/* Action / Pay Button */}
        <div className="pt-2 flex justify-end">
          <motion.button
            type="submit"
            disabled={loading || !form.amount}
            className="px-6 py-2.5 rounded-lg bg-[#1f6feb] hover:bg-[#388bfd] text-white text-sm font-medium transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4 text-white flex-shrink-0" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>{loadingText || 'Processing payment...'}</span>
              </>
            ) : (
              <>
                Pay now
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </>
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}
