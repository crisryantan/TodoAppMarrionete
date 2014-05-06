var TodoApp = new Marionette.Application();

	TodoApp.addRegions({
		mainRegion : '#main-region'
	});

	TodoApp.todoModel = Backbone.Model.extend({
		idAttribute : '_id',
		url : 'http://localhost:3030/todos'
	});

	TodoApp.todoCollection = Backbone.Collection.extend({
		model : TodoApp.todoModel,
		url : 'http://localhost:3030/todos'
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
			$('#todoInput').val('');
			console.log(todoInput);
		}

	});

	TodoApp.TodoList = Marionette.ItemView.extend({
		template : '#todoList',
		tagName : 'li'
	});

	TodoApp.todoCollectionView = Marionette.CollectionView.extend({
		itemView: TodoApp.TodoList
	});

	TodoApp.on('initialize:after', function(){
		console.log('App is initialized');

		var todoCollection = new TodoApp.todoCollection();
		var addTodoItem = new TodoApp.StaticView();

		var collectionView = new TodoApp.todoCollectionView({
			collection : todoCollection
		});

		var layout = new TodoApp.TodoLayout();
		console.log(layout);

		todoCollection.fetch();
		TodoApp.mainRegion.show(layout);
		layout.addTodo.show(addTodoItem);
		layout.listTodo.show(collectionView);
	});

	TodoApp.start();