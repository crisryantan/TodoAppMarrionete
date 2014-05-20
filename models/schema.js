var mongoose			= require('mongoose');
var todoSchema		= mongoose.Schema({
	todo : String,
	isFinished : Boolean
});

mongoose.model('Todo', todoSchema);

module.exports = {
	Todo : mongoose.model('Todo')
};