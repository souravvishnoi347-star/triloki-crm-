const fs = require('fs');
const path = 'D:/Hostbolt/micro saas/triloki crm/src/app/invoices/page.tsx';
let code = fs.readFileSync(path, 'utf8');

const map = {
  'bg-white': 'bg-[#ffffff]',
  'bg-orange-500': 'bg-[#f97316]',
  'text-white': 'text-[#ffffff]',
  'text-orange-100': 'text-[#ffedd5]',
  'border-white/50': 'border-[#ffffff]/50',
  'text-orange-500': 'text-[#f97316]',
  'text-gray-500': 'text-[#6b7280]',
  'text-gray-800': 'text-[#1f2937]',
  'border-blue-400': 'border-[#60a5fa]',
  'text-gray-400': 'text-[#9ca3af]',
  'divide-gray-200': 'divide-[#e5e7eb]',
  'text-gray-600': 'text-[#4b5563]',
  'text-green-600': 'text-[#16a34a]',
  'text-gray-900': 'text-[#111827]',
  'border-gray-100': 'border-[#f3f4f6]',
  'border-gray-200': 'border-[#e5e7eb]',
  'border-gray-300': 'border-[#d1d5db]',
  'border-orange-200': 'border-[#fed7aa]',
  'text-orange-600': 'text-[#ea580c]',
  'bg-orange-50/30': 'bg-[#fff7ed]/30',
  'text-blue-400': 'text-[#60a5fa]',
  'text-purple-400': 'text-[#c084fc]',
  'text-pink-400': 'text-[#f472b6]',
  'bg-slate-50': 'bg-[#f8fafc]',
  'bg-gray-100': 'bg-[#f3f4f6]',
  'bg-red-50': 'bg-[#fef2f2]',
  'text-red-500': 'text-[#ef4444]',
  'text-gray-700': 'text-[#374151]',
  'bg-gray-50': 'bg-[#f9fafb]'
};

for (const [k, v] of Object.entries(map)) {
  code = code.split(' ' + k).join(' ' + v);
  code = code.split('"' + k).join('"' + v);
}

fs.writeFileSync(path, code);
console.log('done');
