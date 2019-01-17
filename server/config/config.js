var env = process.env.NODE_ENV || 'development';

if (env == 'development') {
	process.env.PORT = 3000;
	process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
} else if (env === 'test') {
	process.env.PORT = 3000;
	process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
} else {
	process.env.MONGODB_URI = 'mongodb://howard:asdf1234@ds159164.mlab.com:59164/howard_todo';
}