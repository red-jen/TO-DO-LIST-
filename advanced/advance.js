// Task data structure
let tasks = {
    todo: [],
    doing: [],
    done: []
};

class Task {
    constructor(title, description, dueDate, priority, status = 'todo') {
        this.id = Date.now().toString();
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.status = status;
        this.createdAt = new Date().toISOString();
    }
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();

    const drake = dragula([
        document.querySelector('#todoTasks'),
        document.querySelector('#doingTasks'),
        document.querySelector('#doneTasks')
    ]);

    drake.on('drop', (el, target, source) => {
        const taskId = el.getAttribute('data-id');
        const newStatus = target.id.replace('Tasks', '');
        const oldStatus = source.id.replace('Tasks', '');
        updateTaskStatus(taskId, oldStatus, newStatus);
    });

    // Event listeners
    document.getElementById('searchInput').addEventListener('input', renderTasks);
    document.getElementById('priorityFilter').addEventListener('change', renderTasks);
    document.getElementById('sortBy').addEventListener('change', renderTasks);
    document.getElementById('addTaskForm').addEventListener('submit', handleAddTask);

    renderTasks();
    updateStatistics();
});

function handleAddTask(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const task = new Task(
        formData.get('title'),
        formData.get('description'),
        formData.get('dueDate'),
        formData.get('priority')
    );

    tasks.todo.push(task);
    renderTasks();
    updateStatistics();
    saveToLocalStorage();
    closeAddTaskModal();
    e.target.reset();
}

function renderTasks() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const priorityFilter = document.getElementById('priorityFilter').value;
    const sortBy = document.getElementById('sortBy').value;

    ['todo', 'doing', 'done'].forEach(status => {
        const container = document.getElementById(`${status}Tasks`);
        if (!container) return;

        let filteredTasks = filterTasks(tasks[status]);
        filteredTasks = sortTasks(filteredTasks);
        
        container.innerHTML = '';
        filteredTasks.forEach(task => {
            container.appendChild(createTaskElement(task));
        });
    });
}

function filterTasks(taskList) {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const priorityFilter = document.getElementById('priorityFilter').value;
    
    return taskList.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchTerm) ||
                            task.description.toLowerCase().includes(searchTerm);
        const matchesPriority = !priorityFilter || task.priority === priorityFilter;
        return matchesSearch && matchesPriority;
    });
}

function sortTasks(taskList) {
    const sortBy = document.getElementById('sortBy').value;
    return [...taskList].sort((a, b) => {
        if (sortBy === 'date') {
            return new Date(a.dueDate) - new Date(b.dueDate);
        } else if (sortBy === 'priority') {
            return a.priority.localeCompare(b.priority);
        }
        return 0;
    });
}

function createTaskElement(task) {
    const div = document.createElement('div');
    div.className = `task-card ${getPriorityColor(task.priority)}`;
    div.setAttribute('data-id', task.id);
    
    div.innerHTML = `
        <h3 class="text-lg font-semibold">${task.title}</h3>
        <p class="text-gray-600">${task.description}</p>
        <div class="mt-2">
            <span class="text-sm ${getPriorityBadgeColor(task.priority)} px-2 py-1 rounded">
                ${task.priority}
            </span>
            <span class="text-sm text-gray-500">Due: ${formatDate(task.dueDate)}</span>
        </div>
        <button onclick="deleteTask('${task.id}', '${task.status}')" 
                class="mt-2 text-red-600 hover:text-red-800">
            Delete
        </button>
    `;
    
    return div;
}

function updateTaskStatus(taskId, oldStatus, newStatus) {
    const taskIndex = tasks[oldStatus].findIndex(t => t.id === taskId);
    if (taskIndex === -1) return;

    const task = tasks[oldStatus][taskIndex];
    tasks[oldStatus].splice(taskIndex, 1);
    tasks[newStatus].push({...task, status: newStatus});
    
    saveToLocalStorage();
    updateStatistics();
}

function deleteTask(taskId, status) {
    const index = tasks[status].findIndex(t => t.id === taskId);
    if (index !== -1) {
        tasks[status].splice(index, 1);
        renderTasks();
        updateStatistics();
        saveToLocalStorage();
    }
}

// Utility Functions
function getPriorityColor(priority) {
    return {
        'P1': 'border-red-500',
        'P2': 'border-orange-500',
        'P3': 'border-green-500'
    }[priority] || 'border-gray-500';
}

function getPriorityBadgeColor(priority) {
    return {
        'P1': 'bg-red-100 text-red-800',
        'P2': 'bg-orange-100 text-orange-800',
        'P3': 'bg-green-100 text-green-800'
    }[priority] || 'bg-gray-100 text-gray-800';
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('fr-FR');
}

function updateStatistics() {
    document.getElementById('todoCount').textContent = tasks.todo.length;
    document.getElementById('doingCount').textContent = tasks.doing.length;
    document.getElementById('doneCount').textContent = tasks.done.length;
    document.getElementById('totalTasks').textContent = 
        tasks.todo.length + tasks.doing.length + tasks.done.length;
}

// Local Storage Functions
function saveToLocalStorage() {
    localStorage.setItem('taskManagerTasks', JSON.stringify(tasks));
}

function loadFromLocalStorage() {
    const savedTasks = localStorage.getItem('taskManagerTasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }
}

// Modal Functions
function openAddTaskModal() {
    document.getElementById('addTaskModal').classList.remove('hidden');
}

function closeAddTaskModal() {
    document.getElementById('addTaskModal').classList.add('hidden');
}