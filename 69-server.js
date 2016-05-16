var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./67-db.js');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

// var todos = [  {
//     "description": "Walk the dog",
//     "completed": false,
//     "id": 1
//   },
//   {
//     "description": "talk to the Dog",
//     "completed": true,
//     "id": 2
//   },
//   {
//     "description": "talk to the computer",
//     "completed": true,
//     "id": 3
//   },
//   {
//     "description": "yell at the computer",
//     "completed": false,
//     "id": 4
//   }];
// var todoNextId = 5;

app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send('Todo API Root');
});

// GET /todos
// GET /todos?completed=[true|false]
// GET /todos?q=string
app.get('/todos', function (req, res) {
  var query = req.query;
  var where = {};

  // /todos?completed=[true|false]
  if (query.hasOwnProperty('completed')) {
    if (query.completed.toLowerCase() === 'true') {
      where.completed = true;
    }
    else if (query.completed.toLowerCase() === 'false') {
      where.completed = false;
    }
  }

  // /todos?q=string
  if (query.hasOwnProperty('q') && query.q.length > 0) {
      where.description = {
        $like :'%' + query.q + '%'
      };
  }

  db.todo.findAll({
    where: where
  }).then(function (todos) {
    if (todos.length > 0) {
      res.json(todos);
    }
    else {
      res.status(404).send();
    }
  }).catch( function (e) {
    res.status(500).json(e);
  });

});

// GET /todos/#   - display todo #
app.get('/todos/:id', function (req, res) {
  var id = parseInt(req.params.id);

  db.todo.findById(id).then(function (todo){
    if (todo) {
      res.json(todo.toJSON());
    }
    else {
      res.status(404).send();
    }
  }).catch( function (e) {
    res.status(500).json(e);
  });
});

// POST /todos    - add incoming todo json to todos array
app.post('/todos', function (req, res) {
  var body = _.pick(req.body, 'description', 'completed');

  db.todo.create(body).then(function (todo){
    res.json(todo.toJSON());
  }).catch( function (e) {
    res.status(404).json(e);
  });
});

// DELETE /todo/#   - delete todo #
app.delete('/todo/:id', function (req, res) {
  var id = parseInt(req.params.id, 10);
  var todo = _.findWhere(todos, {id: id});
  // console.log(id, todo);
  if (todo) {
    todos = _.without(todos, todo);
    res.json(todo);
  }
  else {
    res.status(404).json({"error": "no todo found with that id"});
  }
});

// PUT /todos/#   - update todo #
app.put('/todos/:id', function (req, res) {
  var id = parseInt(req.params.id, 10);
  var todo = _.findWhere(todos, {id: id});

  if (!todo) {
    return res.status(404).send();
  }

  var body = _.pick(req.body, 'description', 'completed');
  var validAttributes = {};

  if (body.hasOwnProperty('completed') &&
      _.isBoolean(body.completed)) {
    validAttributes.completed = body.completed;
  }
  else if (body.hasOwnProperty('completed')) {
    return res.status(400).send();
  }

  if (body.hasOwnProperty('description') &&
      _.isString(body.description) &&
      body.description.trim().length > 0) {
    validAttributes.description = body.description.trim();
  }
  else if (body.hasOwnProperty('description')) {
    return res.status(400).send();
  }

  // apparently todo is like a ptr to todos,
  _.extend(todo, validAttributes);
  res.json(todo);

});

db.sequelize.sync({
  // force: true
}).then(function () {
  app.listen(PORT, function () {
    console.log('Express listening on port ' + PORT);
  });
});