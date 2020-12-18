const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let santosh = new Schema({
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String
    }
});

module.exports = mongoose.model('santosh', santosh);