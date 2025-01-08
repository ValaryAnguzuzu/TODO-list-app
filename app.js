// select elements
const input = document.getElementById('todo-input');
const addButton = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');
const clearAllButton = document.getElementById('clear-all');
const sortDropdown = document.getElementById('sort-tasks');
const sortButton = document.getElementById('sort-btn');


// Function to create a new task element (Consolidated repetitive task creation logic)
function createTaskElement(taskText, priority, isCompleted = false) {
    const listItem = document.createElement('li'); // Create a list item
    const checkbox = document.createElement('input'); // Create a checkbox
    checkbox.type = 'checkbox';
    checkbox.checked = isCompleted; // Set checkbox state based on completion
    checkbox.addEventListener('change', () => {
        listItem.classList.toggle('completed'); // Toggle the completed class
        saveTasks(); // Save the updated tasks
        updateMessages(); // Update both pending and completed messages
    });

    listItem.appendChild(checkbox); // Add the checkbox to the list item

    // Add the task text
    const taskTextSpan = document.createElement('span');
    taskTextSpan.textContent = taskText;
    listItem.appendChild(taskTextSpan);

    // Add priority display
    const priorityIcon = document.createElement('span'); // Create a span for priority icon
    if (priority === 'low') {
        priorityIcon.textContent = '🟢 Low';
    } else if (priority === 'medium') {
        priorityIcon.textContent = '🟡 Medium';
    } else if (priority === 'high') {
        priorityIcon.textContent = '🔴 High';
    }
    priorityIcon.classList.add('priority-icon'); 
    priorityIcon.style.marginLeft = '5px';
    listItem.appendChild(priorityIcon); // Append the priority icon to the task

    // Store the priority as a dataset attribute
    listItem.dataset.priority = priority;
    listItem.classList.add(getPriorityClass(priority)); // Add a priority-specific class

    listItem.appendChild(createDeleteButton()); // Add the delete button
    makeTaskEditable(listItem); // Make the task editable on double-click

    if (isCompleted) listItem.classList.add('completed'); // Mark as completed if needed
    return listItem;
}


//Function to add a new task
function addTask() {
    const taskText = input.value.trim(); // Get and trim the input value
    const priority = document.getElementById('priority').value; // Get the selected priority
    if (taskText === '') {
        alert('Please enter a task!'); // Alert if the input is empty
        return;
    }

    // Check for duplicate tasks
    const existingTasks = Array.from(todoList.querySelectorAll('li')).map((li) =>
        li.querySelector('input[type="checkbox"]')
            ? li.textContent.replace(/\[.*\]/, '').replace('X', '').trim()
            : li.textContent.trim()
    );

    if (existingTasks.includes(taskText)) {
        alert('Task already exists!'); // Alert if a duplicate task is found
        return;
    }

    // Create and append the new task
    const newTask = createTaskElement(taskText, priority);
    todoList.appendChild(newTask);
    input.value = ''; // Clear the input field
    saveTasks(); // Save the updated tasks
    updateMessages(); // Update both pending and completed messages
  }

  // Function to create a delete button
  function createDeleteButton() {
    const deleteBtn = document.createElement('button'); // Create a delete button
    deleteBtn.textContent = 'X'; // Add "X" as the button text
    deleteBtn.classList.add('delete-btn'); // Add a delete button class
    deleteBtn.addEventListener('click', (event) => {
        const listItem = event.target.parentElement; // Get the parent list item
        todoList.removeChild(listItem); // Remove the task
        saveTasks(); // Save the updated tasks
        updateMessages(); // Update both pending and completed messages
    });
    return deleteBtn;

  }

// Function to make a task editable
function makeTaskEditable(listItem) {
  listItem.addEventListener('dblclick', () => {
      const currentText = listItem.querySelector('span').textContent.replace(/\[.*\]/, '').trim(); // Get current task text
      const input = document.createElement('input'); // Create an input field
      const priority = listItem.dataset.priority; // Get the task's priority
      const isChecked = listItem.querySelector('input[type="checkbox"]').checked; // Check if the task is completed
      input.type = 'text';
      input.value = currentText; // Set the current text as the input value

      listItem.textContent = ''; // Clear the list item's content
      listItem.appendChild(input); // Add the input field

      input.addEventListener('blur', () => {
          const updatedText = input.value.trim();
          if (updatedText) {
              // Replace the task with an updated task element
              const updatedTask = createTaskElement(updatedText, priority, isChecked);
              listItem.replaceWith(updatedTask);
              saveTasks(); // Save the updated tasks
              updateMessages(); // Update messages dynamically
          } else {
              alert('Task cannot be empty!'); // Alert if the input is empty
              listItem.textContent = currentText; // Restore the original text
              makeTaskEditable(listItem); // Re-enable editing
          }
      });

      input.addEventListener('keydown', (event) => {
          if (event.key === 'Enter') {
              input.blur(); // Save changes on pressing Enter
          }
      });

      input.focus(); // Automatically focus on the input field
  });
}


// Save tasks to localStorage
function saveTasks() {
  const tasks = Array.from(todoList.querySelectorAll('li')).map((listItem) => ({
      text: listItem.querySelector('span').textContent,
      priority: listItem.dataset.priority,
      completed: listItem.classList.contains('completed'),
  }));
  localStorage.setItem('tasks', JSON.stringify(tasks)); // Save tasks as a JSON string
}

// Load tasks from localStorage
function loadTasks() {
  let savedTasks = [];
  try {
      savedTasks = JSON.parse(localStorage.getItem('tasks')) || []; // Parse saved tasks or default to an empty array
  } catch (error) {
      console.error('Error loading tasks:', error); // Log errors in parsing
  }
  savedTasks.forEach((task) => {
    const taskElement = createTaskElement(task.text.replace(/\[.*\]/, '').trim(), task.priority, task.completed); 
    todoList.appendChild(taskElement); // Append each saved task to the list
  });
}

// Get priority-specific CSS class
function getPriorityClass(priority) {
  if (priority === 'high') return 'priority-high';
  if (priority === 'medium') return 'priority-medium';
  if (priority === 'low') return 'priority-low';
  return '';
}

// Update both pending and completed messages
function updateMessages() {
  updatePendingMessage(); // Update the pending tasks message
  updateCompletedMessage(); // Update the completed tasks message
}

// Update pending message
function updatePendingMessage() {
  const tasks = todoList.querySelectorAll('li');
  const pendingCount = Array.from(tasks).filter((task) => !task.classList.contains('completed')).length; // Count pending tasks

  const pendingMessage = document.createElement('p');
  pendingMessage.id = 'pending-message';
  pendingMessage.textContent = `You have ${pendingCount} ${pendingCount === 1 ? 'task' : 'tasks'} pending`;
  pendingMessage.style.textAlign = 'center';
  pendingMessage.style.color = 'purple';

  if (!document.getElementById('pending-message')) {
      todoList.parentElement.appendChild(pendingMessage); // Append the message
  } else {
      document.getElementById('pending-message').textContent = pendingMessage.textContent; // Update existing message
  }
}

// Update completed message
function updateCompletedMessage() {
  const tasks = todoList.querySelectorAll('li');
  const completedCount = Array.from(tasks).filter((task) => task.classList.contains('completed')).length; // Count completed tasks

  const completedMessage = document.createElement('p');
  completedMessage.id = 'completed-message';
  completedMessage.textContent =
      completedCount === 0
          ? 'Sorry🥺 You have no completed tasks!'
          : `You have ${completedCount} ${completedCount === 1 ? 'task' : 'tasks'} completed🎊🎉`;
  completedMessage.style.textAlign = 'center';
  completedMessage.style.color = 'purple';

  if (!document.getElementById('completed-message')) {
      todoList.parentElement.appendChild(completedMessage); // Append the message
  } else {
      document.getElementById('completed-message').textContent = completedMessage.textContent; // Update existing message
  }
}

// Add task on button click
addButton.addEventListener('click', addTask);

// Add task on "Enter" key press
input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
      addTask();
  }
});

// Clear all tasks
clearAllButton.addEventListener('click', () => {
  todoList.innerHTML = ''; // Clear all tasks from the DOM
  localStorage.removeItem('tasks'); // Clear tasks from localStorage
  updateMessages(); // Reset messages
});

// Filter tasks
function filterTasks(filter) {
  const tasks = todoList.querySelectorAll('li');
  tasks.forEach((task) => {
      task.style.display =
          filter === 'all' ||
          (filter === 'completed' && task.classList.contains('completed')) ||
          (filter === 'pending' && !task.classList.contains('completed'))
              ? 'flex'
              : 'none';
  });
  updateMessages(); // Update messages dynamically based on the filter
}

// Sorting function
function sortTasks() {
    const tasks = Array.from(todoList.querySelectorAll('li'));

    // Get the selected sort option
    const sortBy = sortDropdown.value;

    if (sortBy === 'priority') {
        // Sort by priority (High > Medium > Low)
        tasks.sort((a, b) => {
            const priorityOrder = { high: 1, medium: 2, low: 3 };
            return priorityOrder[a.dataset.priority] - priorityOrder[b.dataset.priority];
        });
    } else if (sortBy === 'alphabetical') {
        // Sort by alphabetical order
        tasks.sort((a, b) => {
            const textA = a.querySelector('span').textContent.toLowerCase();
            const textB = b.querySelector('span').textContent.toLowerCase();
            return textA.localeCompare(textB);
        });
    }

  // Clear the list and append sorted tasks
  todoList.innerHTML = '';
  tasks.forEach(task => todoList.appendChild(task));
}

// Add filter button event listeners
const filterButtons = document.querySelectorAll('.filter-btn');
filterButtons.forEach((btn) => {
  btn.addEventListener('click', (event) => {
      filterButtons.forEach((b) => b.classList.remove('active')); // Remove active class from all buttons
      event.target.classList.add('active'); // Add active class to the clicked button
      filterTasks(event.target.id.replace('filter-', '')); // Filter tasks based on the button's ID
  });
});

sortButton.addEventListener('click', sortTasks);

// Load tasks and update messages on page load
document.addEventListener('DOMContentLoaded', () => {
  loadTasks(); // Load tasks from localStorage
  updateMessages(); // Update pending and completed messages
});