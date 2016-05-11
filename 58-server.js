var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send('Todo API Root');
});

app.get('/todos', function (req, res) {
  res.json(todos);
});

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

// process incoming json, add to todos array
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

app.listen(PORT, function () {
  console.log('Express listening on port ' + PORT);
});