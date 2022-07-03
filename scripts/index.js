const formTodo = document.querySelector('.todo__form');
const formInput = document.querySelector('.input--form');
const submitButton = document.querySelector('.button--submit');

const todoList = document.querySelector('.todo__list');
const todoItems = document.querySelectorAll('.todo__item');

const checkboxInput = document.querySelector('.input--checkbox');
const todoInput = document.querySelector('.input--todo');

const todoDone = document.querySelector('.todo__done');
const todoDoneText = document.querySelector('.todo__done-text');
const todoDoneImg = document.querySelector('.todo__done-img');

const initAdvices = ['become developer', 'buy a car', 'pay credit', 'deep studying js', 'buy a house'];

const popUp = document.querySelector('.pop-up');
const popUpClose = document.querySelector('.pop-up__close');
const clearButtonToDoList = document.querySelector('.button__clear');
const cancelButton = document.querySelector('.button__cancel');

formTodo.addEventListener('submit', function(event) {
  event.preventDefault();
  if (formInput.value !== '') {
    addTaskInToDoList();
  } else {
    console.log('error');
  }
});

function addTaskInToDoList() {
  createToDoTask(formInput.value);
  formInput.value = '';
  deleteTodoItem();
  changeTodoItem();
  suggestAdvice();
  checkChildInTodoList();
  saveToDoList();
}

function createToDoTask(value) {
  todoList.insertAdjacentHTML('beforeend', `
         <li class="todo__item">
            <label for="input--custom" clas="todo__label">
                     <input type="checkbox" class="input input--checkbox todo__checkbox" id="input--custom">
          <span class="input--custom"></span>
          </label>
          <p class="todo__text">${value}</p>
          <button class="button todo__delete"><i class='bx bx-trash button__delete'></i></button>
        </li>`);
}

function saveToDoList() {
  let toDoArr = [];
  const toDoTexts = document.querySelectorAll('.todo__text');
  for (let item of toDoTexts) {
    if (!toDoArr.includes(item.textContent)) {
      toDoArr.push(item.textContent);
    }
  }
  localStorage.setItem('toDoList', JSON.stringify(toDoArr));
}

function renderToDoList() {
  const toDoList = JSON.parse(localStorage.getItem('toDoList'));
  for (let item of toDoList) {
    createToDoTask(item);
  }
  deleteTodoItem();
  changeTodoItem();
  suggestAdvice();
  checkChildInTodoList();
}
renderToDoList();

function deleteTodoItem() {
  const deleteToDoTask = document.querySelectorAll('.todo__delete');
  for (let i = 0; i < deleteToDoTask.length; i++) {
    deleteToDoTask[i].addEventListener('click', function() {
      this.parentElement.remove();
      saveToDoList();
      checkChildInTodoList();
      suggestAdvice();
    });
  }
}

function changeTodoItem() {
  const todoTexts = document.querySelectorAll('.todo__text');
  for (let item of todoTexts) {
    item.addEventListener('dblclick', function() {
      createInputToChangeValue(item);
    });
  }
}

function createInputToChangeValue(parent) {
  let input = document.createElement('input');
  input.setAttribute('class', 'input--todo');
  input.value = parent.textContent;
  parent.textContent = '';
  input.addEventListener('blur', function() {
    parent.textContent = input.value;
  });
  input.addEventListener('keydown', function(event) {
    if (event.keyCode === 13) {
      parent.textContent = input.value;
    }
  });
  parent.appendChild(input);
}

function getRandomInteger(min, max) {
  return Math.floor(min + Math.random() * (max - min + 1));
}

function suggestAdvice() {
  formInput.setAttribute('placeholder', initAdvices[getRandomInteger(0, initAdvices.length - 1)])
}
suggestAdvice();

function checkChildInTodoList() {
  const todoItem = document.querySelector('.todo__item')
  if (todoList.contains(todoItem)) {
    todoDoneText.textContent = 'wops you not finish all task';
    todoDoneImg.classList.add('todo__done-img--close');
  } else {
    todoDoneText.textContent = 'You don\'t have any todos';
    todoDoneImg.classList.remove('todo__done-img--close');
  }
}

function toDoChecked() {
  const checkboxInputs = document.querySelectorAll('.todo__checkbox');
  const toDoTexts = document.querySelectorAll('.todo__text');
  let countUnchecked = checkboxInputs.length;
  for (let i = 0; i < checkboxInputs.length; i++) {
    if (checkboxInputs[i].checked) {
      countUnchecked--;
      toDoTexts[i].classList.add('todo__text--done');
    } else {
      toDoTexts[i].classList.remove('todo__text--done');
    }
    if (countUnchecked === 0) {
      popUp.classList.add('pop-up--opened');
    }
  }
}
window.addEventListener('input', toDoChecked);

function closePopUp(event) {
  if (event.target === popUp) {
    popUp.classList.remove('pop-up--opened');
  } else {
    popUp.classList.remove('pop-up--opened');
  }
}
popUp.addEventListener('click', closePopUp);
popUpClose.addEventListener('click', closePopUp);

function cancelCheckedToDos() {
  const checkboxInputs = document.querySelectorAll('.todo__checkbox');
  checkboxInputs.forEach(elem => elem.checked = false);
  const toDoTexts = document.querySelectorAll('.todo__text');
  toDoTexts.forEach(elem => elem.classList.remove('todo__text--done'));
}
cancelButton.addEventListener('click', cancelCheckedToDos);

function clearToDoList() {
  const checkboxInputs = document.querySelectorAll('.todo__checkbox');
  checkboxInputs.forEach(elem => elem.parentElement.parentElement.remove());
  checkChildInTodoList();
  saveToDoList();
}
clearButtonToDoList.addEventListener('click', clearToDoList);
