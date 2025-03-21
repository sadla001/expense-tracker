// script.js
let transactions = [];
let selectedType = 'income'; // default

const form = document.getElementById('transaction-form');
const list = document.getElementById('transaction-list');
const balance = document.getElementById('balance');
const typeButtons = document.querySelectorAll('.type-btn');
const addTransactionBtn = document.getElementById('add-transaction-btn');

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

  transactions.forEach((t) => {
    // 1. Create the li element
    const li = document.createElement('li');
    li.classList.add('transaction');
    
    // 2. Add the correct class based on type
    if (t.amount >= 0) {
      li.classList.add('income');
    } else {
      li.classList.add('expense');
    }
    
    // 3. Create the description span
    const descSpan = document.createElement('span');
    descSpan.classList.add('description');
    descSpan.textContent = t.description;
    
    // 4. Create the amount span
    const amountSpan = document.createElement('span');
    amountSpan.classList.add('amount');
    amountSpan.textContent = t.amount >= 0 ? `+$${t.amount}` : `-$${Math.abs(t.amount)}`;

    // *** Delete button ***
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-btn');
    deleteBtn.textContent = 'X';  // Or use an icon if you like
  
    // When clicked, remove the transaction from the array
    deleteBtn.addEventListener('click', () => {
        deleteTransaction(t.id);
    });
    
    // 5. Append spans to li
    li.appendChild(descSpan);
    li.appendChild(amountSpan);
    li.appendChild(deleteBtn);
    
    // 6. Finally, append li to the ul
    list.appendChild(li);
    total += t.amount;
  });

  function deleteTransaction(id) {
  // Filter out the transaction with matching id
  transactions = transactions.filter((item) => item.id !== id);

  // Re-render the UI
  updateUI();
}

  balance.textContent = total.toFixed(2);
}