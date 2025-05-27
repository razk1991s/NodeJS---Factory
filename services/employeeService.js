const wsEmployeeRepo = require("../repository/wsEmployeeRepo");
const dbEmployeeRepo = require("../repository/dbEmployeeRepo");
const dbDepartmentRepo = require("../repository/dbDepartmentRepo");
const userRepo = require("../repository/dbUsersRepo");

const getEmployeeInfoByName = async (name) => {
  const firstName = name.split(" ")[0];
  const lastName = name.split(" ")[1];
  const fullName = {
    firstName,
    lastName,
  };
  return await dbEmployeeRepo.getEmployeeByName(fullName);
};

// Get all the full data from the WS using employee Repository
const getEmployeesData = async () => {
  return await wsEmployeeRepo.getAllData();
};

const getEmployeesDataDB = async () => {
  return await dbEmployeeRepo.getDataFromDB();
};

const getEmployeeById = async (id) => {
  return await dbEmployeeRepo.getEmployeeById(id);
};

// Write all the employees data to the DB from the WS
const writeEmployeesToDB = async () => {
  const employees = await dbEmployeeRepo.getDataFromWs();
  for (let employee of employees) {
    const index = Math.floor(Math.random() * 5);
    const depArray = [
      "CEO",
      "Analysts",
      "Finance",
      "Buisness",
      "R&D",
      "General",
    ];
    const id = employee.id.toString();
    const fullName = employee.name.split(" ");
    const firstName = fullName[0];
    const lastName = fullName[1];
    const email = employee.email;
    const startYear = (Math.floor(Math.random() * 30) + 1995).toString();
    const department = depArray[index];
    const depExist = await dbDepartmentRepo.getDepartmentIdByItName(department);
    if (!depExist) {
      const { _id: specialId } = await dbDepartmentRepo.addNewDepartment(
        department
      );
      const employeeObj = {
        id: id,
        FirstName: firstName,
        LastName: lastName,
        StartWork: startYear,
        DepartmentID: specialId,
        Email: email,
      };
      await dbEmployeeRepo.createNewEmploye(employeeObj);
    } else {
      const { _id: depId } = await dbDepartmentRepo.getDepartmentIdByItName(
        department
      );
      const employeeObj = {
        id: id,
        FirstName: firstName,
        LastName: lastName,
        StartWork: startYear,
        DepartmentID: depId,
        Email: email,
      };
      await dbEmployeeRepo.createNewEmploye(employeeObj);
    }
  }
};

//Add new employeee and Create/Add to a deparment
const addNewEmployeToDB = async (emp) => {
  await userRepo.addNewUserByParm(emp.FirstName, emp.LastName);
  const department = {
    Name: emp.Department,
    Manager: emp.Manager,
  };
  const departments = await dbDepartmentRepo.getAllDepartments();
  const existedDepartment = departments.find((d) => d.Name === department.Name);

  //Grant manager permissions to the first employee to signg up
  if (!existedDepartment) {
    const newDepartment = await dbDepartmentRepo.addNewDepartment(
      department.Name
    );
    const id = newDepartment._id;
    const employee = {
      FirstName: emp.FirstName,
      LastName: emp.LastName,
      StartWork: emp.StartWork,
      Email: emp.Email,
      DepartmentID: id,
    };
    const employees = await dbEmployeeRepo.getDataFromDB();
    if (employees.length > 1) {
      return await dbEmployeeRepo.createNewEmploye(employee);
    }
    await dbEmployeeRepo.createNewEmploye(employee);
    const manager = await dbEmployeeRepo.getDataFromDB();
    const obj = { Name: department.Name, ManagerID: manager[0]._id };
    await dbDepartmentRepo.updateDepartmentByName(obj.Name, obj.ManagerID);
    return "Wellcome new manager!";
  } else {
    const depID = await dbDepartmentRepo.getDepartmentIdByItName(
      department.Name
    );
    const employee = {
      FirstName: emp.FirstName,
      LastName: emp.LastName,
      StartWork: emp.StartWork,
      Email: emp.Email,
      DepartmentID: depID,
    };
    return dbEmployeeRepo.createNewEmploye(employee);
  }
};

const updateEmployeeInDB = async (id, obj) => {
  return await dbEmployeeRepo.updateEmployee(id, obj);
};

const deleteEmployeeFromDB = async (name) => {
  return await dbEmployeeRepo.deleteEmployee(name);
};

const deleteShift = async (name) => {
  try {
    const shifts = await dbEmployeeRepo.getShifts();
    const employees = await dbEmployeeRepo.getDataFromDB();
    const id = employees.find((e) => {
      if (e.FirstName === name) {
        return e._id;
      }
    })._id;
    const employeeShifts = shifts.filter(
      (s) => s.EmployeeID.toString() === id.toString()
    );
    for (let emp of employeeShifts) {
      await dbDepartmentRepo.deleteShifts(emp.EmployeeID);
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getEmployeesData,
  getEmployeeById,
  getEmployeeInfoByName,
  getEmployeesDataDB,
  writeEmployeesToDB,
  updateEmployeeInDB,
  addNewEmployeToDB,
  deleteEmployeeFromDB,
  deleteShift,
};
