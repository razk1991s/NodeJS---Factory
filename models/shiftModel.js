const mongoose = require('mongoose');

const shiftSchema = new mongoose.Schema({
    Date: String,
    StartHour: String,
    EndHour: String,
    EmployeeID: { type: mongoose.Schema.ObjectId, ref: 'employee' }
}, {versionKey: false});

const Shift = mongoose.model('shift', shiftSchema);

module.exports = Shift;