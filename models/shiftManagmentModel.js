const mongoose = require('mongoose');

const shiftManagementSchema = new mongoose.Schema({
    DayOrNight: String,
    Date: String,
    NumOfEmployees: Number,
    Start: String,
    End: String,
    ManagerID: { type: mongoose.Schema.ObjectId, ref: 'department' },
}, {versionKey: false});

const ShiftMenagement = mongoose.model('shiftManagement', shiftManagementSchema)

module.exports = ShiftMenagement;