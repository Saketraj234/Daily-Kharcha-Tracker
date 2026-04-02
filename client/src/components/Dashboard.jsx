import React from 'react';

const Dashboard = ({ transactions, monthlyBudget }) => {
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);
  
  const expense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = income - expense;
  const budgetPercent = monthlyBudget > 0 ? Math.min((expense / monthlyBudget) * 100, 100) : 0;

  return (
    <div className="space-y-8 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1e293b] p-6 rounded-2xl shadow-sm border-l-4 border-[#6366f1] animate-slide-up">
          <p className="text-sm font-medium text-gray-400">Total Income</p>
          <h3 className="text-3xl font-bold text-[#10b981] mt-1">₹{income.toLocaleString('en-IN')}</h3>
        </div>
        <div className="bg-[#1e293b] p-6 rounded-2xl shadow-sm border-l-4 border-[#ef4444] animate-slide-up" style={{ animationDelay: '100ms' }}>
          <p className="text-sm font-medium text-gray-400">Total Expenses</p>
          <h3 className="text-3xl font-bold text-[#ef4444] mt-1">₹{expense.toLocaleString('en-IN')}</h3>
        </div>
        <div className="bg-[#1e293b] p-6 rounded-2xl shadow-sm border-l-4 border-indigo-500 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <p className="text-sm font-medium text-gray-400">Remaining Balance</p>
          <h3 className={`text-3xl font-bold mt-1 ${balance >= 0 ? 'text-[#6366f1]' : 'text-[#ef4444]'}`}>
            ₹{balance.toLocaleString('en-IN')}
          </h3>
        </div>
      </div>

      {monthlyBudget > 0 && (
        <div className="bg-[#1e293b] p-6 rounded-2xl shadow-sm animate-fade-in">
          <div className="flex justify-between text-xs font-bold mb-2">
            <span>Used: <span className="text-[#ef4444]">₹{expense.toLocaleString('en-IN')}</span></span>
            <span>Target: <span className="text-[#10b981]">₹{monthlyBudget.toLocaleString('en-IN')}</span></span>
          </div>
          <div className="w-full bg-[#334155] rounded-full h-3 overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${budgetPercent >= 100 ? 'bg-[#ef4444]' : budgetPercent >= 80 ? 'bg-yellow-500' : 'bg-[#6366f1]'}`}
              style={{ width: `${budgetPercent}%` }}
            ></div>
          </div>
          {budgetPercent >= 100 && (
            <p className="text-xs mt-2 text-[#ef4444] font-bold animate-pulse">⚠️ Warning: Budget Exceeded!</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
