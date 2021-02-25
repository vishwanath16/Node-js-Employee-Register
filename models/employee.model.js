const mongoose = require('mongoose');

var employeeSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: 'This field is required.',
    },
    lastName: {
        type: String,
    },
    age: {
        type: Number,
        min: 1,
        maxlength: 5,
        required: true,
    },
    gender : String,
    email: {
        type: String,
        unique : true,
        required: true,
    },
    address: {
        type: String
    }
});

// Custom validation for email
employeeSchema.path('email').validate((val) => {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, 'Invalid e-mail.');



mongoose.model('Employee', employeeSchema);