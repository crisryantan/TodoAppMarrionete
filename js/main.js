var TodoApp = new Marionette.Application();

	TodoApp.addRegions({
		mainRegion : '#main-region'
	});


	TodoApp.todoModel = Backbone.Model.extend({
		idAttribute : '_id',
		urlRoot : 'http://localhost:3030/todos',
		validate : function(attrs){
			if(!attrs.todo.trim()){
				return 'Enter valid todo';
			}
		}
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
			'todoInput' : '#todoInput'
		},

		'events' : {
			'keypress @ui.todoInput' : 'keyCode',
		},

		keyCode : function(e){
			if(e.keyCode === 13 ){
				this.addTodo();
			}else{

			}
		},
		addTodo : function(){
			var todoInput = $('#todoInput').val();
			var task = new TodoApp.todoModel({ todo : todoInput});
			var self = this;

			task.save({},{
				success : function(data){ console.log('successfully added todo');
					self.collection.add(data);
					$('#todoInput').val('');
			},
				error   : function(err){ console.log('error saving todo : ' + err);}
			});
		}

	});

	TodoApp.TodoList = Marionette.ItemView.extend({
		template : '#todoList',
		tagName : 'li',

		ui : {
			'todoDelete' : '.delete',
			'finished' : '.elementCheckbox',
			'todos' : '.elementLI'
		},

		events : {
			'click @ui.todoDelete' : 'deleteThis',
			'click @ui.todos' : 'taskClicked',
			'blur @ui.todos' : 'editThis',
			'keypress @ui.todos': 'onEnterUpdate',
			'click @ui.finished' : 'updateCheckbox'
		},

		initialize: function(){
			if(this.model.get('isFinished')){
				this.$el.addClass( 'isDone' )
			}else{
				this.$el.addClass( '' )
			}
		},

		taskClicked : function(){
			this.$('.elementLI').attr('contenteditable', true);
		},

		editThis : function(){
			var self = this;
			var todo = this.$('.elementLI').text();
        this.model.save({todo: todo}, {
            success: function() { console.log("successfully updated todo");},
            error: function() { console.log("Failed to update todo");},
            wait : true
        });

			this.$('.elementLI').removeAttr('contenteditable');
		},

		onEnterUpdate: function(ev) {
			if (ev.keyCode === 13) {
				this.editThis();
			}
		},

		deleteThis : function () {
			this.model.destroy(null,{
				success : function(){console.log('success');},
				error: function(err){ console.log('error');},
				wait : true
			});
		},

		updateCheckbox : function(){
			this.$el.toggleClass( 'isDone' );
			this.model.save({isFinished : this.$el.hasClass('isDone')});
		}
	});

	TodoApp.todoCollectionView = Marionette.CollectionView.extend({
		itemView: TodoApp.TodoList
	});

	TodoApp.on('initialize:after', function(){
		console.log('App is initialized');

		var todoCollection = new TodoApp.todoCollection();
		var addTodoItem = new TodoApp.StaticView({ collection : todoCollection });

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