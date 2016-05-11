var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
  dialect: 'sqlite',
  storage: __dirname + '/database.sqlite'
});

// Todo model
var Todo = sequelize.define('todo', {
  description: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      len: [1,250]
    }
  },
  completed: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
});

// sequelize.sync() will, based on your model definitions, create
//   any missing tables.
// If force: true it will first drop tables before recreating them.

sequelize.sync({
  // force: true
}).then(function() {
  console.log('synced');

  Todo.findById(2).then(function (todo) {
    if (todo) {
      console.log(todo.toJSON());
    } else {
      console.log('Todo not found');
    }
  });

  // Todo.create({
  //   description: 'Take out trash'
  // }).then( function (todo) {
  //   // console.log('finished', todo.dataValues);
  //   return Todo.create({
  //     description: 'Clean office'
  //   });
  // }).then(function() {
  //   // return Todo.findById(1);
  //   return Todo.findAll({
  //     // where: { completed: false }
  //     // where: { description: { $like: '%trash%' } }
  //     where: { description: { $like: '%Office%' } }
  //   });
  // }).then(function (todos) {
  //   if (todos) {
  //     // forEach only for findAll() ...
  //     todos.forEach(function (todo) {
  //       console.log(todo.toJSON());
  //     });
  //   }
  //   else {
  //     console.log('no todo found');
  //   }
  // }).catch( function (e) {
  //   console.log(e);
  // });

});