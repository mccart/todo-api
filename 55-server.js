var express = require('express');
var bodyParser = require('body-parser');

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
  for (var i=0; i < todos.length; i++ ){
    // console.log(typeof id, id, typeof todos[i].id, todos[i].id);
    // console.log(typeof parseInt(id), parseInt(id), typeof todos[i].id, todos[i].id);
    // console.log(typeof Number(id), Number(id), typeof todos[i].id, todos[i].id);
    if (id === todos[i].id) {
      break;
    }
  }
  if (i < todos.length) {
    res.json(todos[i]);
  }
  else {
    res.status(404).send('id: ' + req.params.id + ' not found');
  }
});

// process incoming json, add to todos array
app.post('/todos', function (req, res) {
  var body = req.body;
  body.id = todoNextId++;
  todos.push(body);
  // console.log('---',body,'---');
  res.json(body);
});

app.listen(PORT, function () {
  console.log('Express listening on port ' + PORT);
});