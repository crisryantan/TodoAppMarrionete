define( function ( require ) {

	var Marionette = require( 'marionette' );
	var Backbone = require( 'backbone' );
	var todoCollection = require( 'collection/todoCollection' );
	var todoModel = require ( 'models/todoModel' );
	var TodoLayout = require( 'views/todoLayoutView' );
	var TodoList = require ( 'views/todoListView' );
	var TodoCompositeView = require ( 'views/todoCompositeView' );
	var StatusView = require ( 'views/todoStatusView' );
	var TodoApp = new Marionette.Application();

	TodoApp.addRegions({
		mainRegion : '#main-region'
	});



	TodoApp.on('initialize:after', function(){
		console.log('App is initialized');

		var todosCollection = new todoCollection();

		var todoComposite = new TodoCompositeView( {
			collection : todosCollection
		} );

		var layout = new TodoLayout();

		TodoApp.mainRegion.show(layout);
		layout.listTodo.show(todoComposite);
	});

	return TodoApp;
});