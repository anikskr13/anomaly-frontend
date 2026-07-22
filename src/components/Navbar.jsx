import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-[#0d1117]/90 backdrop-blur-md border-b border-[#30363d]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1f6feb] to-[#388bfd] flex items-center justify-center font-bold text-white text-xs tracking-tight shadow-md shadow-[#1f6feb]/20">
            SP
          </div>
          <span className="text-base font-bold text-[#f0f6fc] tracking-tight">
            Secure<span className="text-[#58a6ff]">Pay</span>
          </span>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-1 bg-[#161b22] rounded-lg p-1 border border-[#30363d]">
          <Link to="/">
            <motion.div
              className={`px-3.5 py-1.5 rounded-md text-sm font-medium transition-all ${
                location.pathname === '/'
                  ? 'bg-[#21262d] text-[#f0f6fc] border border-[#30363d]'
                  : 'text-[#8b949e] hover:text-[#c9d1d9]'
              }`}
              whileTap={{ scale: 0.98 }}
            >
              Make payment
            </motion.div>
          </Link>
          <Link to="/history">
            <motion.div
              className={`px-3.5 py-1.5 rounded-md text-sm font-medium transition-all ${
                location.pathname === '/history'
                  ? 'bg-[#21262d] text-[#f0f6fc] border border-[#30363d]'
                  : 'text-[#8b949e] hover:text-[#c9d1d9]'
              }`}
              whileTap={{ scale: 0.98 }}
            >
              Transaction history
            </motion.div>
          </Link>
        </div>
      </div>
    </nav>
  );
}
