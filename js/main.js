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
			//addTodo : '#todo-add',
			listTodo : '#todo-list'
		}
	});



TodoApp.TodoList = Marionette.ItemView.extend({
		template : '#todoList',
		tagName : 'li',

		'ui' : {
			'todoDelete' : 'button.delete',
			'finished' : 'input.elementCheckbox',
			'todos' : 'span.elementLI'
		},

		modelEvents : {
			'change:isFinished' : 'updateDone'
		},

		events : {
			'click @ui.todoDelete' : 'deleteThis',
			'click @ui.todos' : 'taskClicked',
			'blur @ui.todos' : 'editThis',
			'keypress @ui.todos': 'onEnterUpdate',
			'click @ui.finished' : 'updateCheckbox'
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
			this.model.save({isFinished : this.$el.hasClass('isDone')},{wait : true});
		},

		updateDone :function(){
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

	TodoApp.TodoCompositeView = Marionette.CompositeView.extend({
		tagName : 'div',
		template : '#todoComposite',
		itemView : TodoApp.TodoList,
		itemViewContainer : 'ul',

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

		initialize : function(){
			this.collection.fetch({
				success : function(collection){
					if( collection.length === collection.where({isFinished : true}).length){
						$('#check_all').prop('checked', true);
					}
				}
			});
			this.listenTo(this.collection,'change:isFinished',this.updateFlag);
		},

		updateFlag : function(){
			if( this.collection.length === this.collection.where({isFinished : true}).length){
				$('#check_all').prop('checked', true);
			}else{
				//place logic here
				// $('#check_all').prop('checked', false);
			}
		},

		selectAll : function(){
			this.collection.each(function(task){
				if($('#check_all').is(':checked')){
					task.set('isFinished', true);
					task.save( { 'isFinished' : true } );
				}else{
					task.set('isFinished', false);
					task.save( { 'isFinished' : false } );
				}
			});
		},

		deleteSelected : function(){
			this.collection.each(function(model){
				if( model.get('isFinished')){
					model.destroy( { wait : true} );
				}
			});
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
		}

	});





	TodoApp.on('initialize:after', function(){
		console.log('App is initialized');

		var todoCollection = new TodoApp.todoCollection();
		var todoComposite = new TodoApp.TodoCompositeView( {
			collection : todoCollection
		});

		var layout = new TodoApp.TodoLayout();

		TodoApp.mainRegion.show(layout);
		layout.listTodo.show(todoComposite);
	});

	TodoApp.start();