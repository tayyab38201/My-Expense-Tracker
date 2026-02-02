'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { PlusCircle, Trash2, TrendingUp, TrendingDown, DollarSign, Calendar, Tag, Filter, Download, Moon, Sun, Search, PieChart, BarChart3, RefreshCw, AlertCircle, Edit2, Check, X } from 'lucide-react';

const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('food');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterCategory, setFilterCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [timeFilter, setTimeFilter] = useState('all');
  const [budget, setBudget] = useState('');
  const [showBudgetInput, setShowBudgetInput] = useState(false);
  const [monthlyBudget, setMonthlyBudget] = useState(0);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState('monthly');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [sortBy, setSortBy] = useState('date');

  const categories = [
    { value: 'food', label: 'Food & Dining', color: 'bg-orange-500', hoverColor: 'hover:bg-orange-600', icon: '🍔' },
    { value: 'transport', label: 'Transport', color: 'bg-blue-500', hoverColor: 'hover:bg-blue-600', icon: '🚗' },
    { value: 'entertainment', label: 'Entertainment', color: 'bg-purple-500', hoverColor: 'hover:bg-purple-600', icon: '🎬' },
    { value: 'utilities', label: 'Utilities', color: 'bg-yellow-500', hoverColor: 'hover:bg-yellow-600', icon: '⚡' },
    { value: 'healthcare', label: 'Healthcare', color: 'bg-red-500', hoverColor: 'hover:bg-red-600', icon: '🏥' },
    { value: 'shopping', label: 'Shopping', color: 'bg-pink-500', hoverColor: 'hover:bg-pink-600', icon: '🛍️' },
    { value: 'education', label: 'Education', color: 'bg-indigo-500', hoverColor: 'hover:bg-indigo-600', icon: '📚' },
    { value: 'other', label: 'Other', color: 'bg-gray-500', hoverColor: 'hover:bg-gray-600', icon: '📌' }
  ];

  useEffect(() => {
    const saved = localStorage.getItem('expenses');
    const savedBudget = localStorage.getItem('monthlyBudget');
    const savedDarkMode = localStorage.getItem('darkMode');
    
    if (saved) {
      try {
        setExpenses(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading expenses');
      }
    }
    if (savedBudget) setMonthlyBudget(parseFloat(savedBudget));
    if (savedDarkMode) setDarkMode(savedDarkMode === 'true');
  }, []);

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  useEffect(() => {
    if (monthlyBudget > 0) {
      localStorage.setItem('monthlyBudget', monthlyBudget.toString());
    }
  }, [monthlyBudget]);

  const addExpense = () => {
    if (!description.trim() || !amount || parseFloat(amount) <= 0) return;

    const newExpense = {
      id: Date.now(),
      description: description.trim(),
      amount: parseFloat(amount),
      category,
      date,
      isRecurring,
      recurringFrequency: isRecurring ? recurringFrequency : null,
      createdAt: new Date().toISOString()
    };

    setExpenses([newExpense, ...expenses]);
    setDescription('');
    setAmount('');
    setCategory('food');
    setDate(new Date().toISOString().split('T')[0]);
    setIsRecurring(false);
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };

  const startEdit = (expense) => {
    setEditingId(expense.id);
    setEditForm({
      description: expense.description,
      amount: expense.amount,
      category: expense.category,
      date: expense.date
    });
  };

  const saveEdit = () => {
    setExpenses(expenses.map(exp => 
      exp.id === editingId 
        ? { ...exp, ...editForm, amount: parseFloat(editForm.amount) }
        : exp
    ));
    setEditingId(null);
    setEditForm({});
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveBudget = () => {
    if (budget && parseFloat(budget) > 0) {
      setMonthlyBudget(parseFloat(budget));
      setBudget('');
      setShowBudgetInput(false);
    }
  };

  const clearAllExpenses = () => {
    if (window.confirm('Are you sure you want to delete all expenses?')) {
      setExpenses([]);
    }
  };

  const getFilteredByTime = (exps) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    switch(timeFilter) {
      case 'today':
        return exps.filter(exp => {
          const expDate = new Date(exp.date);
          return expDate.toDateString() === now.toDateString();
        });
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return exps.filter(exp => new Date(exp.date) >= weekAgo);
      case 'month':
        return exps.filter(exp => {
          const expDate = new Date(exp.date);
          return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
        });
      case 'year':
        return exps.filter(exp => new Date(exp.date).getFullYear() === currentYear);
      default:
        return exps;
    }
  };

  const filteredExpenses = useMemo(() => {
    let filtered = expenses;
    
    if (filterCategory !== 'all') {
      filtered = filtered.filter(exp => exp.category === filterCategory);
    }
    
    filtered = getFilteredByTime(filtered);
    
    if (searchTerm) {
      filtered = filtered.filter(exp => 
        exp.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sorting
    filtered = [...filtered].sort((a, b) => {
      switch(sortBy) {
        case 'amount-high':
          return b.amount - a.amount;
        case 'amount-low':
          return a.amount - b.amount;
        case 'date':
        default:
          return new Date(b.date) - new Date(a.date);
      }
    });
    
    return filtered;
  }, [expenses, filterCategory, searchTerm, timeFilter, sortBy]);

  const stats = useMemo(() => {
    const total = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const byCategory = {};
    
    filteredExpenses.forEach(exp => {
      byCategory[exp.category] = (byCategory[exp.category] || 0) + exp.amount;
    });
    
    const now = new Date();
    const monthlyExpenses = expenses.filter(exp => {
      const expDate = new Date(exp.date);
      return expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear();
    });
    const monthlyTotal = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    
    return { 
      total, 
      byCategory, 
      count: filteredExpenses.length,
      monthlyTotal,
      budgetRemaining: monthlyBudget - monthlyTotal,
      budgetPercentage: monthlyBudget > 0 ? (monthlyTotal / monthlyBudget) * 100 : 0
    };
  }, [filteredExpenses, expenses, monthlyBudget]);

  const exportToCSV = () => {
    const headers = ['Date', 'Description', 'Category', 'Amount', 'Recurring'];
    const rows = filteredExpenses.map(exp => [
      exp.date,
      exp.description,
      getCategoryInfo(exp.category).label,
      exp.amount.toFixed(2),
      exp.isRecurring ? `Yes (${exp.recurringFrequency})` : 'No'
    ]);
    
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expenses_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getCategoryInfo = (cat) => categories.find(c => c.value === cat) || categories[categories.length - 1];

  const bgClass = darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100';
  const cardClass = darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white';
  const textClass = darkMode ? 'text-gray-100' : 'text-slate-800';
  const textSecondaryClass = darkMode ? 'text-gray-400' : 'text-slate-600';
  const inputClass = darkMode 
    ? 'bg-gray-700 border-gray-600 text-gray-100 focus:ring-blue-400' 
    : 'bg-white border-slate-300 text-slate-800 focus:ring-blue-500';

  return (
    <div className={`min-h-screen ${bgClass} p-3 sm:p-4 md:p-6 lg:p-8 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 md:mb-8 gap-3 md:gap-4">
          <div className="text-center sm:text-left w-full sm:w-auto">
            <h1 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold ${textClass} mb-1 md:mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}>
              💰 Expense Tracker Pro
            </h1>
            <p className={`${textSecondaryClass} text-xs sm:text-sm md:text-base`}>Complete financial control at your fingertips</p>
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-end">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 md:p-3 rounded-xl transition-all duration-300 ${cardClass} hover:scale-110 hover:shadow-lg`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-4 h-4 md:w-5 md:h-5 text-yellow-400" /> : <Moon className="w-4 h-4 md:w-5 md:h-5 text-slate-600" />}
            </button>
            
            <button
              onClick={exportToCSV}
              disabled={filteredExpenses.length === 0}
              className={`flex items-center gap-2 px-3 md:px-4 py-2 md:py-3 rounded-xl font-semibold transition-all duration-300 text-sm md:text-base transform hover:scale-105 ${
                filteredExpenses.length === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl'
              }`}
            >
              <Download className="w-4 h-4 md:w-5 md:h-5" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
          </div>
        </div>

        {/* Budget Alert */}
        {monthlyBudget > 0 && stats.budgetPercentage >= 80 && (
          <div className={`mb-4 md:mb-6 p-3 md:p-4 rounded-xl border-l-4 transition-all duration-300 transform hover:scale-[1.02] ${
            stats.budgetPercentage >= 100 
              ? 'bg-red-50 border-red-500 hover:shadow-lg' 
              : 'bg-yellow-50 border-yellow-500 hover:shadow-lg'
          }`}>
            <div className="flex items-start gap-2 md:gap-3">
              <AlertCircle className={`w-4 h-4 md:w-5 md:h-5 mt-0.5 ${stats.budgetPercentage >= 100 ? 'text-red-500' : 'text-yellow-500'} animate-pulse`} />
              <div className="flex-1">
                <p className={`font-semibold text-sm md:text-base ${stats.budgetPercentage >= 100 ? 'text-red-800' : 'text-yellow-800'}`}>
                  {stats.budgetPercentage >= 100 ? '🚨 Budget Exceeded!' : '⚠️ Budget Warning!'}
                </p>
                <p className={`text-xs md:text-sm ${stats.budgetPercentage >= 100 ? 'text-red-700' : 'text-yellow-700'}`}>
                  You've used {stats.budgetPercentage.toFixed(0)}% of your monthly budget (${stats.monthlyTotal.toFixed(2)} / ${monthlyBudget.toFixed(2)})
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          <div className={`${cardClass} rounded-2xl shadow-lg p-4 md:p-6 border-l-4 border-emerald-500 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer`}>
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className={`${textSecondaryClass} text-xs md:text-sm font-medium mb-1`}>Total</p>
                <p className={`text-xl md:text-2xl lg:text-3xl font-bold ${textClass} truncate`}>${stats.total.toFixed(2)}</p>
              </div>
              <div className="bg-emerald-100 p-2 md:p-3 rounded-full transition-transform hover:scale-110">
                <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className={`${cardClass} rounded-2xl shadow-lg p-4 md:p-6 border-l-4 border-blue-500 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer`}>
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className={`${textSecondaryClass} text-xs md:text-sm font-medium mb-1`}>Transactions</p>
                <p className={`text-xl md:text-2xl lg:text-3xl font-bold ${textClass}`}>{stats.count}</p>
              </div>
              <div className="bg-blue-100 p-2 md:p-3 rounded-full transition-transform hover:scale-110">
                <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className={`${cardClass} rounded-2xl shadow-lg p-4 md:p-6 border-l-4 border-purple-500 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer`}>
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className={`${textSecondaryClass} text-xs md:text-sm font-medium mb-1`}>Average</p>
                <p className={`text-xl md:text-2xl lg:text-3xl font-bold ${textClass} truncate`}>
                  ${stats.count > 0 ? (stats.total / stats.count).toFixed(2) : '0.00'}
                </p>
              </div>
              <div className="bg-purple-100 p-2 md:p-3 rounded-full transition-transform hover:scale-110">
                <TrendingDown className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className={`${cardClass} rounded-2xl shadow-lg p-4 md:p-6 border-l-4 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer ${
            monthlyBudget > 0 && stats.budgetRemaining < 0 ? 'border-red-500' : 'border-indigo-500'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className={`${textSecondaryClass} text-xs md:text-sm font-medium mb-1`}>
                  {monthlyBudget > 0 ? 'Budget Left' : 'Set Budget'}
                </p>
                <p className={`text-xl md:text-2xl lg:text-3xl font-bold ${textClass} truncate`}>
                  {monthlyBudget > 0 ? `$${Math.max(0, stats.budgetRemaining).toFixed(2)}` : '--'}
                </p>
              </div>
              <button
                onClick={() => setShowBudgetInput(!showBudgetInput)}
                className="bg-indigo-100 p-2 md:p-3 rounded-full hover:bg-indigo-200 transition-all hover:scale-110"
              >
                <Calendar className="w-5 h-5 md:w-6 md:h-6 text-indigo-600" />
              </button>
            </div>
            {monthlyBudget > 0 && (
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      stats.budgetPercentage >= 100 ? 'bg-gradient-to-r from-red-500 to-red-600' :
                      stats.budgetPercentage >= 80 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' : 'bg-gradient-to-r from-green-500 to-green-600'
                    }`}
                    style={{ width: `${Math.min(100, stats.budgetPercentage)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Budget Input */}
        {showBudgetInput && (
          <div className={`${cardClass} rounded-2xl shadow-lg p-4 md:p-6 mb-6 transition-all duration-300 transform hover:shadow-xl`}>
            <h3 className={`text-base md:text-lg font-bold ${textClass} mb-4`}>💳 Set Monthly Budget</h3>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <span className={`absolute left-4 top-3 md:top-3.5 ${textSecondaryClass} text-sm md:text-base`}>$</span>
                <input
                  type="number"
                  step="0.01"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="Enter monthly budget"
                  className={`w-full pl-7 md:pl-8 pr-4 py-2 md:py-3 border rounded-xl focus:ring-2 focus:border-transparent outline-none transition text-sm md:text-base ${inputClass}`}
                  onKeyPress={(e) => e.key === 'Enter' && saveBudget()}
                />
              </div>
              <button
                onClick={saveBudget}
                className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 text-sm md:text-base"
              >
                Save
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Add Expense Form */}
          <div className="lg:col-span-1">
            <div className={`${cardClass} rounded-2xl shadow-lg p-4 md:p-6 transition-all duration-300 hover:shadow-xl`}>
              <h2 className={`text-lg md:text-xl font-bold ${textClass} mb-4 md:mb-6`}>➕ Add Expense</h2>
              <div className="space-y-3 md:space-y-4">
                <div>
                  <label className={`block text-xs md:text-sm font-medium ${textSecondaryClass} mb-2`}>
                    Description
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Coffee, Taxi, etc."
                    className={`w-full px-3 md:px-4 py-2 md:py-3 border rounded-xl focus:ring-2 focus:border-transparent outline-none transition text-sm md:text-base ${inputClass}`}
                    onKeyPress={(e) => e.key === 'Enter' && addExpense()}
                  />
                </div>

                <div>
                  <label className={`block text-xs md:text-sm font-medium ${textSecondaryClass} mb-2`}>
                    Amount
                  </label>
                  <div className="relative">
                    <span className={`absolute left-3 md:left-4 top-2.5 md:top-3.5 ${textSecondaryClass} text-sm md:text-base`}>$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className={`w-full pl-7 md:pl-8 pr-3 md:pr-4 py-2 md:py-3 border rounded-xl focus:ring-2 focus:border-transparent outline-none transition text-sm md:text-base ${inputClass}`}
                      onKeyPress={(e) => e.key === 'Enter' && addExpense()}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-xs md:text-sm font-medium ${textSecondaryClass} mb-2`}>
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={`w-full px-3 md:px-4 py-2 md:py-3 border rounded-xl focus:ring-2 focus:border-transparent outline-none transition text-sm md:text-base ${inputClass}`}
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.icon} {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`block text-xs md:text-sm font-medium ${textSecondaryClass} mb-2`}>
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className={`w-full px-3 md:px-4 py-2 md:py-3 border rounded-xl focus:ring-2 focus:border-transparent outline-none transition text-sm md:text-base ${inputClass}`}
                  />
                </div>

                <div className="flex items-center gap-2 md:gap-3">
                  <input
                    type="checkbox"
                    id="recurring"
                    checked={isRecurring}
                    onChange={(e) => setIsRecurring(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor="recurring" className={`text-xs md:text-sm font-medium ${textSecondaryClass} cursor-pointer`}>
                    Recurring expense
                  </label>
                </div>

                {isRecurring && (
                  <div className="animate-fadeIn">
                    <label className={`block text-xs md:text-sm font-medium ${textSecondaryClass} mb-2`}>
                      Frequency
                    </label>
                    <select
                      value={recurringFrequency}
                      onChange={(e) => setRecurringFrequency(e.target.value)}
                      className={`w-full px-3 md:px-4 py-2 md:py-3 border rounded-xl focus:ring-2 focus:border-transparent outline-none transition text-sm md:text-base ${inputClass}`}
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                )}

                <button
                  onClick={addExpense}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 md:py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm md:text-base"
                >
                  <PlusCircle className="w-4 h-4 md:w-5 md:h-5" />
                  Add Expense
                </button>
              </div>
            </div>

            {/* Category Breakdown */}
            {Object.keys(stats.byCategory).length > 0 && (
              <div className={`${cardClass} rounded-2xl shadow-lg p-4 md:p-6 mt-4 md:mt-6 transition-all duration-300 hover:shadow-xl`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-base md:text-lg font-bold ${textClass}`}>📊 Category Breakdown</h3>
                  <PieChart className={`w-4 h-4 md:w-5 md:h-5 ${textSecondaryClass}`} />
                </div>
                <div className="space-y-3">
                  {Object.entries(stats.byCategory)
                    .sort((a, b) => b[1] - a[1])
                    .map(([cat, amt]) => {
                      const catInfo = getCategoryInfo(cat);
                      const percentage = (amt / stats.total) * 100;
                      return (
                        <div key={cat} className="transition-transform hover:scale-102">
                          <div className="flex justify-between items-center mb-1">
                            <span className={`text-xs md:text-sm font-medium ${textSecondaryClass} flex items-center gap-2`}>
                              <span className="text-base md:text-lg">{catInfo.icon}</span>
                              <span className="hidden sm:inline">{catInfo.label}</span>
                            </span>
                            <div className="text-right">
                              <span className={`text-xs md:text-sm font-bold ${textClass}`}>${amt.toFixed(2)}</span>
                              <span className={`text-xs ${textSecondaryClass} ml-2`}>{percentage.toFixed(0)}%</span>
                            </div>
                          </div>
                          <div className={`w-full ${darkMode ? 'bg-gray-700' : 'bg-slate-200'} rounded-full h-2 overflow-hidden`}>
                            <div
                              className={`${catInfo.color} h-2 rounded-full transition-all duration-500 hover:opacity-80`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>

          {/* Expenses List */}
          <div className="lg:col-span-2">
            <div className={`${cardClass} rounded-2xl shadow-lg p-4 md:p-6 transition-all duration-300 hover:shadow-xl`}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 md:mb-6 gap-3">
                <h2 className={`text-lg md:text-xl font-bold ${textClass}`}>📝 Expenses</h2>
                <div className="flex items-center gap-2 flex-wrap">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className={`px-3 py-2 rounded-lg text-xs md:text-sm transition-colors ${
                      darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <option value="date">Latest First</option>
                    <option value="amount-high">Highest Amount</option>
                    <option value="amount-low">Lowest Amount</option>
                  </select>
                  
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 text-xs md:text-sm ${
                      darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <Filter className="w-3 h-3 md:w-4 md:h-4" />
                    Filters
                  </button>

                  {expenses.length > 0 && (
                    <button
                      onClick={clearAllExpenses}
                      className="px-3 md:px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300 transform hover:scale-105 text-xs md:text-sm"
                    >
                      Clear All
                    </button>
                  )}
                </div>
              </div>

              {/* Search */}
              <div className="mb-4">
                <div className="relative">
                  <Search className={`absolute left-3 md:left-4 top-2.5 md:top-3.5 w-4 h-4 md:w-5 md:h-5 ${textSecondaryClass}`} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search expenses..."
                    className={`w-full pl-10 md:pl-12 pr-3 md:pr-4 py-2 md:py-3 border rounded-xl focus:ring-2 focus:border-transparent outline-none transition text-sm md:text-base ${inputClass}`}
                  />
                </div>
              </div>

              {/* Filters */}
              {showFilters && (
                <div className={`mb-4 md:mb-6 p-3 md:p-4 rounded-xl transition-all duration-300 ${darkMode ? 'bg-gray-700' : 'bg-slate-50'}`}>
                  <div className="mb-4">
                    <p className={`text-xs md:text-sm font-semibold ${textSecondaryClass} mb-2`}>⏰ Time Period</p>
                    <div className="flex flex-wrap gap-2">
                      {['all', 'today', 'week', 'month', 'year'].map(period => (
                        <button
                          key={period}
                          onClick={() => setTimeFilter(period)}
                          className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg font-medium transition-all duration-300 capitalize text-xs md:text-sm transform hover:scale-105 ${
                            timeFilter === period
                              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                              : darkMode 
                                ? 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                                : 'bg-white text-slate-700 hover:bg-slate-100 hover:shadow-md'
                          }`}
                        >
                          {period}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className={`text-xs md:text-sm font-semibold ${textSecondaryClass} mb-2`}>🏷️ Category</p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setFilterCategory('all')}
                        className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg font-medium transition-all duration-300 text-xs md:text-sm transform hover:scale-105 ${
                          filterCategory === 'all'
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                            : darkMode
                              ? 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                              : 'bg-white text-slate-700 hover:bg-slate-100 hover:shadow-md'
                        }`}
                      >
                        All
                      </button>
                      {categories.map(cat => (
                        <button
                          key={cat.value}
                          onClick={() => setFilterCategory(cat.value)}
                          className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg font-medium transition-all duration-300 text-xs md:text-sm transform hover:scale-105 ${
                            filterCategory === cat.value
                              ? `${cat.color} text-white shadow-lg`
                              : darkMode
                                ? 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                                : 'bg-white text-slate-700 hover:bg-slate-100 hover:shadow-md'
                          }`}
                        >
                          {cat.icon} <span className="hidden sm:inline">{cat.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3 max-h-[500px] md:max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredExpenses.length === 0 ? (
                  <div className="text-center py-8 md:py-12">
                    <div className={`${darkMode ? 'bg-gray-700' : 'bg-slate-100'} rounded-full w-12 h-12 md:w-16 md:h-16 flex items-center justify-center mx-auto mb-4 transition-all hover:scale-110`}>
                      <DollarSign className={`w-6 h-6 md:w-8 md:h-8 ${textSecondaryClass}`} />
                    </div>
                    <p className={`${textSecondaryClass} font-medium text-sm md:text-base`}>No expenses found</p>
                    <p className={`${textSecondaryClass} text-xs md:text-sm mt-1`}>
                      {searchTerm || filterCategory !== 'all' || timeFilter !== 'all'
                        ? 'Try adjusting your filters'
                        : 'Add your first expense to get started'}
                    </p>
                  </div>
                ) : (
                  filteredExpenses.map((expense) => {
                    const catInfo = getCategoryInfo(expense.category);
                    const isEditing = editingId === expense.id;
                    
                    return (
                      <div
                        key={expense.id}
                        className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 md:p-4 rounded-xl transition-all duration-300 group ${
                          darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-slate-50 hover:bg-slate-100'
                        } hover:shadow-lg transform hover:scale-[1.02]`}
                      >
                        {isEditing ? (
                          <div className="flex-1 space-y-2">
                            <input
                              type="text"
                              value={editForm.description}
                              onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                              className={`w-full px-3 py-2 border rounded-lg text-sm ${inputClass}`}
                            />
                            <div className="flex gap-2">
                              <input
                                type="number"
                                step="0.01"
                                value={editForm.amount}
                                onChange={(e) => setEditForm({...editForm, amount: e.target.value})}
                                className={`w-1/3 px-3 py-2 border rounded-lg text-sm ${inputClass}`}
                              />
                              <select
                                value={editForm.category}
                                onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                                className={`flex-1 px-3 py-2 border rounded-lg text-sm ${inputClass}`}
                              >
                                {categories.map(cat => (
                                  <option key={cat.value} value={cat.value}>{cat.icon} {cat.label}</option>
                                ))}
                              </select>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={saveEdit}
                                className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all text-sm"
                              >
                                <Check className="w-4 h-4" /> Save
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="flex items-center gap-1 px-3 py-1.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all text-sm"
                              >
                                <X className="w-4 h-4" /> Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0 mb-2 sm:mb-0">
                              <div className={`${catInfo.color} p-2 md:p-3 rounded-lg text-lg md:text-2xl transition-transform group-hover:scale-110`}>
                                {catInfo.icon}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <p className={`font-semibold ${textClass} truncate text-sm md:text-base`}>{expense.description}</p>
                                  {expense.isRecurring && (
                                    <span className="flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full whitespace-nowrap">
                                      <RefreshCw className="w-3 h-3" />
                                      {expense.recurringFrequency}
                                    </span>
                                  )}
                                </div>
                                <div className="flex flex-wrap items-center gap-2 mt-1 text-xs">
                                  <span className={`flex items-center gap-1 ${textSecondaryClass}`}>
                                    <Tag className="w-3 h-3" />
                                    <span className="hidden sm:inline">{catInfo.label}</span>
                                  </span>
                                  <span className={`flex items-center gap-1 ${textSecondaryClass}`}>
                                    <Calendar className="w-3 h-3" />
                                    {new Date(expense.date).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 md:gap-3 justify-between sm:justify-end">
                              <p className={`text-base md:text-lg font-bold ${textClass} whitespace-nowrap`}>
                                ${expense.amount.toFixed(2)}
                              </p>
                              <div className="flex gap-1 md:gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => startEdit(expense)}
                                  className="p-1.5 md:p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all hover:scale-110"
                                  aria-label="Edit expense"
                                >
                                  <Edit2 className="w-4 h-4 md:w-5 md:h-5" />
                                </button>
                                <button
                                  onClick={() => deleteExpense(expense.id)}
                                  className="p-1.5 md:p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all hover:scale-110"
                                  aria-label="Delete expense"
                                >
                                  <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ExpenseTracker;