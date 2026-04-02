import React, { useState, useEffect } from 'react';
import { PlusCircle, Save, XCircle } from 'lucide-react';

const categories = {
  income: ['Jobs', 'Business', 'Freelance', 'Investments', 'Others'],
  expense: ['Food', 'Travel', 'Shopping', 'Bills', 'Health', 'Others']
};

const TransactionForm = ({ onSubmit, initialData, onCancel }) => {
  const [formData, setFormData] = useState({
    desc: '',
    amount: '',
    category: 'Jobs',
    date: new Date().toISOString().substring(0, 10),
    type: 'income'
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        desc: initialData.desc,
        amount: initialData.amount,
        category: initialData.category,
        date: initialData.date,
        type: initialData.type
      });
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      desc: '',
      amount: '',
      category: formData.type === 'income' ? 'Jobs' : 'Food',
      date: new Date().toISOString().substring(0, 10),
      type: formData.type
    });
  };

  const handleTypeChange = (type) => {
    setFormData({
      ...formData,
      type,
      category: categories[type][0]
    });
  };

  return (
    <section className="bg-[#1e293b] p-6 rounded-2xl shadow-sm animate-fade-in border border-[#334155]">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <span className="bg-[#6366f1]/10 text-[#6366f1] p-1.5 rounded-lg">
          <PlusCircle className="w-5 h-5" />
        </span>
        {initialData ? 'Update Transaction' : 'Add Transaction'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-2 p-1 bg-[#334155] rounded-xl mb-4">
          <button 
            type="button" 
            onClick={() => handleTypeChange('income')}
            className={`py-2 rounded-lg text-sm font-bold transition-all ${formData.type === 'income' ? 'bg-[#475569] shadow-sm text-white' : 'text-gray-400'}`}
          >
            Income
          </button>
          <button 
            type="button" 
            onClick={() => handleTypeChange('expense')}
            className={`py-2 rounded-lg text-sm font-bold transition-all ${formData.type === 'expense' ? 'bg-[#475569] shadow-sm text-white' : 'text-gray-400'}`}
          >
            Expense
          </button>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Description</label>
          <input 
            type="text" 
            value={formData.desc}
            onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
            placeholder="e.g. Salary, Grocery" 
            required 
            className="w-full bg-[#334155] border-none rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#6366f1] outline-none transition-all"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Amount (₹)</label>
            <input 
              type="number" 
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="0.00" 
              required 
              className="w-full bg-[#334155] border-none rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#6366f1] outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Category</label>
            <select 
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full bg-[#334155] border-none rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#6366f1] outline-none transition-all"
            >
              {categories[formData.type].map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Date</label>
          <input 
            type="date" 
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required 
            className="w-full bg-[#334155] border-none rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#6366f1] outline-none transition-all"
          />
        </div>
        <div className="flex gap-2">
          <button 
            type="submit" 
            className="flex-1 bg-[#6366f1] hover:bg-[#4f46e5] text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-[#6366f1]/20 flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            {initialData ? 'Update' : 'Add'} Transaction
          </button>
          {initialData && (
            <button 
              type="button" 
              onClick={onCancel}
              className="bg-[#ef4444]/10 text-[#ef4444] hover:bg-[#ef4444]/20 p-3 rounded-xl transition-all"
            >
              <XCircle className="w-6 h-6" />
            </button>
          )}
        </div>
      </form>
    </section>
  );
};

export default TransactionForm;
