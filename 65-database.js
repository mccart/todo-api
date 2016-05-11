var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
  dialect: 'sqlite',
  storage: __dirname + '/database.sqlite'
});

// Todo model
var Todo = sequelize.define('todo', {
  description: {
    type: Sequelize.STRING
  },
  completed: {
    type: Sequelize.BOOLEAN
  }
});

// sequelize.sync() will, based on your model definitions, create
//   any missing tables.
// If force: true it will first drop tables before recreating them.

sequelize.sync({force: true}).then(function() {
  console.log('synced');

  Todo.create({
    description: 'Walking my dog',
    completed: false
  }).then(function (todo) {
    console.log('finished', todo.dataValues);
  });
});