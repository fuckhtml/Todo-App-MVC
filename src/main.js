class Model {
  // 0. State of the model
  //    an array of todo objects, 
  //    prepopulated with some data
  constructor() {
    this.todos = JSON.parse(window.localStorage.getItem('todos')) || [];
    // this.todos = [
    //   {id: 1, text: 'Learn 10 new words', complete: false},
    //   {id: 2, text: 'Translate a song', complete: false},
    // ];
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

    this.onTodoListChanged();
  }

  // 2. Second method to manipulate
  //    its own data
  editTodo(id, text) {
    this.todos = this.todos.map((todo) => 
      todo.id === id ? {id: id, text: text, complete: todo.complete} : todo
    )

    this.onTodoListChanged();
  }

  // 3. Third method to manipulate
  //    its own data
  deleteTodo(id) {
    this.todos = this.todos.filter((todo) => todo.id !== id);

    this.onTodoListChanged();
  }

  // 4. Fourth method to manipulate
  //    it own data
  toggleTodo(id) {
    this.todos = this.todos.map((todo) => 
      todo.id === id ? {id: todo.id, text: todo.text, complete: !todo.complete} : todo
    )

    this.onTodoListChanged();
  }

  bindTodoListChanged(callback) {
    this.onTodoListChanged = function() {
      callback(this.todos);
      this._commit();
    }
  }

  _commit() {
    window.localStorage.setItem('todos', JSON.stringify(this.todos));
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

    // ---
    this._bufferedText = '';
    this._setHandlerTodoOnEditing(); 
  }

  get _todoText() {
    return this.input.value;
  }

  _resetInput() {
    this.input.value = '';
  }

  // DisplayTodos method is called with todos parameter 
  // from the Model Class everytime, when the todos list 
  // is changed. Display method creates ul and lis with the todos.
  // This sync implementation allows always to show the last state 
  // of the data.
  displayTodos(todos) {
    // Delete all nodes
    while (this.todoList.firstChild) {
      this.todoList.removeChild(this.todoList.firstChild);
    }

    if (todos.length === 0) {
  
      // Show default message
      const p = this.createElement('p');
      p.textContent = 'Nothing to do. Add a task?';
      this.todoList.append(p);
  
    } else {
      // Loop through all the todos and display 
      // a checkbox, span and delete button.

      todos.forEach(todo => {
        const li = this.createElement('li');
        li.id = todo.id;

        // add a checkbox
        const checkbox = this.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.complete;

        // add a contenteditable span with todo text
        const span = this.createElement('span', 'editable');
        span.contentEditable = true;

        // if the todo is complete, the span should have a strickthrough
        if (todo.complete) {
          const s = this.createElement('s');
          s.textContent = todo.text;
          span.append(s);
        } else {
          span.textContent = todo.text;
        }

        // add a delete button
        const deleteButton = this.createElement('button', 'delete');
        deleteButton.textContent = 'Delete';

        // append the li with the ckeckbox, the span and the delete button
        li.append(checkbox, span, deleteButton);

        // append todoList with the li
        this.todoList.append(li);
      });
    }
  }

  //
  // # One of the most important part
  // View-Model binding methods
  bindAddTodo (handler) {
    this.form.addEventListener('submit', (event) => {
      event.preventDefault();

      if (this._todoText) {
        handler(this._todoText);
        this._resetInput();
      }
    })
  }

  bindDeleteTodo (handler) {
    this.todoList.addEventListener('click', (event) => {
      if (event.target.className === 'delete') {
        const id = parseInt(event.target.parentElement.id);

        handler(id);
      }
    })
  }

  bindToggleTodo (handler) {
    this.todoList.addEventListener('click', (event) => {
      if (event.target.type === 'checkbox') {
        const id = parseInt(event.target.parentElement.id);

        handler(id);
      }
    })
  }

  // Update temporary state
  _setHandlerTodoOnEditing() {
    this.todoList.addEventListener('input', (event) => {
      if (event.target.className === 'editable') {
        this._bufferedText = event.target.textContent;
      }
    })
  }

  bindEditTodo(handler) {
    this.todoList.addEventListener('focusout', (event) => {
      if (event.target.className === 'editable' && this._bufferedText) {
        const id = parseInt(event.target.parentElement.id);

        handler(id, this._bufferedText);
        this._bufferedText = '';
      }      
    })
  }
}

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    // Display Initial TodoList
    this.onTodoListChanged(this.model.todos);
  
    // # One of the most important part
    // Bind Model-View
    this.view.bindAddTodo( this.handleAddTodo.bind(this) );
    this.view.bindDeleteTodo( this.handleDeleteTodo.bind(this) );
    this.view.bindToggleTodo( this.handleToggleTodo.bind(this) );
    this.view.bindEditTodo( this.handleEditTodo.bind(this) );

    this.model.bindTodoListChanged(this.onTodoListChanged.bind(this));
  }

  onTodoListChanged(todos) {
    this.view.displayTodos(todos);
  }

  // # One of the most important part
  // View-Model Handlers
  handleAddTodo(todoText) {
    this.model.addTodo(todoText);
  }

  handleEditTodo(id, todoText) {
    this.model.editTodo(id, todoText);
  }

  handleDeleteTodo(id) {
    this.model.deleteTodo(id);
  }

  handleToggleTodo(id)  {
    this.model.toggleTodo(id);
  }

}

const app = new Controller(new Model(), new View());