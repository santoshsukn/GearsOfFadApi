const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let user = new Schema({
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String
    },
    gender:{
        type : String,
        required: true
    },
    age:{
        type : Number,
        required: true
    },
    fatherName : {
        type : String,
        required: true
    },
    userName : {
        type : String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    createdDate: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('user', user);