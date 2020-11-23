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
  constructor() {}
}

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }
}

const app = new Controller(new Model(), new View());