const addTask = document.getElementById('addTask');
const Multiple = document.getElementById('Multiple');
const addTaskModal = document.getElementById('addTaskModal');
const MyHidde = document.getElementById('MyHidde')
const Task = document.getElementById('Task')



// add task function
function faddTask() {
  // alert('It was clicked!');
  addTaskModal.classList.remove('hidden');


}
addTask.addEventListener('click' , faddTask);
//copie and creat the tasks
const clonedTask = Task.cloneNode(true); // 'true' means a deep copy, including child elements
clonedTask.id = 'newElementId'; //Change the ID to avoid duplicates



// annuler function 
function fhiddetask() {
  addTaskModal.classList.add('hidden');
}
MyHidde.addEventListener('click' ,fhiddetask )
