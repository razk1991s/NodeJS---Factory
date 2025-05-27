const dbEmployeeRepo = require("../repository/dbEmployeeRepo");
const dbDepartmentRepo = require("../repository/dbDepartmentRepo");
const dbshiftsRepo = require("../repository/dbShiftsRepo");

// Get the full data from the DB for the emplyee's with using employee Repository
const getData = async () => {
  return await dbEmployeeRepo.getDataFromDB();
};

const getDataFromWs = async () => {
  return await dbEmployeeRepo.getDataFromWs();
};

const insertTimeToDB = async (id, timeStemp) => {
  const enteredTime = new Date(timeStemp);
  const date =
    enteredTime.toString().split(" ")[0] +
    " " +
    enteredTime.toString().split(" ")[1] +
    " " +
    enteredTime.toString().split(" ")[2] +
    " " +
    enteredTime.toString().split(" ")[3];
  const startHour = enteredTime.toString().split(" ")[4];

  const shifts = await dbshiftsRepo.getShifts();

  const employeeShift = shifts.filter(
    (s) => s.EmployeeID.toString() === id.toString()
  );

  //Look shifts for the employee logged in
  const existingShift = employeeShift.find((s) => s.Date === date);
  if (!existingShift) {
    const shift = {
      Date: date,
      StartHour: startHour,
      EndHour: "Not clocked yet",
      EmployeeID: id,
    };
    return dbshiftsRepo.createNewShift(shift);
  }
};

const getShifts = async (filter) => {
  return await dbEmployeeRepo.getShifts(filter);
};

const getShiftsByDate = async (obj) => {
  const data = await getShifts();
  const date =
    obj.toString().split(" ")[0] +
    " " +
    obj.toString().split(" ")[1] +
    " " +
    obj.toString().split(" ")[2] +
    " " +
    obj.toString().split(" ")[3];
  return data.filter((s) => s.Date === date);
};

const getShiftByEmployeeId = async (id) => {
  return await dbEmployeeRepo.getShiftByEmployeeId(id);
};

const updateShiftClockOut = async (id, obj) => {
  const employeeShift = await dbEmployeeRepo.getEmployeeShiftsById(id);
  const index = employeeShift.length;
  const shiftToUpdate = employeeShift[index - 1];
  const specialId = shiftToUpdate._id;
  await dbEmployeeRepo.updateShiftClockOutById(specialId, obj);
};

const getEmployeeShiftsById = async (id) => {
  return await dbEmployeeRepo.getEmployeeShiftsById(id);
};

const getDepartments = async () => {
  return await dbDepartmentRepo.getAllDepartments();
};

const getDepartmentBIyId = async (id) => {
  return await dbDepartmentRepo.getDepartmentById(id);
};

const addNewDepartment = async (dep) => {
  return await dbDepartmentRepo.addNewDepartment(dep);
};

const getDepartmentDetail = async (name) => {
  try {
    const department = await dbDepartmentRepo.getDepartmentIdByItName(name);
    const employees = await getData();
    const emp = employees.filter(
      (e) => e.DepartmentID.toString() === department._id.toString()
    );
    const manager = emp.find(
      (e) => e._id.toString() === department.ManagerID.toString()
    );
    const sendData = { emp, department, manager };
    return sendData;
  } catch (error) {
    console.log(error);
  }
};

const updateDepartmentById = async (id, obj) => {
  return await dbDepartmentRepo.updateDepartmentById(id, obj);
};

const updateDepartmentByName = (obj) => {
  return dbDepartmentRepo.updateDepartmentByName(obj);
};

const deleteDepartment = (id) => {
  return dbDepartmentRepo.deleteDepartmentById(id);
};

module.exports = {
  getDataFromWs,
  getData,
  getEmployeeShiftsById,
  getShiftByEmployeeId,
  getDepartmentDetail,
  getShiftsByDate,
  getDepartments,
  getDepartmentBIyId,
  updateShiftClockOut,
  updateDepartmentById,
  updateDepartmentByName,
  insertTimeToDB,
  addNewDepartment,
  deleteDepartment,
};
