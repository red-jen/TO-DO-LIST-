let tasks = {
    todo: [],
    progress: [],
    done: []
};

function showAddTaskModal() {
    document.getElementById('addTaskModal').style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function addTask() {
    const taskName = document.getElementById('taskInput').value;
    const status = document.getElementById('statusSelect').value;
    
    if (taskName.trim() !== '') {
        tasks[status].push(taskName);
        updateTasks();
        closeModal('addTaskModal');
        document.getElementById('taskInput').value = '';
    }
}

function deleteTask(status, index) {
    tasks[status].splice(index, 1);
    updateTasks();
}

function editTask(status, index) {
    const newTaskName = prompt('Edit task:', tasks[status][index]);
    if (newTaskName !== null && newTaskName.trim() !== '') {
        tasks[status][index] = newTaskName;
        updateTasks();
    }
}

function updateTasks() {
    for (const status in tasks) {
        const container = document.getElementById(`${status}-tasks`);
        const countElement = document.getElementById(`${status}-count`);
        
        container.innerHTML = '';
        countElement.textContent = tasks[status].length;

        tasks[status].forEach((task, index) => {
            const taskElement = document.createElement('div');
            taskElement.className = 'task';
            taskElement.innerHTML = `
                ${task}
                <div class="task-actions">
                    <button class="delete-btn" onclick="deleteTask('${status}', ${index})">Delete</button>
                    <button class="edit-btn" onclick="editTask('${status}', ${index})">Edit</button>
                </div>
            `;
            container.appendChild(taskElement);
        });
    }
}

function searchTasks() {
    const searchText = document.querySelector('.search-box').value.toLowerCase();
    const allTasks = document.querySelectorAll('.task');
    
    allTasks.forEach(task => {
        const taskText = task.textContent.toLowerCase();
        if (taskText.includes(searchText)) {
            task.style.display = 'block';
        } else {
            task.style.display = 'none';
        }
    });
}

// Initialize with some sample tasks
tasks.todo = ['Brief Soutenances Croisées', 'WORKSHOP 3', 'Veille'];
tasks.progress = ['WORKSHOP 2'];
tasks.done = ['Brief 5', 'WORKSHOP 1'];
updateTasks();