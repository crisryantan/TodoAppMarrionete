define( function ( require ) {

	var Backbone	= require ( 'backbone' );
	var todoModel	= require( '../models/todoModel' );

	todoCollection	= Backbone.Collection.extend({
		model : todoModel,
		url : 'http://localhost:3030/todos'
	});

	return todoCollection;
} );