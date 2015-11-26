"use strict";
+function($) {
var taskInput = $(".newItem input").eq(0);
var addBtn = $(".newItem button").eq(0);
var taskList__todo = $(".taskList--todo").eq(0);
var taskList__done = $(".taskList--done").eq(0);
var tasks = $(".taskItem");
var nId = 0;
var tdMask = 'td_';
var lsMas = [];
var clicky;

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
  
  nId++;
}; 
addBtn.on('click', function () {
  addTask();
});
taskInput.on('keydown', function (e) {
  if (e.which === 13) {
    addTask();
  }
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
      '{"value":"' + value + '","isDo":"true"}'
    );
  } else if (_taskList__done) {
    taskItem.find(".taskContent").toggleClass("checkboxTrue");
    taskItem.find(".taskSwitch").prop("checked", true);
    taskList__todo.append(taskItem);
    
    localStorage.setItem(
      taskItem.attr("data-itemid"),
      '{"value":"' + value + '","isDo":"false"}'
    );
  }
  
  taskItem.find(".editBtn").toggleClass("is-hidden");
};                // Перенос записи из "запланированных" к "выполненным" задачам. Изменяет состояние чекбокса (в зависимости от того, из какого списка задач происходит перенос). Используется в addTask (для вывода данных из localStorage в нужный список). 

var deleteTask = function () {
  localStorage.removeItem($(this).parent().parent().attr('data-itemid'));
  $(this).parent().parent().remove();
};              // Удаление записи. Используется в bindTaskEvents.

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
  
  var taskId = taskItem.attr('data-itemid');
  
  localStorage.setItem(
    taskId,
    '{"value":"' +
    taskInput.val() +
    '", "isDo":"' +
    JSON.parse(localStorage[taskId]).isDo +
    '"}'
  );
};                // Редактирование записи. Используется в bindTaskEvents.

var disableEditBtn = function () {
  var listItem = $(this).parent();
  var editBtn = listItem.find(".editBtn");
  
  if (!$(this).val()) editBtn.prop("disabled", true);
  else editBtn.prop("disabled", false);
};          // Disable кнопку редактирования("готово") если поле редактирования записи пустое. Используется в bindTaskEvents.

var setPointer = function () {            
  var temp = $(this).val();
  $(this).val('');
  $(this).val(temp);
};              // Устанавливает указатель в конец строки поля редактирования записи. Используется в bindTaskEvents.

$(document).mousedown(function(e) {
  clicky = $(e.target);
});

var blurInput = function(e) {
  if (!clicky.eq(0).hasClass('editBtn')) {
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
  this.find(".taskInput").on('keydown',
    function (e) {
      if (e.which === 13) 
        editTask.call($(this).parent().find('.editBtn'));
    }
  );
};

for (var i = 0; i < tasks.length; i++) {
  bindTaskEvents.call(tasks.eq(i));
}

$(".taskList--todo, .taskList--done").sortable({
  cancel: "li:has(label.is-hidden)",
  connectWith: ".taskList",
  change: function(event, ui) {
    if (ui.sender) {
      moveTask.call(ui.item.find('.taskSwitch'));
    }
  }
}).disableSelection();

(function showTask() {
  var ls = [];
  
  for(var key in localStorage) {
    if (key.slice(0, 3) === tdMask) {
      ls.push(key);
    }
  }
  nId = ls.length;

  ls.sort(function(a, b) {
    return a.slice(3) - b.slice(3);
  });

  for (var i = 0; i < ls.length; i++) {

    var key = ls[i];
    var val = JSON.parse(localStorage[key]);

    addTask('storage', val.isDo, val.value, key);
  }
}());

}(jQuery);