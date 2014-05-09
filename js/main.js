var TodoApp = new Marionette.Application();

	TodoApp.addRegions({
		mainRegion : '#main-region'
	});

	//model
	TodoApp.todoModel = Backbone.Model.extend({
		idAttribute : '_id',
		urlRoot : 'http://localhost:3030/todos',
		validate : function(attrs){
			if(!attrs.todo.trim()){
				return 'Enter valid todo';
			}
		}
	});

	//collection
	TodoApp.todoCollection = Backbone.Collection.extend({
		model : TodoApp.todoModel,
		url : 'http://localhost:3030/todos'
	});

	//template
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
			'todoInput' : '#todoInput',
			'selectAll' : '#check_all',
			'deleteSelected' : '#delete_selected'
		},

		'events' : {
			'click @ui.selectAll' : 'selectAll',
			'click @ui.deleteSelected' : 'deleteSelected',
			'keypress @ui.todoInput' : 'keyCode'
		},

		selectAll : function(){
			this.collection.each(this.isFinished, this);
		},

		deleteSelected : function(){
			var todos = this.collection.where({isFinished : true});
			console.log(todos);
		},


		isFinished : function(task){
			if($('#check_all').is(':checked')){
				task.set('isFinished', true);
			}else{
				task.set('isFinished', false);
			}
		},

		keyCode : function(e){
			if(e.keyCode === 13 ){
				this.addTodo();
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
		},

	});

	TodoApp.TodoList = Marionette.ItemView.extend({
		template : '#todoList',
		tagName : 'li',

		'ui' : {
			'todoDelete' : 'button.delete',
			'finished' : 'input.elementCheckbox',
			'todos' : 'span.elementLI'
		},
		events : {
			'click @ui.todoDelete' : 'deleteThis',
			'click @ui.todos' : 'taskClicked',
			'blur @ui.todos' : 'editThis',
			'keypress @ui.todos': 'onEnterUpdate',
			'click @ui.finished' : 'updateCheckbox'
		},
		initialize : function(){
			this.listenTo(this.model, 'change', this.toggleAll);
		},

		'onRender' : function(){
			if(this.model.get('isFinished')){
				this.ui.finished.prop( 'checked' , true );
				this.$el.addClass( 'isDone' );
			}else{
				this.ui.finished.prop( 'checked' , false );
				this.$el.addClass( '' );
			}
		},
		taskClicked : function(){
			this.ui.todos.attr('contenteditable', true);
		},

		editThis : function(){
			var self = this;
			var todo = this.$('.elementLI').text();
        this.model.save({todo: todo}, {
            success: function() { console.log("successfully updated todo");},
            error: function() { console.log("Failed to update todo");},
            wait : true
        });

			this.ui.todos.removeAttr('contenteditable');
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
		},
		toggleAll :function(){
			var self = this;
			if(this.model.get('isFinished')){
				this.ui.finished.prop( 'checked' , true );
				this.ui.todos.css('text-decoration', 'line-through');
				this.model.save({isFinished : this.model.get('isFinished')},{
					success : function(){console.log('success updating : ' + self.model.get('_id'));},
					error: function(err){ console.log(err);},
					wait : true
				});
			}else{
				this.ui.finished.prop( 'checked' , false );
				this.ui.todos.css('text-decoration', 'none');
				this.model.save({isFinished : this.model.get('isFinished')},{
					success : function(){console.log('success updating : ' + self.model.get('_id'));},
					error: function(err){ console.log(err);},
					wait : true
				});
			}
		}
	});

	TodoApp.todoCollectionView = Marionette.CollectionView.extend({
		//tagName : 'ul',
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

		todoCollection.fetch();
		TodoApp.mainRegion.show(layout);
		layout.addTodo.show(addTodoItem);
		layout.listTodo.show(collectionView);
	});

	TodoApp.start();