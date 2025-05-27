const Department = require("../models/departmentModel");
const Employee = require("../models/employeeModel");
const Shift = require("../models/shiftModel");

const getAllDepartments = async (filter) => {
  return await Department.find(filter);
};

const getDepartmentById = async (id) => {
  return await Department.findById(id);
};

const addNewDepartment =  async (dep) => {
  const newDepartment =  new Department({Name: dep});
  await newDepartment.save();
  return newDepartment;
};

const getDepartmentIdByItName =  async (name, filter) => {
  try {
    const department =  await  Department.findOne({ Name: name });
    return department;
  } catch(error){   
    return  console.log(error);
  }
};

const deleteShifts = (id) => {
  return Shift.findOneAndDelete({ EmployeeID: id });
};

const updateDepartmentById =  async (id, obj) =>{
  return Department.findByIdAndUpdate(id, obj);
};

const updateDepartmentByName = async (name, obj) =>{
  try{
    await Department.findOneAndUpdate({Name: name}, {ManagerID: obj});
  }catch (error){
    console.log(error);
  }
};

const deleteDepartmentById = async (id) =>{
  try{
    await Department.findByIdAndDelete(id);
  }catch(error){
    console.log(error);
  }
};

module.exports = {
  getAllDepartments,
  getDepartmentById,
  addNewDepartment,
  getDepartmentIdByItName,
  deleteShifts,
  updateDepartmentById,
  updateDepartmentByName,
  deleteDepartmentById
};
