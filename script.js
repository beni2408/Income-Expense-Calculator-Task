const form = document.getElementById("entry-form");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const entriesList = document.getElementById("entries-list");
const totalIncomeEl = document.getElementById("total-income");
const totalExpenseEl = document.getElementById("total-expense");
const netBalanceEl = document.getElementById("net-balance");
const filterRadios = document.querySelectorAll("input[name='filter']");

let entries = JSON.parse(localStorage.getItem("entries")) || [];
let editId = null;

// Save to local storage
function saveEntries() {
  localStorage.setItem("entries", JSON.stringify(entries));
}

// Render Entries
function renderEntries(filter = "all") {
  entriesList.innerHTML = "";

  let filteredEntries = entries;
  if (filter !== "all") {
    filteredEntries = entries.filter((e) => e.type === filter);
  }

  filteredEntries.forEach((entry, index) => {
    const li = document.createElement("li");
    li.classList.add("entry");
    li.innerHTML = `
      <span>${entry.description}</span>
      <span>${entry.amount}</span>
      <span>${entry.type}</span>
      <div class="actions">
        <button class="edit-btn" onclick="editEntry(${index})">Edit</button>
        <button class="delete-btn" onclick="deleteEntry(${index})">Delete</button>
      </div>
    `;
    entriesList.appendChild(li);
  });

  calculateTotals();
}

// Calculate totals
function calculateTotals() {
  const income = entries
    .filter((e) => e.type === "income")
    .reduce((sum, e) => sum + e.amount, 0);
  const expense = entries
    .filter((e) => e.type === "expense")
    .reduce((sum, e) => sum + e.amount, 0);
  const balance = income - expense;

  totalIncomeEl.textContent = income;
  totalExpenseEl.textContent = expense;
  netBalanceEl.textContent = balance;
}

// Add or Update Entry
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const description = descriptionInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const type = typeInput.value;

  if (!description || isNaN(amount)) return;

  if (editId !== null) {
    entries[editId] = { description, amount, type };
    editId = null;
  } else {
    entries.push({ description, amount, type });
  }

  saveEntries();
  renderEntries();
  form.reset();
});

// Edit Entry
function editEntry(index) {
  const entry = entries[index];
  descriptionInput.value = entry.description;
  amountInput.value = entry.amount;
  typeInput.value = entry.type;
  editId = index;
}

// Delete Entry
function deleteEntry(index) {
  entries.splice(index, 1);
  saveEntries();
  renderEntries();
}

// Filter Entries
filterRadios.forEach((radio) => {
  radio.addEventListener("change", (e) => {
    renderEntries(e.target.value);
  });
});

// Initial Render
renderEntries();
