define( function ( require ) {
	var Backbone = require ( 'backbone' );

	TodoModel = Backbone.Model.extend({
		idAttribute : '_id',
		urlRoot     : 'http://localhost:3030/todos',
		validate    : function( attrs ) {
			if( !attrs.todo.trim() ) {
				return 'Enter valid todo';
			}
		}
	});

	return TodoModel;

} );