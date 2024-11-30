// Находим элементы на странице

const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');

let tasks = [];

if (localStorage.getItem('tasks')) {

    tasks = JSON.parse(localStorage.getItem('tasks'));

    // Рендерим задачу на странице

    tasks.forEach(task => renderTask(task));
}

checkEmptyList();

//  Добавление задачи

form.addEventListener('submit', addTask)

//  Удаление задачи

tasksList.addEventListener('click', deleteTask)

//  Отмечаем задачу завершенной

tasksList.addEventListener('click', doneTask)

//  Функции

function addTask(event) {

    // Отменяем отправку формы

    event.preventDefault();

    // Достаем текст задачи из поля ввода

    const taskText = taskInput.value;

    // Описываем задачу в виде объекта

    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false
    };

    //  Добавляем задачу в массив с объектами

    tasks.push(newTask);

    // Добавляем задачу хранилище

    saveToLocalStorage();

    // Рендерим задачу на странице

    renderTask(newTask);

    // Очистить поле ввода и вернуть фокус

    taskInput.value = '';
    taskInput.focus();

    // Проверка вывода "Список дел пуст"

    checkEmptyList();

}

function deleteTask(event) {

    //  Если событие произошло не с кнопкой с атрибутом "delete"

    if (event.target.dataset.action !== 'delete') return;

    //  Удаляем его родителя с тегом li

    const parentNode = event.target.closest('li');

    // Находим id родителя с тегом li

    const id = Number(parentNode.id);

    // Удаляем li найденный li из базы данных

    tasks.forEach((task, i) => {
        if(task.id === id) tasks.splice(i, 1);
    })

    parentNode.remove();

    // Добавляем задачу хранилище

    saveToLocalStorage();

    // Проверка вывода "Список дел пуст"

    checkEmptyList();

}

function doneTask(event) {

    //  Если событие произошло не с кнопкой с атрибутом "done"

    if (event.target.dataset.action !== 'done') return;

    // Находим его родителя li

    const parentNode = event.target.closest('li');

    // Находим id родителя с тегом li

    const id = Number(parentNode.id);

    // Меняем статус задачи в базе данных

    tasks.forEach((task, i) => {
        if(task.id === id) {
            (task.done === false) ? task.done = true : task.done = false;
        }
    })

    // Добавляем задачу хранилище

    saveToLocalStorage();

    // Находим нашу задачу

    const taskTitle = parentNode.querySelector('.task-title');

    // Добавляем класс CSS выполненной задачи

    taskTitle.classList.toggle('task-title--done');

}

function checkEmptyList() {

    // Если нет задач в массиве с данными

    if (tasks.length === 0) {
        const emptyListHTML = `
                                <li id="emptyList" class="list-group-item empty-list">
                                    <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
                                    <div class="empty-list__title">Список дел пуст</div>
                                </li>`

        // Вводим эту разметку в HTML

        tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
    }

        // Если есть задачи в массиве с данными удаляем ее

    if (tasks.length > 0) {
        const emptyListEl = document.querySelector('#emptyList');
        emptyListEl ? emptyListEl.remove() : null;
    }

}

function saveToLocalStorage() {

    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTask(task) {

    //  Формируем css класс

    const cssClass = (task.done) ? "task-title task-title--done" : "task-title";

    // Формируем разметку для новой задачи

    const taskHTML = `
                        <li id ="${task.id}" class="list-group-item d-flex justify-content-between task-item">
                            <span class="${cssClass}">${task.text}</span>
                            <div class="task-item__buttons">
                                <button type="button" data-action="done" class="btn-action">
                                    <img src="./img/tick.svg" alt="Done" width="18" height="18">
                                </button>
                                <button type="button" data-action="delete" class="btn-action">
                                    <img src="./img/cross.svg" alt="Done" width="18" height="18">
                                </button>
                            </div>
                        </li>
                    `;

    // Добавить на страницу

    tasksList.insertAdjacentHTML('beforeend', taskHTML);

}