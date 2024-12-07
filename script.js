// Select DOM elements
const expenseForm = document.getElementById('expense-form');
const expenseTableBody = document.querySelector('#expense-table tbody');
const totalAmount = document.getElementById('total-amount');
const sortButton = document.getElementById('sort-by-date');
const filterForm = document.getElementById('filter-form');
const filterStartDate = document.getElementById('filter-start-date');
const filterEndDate = document.getElementById('filter-end-date');
const categorySummary = document.getElementById('category-summary');

let expenses = [];
let editIndex = null;
let sortAscending = true; // to toggle between ascending/descending sort

// Event Listener for Add Expense Button
expenseForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const expenseName = document.getElementById('expense-name').value;
  const expenseAmount = parseFloat(document.getElementById('expense-amount').value);
  const expenseDate = document.getElementById('expense-date').value;
  const expenseCategory = document.getElementById('expense-category').value;

  const newExpense = {
    name: expenseName,
    amount: expenseAmount,
    date: expenseDate,
    category: expenseCategory,
  };

  if (editIndex !== null) {
    expenses[editIndex] = newExpense; // Update expense if editing
    editIndex = null; // Reset the edit index
  } else {
    expenses.push(newExpense); // Add new expense
  }

  displayExpenses();
  clearForm();
});

// Display Expenses in the Table
function displayExpenses() {
  expenseTableBody.innerHTML = ''; // Clear table before re-rendering

  expenses.forEach((expense, index) => {
    const expenseRow = document.createElement('tr');
    expenseRow.innerHTML = `
      <td>${expense.name}</td>
      <td>${expense.amount.toFixed(2)}</td>
      <td>${expense.date}</td>
      <td>${expense.category}</td>
      <td class="action-buttons">
        <button onclick="editExpense(${index})">Edit</button>
        <button onclick="deleteExpense(${index})">Delete</button>
      </td>
    `;
    expenseTableBody.appendChild(expenseRow);
  });

  updateTotal();
  updateCategorySummary();
}

// Edit Expense
function editExpense(index) {
  const expense = expenses[index];
  document.getElementById('expense-name').value = expense.name;
  document.getElementById('expense-amount').value = expense.amount;
  document.getElementById('expense-date').value = expense.date;
  document.getElementById('expense-category').value = expense.category;
  editIndex = index; // Set editIndex to the selected expense's index
}

// Delete Expense
function deleteExpense(index) {
  expenses.splice(index, 1); // Remove the selected expense
  displayExpenses();
}

// Clear Form
function clearForm() {
  document.getElementById('expense-name').value = '';
  document.getElementById('expense-amount').value = '';
  document.getElementById('expense-date').value = '';
  document.getElementById('expense-category').value = '';
}

// Update Total Expenses
function updateTotal() {
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  totalAmount.textContent = total.toFixed(2);
}

// Sort by Date Functionality
sortButton.addEventListener('click', () => {
  expenses.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return sortAscending ? dateA - dateB : dateB - dateA;
  });

  sortAscending = !sortAscending; // Toggle the sorting order
  displayExpenses();
});

// Filter by Date Range
filterForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const startDate = new Date(filterStartDate.value);
  const endDate = new Date(filterEndDate.value);

  const filteredExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    return expenseDate >= startDate && expenseDate <= endDate;
  });

  displayFilteredExpenses(filteredExpenses);
});

// Display Filtered Expenses
function displayFilteredExpenses(filteredExpenses) {
  expenseTableBody.innerHTML = ''; // Clear table before re-rendering

  filteredExpenses.forEach((expense, index) => {
    const expenseRow = document.createElement('tr');
    expenseRow.innerHTML = `
      <td>${expense.name}</td>
      <td>${expense.amount.toFixed(2)}</td>
      <td>${expense.date}</td>
      <td>${expense.category}</td>
      <td class="action-buttons">
        <button onclick="editExpense(${index})">Edit</button>
        <button onclick="deleteExpense(${index})">Delete</button>
      </td>
    `;
    expenseTableBody.appendChild(expenseRow);
  });

  updateTotal();
}

// Update Category Summary
function updateCategorySummary() {
  const categoryTotals = {};

  expenses.forEach((expense) => {
    if (!categoryTotals[expense.category]) {
      categoryTotals[expense.category] = 0;
    }
    categoryTotals[expense.category] += expense.amount;
  });

  categorySummary.innerHTML = ''; // Clear existing summary

  for (const category in categoryTotals) {
    const summaryItem = document.createElement('p');
    summaryItem.textContent = `${category}: ${categoryTotals[category].toFixed(2)}`;
    categorySummary.appendChild(summaryItem);
  }
}

