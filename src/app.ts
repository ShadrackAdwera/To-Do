/// <reference path="./models/drag-drop-interfaces.ts" />
/// <reference path="./models/project-model.ts" />
/// <reference path="./state/app-state.ts" />
/// <reference path="./decorators/autobind.ts" />
/// <reference path="./components/app-component.ts" />
/// <reference path="./components/todo-item.ts" />
/// <reference path="./components/todo-input.ts" />
/// <reference path="./components/todo-list.ts" />

/*
Display the form when the class is instantiated
*/

namespace App {

new TodoInput();
new TodoList('active');
new TodoList('complete');
}