const Shift = require("../models/shiftModel");

const getShifts = async (filter) => {
  return await Shift.find(filter);
};

const createNewShift = async (shift) => {
    const newShift = new Shift(shift);
    newShift.save();
  };

module.exports = { getShifts, createNewShift }