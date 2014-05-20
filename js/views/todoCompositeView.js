define( function ( require ) {

	var Marionette						= require ( 'marionette' );
	var TodoList							= require ( './todoListView' );
	var todoCompositeTemplate = require ( 'doT!template/todoCompositeView' );
	var todoModel							= require ( 'models/todoModel' );

	return Marionette.CompositeView.extend( {
		tagName						: 'div',
		template					: todoCompositeTemplate,
		itemView					: TodoList,
		itemViewContainer : 'ul',

		'ui' : {
			'todoInput'       : '#todoInput',
			'elementCheckbox' : '.elementCheckbox',
			'selectAll'       : '#check_all',
			'deleteSelected'  : '#delete_selected',
			'itemsLeft'       : 'span#items-left'
		},

		'events' : {
			'click @ui.selectAll'      : 'selectAll',
			'click @ui.deleteSelected' : 'deleteSelected',
			'keypress @ui.todoInput'   : 'keyCode'
		},

		initialize : function() {
			var self = this;
			this.collection.fetch( {
				success : function( collection ) {
					if( collection.length === collection.where( {isFinished : true}).length ) {
						self.ui.selectAll.prop( 'checked', true );
					}
					if( collection.length === 0 ) {
						self.ui.selectAll.prop( 'checked', false );
					}
				}
			});
			this.listenTo( this.collection,'change:isFinished',this.updateFlag );
			this.listenTo( this.collection,'sync', this.updateRemaining) ;
			this.listenTo( this.collection,'remove', this.updateRemaining );
		},

		updateFlag : function(){
			if( this.collection.length === this.collection.where( {isFinished : true}).length ) {
					this.ui.selectAll.prop( 'checked', true );
			}
			else{
					this.ui.selectAll.prop( 'checked', false );
			}
		},

		selectAll : function() {
			var self = this;
			if( this.ui.selectAll.is( ':checked' ) ) {
				this.collection.each( function( task ) {
					task.save( { 'isFinished' : true }, {
						success : function() {
							this.$( '.elementCheckbox' ).prop( 'checked', true );
							this.$( '.elementLI' ).css( 'text-decoration', 'line-through' );
						}
					},
					{
						wait : true
					});
				});
			}else{
				this.collection.each( function( task ) {
					task.save( { 'isFinished' : false }, {
						success : function() {
							this.$( '.elementCheckbox' ).prop( 'checked', false );
							this.$( '.elementLI' ).css( 'text-decoration', 'none' );
						}
					},
					{
						wait : true
					});
				});
			}

		},

		deleteSelected : function() {
			this.collection.each( function( model ){
				if( model.get( 'isFinished' ) ){
					model.destroy( { wait : true } );
				}
			});
			this.$( '#check_all' ).prop( 'checked', false );
		},

		keyCode : function( e ) {
			if( e.keyCode === 13 ) {
				this.addTodo();
			}
		},
		addTodo : function(){
			var todoInput = $( '#todoInput' ).val();
			var task      = new todoModel ( { todo : todoInput} );
			var self      = this;

			task.save( {} ,{
				success : function( data ){
					console.log('successfully added todo');
					self.collection.add( data );
					$( '#todoInput' ).val('');
			},
				error   : function(err) {
					console.log( 'error saving todo : ' + err );
				}
			} );
		},

		updateRemaining : function () {
			var remaining = this.collection.where( { 'isFinished' : false } );
			var toDelete  = Math.abs( remaining.length - this.collection.length );
			this.ui.itemsLeft.text( remaining.length );
			if( toDelete === 0 ) {
				this.ui.deleteSelected.addClass('hide');
			}else{
				this.ui.deleteSelected.removeClass('hide');
			}
		}

	});

} );