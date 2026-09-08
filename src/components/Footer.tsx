import React from 'react';
import { ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#F4F2EB] text-stone-600 border-t border-stone-300 py-8 text-xs font-sans">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-5">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <span className="font-serif font-bold text-stone-900 text-sm">Frontier AI Lab</span>
            <span className="text-stone-500 ml-2">• Open source under Apache-2.0</span>
          </div>

          <div className="flex items-center space-x-4 font-mono text-[11px]">
            <a href="https://arxiv.org/abs/2509.26507" target="_blank" rel="noreferrer" className="hover:text-accent-terracotta inline-flex items-center gap-1 text-stone-700">
              <span>BDH Paper</span><ExternalLink className="w-3 h-3" />
            </a>
            <a href="https://arxiv.org/abs/2608.09888" target="_blank" rel="noreferrer" className="hover:text-accent-terracotta inline-flex items-center gap-1 text-stone-700">
              <span>BDH-CQ Paper</span><ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        <div className="overflow-x-auto rounded-md border border-stone-300 bg-[#FAF9F5]">
          <table className="w-full text-left text-xs" aria-label="Frontier AI Lab team">
            <caption className="sr-only">Frontier AI Lab team members</caption>
            <thead className="bg-stone-200 text-stone-700">
              <tr>
                <th scope="col" className="px-3 py-2 font-semibold">Team</th>
                <th scope="col" className="px-3 py-2 font-semibold">Role</th>
                <th scope="col" className="px-3 py-2 font-semibold">Name</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 text-stone-700">
              <tr><td className="px-3 py-2 font-medium" rowSpan={4}>Eduecho</td><td className="px-3 py-2">Leader</td><td className="px-3 py-2">Anuj Maurya</td></tr>
              <tr><td className="px-3 py-2">Member</td><td className="px-3 py-2">Archita Kesharwani</td></tr>
              <tr><td className="px-3 py-2">Member</td><td className="px-3 py-2">Aru Shubham Singh</td></tr>
              <tr><td className="px-3 py-2">Member</td><td className="px-3 py-2">Shlok Bhardwaj</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </footer>
  );
};
