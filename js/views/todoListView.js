define( function ( require ){

	var Marionette       = require ( 'marionette' );
	var todoListTemplate = require ( 'doT!template/todoListView' );

	return Marionette.ItemView.extend( {
		template : todoListTemplate,
		tagName : 'li',

		'ui' : {
			'todoDelete' : 'button.delete',
			'finished'   : 'input.elementCheckbox',
			'todos'      : 'span.elementLI'
		},

		events : {
			'click @ui.todoDelete' : 'deleteThis',
			'click @ui.todos'      : 'taskClicked',
			'blur @ui.todos'       : 'editThis',
			'keypress @ui.todos'   : 'onEnterUpdate',
			'click @ui.finished'   : 'updateCheckbox'
		},

		'onRender' : function() {
			if( this.model.get('isFinished') ) {
				this.ui.finished.prop( 'checked' , true );
				this.$el.addClass( 'isDone' );
			}else{
				this.ui.finished.prop( 'checked' , false );
				this.$el.addClass( '' );
			}
		},

		taskClicked : function() {
			this.ui.todos.attr( 'contenteditable', true );
		},

		editThis : function() {
			var self = this;
			var todo = this.$( '.elementLI' ).text();
			if(todo.trim()){
				this.model.save({todo: todo}, {
						success	: function() {
							console.log( "successfully updated todo" );
						},
						error		: function() {
							console.log( "Failed to update todo" );
						},
						wait : true
				});
				this.ui.todos.removeAttr( 'contenteditable' );
			}else{
				this.deleteThis();
			}

		},

		onEnterUpdate: function( ev ) {
			if ( ev.keyCode === 13 ) {
				this.editThis();
			}
		},

		deleteThis : function () {
			this.model.destroy( null,{
				success	: function () {
					console.log( 'success' );
				},
				error		: function( err ) {
					console.log( 'error' );
				},
				wait : true
			});
		},

		updateCheckbox : function() {
			var self = this;
			self.$el.toggleClass( 'isDone' );
			this.model.save({isFinished : self.$el.hasClass( 'isDone' )},
				{success : function(){
				if( self.$el.hasClass( 'isDone' ) ) {
					self.ui.finished.prop( 'checked' , true );
					self.ui.todos.css( 'text-decoration', 'line-through' );
				}else{
					self.ui.finished.prop( 'checked' , false );
					self.ui.todos.css( 'text-decoration', 'none' );
				}

				}},
				{wait : true});
		}

	} );

} );