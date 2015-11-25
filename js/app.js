"use strict";

var taskInput = $(".newItem input").eq(0);
var addBtn = $(".newItem button").eq(0);
var taskList__todo = $(".taskList--todo").eq(0);
var taskList__done = $(".taskList--done").eq(0);
var tasks = $(".taskItem");

var nId = 0;
var tdMask = 'td_';
var lsMas = [];


var createTask = function(val, id) {
  var taskItem = $(
    '<li class="taskItem clearfix" data-itemid="' + id + '">' +
      '<input type="checkbox" class="taskSwitch">' +
      '<label class="taskContent">' + val + '</label>' +
      '<input type="text" class="taskInput">' +
      '<span class="taskItemControl layout--pushRight">' +
        '<button class="editBtn">Редактировать</button> ' +
        '<button class="deleteBtn">Удалить</button>' +
      '</span>' +
    '</li>'
  );

  return taskItem;
};

var addTask = function (source, status, val, id) {
  
  if (source != 'storage') {
    if (!taskInput.val()) return;
    
    val = taskInput.val();
    
    localStorage.setItem(
      tdMask + nId,
      '{"value": "'+ val + '","isDo": "false" }'
    );
    
    var taskItem = createTask(val, tdMask + nId);
    taskList__todo.append(taskItem);
  } else {
    var taskItem = createTask(val, id);

    taskList__todo.append(taskItem);
    
    if (status == 'true') {
      moveTask.call(taskItem.find('.taskSwitch'));
    }
  }

  taskInput.val('');

  bindTaskEvents.call(taskItem);
}; addBtn.on('click', function () {
  addTask();
  nId++;
});

var moveTask = function () {
  var taskItem = $(this).parent();
  var taskList = taskItem.parent();
  var _taskList__todo = taskList.hasClass("taskList--todo");
  var _taskList__done = taskList.hasClass("taskList--done");  
  
  var value = taskItem.find('.taskContent').html();
  
  if (_taskList__todo) {
    taskItem.find(".taskContent").toggleClass("checkboxTrue");
    taskItem.find(".taskSwitch").prop("checked", false);
    taskList__done.append(taskItem);
    
    localStorage.setItem(
      taskItem.attr("data-itemid"),
      '{"value":"'+value+'","isDo":"true"}'
    );
  } else if (_taskList__done) {
    taskItem.find(".taskContent").toggleClass("checkboxTrue");
    taskItem.find(".taskSwitch").prop("checked", true);
    taskList__todo.append(taskItem);
    
    localStorage.setItem(
      taskItem.attr("data-itemid"),
      '{"value":"'+value+'","isDo":"false"}'
    );
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
};

var disableEditBtn = function () {
  var listItem = $(this).parent();
  var editBtn = listItem.find(".editBtn");
  
  if (!$(this).val()) editBtn.prop("disabled", true);
  else editBtn.prop("disabled", false);
  console.log('is it also here?');
};

var setPointer = function () {
  var temp = $(this).val();
  $(this).val('');
  $(this).val(temp);
};

 var clicky;

$(document).mousedown(function(e) {
    clicky = $(e.target);
});

var blurInput = function(e) {
  if (!clicky.eq(0).hasClass('editBtn')) {
    console.log("q");
    $(this).removeClass("is-visible");
    $(this).addClass("is-hidden");
    $(this).parent().find('.taskContent').removeClass("is-hidden");
    $(this).parent().find('.editBtn').html("Редактировать");
    $(this).parent().find('.editBtn').prop("disabled", false);
  }
}

var bindTaskEvents = function () {
  this.find(".taskContent").click(moveTask);
  this.find(".deleteBtn").click(deleteTask);
  this.find(".editBtn").click(editTask);
  this.find(".taskInput").focus(setPointer);
  this.find(".taskInput").on("input", disableEditBtn);
  this.find(".taskInput").on("blur", blurInput);

};

for (var i = 0; i < tasks.length; i++) {
  bindTaskEvents.call(tasks.eq(i));
}

$(".taskList--todo, .taskList--done").sortable({
  cancel: "li:has(label.is-hidden)",
  connectWith: ".taskList",
  change: function(event,ui) {
      if (ui.sender) {
        moveTask.call(ui.item[0].querySelector('input[type=checkbox]'));
      }
  }
}).disableSelection();

function showTask() {
  var localLength = [];
  
  for(var key in localStorage) {
    console.log(key);
    if (key.slice(0,3) === tdMask){
      localLength.push(key);
    }
  }
  nId = localLength.length;

  localLength.sort(function(a,b){
    return a.slice(3)-b.slice(3);
  });


  for (var i = 0; i < localLength.length; i++) {

    var key = localLength[i];
    var val = JSON.parse(localStorage[key]);

    addTask('storage', val.isDo, val.value, key);
  }
}

showTask();