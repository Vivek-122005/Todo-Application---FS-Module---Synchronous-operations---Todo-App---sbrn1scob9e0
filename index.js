const fs = require('fs');
const path = require('path');


const dbPath = path.join(__dirname, 'db.txt');


function createTodoSync(title) {
  const newTodo = {
    id: Date.now(),
    title: title,
    isCompleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  const todoString = JSON.stringify(newTodo, null, 2);
  
  fs.appendFileSync(dbPath, todoString + '\n'); 
  
  return newTodo;
}

function getTodosSync() {
  try {
    const data = fs.readFileSync(dbPath, 'utf-8');
    return data;
  } catch (error) {
    return '';
  }
}


function getTodoSync(id) {
  const data = getTodosSync();
  const todos = data.trim().split('\n').map(line => JSON.parse(line));
  
  const todo = todos.find(t => t.id === id);
  return todo ? JSON.stringify(todo, null, 2) : null;
}

function updateTodoSync(id, updates) {
  const data = getTodosSync();
  const todos = data.trim().split('\n').map(line => JSON.parse(line));

  const index = todos.findIndex(t => t.id === id);
  if (index === -1) return null;

  todos[index] = {
    ...todos[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  const updatedData = todos.map(todo => JSON.stringify(todo, null, 2)).join('\n');
  fs.writeFileSync(dbPath, updatedData + '\n');
  
  return todos[index];
}

function deleteTodoSync(id) {
  const data = getTodosSync();
  const todos = data.trim().split('\n').map(line => JSON.parse(line));
  
  const updatedTodos = todos.filter(t => t.id !== id);
  
  const updatedData = updatedTodos.map(todo => JSON.stringify(todo, null, 2)).join('\n');
  fs.writeFileSync(dbPath, updatedData + '\n');
  
  return todos.length !== updatedTodos.length; 
}

module.exports = {
  createTodoSync,
  getTodosSync,
  getTodoSync,
  updateTodoSync,
  deleteTodoSync,
};
