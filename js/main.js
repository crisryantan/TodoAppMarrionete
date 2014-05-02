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
		tagName : 'span',
		'ui' : {
			'elementLI' : '#elementLI',
			'todoInput' : '#todoInput'
		},

		'events' : {
			'keypress @ui.todoInput' : 'keyCode',
			'clicked @ui.elementLI' : 'taskClicked',
			'blur @ui.elementLI' : 'editThis2',
		},

		taskClicked : function (){
			console.log('clicked');
			this.ui.elementLI.attr('contenteditable', true);
		},

		editThis2 : function(){
			this.ui.elementLI.attr.removeAttr('contenteditable');
		},

		keyCode : function(e){
			if(e.keyCode === 13 ){
				this.addTodo();
			}else{

			}
		},

		addTodo : function(){
			var todoInput = $('#todoInput').val();
			$('#todo-list').append('<li><span id="elementLI">' + todoInput +'</span></li>');
			console.log(todoInput);
		}

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