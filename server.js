var express  = require( 'express' );
var app      = express();
var connect  = require( 'connect' );
var http     = require( 'http' );
var server   = http.createServer( app );
var port     = 3030;
var path     = require( 'path' );
var cwd      = process.cwd();
var crud     = require( './controllers/todoAPI' );
var configDB = require( './controllers/database.js' );
var mongoose = require( 'mongoose' );
var files    = path.join( cwd );

	mongoose.connect(configDB.url);

	var allowCrossDomain = function ( req, res, next ) {
		res.setHeader( 'Access-Control-Allow-Origin', '*' );
		res.setHeader( 'Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS' );
		res.setHeader( 'Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With' );

	if ( 'OPTIONS' == req.method ) {
			res.send(200);
		}else{
			next();
		}
	};

	app.use( allowCrossDomain );
	app.use( express.static(files) );
	app.use( connect.bodyParser() );

	app.get( '/todos', crud.displayTodo );
	app.post( '/todos', crud.create );
	app.delete( '/todos/:id', crud.destroy );
	app.put( '/todos/:id', crud.update );

	server.listen(port, function() {
		console.log('App is starting in port 3030');
	});