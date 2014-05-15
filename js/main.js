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

		// modelEvents : {
		// 	'change:isFinished' : 'updateCheckbox'
		// },

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
			var self = this;
			self.$el.toggleClass( 'isDone' );
			this.model.save({isFinished : self.$el.hasClass('isDone')},
				{success : function(){
				if(self.$el.hasClass('isDone')){
					self.ui.finished.prop( 'checked' , true );
					self.ui.todos.css('text-decoration', 'line-through');
				}else{
					self.ui.finished.prop( 'checked' , false );
					self.ui.todos.css('text-decoration', 'none');
				}

				}},
				{wait : true});
		}

	});

	TodoApp.TodoCompositeView = Marionette.CompositeView.extend({
		tagName : 'div',
		template : '#todoComposite',
		itemView : TodoApp.TodoList,
		itemViewContainer : 'ul',

		'ui' : {
			'todoInput' : '#todoInput',
			'elementCheckbox' : '.elementCheckbox',
			'selectAll' : '#check_all',
			'deleteSelected' : '#delete_selected',
			'itemsLeft' : 'span#items-left'
		},



		'events' : {
			'click @ui.selectAll' : 'selectAll',
			'click @ui.deleteSelected' : 'deleteSelected',
			'keypress @ui.todoInput' : 'keyCode'
		},



		initialize : function(){
			var self = this;
			this.collection.fetch({
				success : function(collection){
					if( collection.length === collection.where({isFinished : true}).length){
						self.ui.selectAll.prop('checked', true);
					}
				}
			});
			this.listenTo(this.collection,'change:isFinished',this.updateFlag);
			this.listenTo(this.collection,'sync', this.updateRemaining);
			this.listenTo(this.collection,'remove', this.updateRemaining);
		},


		updateFlag : function(){
			if( this.collection.length === this.collection.where({isFinished : true}).length){
					this.ui.selectAll.prop('checked', true);
			}
			else{
					this.ui.selectAll.prop('checked', false);
			}
		},

		selectAll : function(){
			var self = this;
			if(this.ui.selectAll.is(':checked')){
				console.log('true');
				this.collection.each(function(task){
					task.save( { 'isFinished' : true }, {
						success : function(){
							this.$('.elementCheckbox').prop('checked', true);
							this.$('.elementLI').css('text-decoration', 'line-through');
						}
					});
				});
			}else{
				console.log('false');
				this.collection.each(function(task){
					task.save( { 'isFinished' : false }, {
						success : function(){
							this.$('.elementCheckbox').prop('checked', false);
							this.$('.elementLI').css('text-decoration', 'none');
						}
					});
				});
			}

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
		},

		updateRemaining : function (){
			var remaining = this.collection.where( { 'isFinished' : false } );
			var toDelete = Math.abs( remaining.length - this.collection.length );
			this.ui.itemsLeft.text( remaining.length );
			if( toDelete === 0 ){
				this.ui.deleteSelected.addClass('hide');
			}else{
				this.ui.deleteSelected.removeClass('hide');
			}
		}

	});

	TodoApp.StatusView = Marionette.ItemView.extend({
		tagName : 'span',
		className : 'statusContainer',
		template : '#todoStatus-template'
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