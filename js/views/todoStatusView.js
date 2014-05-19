define( function ( require ) {

	var Marionette = require ( 'marionette' );
	var todoStatusTemplate = require ( 'doT!template/todoStatusView' );

	return Marionette.ItemView.extend({
		tagName : 'span',
		className : 'statusContainer',
		template : todoStatusTemplate
	});

});