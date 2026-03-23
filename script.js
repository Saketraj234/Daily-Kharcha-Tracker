// State
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let monthlyBudget = parseFloat(localStorage.getItem('monthlyBudget')) || 0;
let currentType = 'income'; // 'income' or 'expense'
let categoryChart = null;
let dailyChart = null;

const categories = {
    income: ['Jobs', 'Business', 'Freelance', 'Investments', 'Others'],
    expense: ['Food', 'Travel', 'Shopping', 'Bills', 'Health', 'Others']
};

// DOM Elements
const transactionForm = document.getElementById('transactionForm');
const transactionList = document.getElementById('transactionList');
const totalIncomeEl = document.getElementById('totalIncome');
const totalExpenseEl = document.getElementById('totalExpense');
const balanceEl = document.getElementById('balance');
const typeBtns = document.querySelectorAll('.type-btn');
const budgetInput = document.getElementById('budgetInput');
const saveBudgetBtn = document.getElementById('saveBudgetBtn');
const budgetProgressWrapper = document.getElementById('budgetProgressWrapper');
const budgetUsedEl = document.getElementById('budgetUsed');
const budgetTargetEl = document.getElementById('budgetTarget');
const budgetProgressBar = document.getElementById('budgetProgressBar');
const budgetWarning = document.getElementById('budgetWarning');
const filterCategory = document.getElementById('filterCategory');
const filterMonth = document.getElementById('filterMonth');
const exportBtn = document.getElementById('exportBtn');
const categorySelect = document.getElementById('category');

// Initialize
function init() {
    // Set default date to today
    document.getElementById('date').valueAsDate = new Date();
    
    // Set default filter month to current
    const now = new Date();
    filterMonth.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    
    // Initial Budget Display
    if (monthlyBudget > 0) {
        budgetInput.value = monthlyBudget;
        budgetProgressWrapper.classList.remove('hidden');
    }

    updateCategoryOptions();
    updateDashboard();
    renderTransactions();
    initCharts();
    updateFilterCategories();
}

function updateCategoryOptions() {
    const options = categories[currentType];
    categorySelect.innerHTML = options.map(cat => `<option value="${cat}">${cat}</option>`).join('');
}

function updateFilterCategories() {
    const allCats = [...new Set([...categories.income, ...categories.expense])];
    const currentVal = filterCategory.value;
    filterCategory.innerHTML = '<option value="all">All Categories</option>' + 
        allCats.map(cat => `<option value="${cat}">${cat}</option>`).join('');
    filterCategory.value = currentVal;
}

// Transaction Type Toggle
typeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        typeBtns.forEach(b => b.classList.remove('active', 'bg-white', 'bg-gray-600', 'shadow-sm'));
        typeBtns.forEach(b => b.classList.add('text-gray-500'));
        
        btn.classList.add('active', 'bg-white', 'bg-gray-600', 'shadow-sm');
        btn.classList.remove('text-gray-500');
        currentType = btn.dataset.type;
        updateCategoryOptions();
    });
});

// Add / Edit Transaction
transactionForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const id = document.getElementById('editId').value;
    const desc = document.getElementById('desc').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;
    const date = document.getElementById('date').value;

    if (id) {
        // Edit
        const index = transactions.findIndex(t => t.id === parseInt(id));
        transactions[index] = { ...transactions[index], desc, amount, category, date, type: currentType };
        document.getElementById('editId').value = '';
        document.getElementById('submitBtn').textContent = 'Add Transaction';
    } else {
        // Add
        const newTransaction = {
            id: Date.now(),
            desc,
            amount,
            category,
            date,
            type: currentType
        };
        transactions.unshift(newTransaction);
    }

    saveAndRefresh();
    transactionForm.reset();
    document.getElementById('date').valueAsDate = new Date();
});

function saveAndRefresh() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
    updateDashboard();
    renderTransactions();
    updateCharts();
}

// Delete Transaction
function deleteTransaction(id) {
    if (confirm('Are you sure you want to delete this transaction?')) {
        transactions = transactions.filter(t => t.id !== id);
        saveAndRefresh();
    }
}

// Edit Transaction
function editTransaction(id) {
    const t = transactions.find(t => t.id === id);
    if (!t) return;

    document.getElementById('editId').value = t.id;
    document.getElementById('desc').value = t.desc;
    document.getElementById('amount').value = t.amount;
    document.getElementById('category').value = t.category;
    document.getElementById('date').value = t.date;
    
    // Set type
    currentType = t.type;
    typeBtns.forEach(btn => {
        if (btn.dataset.type === t.type) {
            btn.click();
        }
    });

    document.getElementById('submitBtn').textContent = 'Update Transaction';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Dashboard Update
function updateDashboard() {
    const income = transactions
        .filter(t => t.type === 'income')
        .reduce((acc, t) => acc + t.amount, 0);
    
    const expense = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => acc + t.amount, 0);

    const balance = income - expense;

    totalIncomeEl.textContent = `₹${income.toLocaleString('en-IN')}`;
    totalExpenseEl.textContent = `₹${expense.toLocaleString('en-IN')}`;
    balanceEl.textContent = `₹${balance.toLocaleString('en-IN')}`;
    balanceEl.className = `text-3xl font-bold mt-1 ${balance >= 0 ? 'text-primary' : 'text-danger'}`;

    updateBudgetProgress(expense);
}

// Budget Progress
saveBudgetBtn.addEventListener('click', () => {
    const val = parseFloat(budgetInput.value);
    if (val > 0) {
        monthlyBudget = val;
        localStorage.setItem('monthlyBudget', monthlyBudget);
        budgetProgressWrapper.classList.remove('hidden');
        updateDashboard();
        alert('Budget saved successfully!');
    }
});

function updateBudgetProgress(totalExpense) {
    if (monthlyBudget <= 0) return;

    const percent = Math.min((totalExpense / monthlyBudget) * 100, 100);
    budgetUsedEl.textContent = `₹${totalExpense.toLocaleString('en-IN')}`;
    budgetTargetEl.textContent = `₹${monthlyBudget.toLocaleString('en-IN')}`;
    budgetProgressBar.style.width = `${percent}%`;
    
    if (percent >= 100) {
        budgetProgressBar.className = 'bg-danger h-full transition-all duration-500';
        budgetWarning.classList.remove('hidden');
    } else if (percent >= 80) {
        budgetProgressBar.className = 'bg-yellow-500 h-full transition-all duration-500';
        budgetWarning.classList.add('hidden');
    } else {
        budgetProgressBar.className = 'bg-primary h-full transition-all duration-500';
        budgetWarning.classList.add('hidden');
    }
}

// Render List
function renderTransactions() {
    const cat = filterCategory.value;
    const month = filterMonth.value;

    const filtered = transactions.filter(t => {
        const tMonth = t.date.substring(0, 7); // YYYY-MM
        const matchCat = cat === 'all' || t.category === cat;
        const matchMonth = !month || tMonth === month;
        return matchCat && matchMonth;
    });

    if (filtered.length === 0) {
        transactionList.innerHTML = `
            <div class="text-center py-10 text-gray-400">
                <p>No transactions found for this period.</p>
            </div>
        `;
        return;
    }

    transactionList.innerHTML = filtered.map(t => `
        <div class="bg-gray-700/50 p-4 rounded-xl flex items-center justify-between group hover:shadow-md transition-all border border-transparent hover:border-primary/20">
            <div class="flex items-center gap-4">
                <div class="p-3 rounded-xl ${t.type === 'income' ? 'bg-secondary/10 text-secondary' : 'bg-danger/10 text-danger'}">
                    ${t.type === 'income' ? 
                        '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12" /></svg>' : 
                        '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6" /></svg>'
                    }
                </div>
                <div>
                    <h4 class="font-bold text-sm text-gray-100">${t.desc}</h4>
                    <div class="flex items-center gap-2 mt-0.5">
                        <span class="text-[10px] font-bold uppercase tracking-wider text-gray-400">${t.category}</span>
                        <span class="text-[10px] text-gray-400">•</span>
                        <span class="text-[10px] text-gray-400 font-medium">${new Date(t.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                    </div>
                </div>
            </div>
            <div class="flex items-center gap-4">
                <span class="font-bold ${t.type === 'income' ? 'text-secondary' : 'text-danger'}">
                    ${t.type === 'income' ? '+' : '-'} ₹${t.amount.toLocaleString('en-IN')}
                </span>
                <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onclick="editTransaction(${t.id})" class="p-1.5 text-gray-400 hover:text-primary transition-colors">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                    <button onclick="deleteTransaction(${t.id})" class="p-1.5 text-gray-400 hover:text-danger transition-colors">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Charts Initialization
function initCharts() {
    const ctx1 = document.getElementById('categoryChart').getContext('2d');
    const ctx2 = document.getElementById('dailyChart').getContext('2d');

    categoryChart = new Chart(ctx1, {
        type: 'doughnut',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 10 } } }
            },
            cutout: '70%'
        }
    });

    dailyChart = new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Expenses',
                data: [],
                backgroundColor: '#6366f1',
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, grid: { display: false }, ticks: { font: { size: 10 } } },
                x: { grid: { display: false }, ticks: { font: { size: 10 } } }
            }
        }
    });

    updateCharts();
}

function updateCharts() {
    if (!categoryChart || !dailyChart) return;

    // Category Data (Expenses only)
    const catData = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
        catData[t.category] = (catData[t.category] || 0) + t.amount;
    });

    categoryChart.data.labels = Object.keys(catData);
    categoryChart.data.datasets[0].data = Object.values(catData);
    categoryChart.update();

    // Daily Data (Last 7 days)
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        last7Days.push(d.toISOString().split('T')[0]);
    }

    const dailyData = last7Days.map(date => {
        return transactions
            .filter(t => t.type === 'expense' && t.date === date)
            .reduce((acc, t) => acc + t.amount, 0);
    });

    dailyChart.data.labels = last7Days.map(d => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }));
    dailyChart.data.datasets[0].data = dailyData;
    dailyChart.update();
}

// Filters
filterCategory.addEventListener('change', renderTransactions);
filterMonth.addEventListener('change', renderTransactions);

// Export to Excel
exportBtn.addEventListener('click', () => {
    if (transactions.length === 0) {
        alert('No data to export!');
        return;
    }

    const ws = XLSX.utils.json_to_sheet(transactions.map(t => ({
        Date: t.date,
        Description: t.desc,
        Category: t.category,
        Type: t.type.toUpperCase(),
        'Amount (₹)': t.amount
    })));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Transactions");
    XLSX.writeFile(wb, `Kharcha_Tracker_${new Date().toISOString().split('T')[0]}.xlsx`);
});

// Expose functions to window
window.editTransaction = editTransaction;
window.deleteTransaction = deleteTransaction;

// Run Init
init();
