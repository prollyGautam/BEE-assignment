const BASE_URL = "http://localhost:5000";
let token = null;

const signupSection = document.getElementById("signup-section");
const loginSection = document.getElementById("login-section");
const taskSection = document.getElementById("task-section");

const taskList = document.getElementById("task-list");

// Sign Up
document.getElementById("signup-btn").addEventListener("click", async () => {
  const username = document.getElementById("signup-username").value;
  const password = document.getElementById("signup-password").value;

  try {
    const res = await fetch(`${BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    alert(data.message || "Signed up successfully");
  } catch (err) {
    console.error(err);
    alert("Sign-up failed");
  }
});

// Log In
document.getElementById("login-btn").addEventListener("click", async () => {
  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;

  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (res.ok) {
      token = data.token;
      loginSection.classList.add("hidden");
      taskSection.classList.remove("hidden");
      fetchTasks();
    } else {
      alert(data.message || "Login failed");
    }
  } catch (err) {
    console.error(err);
    alert("Login failed");
  }
});

// Fetch Tasks
async function fetchTasks() {
  try {
    const res = await fetch(`${BASE_URL}/tasks`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const tasks = await res.json();
    renderTasks(tasks);
  } catch (err) {
    console.error(err);
  }
}

// Render Tasks
function renderTasks(tasks) {
  taskList.innerHTML = "";
  tasks.forEach((task) => {
    const taskEl = document.createElement("div");
    taskEl.className = `task ${task.status === "Completed" ? "completed" : ""}`;
    taskEl.innerHTML = `
      <h3>${task.title}</h3>
      <p>${task.description}</p>
      <p>Status: ${task.status}</p>
      <div class="actions">
        <button onclick="updateTask('${task._id}', 'Completed')">Mark Completed</button>
        <button onclick="deleteTask('${task._id}')">Delete</button>
      </div>
    `;
    taskList.appendChild(taskEl);
  });
}

// Add Task
document.getElementById("add-task-btn").addEventListener("click", async () => {
  const title = document.getElementById("task-title").value;
  const description = document.getElementById("task-description").value;

  try {
    const res = await fetch(`${BASE_URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description }),
    });

    const task = await res.json();
    fetchTasks();
  } catch (err) {
    console.error(err);
  }
});

// Update Task
async function updateTask(taskId, status) {
  try {
    const res = await fetch(`${BASE_URL}/tasks/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    if (res.ok) fetchTasks();
  } catch (err) {
    console.error(err);
  }
}

// Delete Task
async function deleteTask(taskId) {
  try {
    const res = await fetch(`${BASE_URL}/tasks/${taskId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) fetchTasks();
  } catch (err) {
    console.error(err);
  }
}
