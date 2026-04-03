const form = document.getElementById("transaction-form");
const list = document.getElementById("transaction-list");
const balance = document.getElementById("balance");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

let chart;

// Add transaction
form.addEventListener("submit", function(e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const amount = document.getElementById("amount").value;
  const category = document.getElementById("category").value;

  if (name === "" || amount === "" || category === "") {
    alert("Please fill all fields!");
    return;
  }

  const transaction = {
    id: Date.now(),
    name,
    amount: Number(amount),
    category
  };

  transactions.push(transaction);
  saveData();
  updateUI();

  form.reset();
});

// Save to localStorage
function saveData() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Delete transaction
function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  saveData();
  updateUI();
}

// Update UI
function updateUI() {
  list.innerHTML = "";

  let total = 0;

  transactions.forEach(t => {
    total += t.amount;

    const li = document.createElement("li");
    li.innerHTML = `
      ${t.name} - $${t.amount} (${t.category})
      <button class="delete-btn" onclick="deleteTransaction(${t.id})">Delete</button>
    `;
    list.appendChild(li);
  });

  balance.textContent = `$${total}`;
  updateChart();
}

// Chart
function updateChart() {
  const categories = {
    Food: 0,
    Transport: 0,
    Fun: 0
  };

  transactions.forEach(t => {
    categories[t.category] += t.amount;
  });

  const data = {
    labels: ["Food", "Transport", "Fun"],
    datasets: [{
      data: [categories.Food, categories.Transport, categories.Fun]
    }]
  };

  if (chart) {
    chart.destroy();
  }

  const ctx = document.getElementById("chart").getContext("2d");
  chart = new Chart(ctx, {
    type: "pie",
    data: data
  });
}

// Load on start
updateUI();