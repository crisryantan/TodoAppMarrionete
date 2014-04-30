var express = require('express'),
	app = express(),
	http = require('http'),
	server = http.createServer(app),
	port = 3030,
	path = require('path'),
	cwd = process.cwd(),
	files = path.join(cwd);

	var allowCrossDomain = function(req, res, next){
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
		res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

	if('OPTIONS' == req.method){
			res.send(200);
		}else{
			next();
		}
	};

	app.use( allowCrossDomain);
	app.use(express.static(files));

	server.listen(port, function(){
		console.log('App is starting in port 3030');
	});