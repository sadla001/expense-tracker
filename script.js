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
});

function updateUI() {
  list.innerHTML = '';
  let total = 0;

  transactions.forEach((t) => {
    const sign = t.amount > 0 ? '+' : '-';
    const li = document.createElement('li');
    li.textContent = `${t.description}: ${sign}$${Math.abs(t.amount)}`;
    list.appendChild(li);
    total += t.amount;
  });

  balance.textContent = total.toFixed(2);
}