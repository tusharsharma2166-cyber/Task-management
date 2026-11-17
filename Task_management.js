// =========================================================
// FUNCTIONALITY 1: ADD TASK & DISPLAY LIST (WITH LOCALSTORAGE)
// =========================================================
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const priorityInput = document.getElementById("priority-input");
const dateInput = document.getElementById("date-input");
const taskList = document.getElementById("task-list");
const emptyMessage = document.getElementById("empty-message");

let tasks = JSON.parse(localStorage.getItem("my_tasks")) || [];

function saveTasks() {
  localStorage.setItem("my_tasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = "";

  if (tasks.length === 0) {
    emptyMessage.style.display = "block";
  } else {
    emptyMessage.style.display = "none";
  }

  tasks.forEach(function (task) {
    const li = document.createElement("li");
    li.className = "task-item" + (task.completed ? " completed" : "");
    li.setAttribute("data-id", task.id);

    const dateText = task.dueDate ? "Due: " + task.dueDate : "No due date";

    li.innerHTML = `
      <div class="task-left">
        <input 
          type="checkbox" 
          class="task-checkbox" 
          data-id="${task.id}"
          ${task.completed ? "checked" : ""} 
        />
        <div class="task-info">
          <span class="task-title">${task.title}</span>
          <div class="task-meta">
            <span class="badge badge-${task.priority}">${task.priority}</span>
            <span>${dateText}</span>
          </div>
        </div>
      </div>
      <div class="task-actions">
        <button class="edit-btn" data-id="${task.id}">Edit</button>
        <button class="delete-btn" data-id="${task.id}">Delete</button>
      </div>
    `;

    taskList.appendChild(li);
  });
}

function addTask(event) {
  event.preventDefault();

  const title = taskInput.value.trim();
  if (title === "") return;

  const newTask = {
    id: Date.now(),
    title: title,
    priority: priorityInput.value,
    dueDate: dateInput.value,
    completed: false
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();

  taskInput.value = "";
  dateInput.value = "";
  priorityInput.value = "Medium";
}

taskForm.addEventListener("submit", addTask);
renderTasks();


// =========================================================
// FUNCTIONALITY 2: MARK TASK COMPLETED / PENDING (CHECKBOX)
// =========================================================
function toggleTaskStatus(taskId) {
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id === taskId) {
      tasks[i].completed = !tasks[i].completed;
      break;
    }
  }
  saveTasks();
  renderTasks();
}

taskList.addEventListener("change", function (event) {
  if (event.target.classList.contains("task-checkbox")) {
    const id = Number(event.target.getAttribute("data-id"));
    toggleTaskStatus(id);
  }
});

// =========================================================
// FUNCTIONALITY 3: SEARCH TASKS BY KEYWORD
// =========================================================
const searchInput = document.getElementById("search-input");

function searchTasks() {
  const searchText = searchInput.value.toLowerCase().trim();
  const allTaskItems = document.querySelectorAll(".task-item");
  let visibleCount = 0;

  allTaskItems.forEach(function (item) {
    const titleText = item.querySelector(".task-title").textContent.toLowerCase();
    if (titleText.includes(searchText)) {
      item.style.display = "flex";
      visibleCount++;
    } else {
      item.style.display = "none";
    }
  });

  emptyMessage.style.display = visibleCount === 0 ? "block" : "none";
}

searchInput.addEventListener("input", searchTasks);

// =========================================================
// FUNCTIONALITY 4: FILTER TASKS BY STATUS (ALL / PENDING / COMPLETED)
// =========================================================
const filterButtons = document.querySelectorAll(".filter-btn");
let currentFilter = "all";

function applyStatusFilter() {
  const allTaskItems = document.querySelectorAll(".task-item");
  let visibleCount = 0;

  allTaskItems.forEach(function (item) {
    const isCompleted = item.classList.contains("completed");

    if (currentFilter === "pending" && !isCompleted) {
      item.style.display = "flex";
      visibleCount++;
    } else if (currentFilter === "completed" && isCompleted) {
      item.style.display = "flex";
      visibleCount++;
    } else if (currentFilter === "all") {
      item.style.display = "flex";
      visibleCount++;
    } else {
      item.style.display = "none";
    }
  });

  emptyMessage.style.display = visibleCount === 0 ? "block" : "none";
}

filterButtons.forEach(function (btn) {
  btn.addEventListener("click", function () {
    filterButtons.forEach(function (b) {
      b.classList.remove("active");
    });
    btn.classList.add("active");

    currentFilter = btn.getAttribute("data-filter");
    applyStatusFilter();
  });
});


// =========================================================
// FUNCTIONALITY 5: TASK COUNTER STATS & CLEAR COMPLETED TASKS
// =========================================================
const totalCountEl = document.getElementById("total-count");
const pendingCountEl = document.getElementById("pending-count");
const completedCountEl = document.getElementById("completed-count");
const clearCompletedBtn = document.getElementById("clear-completed-btn");

function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter(function (t) {
    return t.completed;
  }).length;
  const pending = total - completed;

  totalCountEl.textContent = total;
  pendingCountEl.textContent = pending;
  completedCountEl.textContent = completed;
}

function clearCompletedTasks() {
  tasks = tasks.filter(function (task) {
    return !task.completed;
  });
  saveTasks();
  renderTasks();
  updateStats();
}

clearCompletedBtn.addEventListener("click", clearCompletedTasks);
taskForm.addEventListener("submit", updateStats);
taskList.addEventListener("change", updateStats);
taskList.addEventListener("click", updateStats);

// Initialize counter on page load
updateStats();


// =========================================================
// FUNCTIONALITY 6: EDIT TASK & DELETE SINGLE TASK
// =========================================================
function editTaskItem(taskId) {
  const task = tasks.find(function (t) {
    return t.id === taskId;
  });
  if (!task) return;


  const updatedTitle = prompt("Edit your task:", task.title);
  if (updatedTitle !== null && updatedTitle.trim() !== "") {
    task.title = updatedTitle.trim();
    saveTasks();
    renderTasks();
  }
}


function deleteTaskItem(taskId) {
  tasks = tasks.filter(function (task) {
    return task.id !== taskId;
  });
  saveTasks();
  renderTasks();
}


taskList.addEventListener("click", function (event) {
  const id = Number(event.target.getAttribute("data-id"));


  if (event.target.classList.contains("edit-btn")) {
    editTaskItem(id);
  } else if (event.target.classList.contains("delete-btn")) {
    deleteTaskItem(id);
  }
});



