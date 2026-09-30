// Get elements from HTML
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");
const filterButtons = document.querySelectorAll(".filter-btn");

// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Display tasks
function renderTasks() {
    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if (currentFilter === "active") {
        filteredTasks = tasks.filter(task => !task.completed);
    }

    if (currentFilter === "completed") {
        filteredTasks = tasks.filter(task => task.completed);
    }

    if (filteredTasks.length === 0) {
        emptyMessage.style.display = "block";
    } else {
        emptyMessage.style.display = "none";
    }

    filteredTasks.forEach(task => {

        const li = document.createElement("li");
        li.className = "task-item";
        li.dataset.id = task.id;

        li.innerHTML = `
            <div class="task-content">
                <input 
                    type="checkbox" 
                    class="complete-checkbox"
                    ${task.completed ? "checked" : ""}
                >

                <span class="task-text ${task.completed ? "completed" : ""}">
                    ${task.text}
                </span>
            </div>

            <div class="task-actions">
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;

        taskList.appendChild(li);
    });
}

// Add new task
function addTask() {
    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task!");
        return;
    }

    const newTask = {
        id: Date.now(),
        text: text,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();
    renderTasks();

    taskInput.value = "";
    taskInput.focus();
}

// Add button event
addTaskBtn.addEventListener("click", addTask);

// Enter key event
taskInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        addTask();
    }
});

// Filter buttons
filterButtons.forEach(button => {

    button.addEventListener("click", function() {

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        this.classList.add("active");

        currentFilter = this.dataset.filter;

        renderTasks();
    });
});

// Event delegation for task actions
taskList.addEventListener("click", function(event) {

    const taskItem = event.target.closest(".task-item");

    if (!taskItem) return;

    const taskId = Number(taskItem.dataset.id);

    // Delete task
    if (event.target.classList.contains("delete-btn")) {

        tasks = tasks.filter(task => task.id !== taskId);

        saveTasks();
        renderTasks();
    }

    // Edit task
    if (event.target.classList.contains("edit-btn")) {

        const task = tasks.find(task => task.id === taskId);

        const updatedText = prompt("Edit your task:", task.text);

        if (updatedText !== null && updatedText.trim() !== "") {

            task.text = updatedText.trim();

            saveTasks();
            renderTasks();
        }
    }
});

// Complete / incomplete task
taskList.addEventListener("change", function(event) {

    if (!event.target.classList.contains("complete-checkbox")) {
        return;
    }

    const taskItem = event.target.closest(".task-item");
    const taskId = Number(taskItem.dataset.id);

    const task = tasks.find(task => task.id === taskId);

    task.completed = event.target.checked;

    saveTasks();
    renderTasks();
});

// Display saved tasks when page loads
renderTasks();