		var TodoApp = new Marionette.Application();

	TodoApp.addRegions({
		mainRegion : '#main-region'
	});

	TodoApp.TodoLayout = Marionette.Layout.extend({
		template : '#todoLayout',
		regions:{
			addTodo : '#todo-add',
			listTodo : '#todo-list'
		}
	});

	TodoApp.StaticView = Marionette.ItemView.extend({
		template : '#input-todo',
		tagName : 'span'
	});

	TodoApp.TodoList = Marionette.ItemView.extend({
		template : '#todoList',
		tagName : 'li'
	});

	TodoApp.on('initialize:after', function(){
		console.log('App is initialized');

		var addTodoItem = new TodoApp.StaticView();
		var todoList = new TodoApp.TodoList();
		var layout = new TodoApp.TodoLayout();
		console.log(layout);

		TodoApp.mainRegion.show(layout);
		layout.addTodo.show(addTodoItem);
		layout.listTodo.show(todoList);

	});

	TodoApp.start();