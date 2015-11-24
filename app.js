"use strict";

var taskInput = $(".newItem input").eq(0);
var addBtn = $(".newItem button").eq(0);
var taskList__todo = $(".taskList--todo").eq(0);
var taskList__done = $(".taskList--done").eq(0);
var tasks = $(".taskItem");

var addTask = function () {
  
  if (!taskInput.val()) return;
  
  var $taskItem = $(
    '<li class="taskItem clearfix">' +
      '<input type="checkbox" class="taskSwitch">' +
      '<label class="taskContent">' + taskInput.val() + '</label>' +
      '<input type="text" class="taskInput">' +
      '<span class="taskItemControl layout--pushRight">' +
        '<button class="editBtn">Редактировать</button> ' +
        '<button class="deleteBtn">Удалить</button>' +
      '</span>' +
    '</li>'
  );
  taskList__todo.append($taskItem);

  taskInput.val('');

  bindTaskEvents.call($taskItem);
}; addBtn.click(addTask);

var moveTask = function () {
  var taskItem = $(this).parent();
  var taskList = taskItem.parent();
  var _taskList__todo = taskList.hasClass("taskList--todo");
  var _taskList__done = taskList.hasClass("taskList--done");  
  
  if (_taskList__todo) {
    taskItem.find(".taskContent").toggleClass("checkboxTrue");
    taskItem.find(".taskSwitch").prop("checked", false);
    taskList__done.append(taskItem);
  } else if (_taskList__done) {
    taskItem.find(".taskContent").toggleClass("checkboxTrue");
    taskItem.find(".taskSwitch").prop("checked", true);
    taskList__todo.append(taskItem);
  }
  
  taskItem.find(".editBtn").toggleClass("is-hidden");
};

var deleteTask = function () {
  $(this).parent().parent().remove();
};

var editTask = function () {
  
  var editBtn = $(this);
  var taskItem = editBtn.parent().parent();
  var taskInput = taskItem.find(".taskInput");
  var taskContent = taskItem.find(".taskContent");
  var taskInput_is = taskInput.hasClass("is-visible");

  if (taskInput_is) {
    taskItem.find(".taskSwitch").prop("disabled", false);
    editBtn.html("Редактировать");
    taskContent.html(taskInput.val());
  } else {
      taskItem.find(".taskSwitch").prop("disabled", true);
      editBtn.html("Готово");
      taskInput.val(taskContent.html());
  }

  taskInput.toggleClass("is-visible");
  taskContent.toggleClass("is-hidden");
  taskInput.focus();
  taskInput.on("input", disableEditBtn);
};

var disableEditBtn = function () {
  var listItem = $(this).parent();
  var editBtn = listItem.find(".editBtn");
  
  if (!$(this).val()) editBtn.prop("disabled", true);
  else editBtn.prop("disabled", false);
}

var setPointer = function () {
  var temp = $(this).val();
  $(this).val('');
  $(this).val(temp);
};

var bindTaskEvents = function () {
  this.find(".taskContent").click(moveTask);
  this.find(".deleteBtn").click(deleteTask);
  this.find(".editBtn").click(editTask);
  this.find(".taskInput").focus(setPointer);
};

for (var i = 0; i < tasks.length; i++) {
  bindTaskEvents.call(tasks.eq(i));
}