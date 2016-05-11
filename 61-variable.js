
// Object exmaple
var person = {
  name: 'Andrew',
  age:21
}

function updatePerson (obj) {

  // // local object...
  // obj = {
  //   name: 'Andrew',
  //   age: 24
  // };

  // if not local, referenced object
  obj.age = 24;
}

updatePerson(person);
console.log(person);

// Array example
var grades = [15, 88];

function addGrades (gradesArr) {
  gradesArr.push(55);
  debugger; // plants breakpt

  // local array
  // gradesArr = [12, 33, 99]
}

addGrades(grades);
console.log(grades);