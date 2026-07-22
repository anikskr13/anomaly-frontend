import { motion } from 'framer-motion';

export default function SampleButtons({ onSelect }) {
  const presets = [
    {
      id: 'normal',
      label: '🏪 Normal Purchase',
      data: {
        merchant: 'Swiggy',
        amount: 1200,
        hour_of_day: 14,
        frequency: 2,
        is_foreign: 0,
        category: 'Food & Dining',
      },
    },
    {
      id: 'latenight',
      label: '🌙 Late Night',
      data: {
        merchant: 'Unknown Merchant',
        amount: 98000,
        hour_of_day: 3,
        frequency: 47,
        is_foreign: 1,
        category: 'Shopping',
      },
    },
    {
      id: 'international',
      label: '🌍 International',
      data: {
        merchant: 'Overseas Digital',
        amount: 62000,
        hour_of_day: 1,
        frequency: 18,
        is_foreign: 1,
        category: 'Shopping',
      },
    },
    {
      id: 'random',
      label: '🎲 Random',
      data: () => ({
        merchant: ['Flipkart', 'Amazon', 'Zomato', 'BookMyShow', 'MakeMyTrip', 'Uber'][Math.floor(Math.random() * 6)],
        amount: Math.floor(Math.random() * 90000) + 500,
        hour_of_day: Math.floor(Math.random() * 24),
        frequency: Math.floor(Math.random() * 40) + 1,
        is_foreign: Math.round(Math.random()),
        category: ['Shopping', 'Food & Dining', 'Travel', 'Entertainment', 'Utilities'][Math.floor(Math.random() * 5)],
      }),
    },
  ];

  const handleClick = (preset) => {
    const data = typeof preset.data === 'function' ? preset.data() : preset.data;
    onSelect(data);
  };

  return (
    <div className="space-y-1.5">
      <span className="text-xs font-normal text-[#8b949e]">Preset scenarios</span>
      <div className="flex flex-wrap gap-2">
        {presets.map((preset) => (
          <motion.button
            key={preset.id}
            type="button"
            onClick={() => handleClick(preset)}
            className="px-3 py-1.5 rounded-full bg-[#21262d] border border-[#30363d] text-[#c9d1d9] text-xs font-medium hover:bg-[#30363d] hover:text-white transition-all flex items-center gap-1"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {preset.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
