var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
var PORT = process.env.PORT || 3000;
// var todos = [];
// var todoNextId = 1;

var todos = [  {
    "description": "Walk the dog",
    "completed": false,
    "id": 1
  },
  {
    "description": "talk to the Dog",
    "completed": true,
    "id": 2
  },
  {
    "description": "talk to the computer",
    "completed": true,
    "id": 3
  },
  {
    "description": "yell at the computer",
    "completed": false,
    "id": 4
  }];
var todoNextId = 5;

app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send('Todo API Root');
});

// GET /todos
// GET /todos?completed=[true|false]
// GET /todos?q=string
app.get('/todos', function (req, res) {
  var queryParams = req.query;
  var filteredTodos = todos;

  // /todos?completed=[true|false]
  if (queryParams.hasOwnProperty('completed')) {
    if (queryParams.completed.toLowerCase() === 'true') {
      filteredTodos = _.where(filteredTodos, {completed: true});
    }
    else if (queryParams.completed.toLowerCase() === 'false') {
      filteredTodos = _.where(filteredTodos, {completed: false});
    }
    // else {
    //   return res.status(400).send();
    // }
  }

  // /todos?q=string
  if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
      filteredTodos = _.filter(filteredTodos, function (todo) {
        return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
      });
  }

  res.json(filteredTodos);
});

// GET /todos/#   - display todo #
app.get('/todos/:id', function (req, res) {
  // Number() or parseInt() will do...
  var id = parseInt(req.params.id);
  // use underscore function _.findWhere()
  var todo = _.findWhere(todos, {id: id});

  if (todo) {
    res.json(todo);
  }
  else {
    // res.status(404).send('id: ' + req.params.id + ' not found');
    res.status(404).send();
  }
});

// POST /todos    - add incoming todo json to todos array
app.post('/todos', function (req, res) {
  var body = _.pick(req.body, 'description', 'completed');

  if (!_.isBoolean(body.completed) ||
      !_.isString(body.description) ||
      body.description.trim().length === 0) {
        return res.status(400).send()
  }

  body.description = body.description.trim();
  body.id = todoNextId++;

  todos.push(body);
  res.json(body);
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

app.listen(PORT, function () {
  console.log('Express listening on port ' + PORT);
});