import React, { useState, useEffect } from 'react';
import { transactionAPI, authAPI, userAPI } from './api';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import Auth from './components/Auth';
import Charts from './components/Charts';
import { LogOut, Download, Wallet } from 'lucide-react';
import * as XLSX from 'xlsx';

function App() {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [monthlyBudget, setMonthlyBudget] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filterMonth, setFilterMonth] = useState(new Date().toISOString().substring(0, 7));
  const [filterCategory, setFilterCategory] = useState('all');
  const [editingTransaction, setEditingTransaction] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user, filterMonth, filterCategory]);

  const fetchTransactions = async () => {
    try {
      const res = await transactionAPI.getAll(filterMonth, filterCategory);
      setTransactions(res.data);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    }
  };

  const handleLogin = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setMonthlyBudget(userData.monthlyBudget || 0);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const handleAddTransaction = async (data) => {
    try {
      if (editingTransaction) {
        await transactionAPI.update(editingTransaction._id, data);
        setEditingTransaction(null);
      } else {
        await transactionAPI.add(data);
      }
      fetchTransactions();
    } catch (err) {
      console.error('Error adding/updating transaction:', err);
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await transactionAPI.delete(id);
        fetchTransactions();
      } catch (err) {
        console.error('Error deleting transaction:', err);
      }
    }
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveBudget = async (budget) => {
    try {
      await userAPI.updateBudget(budget);
      setMonthlyBudget(budget);
      alert('Budget saved successfully!');
    } catch (err) {
      console.error('Error saving budget:', err);
    }
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(transactions);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Transactions");
    XLSX.writeFile(wb, "Kharcha_Tracker_Report.xlsx");
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen text-xl">Loading...</div>;

  if (!user) return <Auth onLogin={handleLogin} />;

  return (
    <div className="bg-[#0f172a] text-[#f1f5f9] min-h-screen font-inter custom-scrollbar">
      {/* Navbar */}
      <nav className="bg-[#1e293b] shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-[#6366f1] p-2 rounded-lg text-white">
              <Wallet className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Kharcha <span className="text-[#6366f1]">Tracker</span></h1>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={exportToExcel}
              className="bg-[#334155] hover:bg-[#475569] px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <button 
              onClick={handleLogout}
              className="bg-[#ef4444] hover:bg-red-600 px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-4 lg:p-8">
        <Dashboard transactions={transactions} monthlyBudget={monthlyBudget} onSaveBudget={handleSaveBudget} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-8">
            <TransactionForm 
              onSubmit={handleAddTransaction} 
              initialData={editingTransaction} 
              onCancel={() => setEditingTransaction(null)} 
            />
            
            <section className="bg-[#1e293b] p-6 rounded-2xl shadow-sm animate-fade-in">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="bg-[#10b981]/10 text-[#10b981] p-1.5 rounded-lg">
                  <Wallet className="w-5 h-5" />
                </span>
                Monthly Budget
              </h2>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  value={monthlyBudget} 
                  onChange={(e) => setMonthlyBudget(e.target.value)}
                  placeholder="Set Budget" 
                  className="flex-1 bg-[#334155] border-none rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#6366f1] outline-none"
                />
                <button 
                  onClick={() => handleSaveBudget(monthlyBudget)}
                  className="bg-[#10b981] text-white px-4 rounded-xl font-bold"
                >
                  Save
                </button>
              </div>
            </section>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <Charts transactions={transactions} />
            
            <section className="bg-[#1e293b] p-6 rounded-2xl shadow-sm flex-1 flex flex-col min-h-[500px]">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <h2 className="text-xl font-bold">Transaction History</h2>
                <div className="flex flex-wrap items-center gap-3">
                  <select 
                    value={filterCategory} 
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="bg-[#334155] border-none rounded-lg px-3 py-1.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-[#6366f1]"
                  >
                    <option value="all">All Categories</option>
                    <option value="Jobs">Jobs</option>
                    <option value="Business">Business</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Investments">Investments</option>
                    <option value="Food">Food</option>
                    <option value="Travel">Travel</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Bills">Bills</option>
                    <option value="Health">Health</option>
                    <option value="Others">Others</option>
                  </select>
                  <input 
                    type="month" 
                    value={filterMonth}
                    onChange={(e) => setFilterMonth(e.target.value)}
                    className="bg-[#334155] border-none rounded-lg px-3 py-1.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-[#6366f1]"
                  />
                </div>
              </div>
              
              <TransactionList 
                transactions={transactions} 
                onEdit={handleEditTransaction} 
                onDelete={handleDeleteTransaction} 
              />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
