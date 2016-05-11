var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;

var todos = [{
  id: 1,
  description: 'Meet mom for lunch',
  completed: false
}, {
  id: 2,
  description: 'Go to market',
  completed: false
}, {
  id: 3,
  description: 'Feed the dog',
  completed: true
}];

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

app.listen(PORT, function () {
  console.log('Express listening on port ' + PORT);
});