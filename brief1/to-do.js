const addTask = document.getElementById('addTask');
const Multiple = document.getElementById('Multiple');
const addTaskModal = document.getElementById('addTaskModal');
let myH

function faddTask() {
  alert('It was clicked!');
  addTaskModal.classList.add('show');

}
addTask.addEventListener('click' , faddTask);