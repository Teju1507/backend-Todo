const express = require("express")
const app = express()
const port = 3001

// Middleware to parse JSON bodies
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// In-memory data storage
let todos = []
let nextId = 1

// Serve the HTML content for the root URL
app.get("/", (req, res) => {
  res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>To-Do List</title>
            <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #29648a;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .container {
            margin-top: 40px;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            background: linear-gradient(#265077, #022140);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
            border-radius: 10px;
        }
        h1 {
            color: #fff;
            text-align: center;
            margin-bottom: 20px;
        }
        #addTaskButton {
            background-color: #265077;
            color: white;
            border: none;
            padding: 10px 20px;
            font-size: 16px;
            border-radius: 5px;
            cursor: pointer;
            margin-bottom: 20px;
        }
        #addTaskButton:hover {
            background-color: #022140;
        }
        #taskForm {
            margin-top: 50px;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        #taskForm input[type="text"], #taskForm input[type="date"], #taskForm input[type="checkbox"] {
            display: block;
            width: calc(100% - 20px);
            margin: 10px 0;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            box-sizing: border-box;
        }
        #taskForm input[type="text"], #taskForm input[type="date"] {
            font-size: 14px;
        }
        #taskForm input[type="checkbox"] {
            width: auto;
            margin-right: 10px;
            display: inline-block;
        }
        #taskForm label {
            display: block;
            font-size: 14px;
            margin-bottom: 5px;
            color: #333;
        }
        #taskForm button {
            padding: 10px 15px;
            font-size: 14px;
            background-color: #265077;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            margin-right: 10px;
        }
        #taskForm button:hover {
            background-color: #022140;
        }
        #tasks {
            margin-top: 20px;
        }
        .task {
        background-color: #ffffff;
        padding: 15px;
        border: 1px solid #ddd;
        border-radius: 5px;
        margin-bottom: 10px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .task-box {
        padding: 10px;
        border-radius: 5px;
        margin-right: 10px;
        display: inline-block;
    }
    .task-box.description {
        background-color: #e3f2fd;
        flex-grow: 1;
    }
    .task-box.status {
        background-color: #e8f5e9;
    }
    .task-box.date {
        background-color: #fce4ec;
    }
    .task-actions {
        display: flex;
        gap: 10px;
    }
    .task-actions button {
        background-color: #265077;
        color: white;
        border: none;
        padding: 5px 10px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 12px;
    }
    .task-actions button:hover {
        background-color: #022140;
    }

#taskDetails {
    margin-top: 20px;
}
/* Calendar container */
#calendar {
    display: grid;
    grid-template-columns: repeat(7, 1fr); /* 7 columns for days of the week */
    gap: 1px; /* Optional: adds spacing between days */
    border: 1px solid #ccc; /* Border around the entire calendar */
}

/* Header row for days of the week */
.calendar-header {
    display: contents; /* Use the grid layout of the parent */
}

/* Style for days of the week */
.calendar-header-day {
    background-color: #f0f0f0; /* Light background for day headers */
    text-align: center;
    padding: 10px;
    border-bottom: 1px solid #ddd; /* Border below the day headers */
    font-weight: bold;
}

/* Style for calendar days */
.calendar-day {
    text-align: center;
    padding: 10px;
    border: 1px solid #022140; /* Border around each day cell */
    cursor: pointer;
    color:#265077;
    transition: background-color 0.3s;
}

.calendar-day:hover {
    background-color: #265077; /* Light background on hover */
    color:#022140;
}

/* Style for empty cells (days before the start of the month) */
.calendar-day.empty {
    background-color: #e0e0e0; /* Grey background for empty cells */
}

/* Calendar controls (buttons) */
#calendar-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

/* Styling for the month display */
#calendar-month {
    font-size: 1.2em;
    font-weight: bold;
    color:#fff;
}
#prevMonthButton, #nextMonthButton{
 background-color: #265077;
            color: white;
            border: none;
            padding: 10px 20px;
            font-size: 16px;
            border-radius: 5px;
            cursor: pointer;
            margin-bottom: 20px;
            margin-top:10px;
            }
#prevMonthButton:hover, #nextMonthButton:hover{
          background-color: #022140;
        }

    </style>

        </head>
        <body>
           <div class="container">
    <h1>Welcome to the To-Do List</h1>
    <button id="addTaskButton">Add Task</button>
    <div id="taskForm">
        <input type="text" id="taskText" placeholder="Task Description">
        <input type="checkbox" id="taskCompleted"> Completed
        <input type="date" id="taskDate">
        <button id="saveTaskButton">Save Task</button>
        <button id="cancelEditButton" style="display: none;">Cancel</button>
    </div>

<div id="calendar-controls">
    <button id="prevMonthButton">Previous Month</button>
    <span id="calendar-month"></span>
    <button id="nextMonthButton">Next Month</button>
</div>
<div id="calendar"></div>
<div id="tasks"></div>
</div>
 <script>
    let editingTaskId = null;

    document.getElementById('addTaskButton').addEventListener('click', () => {
        document.getElementById('taskForm').style.display = 'block';
        document.getElementById('saveTaskButton').textContent = 'Save Task';
        document.getElementById('cancelEditButton').style.display = 'none';
        clearForm();
    });

    document.getElementById('saveTaskButton').addEventListener('click', async () => {
        const taskText = document.getElementById('taskText').value;
        const taskCompleted = document.getElementById('taskCompleted').checked;
        const taskDate = document.getElementById('taskDate').value;
        console.log('Task Date:', taskDate); // Check the date format

        if (taskText) {
            try {
                const method = editingTaskId ? 'PUT' : 'POST';
                const url = editingTaskId ? '/' + editingTaskId : '/';

                // Ensure the date is treated as a simple string without time information
                const taskData = {
                    text: taskText,
                    completed: taskCompleted,
                    date: taskDate // Keep this as the date string from the input
                };

                const response = await fetch(url, {
                    method: method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(taskData)
                });
                if (response.ok) {
                    await loadTasksForDate();
                    document.getElementById('taskForm').style.display = 'none';
                    clearForm();
                } else {
                    alert('Failed to save task');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        } else {
            alert('Task description is required');
        }
    });

    document.getElementById('cancelEditButton').addEventListener('click', () => {
        document.getElementById('taskForm').style.display = 'none';
        clearForm();
    });

    let currentYear = new Date().getFullYear();
    let currentMonth = new Date().getMonth();

    // Function to generate the calendar
    function generateCalendar(year, month) {
        var calendar = document.getElementById('calendar');
        var calendarMonth = document.getElementById('calendar-month');
        calendar.innerHTML = '';

        var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        calendarMonth.textContent = monthNames[month] + ' ' + year;

        var daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        var headerRow = document.createElement('div');
        headerRow.className = 'calendar-header';
        for (var i = 0; i < daysOfWeek.length; i++) {
            var dayHeader = document.createElement('div');
            dayHeader.className = 'calendar-day calendar-header-day';
            dayHeader.textContent = daysOfWeek[i];
            headerRow.appendChild(dayHeader);
        }
        calendar.appendChild(headerRow);

        var firstDay = new Date(year, month).getDay();
        var daysInMonth = new Date(year, month + 1, 0).getDate();

        for (var i = 0; i < firstDay; i++) {
            var emptyCell = document.createElement('div');
            emptyCell.className = 'calendar-day empty';
            calendar.appendChild(emptyCell);
        }

        for (var day = 1; day <= daysInMonth; day++) {
            var dayCell = document.createElement('div');
            dayCell.className = 'calendar-day';
            dayCell.textContent = day;
            dayCell.addEventListener('click', (function(day) {
                return function() {
                    console.log('Clicked day: ' + day); // Check if the click is registered
                    loadTasksForDate(year, month + 1, day);
                };
            })(day));
            calendar.appendChild(dayCell);
        }
}
    async function loadTasksForDate(year, month, day) {
    console.log(year,month,day)
        document.getElementById('taskForm').style.display = 'block'; // Ensure the form is visible
        try {
            const response = await fetch('/todos');
            if (!response.ok) throw new Error('Network response was not ok');
            const tasks = await response.json();

            const tasksDiv = document.getElementById('tasks');
            tasksDiv.innerHTML = ''; // Clear existing tasks

            tasks.forEach(task => {
                const taskDate = new Date(task.date);
                if (taskDate.getFullYear() === year && taskDate.getMonth() + 1 === month && taskDate.getDate() + 1 === day) {
                    const taskElement = document.createElement('div');
                    taskElement.className = 'task';

                    const descriptionBox = document.createElement('div');
                    descriptionBox.className = 'task-box description';
                    descriptionBox.textContent = task.text;

                    const statusBox = document.createElement('div');
                    statusBox.className = 'task-box status';
                    statusBox.textContent = task.completed ? 'Completed' : 'Not Completed';

                    const dateBox = document.createElement('div');
                    dateBox.className = 'task-box date';
                    dateBox.textContent = task.date;

                    const actionsDiv = document.createElement('div');
                    actionsDiv.className = 'task-actions';

                    const editButton = document.createElement('button');
                    editButton.textContent = 'Edit';
                    editButton.onclick = () => editTask(task.id);
                    actionsDiv.appendChild(editButton);

                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Delete';
                    deleteButton.onclick = () => deleteTask(task.id);
                    actionsDiv.appendChild(deleteButton);

                    const toggleCompleteButton = document.createElement('button');
                    toggleCompleteButton.textContent = task.completed ? 'Mark as Incomplete' : 'Mark as Complete';
                    toggleCompleteButton.onclick = () => toggleComplete(task.id);
                    actionsDiv.appendChild(toggleCompleteButton);

                    taskElement.appendChild(descriptionBox);
                    taskElement.appendChild(statusBox);
                    taskElement.appendChild(dateBox);
                    taskElement.appendChild(actionsDiv);

                    tasksDiv.appendChild(taskElement);
                }
            });
        } catch (error) {
            console.error('Error:', error);
        }
    }

    document.getElementById('prevMonthButton').addEventListener('click', () => {
        if (currentMonth === 0) {
            currentMonth = 11;
            currentYear--;
        } else {
            currentMonth--;
        }
        generateCalendar(currentYear, currentMonth);
    });

    document.getElementById('nextMonthButton').addEventListener('click', () => {
        if (currentMonth === 11) {
            currentMonth = 0;
            currentYear++;
        } else {
            currentMonth++;
        }
        generateCalendar(currentYear, currentMonth);
    });

    // Initialize calendar
    generateCalendar(currentYear, currentMonth);

    window.editTask = async (id) => {
        try {
            const response = await fetch('/todos');
            const tasks = await response.json();
            const task = tasks.find(t => t.id === id);
            if (task) {
                editingTaskId = id;
                document.getElementById('taskText').value = task.text;
                document.getElementById('taskCompleted').checked = task.completed;
                document.getElementById('taskDate').value = task.date;
                document.getElementById('taskForm').style.display = 'block';
                document.getElementById('saveTaskButton').textContent = 'Update Task';
                document.getElementById('cancelEditButton').style.display = 'inline-block';
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

window.deleteTask = async function(taskId) {
    try {
       const response = await fetch('/' + taskId, {
    method: 'DELETE',
});

        if (response.ok) {
            await loadTasksForDate(); // Reload the tasks after deletion
        } else {
            alert('Failed to delete task');
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

// Function to toggle the completion status of a task
window.toggleComplete = async function(taskId, currentStatus) {
    try {
        const response = await fetch('/' + taskId, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed: !currentStatus }),
});

        if (response.ok) {
            await loadTasksForDate(); // Reload the tasks after updating
        } else {
            alert('Failed to update task');
        }
    } catch (error) {
        console.error('Error:', error);
    }
};
    function clearForm() {
        document.getElementById('taskText').value = '';
        document.getElementById('taskCompleted').checked = false;
        document.getElementById('taskDate').value = '';
        editingTaskId = null;
    }

    // Initial task load
    loadTasksForDate();
</script>
        </body>
        </html>
    `)
})

// API routes
app.get("/todos", (req, res) => {
  res.json(todos)
})

// Endpoint to add a new task
app.post("/", (req, res) => {
  const newTask = { id: nextId++, ...req.body }
  todos.push(newTask)
  res.status(201).json(newTask)
})

// Endpoint to update a task (mark as complete or edit)
app.put("/:id", (req, res) => {
  const taskId = parseInt(req.params.id)
  const taskIndex = todos.findIndex((task) => task.id === taskId)

  if (taskIndex !== -1) {
    todos[taskIndex] = { ...todos[taskIndex], ...req.body }
    res.json(todos[taskIndex])
  } else {
    res.status(404).send("Task not found")
  }
})

// Endpoint to delete a task
app.delete("/:id", (req, res) => {
  const taskId = parseInt(req.params.id)
  const taskIndex = todos.findIndex((task) => task.id === taskId)

  if (taskIndex !== -1) {
    const deletedTask = todos.splice(taskIndex, 1)
    res.json(deletedTask[0])
  } else {
    res.status(404).send("Task not found")
  }
})
// Endpoint to retrieve a specific task by its ID
app.get("/todos/:id", (req, res) => {
  const taskId = parseInt(req.params.id)
  const task = todos.find((task) => task.id === taskId)

  if (task) {
    res.json(task)
  } else {
    res.status(404).send("Task not found")
  }
})
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
