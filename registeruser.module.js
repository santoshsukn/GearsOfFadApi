const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let registeruser = new Schema({
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String 
    },
    DOB:{
        type : Date,
        required: false
    },
    email:{
        type : String,
        required: true
    },
    mobile:{
        type : String,
        required: true
    },
    role:{
        type : String,
        required: true
    },
    fatherName : {
        type : String,
        required: false
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

module.exports = mongoose.model('registeruser', registeruser);