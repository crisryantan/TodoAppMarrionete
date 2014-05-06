var schema = require('../models/schema');
var mongoose = require('mongoose');

var ObjectId = mongoose.Types.ObjectId;

exports.create = function(req, res, next){
			console.log('Request : ' + req.body.todo);
			new schema.Todo({}, { versionKey: false });
			var Todo = new schema.Todo({
				todo: req.body.todo,
				isFinished : false
			});
			Todo.save(function(err,todo){
				if(err) return console.log(err);
				else{
						console.log('successfully added');
						res.send(200,todo);
				}
			});
};

exports.displayTodo = function(req, res, next){
	schema.Todo.find({}, function(err,todos){
		if(err) return res.status(500).send({ sstatus : 'Failed to find todos'});
		res.send(200,todos);
	});
};

exports.destroy = function(req, res, next){
		schema.Todo.findByIdAndRemove(req.params.id, {}, function(err,todo){
				if (err) console.log(err);
				res.send(200, todo);
				console.log('successfully deleted : ' + req.params.id);
		});
};

exports.update = function(req, res, next){
	console.log(req.params.id);
	schema.Todo.findByIdAndUpdate({'_id' : ObjectId(req.params.id)}, {$set:{ todo: req.body.todo, isFinished : req.body.isFinished }},{},function(err,todo){
		if(err){console.log(err);}
		else{
			res.send(200, todo)
			console.log('success update');}
	});
};