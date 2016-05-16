var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
  dialect: 'sqlite',
  storage: __dirname + '/data/todo-api.sqlite'
});

var db = {};

db.todo = sequelize.import(__dirname + '/models/67-todo.js');
db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;
