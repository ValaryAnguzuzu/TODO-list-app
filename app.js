// select elements
const input = document.getElementById('todo-input');
const addButton = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');
const clearAllButton = document.getElementById('clear-all');

//Function to add a new task
function addTask () {
    const taskText = input.value.trim(); //remove extra spaces
    const priority = document.getElementById('priority').value; // Get priority
    if (taskText === '') {
        alert('Please enter a task!');
        return;
    }

    // Prevent duplicate tasks
    const existingTasks = Array.from(todoList.querySelectorAll('li')).map(
    (li) => li.textContent.replace('X', '').trim()
    );
    if (existingTasks.includes(taskText)) {
        alert('Task already exists!');
    return;
  }

    //Create new list item
    const listItem = document.createElement('li'); //Add the task text to the list item
    listItem.textContent = taskText;
    listItem.dataset.priority = priority; // Save priority as a dataset attribute
    listItem.classList.add(getPriorityClass(priority)); // Add priority-specific class
    listItem.appendChild(createDeleteButton());
    todoList.appendChild(listItem);
    input.value = '';
    makeTaskEditable(listItem);
    saveTasks();
}
/*
//Add delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'X';
    deleteBtn.classList.add('delete-btn');
    listItem.appendChild(deleteBtn);
*/
 // function to Create delete button
function createDeleteButton() {
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'X';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.addEventListener('click', (event) => {
      const listItem = event.target.parentElement;
      todoList.removeChild(listItem);
      saveTasks();
    });
    return deleteBtn;
  }
/* 
    //Append to the list
    todoList.appendChild(listItem);

    //Clear input field
    input.value = '';

    //Add delete functionality
    deleteBtn.addEventListener('click', () => {
        todoList.removeChild(listItem);
    });
}
*/

// Make task editable
function makeTaskEditable(listItem) {
  listItem.addEventListener('dblclick', () => {
    const currentText = listItem.textContent.replace('X', '').trim();
    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentText;
    listItem.textContent = '';
    listItem.appendChild(input);

    input.addEventListener('blur', () => {
      const updatedText = input.value.trim();
      if (updatedText) {
        listItem.textContent = updatedText;
        listItem.appendChild(createDeleteButton());
        makeTaskEditable(listItem);
        saveTasks();
      } else {
        alert('Task cannot be empty!');
        listItem.textContent = currentText;
        listItem.appendChild(createDeleteButton());
        makeTaskEditable(listItem);
      }
    });

    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        input.blur();
      }
    });

    input.focus();
  });
}

//Save tasks in browser
/*
function saveTasks() {
    const tasks = [];
    todoList.querySelectorAll('li').forEach((li) => {
        tasks.push(li.firstChild.textContent); // Save task text
    });
    localStorage.setItem('tasks', JSON.stringify(tasks)); // Save to localStorage
}
*/
function saveTasks() {
    const tasks = [];
    todoList.querySelectorAll('li').forEach((listItem) => {
      const taskText = listItem.textContent.trim(); // Save only the task text
      tasks.push({
          text: taskText,
          priority: listItem.dataset.priority, // Save priority
          completed: listItem.classList.contains('completed') // Save both text and completion state;
        }); 
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

function loadTasks() {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    savedTasks.forEach((task) => {
        const listItem = document.createElement('li');
        listItem.textContent = task.text;
        listItem.dataset.priority = task.priority; // Restore priority
        listItem.classList.add(getPriorityClass(task.priority));
        if (task.completed) {
            listItem.classList.add('completed'); // Restore completed state
        }
        listItem.appendChild(createDeleteButton());
        todoList.appendChild(listItem);
        makeTaskEditable(listItem);
    });
}

function getPriorityClass(priority) {
  if (priority === 'High') return 'priority-high';
  if (priority === 'Medium') return 'priority-medium';
  if (priority === 'Low') return 'priority-low';
  return '';
}


//Add task on button click
addButton.addEventListener('click', addTask);

//Add task on "Enter" key press
input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        addTask();
    }
});

//Clear all tasks
clearAllButton.addEventListener('click', () => {
    todoList.innerHTML = '';
    localStorage.removeItem('tasks'); // Clear tasks in localStorage
});

// Function to filter tasks
function filterTasks(filter) {
    const tasks = todoList.querySelectorAll('li');
    tasks.forEach((task) => {
        if (filter === 'all') {
        task.style.display = 'flex'; // Show all tasks
        } else if (filter === 'completed' && !task.classList.contains('completed')) {
        task.style.display = 'none'; // Hide non-completed tasks
        } else if (filter === 'pending' && task.classList.contains('completed')) {
        task.style.display = 'none'; // Hide completed tasks
        } else {
        task.style.display = 'flex'; // Show relevant tasks
        }
    });
}

//add event listeners to filter buttons
const filterButtons = document.querySelectorAll('.filter-btn');
filterButtons.forEach((btn) => {
    btn.addEventListener('click', (event) => {
        //remove active class from buttons
        filterButtons.forEach((b) => b.classList.remove('active'));
        //add active class to clicked button
        event.target.classList.add('active');
        //filter tasks based on button clicked
        filterTasks(event.target.id.replace('filter-', ''));
    });
});

  // Add "completed" class toggle when marking tasks
todoList.addEventListener('click', (event) => {
    if (event.target.tagName === 'LI') {
        event.target.classList.toggle('completed');
        saveTasks();
    }
  });

//Call loadTasks on page load
document.addEventListener('DOMContentLoaded', loadTasks);


