requirejs.config({
	baseUrl : '	js',
	paths : {
		'jquery'				: '../bower_components/jquery/dist/jquery',
		'underscore'			: '../bower_components/underscore/underscore',
		'backbone'				: '../bower_components/backbone/backbone',
		'backbone.babysitter'	: '../bower_components/backbone.babysitter/lib/backbone.babysitter',
		'backbone.wreqr'		: '../bower_components/backbone.wreqr/lib/backbone.wreqr',
		'marionette'			: '../bower_components/marionette/lib/core/amd/backbone.marionette',
		'bootstrap'			: '../bower_components/bootstrap/dist/js/bootstrap',
		'text'					: '../bower_components/requirejs-text/text',
		'doT'					: '../bower_components/requirejs-doT/doT',
		'doTCompiler'			: '../bower_components/doT/doT'

	},

	doT: {
			dext: '.dot', // extension of the templates, defaults to .dot
			templateSettings: {
				evaluate:    /\{\{([\s\S]+?)\}\}/g,
				interpolate: /\{\{=([\s\S]+?)\}\}/g,
				encode:      /\{\{!([\s\S]+?)\}\}/g,
				use:         /\{\{#([\s\S]+?)\}\}/g,
				define:      /\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,
				conditional: /\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,
				iterate:     /\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,
				varname: 'it',
				strip: true,
				append: true,
				selfcontained: false
			}
		},

	shim : {
		underscore : {
			exports : "_"
		},
		backbone : {
			deps : [ "jquery", "underscore"],
			exports : "Backbone"
		},
		marionette : {
			deps : [ 'backbone' ],
			exports : 'Marionette'
		}
	}
});
