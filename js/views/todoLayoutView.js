define ( function ( require ) {
	var Marionette = require ( 'marionette' );
	var todoLayoutTemplate = require ( 'doT!template/todoLayoutView' );

	return Marionette.Layout.extend({
		template : todoLayoutTemplate,
		regions:{
			listTodo : '#todo-list'
		}
	});

} );