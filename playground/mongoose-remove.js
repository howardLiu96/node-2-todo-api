const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({}).then((result) => {
// 	console.log(result);
// });

// Todo.findOneAndRemove
// Todo.findByIdAndRemove

Todo.findByIdAndRemove('5c3ec5a9ff7e1b0cdbfa67c5').then((todo) => {
	console.log(todo);
});

Todo.findOneAndRemove({_id: '5c3ec5a9ff7e1b0cdbfa67c5'}).then((todo) => {
	console.log(todo);
});