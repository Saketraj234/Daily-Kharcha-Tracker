import React from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const Charts = ({ transactions }) => {
  const expenseTransactions = transactions.filter(t => t.type === 'expense');

  // Category Chart Data
  const categories = {};
  expenseTransactions.forEach(t => {
    categories[t.category] = (categories[t.category] || 0) + t.amount;
  });

  const doughnutData = {
    labels: Object.keys(categories),
    datasets: [{
      data: Object.values(categories),
      backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'],
      borderWidth: 0,
    }]
  };

  // Daily Trend Data (Last 7 Days)
  const dailyData = {};
  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().substring(0, 10);
  }).reverse();

  last7Days.forEach(date => {
    dailyData[date] = 0;
  });

  expenseTransactions.forEach(t => {
    if (dailyData[t.date] !== undefined) {
      dailyData[t.date] += t.amount;
    }
  });

  const barData = {
    labels: last7Days.map(d => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })),
    datasets: [{
      label: 'Expenses',
      data: Object.values(dailyData),
      backgroundColor: '#6366f1',
      borderRadius: 4,
    }]
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <section className="bg-[#1e293b] p-6 rounded-2xl shadow-sm border border-[#334155]">
        <h2 className="text-sm font-bold text-gray-400 uppercase mb-4">Category-wise Expenses</h2>
        <div className="h-48 flex items-center justify-center">
          {expenseTransactions.length > 0 ? (
            <Doughnut 
              data={doughnutData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'bottom', labels: { color: '#94a3b8', boxWidth: 12, font: { size: 10 } } }
                },
                cutout: '70%'
              }} 
            />
          ) : (
            <p className="text-gray-500 text-sm">No data available</p>
          )}
        </div>
      </section>
      <section className="bg-[#1e293b] p-6 rounded-2xl shadow-sm border border-[#334155]">
        <h2 className="text-sm font-bold text-gray-400 uppercase mb-4">Daily Trend (Last 7 Days)</h2>
        <div className="h-48 flex items-center justify-center">
          <Bar 
            data={barData} 
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: {
                y: { grid: { color: '#334155' }, ticks: { color: '#94a3b8', font: { size: 10 } } },
                x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 10 } } }
              }
            }} 
          />
        </div>
      </section>
    </div>
  );
};

export default Charts;
