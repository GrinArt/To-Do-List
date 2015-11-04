"use strict";

var taskInput = document.querySelector(".newItem").querySelector("input");
var addBtn = document.querySelector(".newItem").querySelector("button");
var taskList__todo = document.querySelector(".taskList--todo");
var taskList__done = document.querySelector(".taskList--done");
var tasks = document.getElementsByClassName("taskItem");

var addTask = function () {
  
  if (!taskInput.value) return;
  
  var taskItem = document.createElement("li");
  taskItem.classList.add("taskItem", "clearfix");
  taskItem.innerHTML = '<input type="checkbox" class="taskSwitch">';
  taskItem.innerHTML += '<label class="taskContent">' + taskInput.value + '</label>';
  taskInput.value = "";
  taskItem.innerHTML += '<input type="text" class="taskInput">';
  taskList__todo.appendChild(taskItem);

  var span = document.createElement("span");
  span.classList.add("taskItemControl", "layout--pushRight");
  span.innerHTML = '<button class="editBtn">Редактировать</button> ';
  span.innerHTML += '<button class="deleteBtn">Удалить</button>';
  taskItem.appendChild(span);

  bindTaskEvents.call(taskItem);
}; addBtn.onclick = addTask;

var moveTask = function () {
  var taskItem = this.parentNode;
  var taskList = taskItem.parentNode;
  var _taskList__todo = taskList.classList.contains("taskList--todo");
  var _taskList__done = taskList.classList.contains("taskList--done");  
  
  if (_taskList__todo) {
    taskItem.querySelector(".taskContent").classList.toggle("checkboxTrue");
    taskItem.querySelector(".taskSwitch").checked = false;
    taskList__done.appendChild(taskItem);
  } else if (_taskList__done) {
    taskItem.querySelector(".taskContent").classList.toggle("checkboxTrue");
    taskItem.querySelector(".taskSwitch").checked = true;
    taskList__todo.appendChild(taskItem);
  }
  
  taskItem.querySelector(".editBtn").classList.toggle("is-hidden");
};

var deleteTask = function () {
  var taskItem = this.parentNode.parentNode;
  var taskList = taskItem.parentNode;
  
  taskList.removeChild(taskItem);
};

var editTask = function () {
  
  var editBtn = this;
  var taskItem = editBtn.parentNode.parentNode;
  var taskInput = taskItem.querySelector(".taskInput");
  var taskContent = taskItem.querySelector(".taskContent");
  var taskInput_is = taskInput.classList.contains("is-visible");

  if (taskInput_is) {
    taskItem.querySelector(".taskSwitch").disabled = false;
    editBtn.innerHTML = "Редактировать";
    taskContent.innerHTML = taskInput.value;
  } else {
      taskItem.querySelector(".taskSwitch").disabled = true;
      editBtn.innerHTML = "Готово";
      taskInput.value = taskContent.innerHTML;
  }

  taskInput.classList.toggle("is-visible");
  taskContent.classList.toggle("is-hidden");
  taskInput.focus();
  taskInput.addEventListener("input", disableEditBtn);
};

var disableEditBtn = function () {
  
  var listItem = this.parentNode;
  var editBtn = listItem.querySelector(".editBtn");
  if (!this.value) {
    editBtn.disabled = true;;
  } else {
    editBtn.disabled = false;
  }
}

var setPointer = function () {
  var temp = this.value;
  this.value = '';
  this.value = temp;
};

var bindTaskEvents = function () {
  this.querySelector(".taskContent").onclick = moveTask;
  this.querySelector(".deleteBtn").onclick = deleteTask;
  this.querySelector(".editBtn").onclick = editTask;
  this.querySelector(".taskInput").onfocus = setPointer;
};

for (var i = 0; i < tasks.length; i++) {
  bindTaskEvents.call(tasks[i]);
}