const Employee = require("../models/employeeModel");
const Shift = require("../models/shiftModel");
const Department = require("../models/departmentModel");
const jf = require("jsonfile");
const path = require("path");

const filePath = path.join(__dirname, "../data/employeesInfo.json");

const getEmployeeByName = async (fullName) => {
  return await Employee.findOne({
    FirstName: fullName.firstName,
    LastName: fullName.lastName,
  });
};

// Create a new employee in the DB from Web Site
const getDataFromWs = async () => {
  const data = await jf.readFile(filePath);
  return data;
};

const getEmployeeById = async (id) => {
  return await Employee.findById(id);
};

const addNewEmployee = async (emp, filter) => {
  const data = await Employee.find(filter);
  const department = await Department.find(filter);
  const employeeFullData = { data, department };
  return employeeFullData;
};

const createNewEmploye = async (emp) => {
  const newEmpolyee = new Employee(emp);
  await newEmpolyee.save();
  return "New Employee Added";
};

const getDataFromDB = async (filter) => {
  return await Employee.find(filter);
};

const getShiftByEmployeeId = async (id) => {
  return await Shift.find({ EmployeeID: id });
};

const getEmployeeShiftsById = async (id, obj, filter) => {
  const employeeShift = await Shift.find({ EmployeeID: id });
  return employeeShift;
};

const updateShiftClockOutById = async (id, obj) => {
  const clockOutTime = new Date(obj);
  const endHour = clockOutTime.toString().split(" ")[4];
  return await Shift.findByIdAndUpdate(id, { EndHour: endHour }, { new: true });
};

const updateEmployee = async (id, obj) => {
  await Employee.findOneAndUpdate({ _id: id }, obj, { new: true });
  return "Updated";
};

const deleteEmployee = async (name) => {
  return await Employee.findOneAndDelete({ FirstName: name });
};

module.exports = {
  getDataFromWs,
  getDataFromDB,
  getEmployeeById,
  getEmployeeByName,
  createNewEmploye,
  getShiftByEmployeeId,
  getEmployeeShiftsById,
  updateEmployee,
  deleteEmployee,
  addNewEmployee,
  updateShiftClockOutById,
};
