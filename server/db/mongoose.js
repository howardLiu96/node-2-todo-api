var mongoose = require('mongoose');
let db = {
	localhost: 'mongodb://localhost:27017/TodoApp',
	mlab: 'mongodb://howard:asdf1234@ds159164.mlab.com:59164/howard_todo'
};
mongoose.Promise = global.Promise;
mongoose.connect(db.mlab || db.localhost);

module.exports = {
	mongoose: mongoose
};