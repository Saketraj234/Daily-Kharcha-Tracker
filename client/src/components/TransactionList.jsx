import React from 'react';
import { ArrowUpCircle, ArrowDownCircle, Edit2, Trash2 } from 'lucide-react';

const TransactionList = ({ transactions, onEdit, onDelete }) => {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400">
        <p>No transactions found for this period.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 flex-1 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
      {transactions.map((t) => (
        <div key={t._id} className="bg-[#334155]/50 p-4 rounded-xl flex items-center justify-between group hover:shadow-md transition-all border border-transparent hover:border-[#6366f1]/20">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${t.type === 'income' ? 'bg-[#10b981]/10 text-[#10b981]' : 'bg-[#ef4444]/10 text-[#ef4444]'}`}>
              {t.type === 'income' ? <ArrowUpCircle className="w-5 h-5" /> : <ArrowDownCircle className="w-5 h-5" />}
            </div>
            <div>
              <h4 className="font-bold text-sm dark:text-gray-100">{t.desc}</h4>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{t.category}</span>
                <span className="text-[10px] text-gray-400">•</span>
                <span className="text-[10px] text-gray-400 font-medium">
                  {new Date(t.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className={`font-bold ${t.type === 'income' ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
              {t.type === 'income' ? '+' : '-'} ₹{t.amount.toLocaleString('en-IN')}
            </span>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => onEdit(t)}
                className="p-1.5 text-gray-400 hover:text-[#6366f1] transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button 
                onClick={() => onDelete(t._id)}
                className="p-1.5 text-gray-400 hover:text-[#ef4444] transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionList;
