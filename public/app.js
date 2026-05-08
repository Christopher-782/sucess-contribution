/**
 * SUCCESS CONTRIBUTION - PREMIUM MOBILE-FIRST SPA
 * Real Login System + Premium Mobile UI
 */

const API_BASE = ""; // Change to your backend URL if different

let state = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  customers: [],
  currentPage: "login",
  isLoading: false,
};

// --- AUTH API ---
async function apiLogin(username, password) {
  try {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (res.ok && data.token) {
      state.token = data.token;
      state.user = data.user;
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      return { success: true };
    }
    return { success: false, message: data.message || "Invalid credentials" };
  } catch (e) {
    return { success: false, message: "Network error. Please try again." };
  }
}

async function apiRegister(username, password, name) {
  try {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, name }),
    });
    const data = await res.json();
    if (res.ok) {
      return { success: true, message: "Account created! Please sign in." };
    }
    return { success: false, message: data.message || "Registration failed" };
  } catch (e) {
    return { success: false, message: "Network error. Please try again." };
  }
}

// --- ROUTER ---
const router = {
  routes: {
    login: renderLogin,
    dashboard: renderDashboard,
    customers: renderCustomers,
  },
  navigate(page) {
    state.currentPage = page;
    const app = document.getElementById("app");
    const mobileNav = document.getElementById("mobile-nav");

    if (page === "login") {
      mobileNav.classList.add("hidden");
    } else {
      mobileNav.classList.remove("hidden");
      updateMobileNav(page);
    }

    if (page !== "login" && !state.token) {
      this.navigate("login");
      return;
    }

    app.innerHTML = "";
    app.classList.remove("animate-fade-in");
    void app.offsetWidth; // trigger reflow
    app.classList.add("animate-fade-in");
    this.routes[page](app);

    if (page === "dashboard" || page === "customers") {
      fetchCustomers();
    }
  },
};

function updateMobileNav(page) {
  const dashBtn = document.getElementById("mob-dash");
  const custBtn = document.getElementById("mob-cust");
  const dashIcon = document.getElementById("mob-dash-icon");
  const custIcon = document.getElementById("mob-cust-icon");

  if (page === "dashboard") {
    dashBtn.className =
      "flex flex-col items-center py-1 px-4 rounded-xl transition-all nav-link text-blue-600";
    dashIcon.className =
      "w-10 h-10 rounded-xl flex items-center justify-center transition-all bg-blue-50 text-blue-600";
    custBtn.className =
      "flex flex-col items-center py-1 px-4 rounded-xl transition-all nav-link text-slate-400";
    custIcon.className =
      "w-10 h-10 rounded-xl flex items-center justify-center transition-all";
  } else if (page === "customers") {
    dashBtn.className =
      "flex flex-col items-center py-1 px-4 rounded-xl transition-all nav-link text-slate-400";
    dashIcon.className =
      "w-10 h-10 rounded-xl flex items-center justify-center transition-all";
    custBtn.className =
      "flex flex-col items-center py-1 px-4 rounded-xl transition-all nav-link text-blue-600";
    custIcon.className =
      "w-10 h-10 rounded-xl flex items-center justify-center transition-all bg-blue-50 text-blue-600";
  }
}

// --- VIEWS ---

function renderLogin(container) {
  container.innerHTML = `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-6 relative overflow-hidden">
      <!-- Background decoration -->
      <div class="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div class="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

      <div class="w-full max-w-sm relative z-10">
        <!-- Logo -->
        <div class="text-center mb-8">
          <div class="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl mx-auto flex items-center justify-center text-white text-3xl shadow-2xl shadow-blue-500/30 mb-6 animate-scale-in">
            <i class="fas fa-shield-halved"></i>
          </div>
          <h1 class="text-3xl font-extrabold text-white mb-2 tracking-tight">Success Contr.</h1>
          <p class="text-slate-400 text-sm">Premium Finance Management</p>
        </div>

        <!-- Login Card -->
        <div class="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl space-y-5">
          <div id="loginForm">
            <div class="space-y-4">
              <div class="relative">
                <i class="fas fa-user absolute left-4 top-3.5 text-slate-400 text-sm"></i>
                <input type="text" id="loginUser" placeholder="Username" 
                  class="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 pl-11 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition">
              </div>
              <div class="relative">
                <i class="fas fa-lock absolute left-4 top-3.5 text-slate-400 text-sm"></i>
                <input type="password" id="loginPass" placeholder="Password" 
                  class="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 pl-11 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition">
              </div>
            </div>
            <button onclick="handleLogin()" id="loginBtn"
              class="w-full mt-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3.5 rounded-xl font-bold hover:from-blue-500 hover:to-blue-600 transition shadow-lg shadow-blue-500/25 btn-press flex items-center justify-center gap-2">
              <span>Sign In</span>
              <i class="fas fa-arrow-right text-sm"></i>
            </button>

            <div class="mt-6 text-center">
              <p class="text-slate-500 text-sm">Don't have an account? 
                <button onclick="toggleAuthMode()" class="text-blue-400 hover:text-blue-300 font-semibold transition">Create one</button>
              </p>
            </div>
          </div>

          <div id="registerForm" class="hidden">
            <div class="space-y-4">
              <div class="relative">
                <i class="fas fa-user absolute left-4 top-3.5 text-slate-400 text-sm"></i>
                <input type="text" id="regName" placeholder="Full Name" 
                  class="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 pl-11 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition">
              </div>
              <div class="relative">
                <i class="fas fa-at absolute left-4 top-3.5 text-slate-400 text-sm"></i>
                <input type="text" id="regUser" placeholder="Username" 
                  class="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 pl-11 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition">
              </div>
              <div class="relative">
                <i class="fas fa-lock absolute left-4 top-3.5 text-slate-400 text-sm"></i>
                <input type="password" id="regPass" placeholder="Password" 
                  class="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 pl-11 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition">
              </div>
            </div>
            <button onclick="handleRegister()" id="regBtn"
              class="w-full mt-6 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-3.5 rounded-xl font-bold hover:from-emerald-500 hover:to-emerald-600 transition shadow-lg shadow-emerald-500/25 btn-press flex items-center justify-center gap-2">
              <span>Create Account</span>
              <i class="fas fa-user-plus text-sm"></i>
            </button>

            <div class="mt-6 text-center">
              <p class="text-slate-500 text-sm">Already have an account? 
                <button onclick="toggleAuthMode()" class="text-blue-400 hover:text-blue-300 font-semibold transition">Sign in</button>
              </p>
            </div>
          </div>
        </div>

        <p class="text-center text-slate-600 text-xs mt-8">© 2026 Success Contribution. All rights reserved.</p>
      </div>
    </div>`;
}

function renderDashboard(container) {
  const user = state.user || { name: "Admin" };
  container.innerHTML = `
    <div class="flex flex-col md:flex-row min-h-screen">
      <!-- Desktop Sidebar -->
      <aside class="w-full md:w-72 sidebar-gradient text-slate-300 hidden md:flex flex-col p-6">
        <div class="flex items-center gap-3 mb-10">
          <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center text-white shadow-lg">
            <i class="fas fa-shield-halved text-sm"></i>
          </div>
          <div class="text-xl font-bold text-white">Success<span class="text-blue-400">Contr.</span></div>
        </div>

        <nav class="space-y-1 flex-1">
          <button onclick="router.navigate('dashboard')" class="w-full flex items-center gap-3 py-3 px-4 rounded-xl bg-blue-600 text-white font-medium transition-all">
            <i class="fas fa-th-large w-5"></i> Dashboard
          </button>
          <button onclick="router.navigate('customers')" class="w-full flex items-center gap-3 py-3 px-4 rounded-xl hover:bg-slate-800/50 text-slate-400 hover:text-white transition-all">
            <i class="fas fa-users w-5"></i> Customers
          </button>
          <button onclick="exportToCSV()" class="w-full flex items-center gap-3 py-3 px-4 rounded-xl hover:bg-slate-800/50 text-slate-400 hover:text-white transition-all">
            <i class="fas fa-download w-5"></i> Export CSV
          </button>
        </nav>

        <div class="mt-auto pt-6 border-t border-slate-700/50">
          <div class="flex items-center gap-3 px-2">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
              ${user.name ? user.name.charAt(0).toUpperCase() : "A"}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-white truncate">${user.name || "Admin"}</p>
              <p class="text-xs text-slate-500">${user.role || "Administrator"}</p>
            </div>
            <button onclick="logout()" class="w-8 h-8 rounded-lg hover:bg-slate-800 flex items-center justify-center text-slate-400 transition">
              <i class="fas fa-sign-out-alt text-sm"></i>
            </button>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 p-4 md:p-8 pb-28 md:pb-8">
        <!-- Mobile Header -->
        <div class="md:hidden flex items-center justify-between mb-6">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center text-white shadow-lg">
              <i class="fas fa-shield-halved text-sm"></i>
            </div>
            <div>
              <h1 class="text-lg font-bold text-slate-800">Success<span class="text-blue-600">Contr.</span></h1>
            </div>
          </div>
          <div class="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
            ${user.name ? user.name.charAt(0).toUpperCase() : "A"}
          </div>
        </div>

        <header class="flex justify-between items-center mb-8">
          <div>
            <h2 class="text-2xl font-bold text-slate-800">Overview</h2>
            <p class="text-sm text-slate-400 mt-1">Welcome back, ${user.name || "Admin"}</p>
          </div>
          <button onclick="logout()" class="hidden md:flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition px-4 py-2 rounded-xl hover:bg-slate-100">
            <i class="fas fa-sign-out-alt"></i> Logout
          </button>
        </header>

        <!-- Stats Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm card-hover">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <i class="fas fa-users text-lg"></i>
              </div>
              <span class="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">+${state.customers.length > 0 ? "Active" : "0"}</span>
            </div>
            <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Clients</p>
            <h3 class="text-3xl font-extrabold mt-1 text-slate-800" id="stat-customers">0</h3>
          </div>

          <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm card-hover">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <i class="fas fa-wallet text-lg"></i>
              </div>
              <span class="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">NGN</span>
            </div>
            <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Liquidity</p>
            <h3 class="text-3xl font-extrabold mt-1 text-emerald-600" id="stat-balance">₦0</h3>
          </div>

          <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm card-hover">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                <i class="fas fa-server text-lg"></i>
              </div>
              <span class="relative flex h-3 w-3">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">System Status</p>
            <div class="flex items-center mt-2">
              <span class="text-emerald-600 font-bold">Active</span>
              <span class="text-slate-400 text-xs ml-2">All systems operational</span>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="mt-8">
          <h3 class="text-lg font-bold text-slate-800 mb-4">Quick Actions</h3>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button onclick="router.navigate('customers'); setTimeout(() => openModal('addModal'), 300)" 
              class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition text-left btn-press">
              <div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-3">
                <i class="fas fa-user-plus"></i>
              </div>
              <p class="text-sm font-semibold text-slate-700">Add Customer</p>
              <p class="text-xs text-slate-400 mt-0.5">New ledger entry</p>
            </button>
            <button onclick="router.navigate('customers')" 
              class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition text-left btn-press">
              <div class="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-3">
                <i class="fas fa-hand-holding-usd"></i>
              </div>
              <p class="text-sm font-semibold text-slate-700">Deposit</p>
              <p class="text-xs text-slate-400 mt-0.5">Add funds</p>
            </button>
            <button onclick="router.navigate('customers')" 
              class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition text-left btn-press">
              <div class="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 mb-3">
                <i class="fas fa-money-bill-wave"></i>
              </div>
              <p class="text-sm font-semibold text-slate-700">Withdraw</p>
              <p class="text-xs text-slate-400 mt-0.5">Remove funds</p>
            </button>
            <button onclick="exportToCSV()" 
              class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition text-left btn-press">
              <div class="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 mb-3">
                <i class="fas fa-file-download"></i>
              </div>
              <p class="text-sm font-semibold text-slate-700">Export</p>
              <p class="text-xs text-slate-400 mt-0.5">Download CSV</p>
            </button>
          </div>
        </div>
      </main>
    </div>`;
  updateStats();
}

function renderCustomers(container) {
  const user = state.user || { name: "Admin" };
  container.innerHTML = `
    <div class="flex flex-col md:flex-row min-h-screen">
      <!-- Desktop Sidebar -->
      <aside class="w-full md:w-72 sidebar-gradient text-slate-300 hidden md:flex flex-col p-6">
        <div class="flex items-center gap-3 mb-10">
          <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center text-white shadow-lg">
            <i class="fas fa-shield-halved text-sm"></i>
          </div>
          <div class="text-xl font-bold text-white">Success<span class="text-blue-400">Contr.</span></div>
        </div>

        <nav class="space-y-1 flex-1">
          <button onclick="router.navigate('dashboard')" class="w-full flex items-center gap-3 py-3 px-4 rounded-xl hover:bg-slate-800/50 text-slate-400 hover:text-white transition-all">
            <i class="fas fa-th-large w-5"></i> Dashboard
          </button>
          <button onclick="router.navigate('customers')" class="w-full flex items-center gap-3 py-3 px-4 rounded-xl bg-blue-600 text-white font-medium transition-all">
            <i class="fas fa-users w-5"></i> Customers
          </button>
          <button onclick="exportToCSV()" class="w-full flex items-center gap-3 py-3 px-4 rounded-xl hover:bg-slate-800/50 text-slate-400 hover:text-white transition-all">
            <i class="fas fa-download w-5"></i> Export CSV
          </button>
        </nav>

        <div class="mt-auto pt-6 border-t border-slate-700/50">
          <div class="flex items-center gap-3 px-2">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
              ${user.name ? user.name.charAt(0).toUpperCase() : "A"}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-white truncate">${user.name || "Admin"}</p>
              <p class="text-xs text-slate-500">${user.role || "Administrator"}</p>
            </div>
            <button onclick="logout()" class="w-8 h-8 rounded-lg hover:bg-slate-800 flex items-center justify-center text-slate-400 transition">
              <i class="fas fa-sign-out-alt text-sm"></i>
            </button>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 p-4 md:p-8 pb-28 md:pb-8">
        <!-- Mobile Header -->
        <div class="md:hidden flex items-center justify-between mb-6">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center text-white shadow-lg">
              <i class="fas fa-shield-halved text-sm"></i>
            </div>
            <div>
              <h1 class="text-lg font-bold text-slate-800">Success<span class="text-blue-600">Contr.</span></h1>
            </div>
          </div>
          <div class="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
            ${user.name ? user.name.charAt(0).toUpperCase() : "A"}
          </div>
        </div>

        <header class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 class="text-2xl font-bold text-slate-800">Customer Ledger</h2>
            <p class="text-sm text-slate-400 mt-1">${state.customers.length} registered customers</p>
          </div>
          <div class="flex gap-3">
            <button onclick="exportToCSV()" class="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 font-medium hover:bg-slate-50 transition shadow-sm">
              <i class="fas fa-download text-sm"></i> Export
            </button>
            <button onclick="openModal('addModal')" class="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-200 hover:from-blue-500 hover:to-blue-600 transition btn-press">
              <i class="fas fa-plus"></i> Add Customer
            </button>
          </div>
        </header>

        <!-- Search Bar -->
        <div class="relative mb-6">
          <i class="fas fa-search absolute left-4 top-3.5 text-slate-400 text-sm"></i>
          <input type="text" id="searchBar" oninput="handleSearch(this.value)" placeholder="Search customers by name..." 
            class="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm text-sm">
        </div>

        <!-- Desktop Table / Mobile Cards -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <!-- Desktop Table Header -->
          <div class="hidden md:block">
            <table class="w-full text-left border-collapse">
              <thead class="bg-slate-50 text-slate-500 text-xs uppercase">
                <tr>
                  <th class="px-6 py-4 font-bold tracking-wider">Customer</th>
                  <th class="px-6 py-4 font-bold tracking-wider">Balance</th>
                  <th class="px-6 py-4 text-right font-bold tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody id="customerTableBody" class="divide-y divide-slate-100 text-sm"></tbody>
            </table>
          </div>

          <!-- Mobile Cards -->
          <div id="mobileCustomerList" class="md:hidden divide-y divide-slate-100"></div>

          <!-- Empty State -->
          <div id="emptyState" class="hidden px-6 py-16 text-center">
            <div class="w-20 h-20 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4">
              <i class="fas fa-inbox text-3xl text-slate-300"></i>
            </div>
            <h3 class="text-lg font-semibold text-slate-700 mb-1">No customers found</h3>
            <p class="text-sm text-slate-400">Add your first customer to get started</p>
          </div>
        </div>
      </main>
    </div>`;

  fetchCustomers();
}

// --- API & LOGIC ---

const formatNaira = (num) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(
    num || 0,
  );

function getAuthHeaders() {
  return state.token
    ? {
        Authorization: `Bearer ${state.token}`,
        "Content-Type": "application/json",
      }
    : { "Content-Type": "application/json" };
}

async function fetchCustomers() {
  try {
    const res = await fetch(`${API_BASE}/api/customers`, {
      headers: getAuthHeaders(),
    });
    if (res.status === 401) {
      logout();
      return;
    }
    state.customers = await res.json();
    if (state.currentPage === "customers") {
      renderTable(state.customers);
      renderMobileCards(state.customers);
    }
    if (state.currentPage === "dashboard") updateStats();
  } catch (e) {
    console.error(e);
    showToast("Failed to load customers", "error");
  }
}

async function addCustomer() {
  const name = document.getElementById("newName").value.trim();
  const balance = document.getElementById("newBalance").value || 0;
  if (!name) return showToast("Name is required", "error");

  const btn = document.querySelector(
    "#addModal button[onclick='addCustomer()']",
  );
  const originalHTML = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
  btn.disabled = true;

  try {
    const res = await fetch(`${API_BASE}/api/customers`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        customerName: name,
        balance: parseFloat(balance),
      }),
    });

    if (res.ok) {
      closeModal("addModal");
      document.getElementById("newName").value = "";
      document.getElementById("newBalance").value = "";
      fetchCustomers();
      showToast("Customer added successfully!", "success");
    } else {
      const errorData = await res.json();
      showToast(errorData.message || "Failed to add customer", "error");
    }
  } catch (e) {
    showToast("Network error - please try again", "error");
  } finally {
    btn.innerHTML = originalHTML;
    btn.disabled = false;
  }
}

async function processTransaction() {
  const id = document.getElementById("transCustomerId").value;
  const type = document.getElementById("transType").value;
  const amount = parseFloat(document.getElementById("transAmount").value);

  if (!amount || amount <= 0)
    return showToast("Please enter a valid amount", "error");

  const btn = document.getElementById("transBtn");
  const originalHTML = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Processing...';
  btn.disabled = true;

  try {
    const res = await fetch(`${API_BASE}/api/customers/${id}/${type}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ amount: amount }),
    });

    if (res.ok) {
      closeModal("transactionModal");
      document.getElementById("transAmount").value = "";
      fetchCustomers();
      showToast(
        `${type === "deposit" ? "Deposit" : "Withdrawal"} successful!`,
        "success",
      );
    } else {
      const data = await res.json();
      showToast(data.message || "Transaction failed", "error");
    }
  } catch (e) {
    showToast("Network error - please try again", "error");
  } finally {
    btn.innerHTML = originalHTML;
    btn.disabled = false;
  }
}

function openDeleteModal(id) {
  document.getElementById("deleteCustomerId").value = id;
  openModal("deleteModal");
}

async function confirmDelete() {
  const id = document.getElementById("deleteCustomerId").value;
  if (!id) return;

  try {
    const res = await fetch(`${API_BASE}/api/customers/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (res.ok) {
      closeModal("deleteModal");
      fetchCustomers();
      showToast("Customer deleted", "success");
    } else {
      showToast("Delete failed", "error");
    }
  } catch (e) {
    showToast("Delete failed", "error");
  }
}

// --- RENDER FUNCTIONS ---

function renderTable(data) {
  const tbody = document.getElementById("customerTableBody");
  const emptyState = document.getElementById("emptyState");
  if (!tbody) return;

  if (data.length === 0) {
    tbody.innerHTML = "";
    emptyState.classList.remove("hidden");
    return;
  }
  emptyState.classList.add("hidden");

  tbody.innerHTML = data
    .map((c) => {
      const displayName = c.customerName || "Unnamed";
      const safeName = displayName.replace(/'/g, "\'");
      return `
        <tr class="hover:bg-slate-50 transition-colors group">
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-700 font-bold text-xs">
                  ${displayName.charAt(0).toUpperCase()}
                </div>
                <div class="font-semibold text-slate-800">${displayName}</div>
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="font-bold text-emerald-600">${formatNaira(c.balance)}</div>
            </td>
            <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onclick="openTransaction('${c._id}', '${safeName}', 'deposit')" 
                        class="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition inline-flex items-center justify-center btn-press" title="Deposit">
                        <i class="fas fa-plus text-xs"></i>
                    </button>
                    <button onclick="openTransaction('${c._id}', '${safeName}', 'withdraw')" 
                        class="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition inline-flex items-center justify-center btn-press" title="Withdraw">
                        <i class="fas fa-minus text-xs"></i>
                    </button>
                    <button onclick="openDeleteModal('${c._id}')" 
                        class="w-9 h-9 rounded-lg bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition inline-flex items-center justify-center btn-press" title="Delete">
                        <i class="fas fa-trash text-xs"></i>
                    </button>
                </div>
            </td>
        </tr>`;
    })
    .join("");
}

function renderMobileCards(data) {
  const container = document.getElementById("mobileCustomerList");
  const emptyState = document.getElementById("emptyState");
  if (!container) return;

  if (data.length === 0) {
    container.innerHTML = "";
    emptyState.classList.remove("hidden");
    return;
  }
  emptyState.classList.add("hidden");

  container.innerHTML = data
    .map((c) => {
      const displayName = c.customerName || "Unnamed";
      const safeName = displayName.replace(/'/g, "\'");
      return `
        <div class="mobile-card bg-white p-4">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-3">
              <div class="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-700 font-bold text-sm shadow-sm">
                ${displayName.charAt(0).toUpperCase()}
              </div>
              <div>
                <div class="font-bold text-slate-800 text-base">${displayName}</div>
                <div class="text-xs text-slate-400">Customer ID: ${c._id.slice(-6)}</div>
              </div>
            </div>
            <div class="text-right">
              <div class="font-extrabold text-emerald-600 text-lg">${formatNaira(c.balance)}</div>
              <div class="text-xs text-slate-400">Available</div>
            </div>
          </div>

          <!-- Action Buttons - ALWAYS VISIBLE on mobile -->
          <div class="flex gap-2 mt-2">
            <button onclick="openTransaction('${c._id}', '${safeName}', 'deposit')" 
              class="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold text-sm shadow-lg shadow-emerald-200 btn-press">
              <i class="fas fa-arrow-down"></i> Deposit
            </button>
            <button onclick="openTransaction('${c._id}', '${safeName}', 'withdraw')" 
              class="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 text-white font-semibold text-sm shadow-lg shadow-rose-200 btn-press">
              <i class="fas fa-arrow-up"></i> Withdraw
            </button>
            <button onclick="openDeleteModal('${c._id}')" 
              class="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition flex items-center justify-center btn-press">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>`;
    })
    .join("");
}

function handleSearch(val) {
  const filtered = state.customers.filter((c) =>
    (c.customerName || "").toLowerCase().includes(val.toLowerCase()),
  );
  renderTable(filtered);
  renderMobileCards(filtered);
}

function updateStats() {
  const total = state.customers.reduce((s, c) => s + (c.balance || 0), 0);
  const el1 = document.getElementById("stat-customers");
  const el2 = document.getElementById("stat-balance");
  if (el1) el1.innerText = state.customers.length;
  if (el2) el2.innerText = formatNaira(total);
}

// --- MODAL FUNCTIONS ---

function openModal(id) {
  const modal = document.getElementById(id);
  modal.classList.remove("hidden");
  // Trigger animation
  requestAnimationFrame(() => {
    modal.classList.add("active");
  });
  document.body.style.overflow = "hidden";
}

function closeModal(id) {
  const modal = document.getElementById(id);
  modal.classList.remove("active");
  setTimeout(() => {
    modal.classList.add("hidden");
    document.body.style.overflow = "";
  }, 300);
}

function openTransaction(id, name, type) {
  document.getElementById("transCustomerId").value = id;
  document.getElementById("transCustomerName").innerText = name;
  document.getElementById("transType").value = type;

  const title = document.getElementById("transTitle");
  const btn = document.getElementById("transBtn");
  const icon = document.getElementById("transIcon");
  const iconInner = document.getElementById("transIconInner");
  const label = document.getElementById("transLabel");
  const warning = document.getElementById("transWarning");

  if (type === "deposit") {
    title.innerText = "Deposit Funds";
    btn.className =
      "flex-1 px-4 py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-bold rounded-xl hover:from-emerald-500 hover:to-emerald-600 transition shadow-lg shadow-emerald-200 btn-press flex items-center justify-center gap-2";
    icon.className =
      "w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white shadow-lg";
    iconInner.className = "fas fa-arrow-down text-lg";
    label.innerText = "Deposit Amount (₦)";
    label.className =
      "block text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2";
    warning.classList.add("hidden");
  } else {
    title.innerText = "Withdraw Funds";
    btn.className =
      "flex-1 px-4 py-3.5 bg-gradient-to-r from-rose-600 to-rose-700 text-white font-bold rounded-xl hover:from-rose-500 hover:to-rose-600 transition shadow-lg shadow-rose-200 btn-press flex items-center justify-center gap-2";
    icon.className =
      "w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center text-white shadow-lg";
    iconInner.className = "fas fa-arrow-up text-lg";
    label.innerText = "Withdrawal Amount (₦)";
    label.className =
      "block text-xs font-bold text-rose-600 uppercase tracking-wider mb-2";
    warning.classList.remove("hidden");
  }

  openModal("transactionModal");
}

// --- AUTH FUNCTIONS ---

let isRegisterMode = false;

function toggleAuthMode() {
  isRegisterMode = !isRegisterMode;
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  if (isRegisterMode) {
    loginForm.classList.add("hidden");
    registerForm.classList.remove("hidden");
    registerForm.classList.add("animate-fade-in");
  } else {
    registerForm.classList.add("hidden");
    loginForm.classList.remove("hidden");
    loginForm.classList.add("animate-fade-in");
  }
}

async function handleLogin() {
  const username = document.getElementById("loginUser").value.trim();
  const password = document.getElementById("loginPass").value;

  if (!username || !password) {
    showToast("Please enter username and password", "error");
    return;
  }

  const btn = document.getElementById("loginBtn");
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
  btn.disabled = true;

  const result = await apiLogin(username, password);

  if (result.success) {
    showToast("Welcome back!", "success");
    router.navigate("dashboard");
  } else {
    showToast(result.message, "error");
    btn.innerHTML =
      '<span>Sign In</span><i class="fas fa-arrow-right text-sm"></i>';
    btn.disabled = false;
  }
}

async function handleRegister() {
  const name = document.getElementById("regName").value.trim();
  const username = document.getElementById("regUser").value.trim();
  const password = document.getElementById("regPass").value;

  if (!name || !username || !password) {
    showToast("Please fill all fields", "error");
    return;
  }
  if (password.length < 6) {
    showToast("Password must be at least 6 characters", "error");
    return;
  }

  const btn = document.getElementById("regBtn");
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating...';
  btn.disabled = true;

  const result = await apiRegister(username, password, name);

  if (result.success) {
    showToast(result.message, "success");
    toggleAuthMode();
  } else {
    showToast(result.message, "error");
  }

  btn.innerHTML =
    '<span>Create Account</span><i class="fas fa-user-plus text-sm"></i>';
  btn.disabled = false;
}

function logout() {
  state.user = null;
  state.token = null;
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  showToast("Logged out successfully", "success");
  router.navigate("login");
}

// --- UTILS ---

function showToast(message, type = "info") {
  const toast = document.getElementById("toast");
  const content = document.getElementById("toastContent");
  const icon = document.getElementById("toastIcon");
  const msg = document.getElementById("toastMessage");

  msg.innerText = message;

  if (type === "success") {
    content.className =
      "px-6 py-3 rounded-2xl text-white text-sm font-medium shadow-2xl flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600";
    icon.className = "fas fa-check-circle";
  } else if (type === "error") {
    content.className =
      "px-6 py-3 rounded-2xl text-white text-sm font-medium shadow-2xl flex items-center gap-2 bg-gradient-to-r from-rose-500 to-rose-600";
    icon.className = "fas fa-exclamation-circle";
  } else {
    content.className =
      "px-6 py-3 rounded-2xl text-white text-sm font-medium shadow-2xl flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600";
    icon.className = "fas fa-info-circle";
  }

  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

function exportToCSV() {
  let csv = "Name,Balance\n";
  state.customers.forEach((c) => (csv += `${c.customerName},${c.balance}\n`));
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `customers_${new Date().toISOString().split("T")[0]}.csv`;
  link.click();
  showToast("CSV exported successfully!", "success");
}

// Handle Enter key on login
window.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    if (state.currentPage === "login") {
      if (!isRegisterMode) handleLogin();
      else handleRegister();
    }
  }
});

window.onload = () => {
  if (state.token && state.user) {
    router.navigate("dashboard");
  } else {
    router.navigate("login");
  }
};
