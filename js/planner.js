// Academic planner: array-based task management with browser localStorage.
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("task-form");
  if (!form) return;

  const input = document.getElementById("task-input");
  const list = document.getElementById("task-list");
  const count = document.getElementById("task-count");
  const progressNumber = document.getElementById("progress-number");
  const progressBar = document.getElementById("progress-bar");
  const progressCaption = document.getElementById("progress-caption");
  const message = document.getElementById("planner-message");
  const STORAGE_KEY = "studentSpaceTasks";
  let tasks = [];

  try {
    tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    if (!Array.isArray(tasks)) tasks = [];
  } catch {
    tasks = [];
  }

  function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  function updateProgress() {
    const completed = tasks.filter(task => task.completed).length;
    const percent = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
    count.textContent = `${tasks.length} ${tasks.length === 1 ? "task" : "tasks"}`;
    progressNumber.textContent = `${percent}%`;
    progressBar.style.width = `${percent}%`;
    progressCaption.textContent = tasks.length
      ? `${completed} of ${tasks.length} tasks completed.`
      : "A good plan starts with one task.";
  }

  function renderTasks() {
    list.replaceChildren();
    if (tasks.length === 0) {
      const empty = document.createElement("li");
      empty.className = "empty-state";
      empty.textContent = "No tasks yet. Add your first study task above.";
      list.appendChild(empty);
    }

    tasks.forEach(task => {
      const item = document.createElement("li");
      item.className = `task-item${task.completed ? " completed" : ""}`;

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.completed;
      checkbox.setAttribute("aria-label", `Mark ${task.text} as completed`);
      checkbox.addEventListener("change", () => {
        task.completed = checkbox.checked;
        saveTasks();
        renderTasks();
      });

      const text = document.createElement("span");
      text.className = "task-text";
      text.textContent = task.text;

      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "delete-task";
      remove.textContent = "Delete";
      remove.setAttribute("aria-label", `Delete ${task.text}`);
      remove.addEventListener("click", () => {
        tasks = tasks.filter(entry => entry.id !== task.id);
        saveTasks();
        renderTasks();
        message.textContent = "Task deleted.";
      });

      item.append(checkbox, text, remove);
      list.appendChild(item);
    });
    updateProgress();
  }

  form.addEventListener("submit", event => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) {
      message.textContent = "Please enter a task before adding it.";
      input.focus();
      return;
    }
    tasks.push({ id: `${Date.now()}-${Math.random().toString(16).slice(2)}`, text, completed: false });
    saveTasks();
    renderTasks();
    form.reset();
    input.focus();
    message.textContent = "Your task has been added.";
  });

  renderTasks();
});
