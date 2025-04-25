const addTask = document.getElementById('addTask');
const Multiple = document.getElementById('Multiple');
const addTaskModal = document.getElementById('addTaskModal');
const MyHidde = document.getElementById('MyHidde');
const addTaskForm = document.getElementById('addTaskForm');
const todoTasksContainer = document.getElementById('todoTasks');
const doingTasksContainer = document.getElementById('doingTasks');
const doneTasksContainer = document.getElementById('doneTasks');

let currentlyEditing = null;

// Priority weight mapping for sorting
const priorityWeight = {
    'P1': 1,
    'P2': 2,
    'P3': 3,
    'P4': 4
};

function openAddTaskModal() {
    currentlyEditing = null;
    addTaskForm.reset();
    // document.getElementById('addBtn').textContent = 'Ajouter';
    addTaskModal.classList.remove('hidden');
}

function closeAddTaskModal() {
    addTaskModal.classList.add('hidden');
}

addTaskForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(addTaskForm);
    const title = formData.get('title');
    const description = formData.get('description');
    const dueDate = formData.get('dueDate');
    const priority = formData.get('priority');

    if (currentlyEditing) { // will tell us if the user is editing anew task
        // Update existing task
        currentlyEditing.querySelector('h2').textContent = title;
        currentlyEditing.querySelector('h3').textContent = description;
        currentlyEditing.querySelector('.due-date').textContent = `Due: ${dueDate}`;
        currentlyEditing.querySelector('.priority').textContent = `Priority: ${priority}`;
        // currentlyEditing.dataset.priority = priority;
        currentlyEditing = null;
        
        // Resort the container after editing
        const container = currentlyEditing.parentElement;
        sortTasksByPriority(container);
    } else {
        // Create new task
        const newTask = createTaskElement(title, description, dueDate, priority);
        todoTasksContainer.appendChild(newTask);
        sortTasksByPriority(todoTasksContainer);
    }

    addTaskForm.reset();
    closeAddTaskModal();
    updateTaskCounts();
});

function createTaskElement(title, description, dueDate, priority) {
    const newTask = document.createElement('div');
    newTask.className = 'bg-white p-5 mb-4 rounded-lg shadow-md';
    newTask.draggable = true;
    newTask.dataset.priority = priority; // Store priority as data attribute
    
    // Add priority indicator class
    const priorityColorClass = getPriorityColorClass(priority);
    
    newTask.innerHTML = `
        <div class="border-l-4 ${priorityColorClass} pl-2">
            <h2 class="bg-slate-500 p-2 rounded mb-2">${title}</h2>
            <h3 class="bg-slate-300 p-2 rounded mb-2 text-ellipsis overflow-hidden text-nowrap text-gray-900 font-thin">${description}</h3>
            <p class="text-sm text-gray-600 mb-2 due-date">Due: ${dueDate}</p>
            <p class="text-sm text-gray-600 mb-2 priority">Priority: ${priority}</p>
            <div class="flex justify-between">
                <button class="bg-gray-600 text-white rounded-md font-serif font-medium w-20 hover:bg-gray-700" onclick="editTask(this)">edit</button>
                <button class="bg-stone-600 text-white rounded-md font-serif font-medium w-20 hover:bg-stone-700" onclick="deleteTask(this)">delete</button>
            </div>
        </div>
    `;

    newTask.addEventListener('dragstart', handleDragStart);
    newTask.addEventListener('dragend', handleDragEnd);

    return newTask;
}

// Get color class based on priority
function getPriorityColorClass(priority) {
    switch(priority) {
        case 'P1': return 'border-red-500';
        case 'P2': return 'border-yellow-500';
        case 'P3': return 'border-blue-500';
        case 'P4': return 'border-gray-500';
        default: return 'border-gray-500';
    }
}

// Sort tasks by priority
function sortTasksByPriority(container) {
    const tasks = Array.from(container.children);
    console.log(tasks);
    tasks.sort((a, b) => {
        const priorityA = priorityWeight[a.dataset.priority];
        const priorityB = priorityWeight[b.dataset.priority];
        return priorityA - priorityB;
    });

    // Clear and re-append sorted tasks
    container.innerHTML = '';
    tasks.forEach(task => container.appendChild(task));
}

function editTask(button) {
    currentlyEditing = button.closest('div[draggable]');
    const title = currentlyEditing.querySelector('h2').textContent;
    const description = currentlyEditing.querySelector('h3').textContent;
    const dueDate = currentlyEditing.querySelector('.due-date').textContent.replace('Due: ', '');
    const priority = currentlyEditing.querySelector('.priority').textContent.replace('Priority: ', '');

    const form = document.getElementById('addTaskForm');
    form.elements['title'].value = title;
    form.elements['description'].value = description;
    form.elements['dueDate'].value = dueDate;
    form.elements['priority'].value = priority;

    document.getElementById('addBtn').textContent = 'Update';
    addTaskModal.classList.remove('hidden');
}

function deleteTask(button) {
    button.closest('div[draggable]').remove();
    updateTaskCounts();
}

function handleDragStart(e) {
    e.target.classList.add('dragging');
    e.target.style.opacity = '0.4';
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
    e.target.style.opacity = '1';
}

[todoTasksContainer, doingTasksContainer, doneTasksContainer].forEach(container => {
    container.addEventListener('dragover', handleDragOver);
    container.addEventListener('drop', handleDrop);
    container.addEventListener('dragenter', handleDragEnter);
    container.addEventListener('dragleave', handleDragLeave);
});

function handleDragOver(e) {
    e.preventDefault();
}

function handleDragEnter(e) {
    e.preventDefault();
    e.target.closest('.p-4')?.classList.add('bg-gray-100');
}

function handleDragLeave(e) {
    e.target.closest('.p-4')?.classList.remove('bg-gray-100');
}

function handleDrop(e) {
    e.preventDefault();
    const dropZone = e.target.closest('.p-4');
    dropZone?.classList.remove('bg-gray-100');
    
    const draggingElement = document.querySelector('.dragging');
    if (draggingElement && dropZone) {
        dropZone.appendChild(draggingElement);
        sortTasksByPriority(dropZone); // Sort after dropping
        updateTaskCounts();
    }
}

function updateTaskCounts() {
    const todoCount = todoTasksContainer.children.length;
    const doingCount = doingTasksContainer.children.length;
    const doneCount = doneTasksContainer.children.length;
    
    document.getElementById('todoCount').textContent = todoCount;
    document.getElementById('doingCount').textContent = doingCount;
    document.getElementById('doneCount').textContent = doneCount;
    document.getElementById('totalTasks').textContent = todoCount + doingCount + doneCount;
}

MyHidde.addEventListener('click', function(e) {
    e.preventDefault();
    closeAddTaskModal();
});

updateTaskCounts();















// this part two 
// Add this new HTML modal structure right after your existing addTaskModal in your HTML
const multipleTasksHTML = `
<div id="multipleTasksModal" class="hidden fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
            <h3 class="text-lg leading-6 font-medium text-gray-900">Add Multiple Tasks</h3>
            <div class="mt-2 px-7 py-3">
                <textarea id="multipleTasksInput" rows="10" class="w-full p-2 border rounded-md mb-3" 
                    placeholder="Enter tasks in the format:
Title, Description, Due Date (YYYY-MM-DD), Priority (P1/P2/P3/P4)
Example:
Task 1, Description 1, 2024-11-01, P1
Task 2, Description 2, 2024-11-02, P2"></textarea>
                <div class="flex justify-between mt-2">
                    <button id="cancelMultipleTasks" class="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">Cancel</button>
                    <button id="addMultipleTasks" class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Add Tasks</button>
                </div>
            </div>
        </div>
    </div>
</div>`;

// Append the modal HTML to the body
document.body.insertAdjacentHTML('beforeend', multipleTasksHTML);

// Add new JavaScript code for multiple tasks functionality
const multipleTasksModal = document.getElementById('multipleTasksModal');
const multipleTasksInput = document.getElementById('multipleTasksInput');
const addMultipleTasksBtn = document.getElementById('addMultipleTasks');
const cancelMultipleTasksBtn = document.getElementById('cancelMultipleTasks');

// Show multiple tasks modal when clicking the Multiple button
Multiple.addEventListener('click', function() {
    multipleTasksModal.classList.remove('hidden');
});

// Cancel button functionality
cancelMultipleTasksBtn.addEventListener('click', function() {
    multipleTasksModal.classList.add('hidden');
    multipleTasksInput.value = '';
});

// Add multiple tasks functionality
addMultipleTasksBtn.addEventListener('click', function() {
    const tasksText = multipleTasksInput.value.trim();
    if (!tasksText) {
        alert('Please enter some tasks');
        return;
    }

    const taskLines = tasksText.split('\n');
    let addedTasks = 0;
    let errors = [];

    taskLines.forEach((line, index) => {
        if (line.trim() === '') return; // Skip empty lines

        const [title, description, dueDate, priority] = line.split(',').map(item => item.trim());

        // Validate input
        if (!title || !description || !dueDate || !priority) {
            errors.push(`Line ${index + 1}: Missing required fields`);
            return;
        }

        // Validate date format
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(dueDate)) {
            errors.push(`Line ${index + 1}: Invalid date format. Use YYYY-MM-DD`);
            return;
        }

        // Validate priority
        if (!['P1', 'P2', 'P3', 'P4'].includes(priority)) {
            errors.push(`Line ${index + 1}: Invalid priority. Use P1, P2, P3, or P4`);
            return;
        }

        // Create and add the task
        const newTask = createTaskElement(title, description, dueDate, priority);
        todoTasksContainer.appendChild(newTask);
        addedTasks++;
    });

    // Sort tasks after adding all of them
    sortTasksByPriority(todoTasksContainer);
    updateTaskCounts();

    // Show results
    let message = `Successfully added ${addedTasks} tasks.`;
    if (errors.length > 0) {
        message += '\n\nErrors:\n' + errors.join('\n');
    }
    alert(message);

    // Close modal and clear input
    multipleTasksModal.classList.add('hidden');
    multipleTasksInput.value = '';
});

// Add this CSS for better styling
const multipleTasksStyle = document.createElement('style');
multipleTasksStyle.textContent = `
    #multipleTasksInput {
        font-family: monospace;
        font-size: 14px;
        line-height: 1.4;
        resize: vertical;
    }

    #multipleTasksModal .rounded-md {
        transition: all 0.2s ease-in-out;
    }

    #multipleTasksModal button:hover {
        transform: translateY(-1px);
    }

    #multipleTasksModal textarea:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
    }
`;
document.head.appendChild(multipleTasksStyle);

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        multipleTasksModal.classList.add('hidden');
        multipleTasksInput.value = '';
    }
});















// final one  =================== search functions ===============================================


// Add this at the beginning of your JS code with other DOM element selections
const searchInput = document.getElementById('searchInput');

// Add this new function for search functionality
function searchTasks(searchTerm) {
    const allTasks = document.querySelectorAll('[draggable="true"]');
    searchTerm = searchTerm.toLowerCase().trim();

    allTasks.forEach(task => {
        const title = task.querySelector('h2').textContent.toLowerCase();
        if (searchTerm === '' || title.includes(searchTerm)) {
            task.classList.remove('hidden');
        } else {
            task.classList.add('hidden');
        }
    });

    // Update counts to only show visible tasks
    updateTaskCounts();
}

// Modify the updateTaskCounts function to only count visible tasks
function updateTaskCounts() {
    const todoCount = Array.from(todoTasksContainer.children)
        .filter(task => !task.classList.contains('hidden')).length;
    const doingCount = Array.from(doingTasksContainer.children)
        .filter(task => !task.classList.contains('hidden')).length;
    const doneCount = Array.from(doneTasksContainer.children)
        .filter(task => !task.classList.contains('hidden')).length;
    
    document.getElementById('todoCount').textContent = todoCount;
    document.getElementById('doingCount').textContent = doingCount;
    document.getElementById('doneCount').textContent = doneCount;
    document.getElementById('totalTasks').textContent = todoCount + doingCount + doneCount;
}

// Add event listener for search input
searchInput.addEventListener('input', (e) => {
    searchTasks(e.target.value);
});