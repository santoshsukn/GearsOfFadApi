const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let patientdata = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('patientdata', patientdata);