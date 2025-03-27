// script.js
let transactions = [];
let selectedType = 'income'; // default

const form = document.getElementById('transaction-form');
const list = document.getElementById('transaction-list');
const balance = document.getElementById('balance');
const typeButtons = document.querySelectorAll('.type-btn');
const addTransactionBtn = document.getElementById('add-transaction-btn');

document.addEventListener('DOMContentLoaded', () => {
  // Load stored transactions
  loadTransactions();
  
  // Determine the current page using the URL path
  const path = window.location.pathname; // e.g., "/expenses.html", "/income.html", etc.
  
  // Call the appropriate update function
  if (path.includes('expenses.html')) {
    updateExpensesUI();
  } else if (path.includes('income.html')) {
    updateIncomeUI();
  } else {
    // Default: show all transactions (Dashboard)
    updateUI();
  }
});

typeButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    typeButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedType = btn.dataset.type;
    addTransactionBtn.textContent = selectedType === 'income' ? 'Add Income' : 'Add Expense';
  });
});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const description = document.getElementById('description').value;
  const amountInput = parseFloat(document.getElementById('amount').value);

  if (isNaN(amountInput)) return;

  const amount = selectedType === 'expense' ? -Math.abs(amountInput) : Math.abs(amountInput);

  const transaction = {
    id: Date.now(),
    description,
    amount
  };

  transactions.push(transaction);
  updateUI();
  form.reset();
  selectedType = 'income'; // reset type
  typeButtons.forEach(b => b.classList.remove('active'));
  typeButtons[0].classList.add('active');
  addTransactionBtn.textContent = selectedType === 'income' ? 'Add Income' : 'Add Expense';
});

function loadTransactions() {
  const stored = localStorage.getItem('transactions');
  if (stored) {
    transactions = JSON.parse(stored);
  }
}

function saveTransactions() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

function deleteTransaction(id) {
    // Filter out the transaction with matching id
    transactions = transactions.filter((item) => item.id !== id);
  
    // Re-render the UI
    updateUI();
  }

  function updateUI() {
    // Clear the existing list items
    list.innerHTML = '';
    let total = 0;
  
    // Loop through all transactions (for Dashboard, or filter later on other pages)
    transactions.forEach((t) => {
      // Create the li element
      const li = document.createElement('li');
      li.classList.add('transaction');
      
      // Add correct class based on type
      if (t.amount >= 0) {
        li.classList.add('income');
      } else {
        li.classList.add('expense');
      }
      
      // Create the description span
      const descSpan = document.createElement('span');
      descSpan.classList.add('description');
      descSpan.textContent = t.description;
      
      // Create the amount span
      const amountSpan = document.createElement('span');
      amountSpan.classList.add('amount');
      amountSpan.textContent = t.amount >= 0 ? `+$${t.amount}` : `-$${Math.abs(t.amount)}`;
  
      // Delete button
      const deleteBtn = document.createElement('button');
      deleteBtn.classList.add('delete-btn');
      deleteBtn.textContent = 'X';
      deleteBtn.addEventListener('click', () => {
        deleteTransaction(t.id);
      });
      
      // Append elements to li
      li.appendChild(descSpan);
      li.appendChild(amountSpan);
      li.appendChild(deleteBtn);
      
      // Append li to the list
      list.appendChild(li);
      
      total += t.amount;
    });
  
    // Update balance display
    balance.textContent = total.toFixed(2);
    
    // Save transactions to local storage after updating the UI
    saveTransactions();
  }
  function updateExpensesUI() {
    list.innerHTML = '';
    let totalExpense = 0;
  
    // Filter transactions for expenses (negative amounts)
    const expenseTransactions = transactions.filter(t => t.amount < 0);
  
    expenseTransactions.forEach((t) => {
      const li = document.createElement('li');
      li.classList.add('transaction', 'expense');
      
      const descSpan = document.createElement('span');
      descSpan.classList.add('description');
      descSpan.textContent = t.description;
      
      const amountSpan = document.createElement('span');
      amountSpan.classList.add('amount');
      amountSpan.textContent = `-$${Math.abs(t.amount)}`;
      
      const deleteBtn = document.createElement('button');
      deleteBtn.classList.add('delete-btn');
      deleteBtn.textContent = 'X';
      deleteBtn.addEventListener('click', () => {
        deleteTransaction(t.id);
      });
      
      li.appendChild(descSpan);
      li.appendChild(amountSpan);
      li.appendChild(deleteBtn);
      list.appendChild(li);
      
      totalExpense += t.amount;
    });
    
    // Display total expense (as a positive number)
    balance.textContent = Math.abs(totalExpense).toFixed(2);
    saveTransactions();
  }
  function updateIncomeUI() {
    list.innerHTML = '';
    let totalIncome = 0;
  
    // Filter transactions for incomes (positive amounts)
    const incomeTransactions = transactions.filter(t => t.amount > 0);
  
    incomeTransactions.forEach((t) => {
      const li = document.createElement('li');
      li.classList.add('transaction', 'income');
      
      const descSpan = document.createElement('span');
      descSpan.classList.add('description');
      descSpan.textContent = t.description;
      
      const amountSpan = document.createElement('span');
      amountSpan.classList.add('amount');
      amountSpan.textContent = `+$${t.amount}`;
      
      const deleteBtn = document.createElement('button');
      deleteBtn.classList.add('delete-btn');
      deleteBtn.textContent = 'X';
      deleteBtn.addEventListener('click', () => {
        deleteTransaction(t.id);
      });
      
      li.appendChild(descSpan);
      li.appendChild(amountSpan);
      li.appendChild(deleteBtn);
      list.appendChild(li);
      
      totalIncome += t.amount;
    });
    
    balance.textContent = totalIncome.toFixed(2);
    saveTransactions();
  }