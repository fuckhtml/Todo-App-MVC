class Model {
  // 0. State of the model
  //    an array of todo objects, 
  //    prepopulated with some data
  constructor() {
    this.todos = [
      {id: 1, text: 'Learn 10 new words', complete: false},
      {id: 2, text: 'Translate a song', complete: false},
    ];
  }

  // 1. First method to manipulate 
  //    its own data
  addTodo(todoText) {
    const todo = {
      id: this.todos.length > 0 ? this.todos[this.todos.length - 1].id + 1 : 0,
      text: todoText,
      complete: false,
    }

    this.todos.push(todo);
  }

  // 2. Second method to manipulate
  //    its own data
  editTodo(id, text) {
    this.todos = this.todos.map((todo) => 
      todo.id === id ? {id: id, text: text, complete: todo.complete} : todo
    )
  }

  // 3. Third method to manipulate
  //    its own data
  deleteTodo(id) {
    this.todos = this.todos.filter((todo) => todo.id !== id);
  }

  // 4. Fourth method to manipulate
  //    it own data
  toggleTodo(id) {
    this.todos = this.todos.map((todo) => 
      todo.id === id ? {id: todo.id, text: todo.text, complete: !todo.complete} : todo
    )
  }
}

class View {
  // 1. Helper method 1
  //    Create an element
  createElement(tag, className) {
    const element = document.createElement(tag);
    className && element.classList.add(className);

    return element;
  }

  // 2. Helper method 2
  //    Retrieve an element
  getElement(selector) {
    const element = document.querySelector(selector);
  
    return element;
  }
  
  constructor() {
    // Setting up all the things
    // Root Element. Title h1. Form, input and button. And todos in ul
    // We'll make them all variables, so it's easy to get access to them

    // Root element
    this.app = this.getElement('#root');

    // Title h1
    this.title = this.createElement('h1');
    this.title.textContent = 'Todos';

    // Form, input and button
    this.form = this.createElement('form');

    this.input = this.createElement('input');
    this.input.type = 'text';
    this.input.placeholder = 'Add todo';
    this.input.name = 'todo';

    this.submitButton = this.createElement('button');
    this.submitButton.textContent = 'Submit';

    // Visual representation of todo list
    this.todoList = this.createElement('ul', 'todo-list');

    // Append the form with input and submit button
    this.form.append(this.input, this.submitButton);

    // Append the application with title, form and todo list
    this.app.append(this.title, this.form, this.todoList);
  }
}

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }
}

const app = new Controller(new Model(), new View());