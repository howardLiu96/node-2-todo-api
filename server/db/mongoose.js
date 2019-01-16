var mongoose = require('mongoose');
let db = {
	localhost: 'mongodb://localhost:27017/TodoApp',
	mlab: 'mongodb://rs146160:NoIdea149@ds159164.com:59164/howard_todo'
};
mongoose.Promise = global.Promise;
mongoose.connect(db.localhost || db.mlab);

module.exports = {
	mongoose: mongoose
};