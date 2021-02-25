const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Employee = mongoose.model('Employee');

router.get('/', (req, res) => {
  res.render('employee/addOrEdit', {
    viewTitle: 'Insert Employee',
  });
});

router.post('/', (req, res) => {
  if (req.body._id == '') insertRecord(req, res);
  else updateRecord(req, res);
});

function insertRecord(req, res) {
  var employee = new Employee();
  employee.firstName = req.body.firstName;
  employee.lastName = req.body.lastName;
  employee.age = req.body.age;
  employee.gender = req.body.gender
  employee.email = req.body.email;
  employee.address = req.body.address;
  employee.save((err, doc) => {
    if (!err) res.redirect('employee/list');
    else {
      if (err.name == 'ValidationError') {
        handleValidationError(err, req.body);
        res.render('employee/addOrEdit', {
          viewTitle: 'Insert Employee',
          employee: req.body,
        });
      } else console.log('Error during record insertion : ' + err);
    }
  });
}

function updateRecord(req, res) {
  Employee.findOneAndUpdate(
    { _id: req.body._id },
    req.body,
    { new: true },
    (err, doc) => {
      if (!err) {
        res.redirect('employee/list');
      } else {
        if (err.name == 'ValidationError') {
          handleValidationError(err, req.body);
          res.render('employee/addOrEdit', {
            viewTitle: 'Update Employee',
            employee: req.body,
          });
        } else console.log('Error during record update : ' + err);
      }
    }
  );
}

router.get('/list', (req, res) => {
  Employee.find((err, docs) => {
    if (!err) {
      res.render('employee/list', {
        list: docs,
      });
    } else {
      console.log('Error in retrieving employee list :' + err);
    }
  });
});

function handleValidationError(err, body) {
  for (field in err.errors) {
    switch (err.errors[field].path) {
      case 'firstName':
        body['firstNameError'] = err.errors[field].message;
        break;
      case 'lastName':
        body['lastNameError'] = err.errors[field].message;
        break;
      case 'email':
        body['emailError'] = err.errors[field].message;
        break;
      default:
        break;
    }
  }
}

router.get('/:id', (req, res) => {
  Employee.findById(req.params.id, (err, doc) => {
    if (!err) {
      res.render('employee/addOrEdit', {
        viewTitle: 'Update Employee',
        employee: doc,
      });
    }
  });
});

router.get('/delete/:id', (req, res) => {
  Employee.findByIdAndRemove(req.params.id, (err, doc) => {
    if (!err) {
      res.redirect('/employee/list');
    } else {
      console.log('Error in employee delete :' + err);
    }
  });
});

module.exports = router;
