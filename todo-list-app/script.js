const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task");
const todosList = document.getElementById("todos-list");
const itemsLeft = document.getElementById("items-left");
const clearCompletedBtn = document.getElementById("clear-completed");
const emptyState = document.querySelector(".empty-state");
const dateElement = document.getElementById("date");
const filters = document.querySelectorAll(".filter");

let todos = []
let currentFilter = "all";

filters.forEach((filter) => {
    filter.addEventListener("click", () => {
        setActiveFilter(filter.getAttribute("data-filter"))
    })
})

addTaskBtn.addEventListener("click",() => {
    addTodo(taskInput.value)
});

taskInput.addEventListener("keydown", (e) => {
    if(e.key === "Enter") addTodo(taskInput.value);
});

clearCompletedBtn.addEventListener("click", clearCompleted);

function addTodo(text) {
    if(text.trim() === "") return;

    const todo = {
        id: Date.now(),
        text,
        completed:false
    }

    todos.push(todo)
    
    saveTodos();
    renderTodos();
    taskInput.value = "";
}

function saveTodos() {
    localStorage.setItem("todos",JSON.stringify(todos));
    updateItemsCount()
    checkEmptyState()
}

function updateItemsCount() {
    const incompleteTodos = todos.filter(todo => !todo.completed)
    itemsLeft.textContent = `${incompleteTodos?.length} item${incompleteTodos.length !== 1? "s" : ""} left`;
}

function checkEmptyState() {
    const filteredTodos = filterTodos(currentFilter);
    if(filteredTodos?.length === 0) 
        emptyState.classList.remove("hidden");
    else emptyState.classList.add("hidden");
}

function filterTodos(filter) {
    switch(filter) {
        case "active":
            return todos.filter((todo) => !todo.completed);
        case "completed":
            return todos.filter((todo) => todo.completed)
        default:
            return todos;
    }
}

function renderTodos() {
    todosList.innerHTML = "";

    const filteredTodos = filterTodos(currentFilter);

    // Creating and appending the DOM elements for each todo created
    filteredTodos.forEach((todo) => {
        
        // parent list element
        const todoItem = document.createElement("li"); 
        todoItem.classList.add("todo-item");
        if(todo.completed) todoItem.classList.add("completed");

        // container to hold both the checkbox and the text in each todo
        const checkboxContainer = document.createElement("label");
        checkboxContainer.classList.add("checkbox-container");

        // checkbox before the text, to mark as completed.
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("todo-checkbox");
        checkbox.checked = todo.completed;
        checkbox.addEventListener("change",() => toggleTodo(todo.id));

        // maybe for the check(✅) tick inside the box
        const checkmark = document.createElement("span");
        checkmark.classList.add("checkmark")

        // append both the box and text inside the container
        checkboxContainer.appendChild(checkbox)
        checkboxContainer.appendChild(checkmark)

        // this is for the text that we enter in the input
        const todoText = document.createElement("span");
        todoText.classList.add("todo-item-text");
        todoText.textContent = todo.text;

        // this is for the delete button for each todo item that'll be created
        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("delete-btn");
        deleteBtn.innerHTML = `<i class="fas fa-times"></i>`;
        deleteBtn.addEventListener("click",() => deleteTodo(todo.id))

        // append container, text and button to the todoItem. (the li element)
        todoItem.appendChild(checkboxContainer)
        todoItem.appendChild(todoText)
        todoItem.appendChild(deleteBtn)

        // append the created todo to the list.
        todosList.appendChild(todoItem)

        // Note that the styles for these elements are already declared in the CSS file.
    })

    checkEmptyState();
}


function clearCompleted() {
    todos = todos.filter((todo) => !todo.completed);
    saveTodos();
    renderTodos();
}


function toggleTodo(id) {
    todos = todos.map((todo) => {
        if(todo.id === id) {
            return {...todo, completed: !todo.completed}
        }

        return todo;
    });

    saveTodos();
    renderTodos();  
}


function deleteTodo(id) {
    todos = todos.filter((todo) => todo.id !== id);
    saveTodos()
    renderTodos()
}

function loadTodos() {
    const storedTodos = localStorage.getItem("todos");
    if(storedTodos) todos = JSON.parse(storedTodos)
    renderTodos();
}

function setActiveFilter(filter) {
    currentFilter = filter

    filters.forEach(item => {
        if(item.getAttribute("data-filter") === filter) {
            item.classList.add("active");
        } else {
            item.classList.remove("active");
        }
    });

    renderTodos()
}

function setDate() {
    const options = {weekday:"long", month:"short", day:"numeric"};
    const today = new Date();

    dateElement.textContent = today.toLocaleDateString("en-IN",options)
}


window.addEventListener("DOMContentLoaded", () => {
    loadTodos();
    updateItemsCount();
    setDate();
})