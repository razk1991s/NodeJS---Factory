const ShiftManagement  = require('../models/shiftManagmentModel');


const getShiftManagement = async (filter) =>{
    return await ShiftManagement.find(filter);
}

const createShiftManagement = async (obj) =>{
    const newShift = new ShiftManagement(obj);
    return newShift.save();
}

module.exports = { getShiftManagement, createShiftManagement }