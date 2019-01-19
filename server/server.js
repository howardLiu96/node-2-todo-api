require('./config/config.js');

// var env = process.env.NODE_ENV || 'development';
// console.log('env ******', env);
// if (env == 'development') {
// 	process.env.PORT = 3000;
// 	process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
// } else if (env === 'test') {
// 	process.env.PORT = 3000;
// 	process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
// }



const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {ObjectID} = require('mongodb');
var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
	var todo = new Todo({
		text: req.body.text
	});

	todo.save().then((doc) => {
		res.send(doc);
	}, (err) => {
		res.status(400).send(err);
	});
});

app.get('/todos', (req, res) => {
	Todo.find().then((todos) => {
		res.send({todos: todos});
	}, (err) => {
		res.status(400).send(err);
	});
});

app.get('/todos/:id', (req, res) => {
	var id = req.params.id;
	if (!ObjectID.isValid(id)) {
		return res.status(404).send();
	}

	Todo.findById(id).then((todo) => {
		if (!todo) {
			return res.status(404).send();
		}
		res.send({todo});
	}, (err) => {
		res.status(400).send();
	});
});

app.delete('/todos/:id', (req, res) => {
	var id = req.params.id;

	if (!ObjectID.isValid(id)) {
		return res.status(404).send();
	}

	Todo.findByIdAndRemove(id).then((todo) => {
		if (!todo) {
			return res.status(404).send();
		}
		res.status(200).send({todo});
	}, (err) => {
		res.status(400).send();
	});
});

app.patch('/todos/:id', (req, res) => {
	var id = req.params.id;
	var body = _.pick(req.body, ['text', 'completed']);

	if (!ObjectID.isValid(id)) {
		return res.status(404).send();
	}

	if (_.isBoolean(body.completed) && body.completed) {
		body.completedAt = new Date().getTime();
	} else {
		body.completed = false;
		body.completedAt = null;
	}

	Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
		if (!todo) {
			return res.status(404).send();
		}
		res.send({todo});
	}).catch((e) => {
		res.status(400).send();
	});
});

app.post('/users', (req, res) => {
	var body = _.pick(req.body, ['email', 'password']);
	var user = new User(body);

	user.save().then(() => {
		return user.generateAuthToken();
		// res.send(user);
	}).then((token) => {
		res.header('x-auth', token).send(user);
	}).catch((err) => {
		res.status(400).send(err);
	});
});

// var authenticate = (req, res, next) => {
// 	var token = req.header('x-auth');

// 	User.findByToken(token).then((user) => {
// 		if (!user) {
// 			return Promise.reject();
// 		}

// 		req.user = user;
// 		req.token = token;
// 		next();
// 	}).catch((err) => {
// 		res.status(401).send();
// 	});
// };

app.get('/users/me', authenticate, (req, res) => {
	res.send(req.user);
});

// POST /users/login
app.post('/users/login', (req, res) => {
	var body = _.pick(req.body, ['email', 'password']);
	User.findByCredentials(body.email, body.password).then((user) => {
		return user.generateAuthToken().then((token) => {
			res.header('x-auth', token).send(user);
		});
	}).catch((err) => {
		res.status(400).send();
	});
});

app.listen(port, () => {
	console.log(`Started up at port ${port}`);
});

module.exports = {
	app: app
};
// var new2 = new Todo({
// 	text: 'Eat dinner',
// 	completed: false,
// 	completedAt: 7
// });

// new2.save().then((doc) => {
// 	console.log('Saved todo', doc);
// }, (err) => {
// 	console.log('Unable to save todo');
// });
