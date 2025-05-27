const userRepo = require("../repository/dbUsersRepo");
const employeesRepo = require("../repository/dbEmployeeRepo");

const getAllUsres = async () => {
  return await userRepo.getUsers();
};

const asignUserToEmployee = async () => {
  const employees = await employeesRepo.getDataFromDB();
  employees.forEach(async (item) => {
    const numberOfAction = Math.floor(Math.random() * 2) + 5;
    const date = new Date().toString();
    const dateArr = date.split(" ");
    const finalDate =
      dateArr[0] + " " + dateArr[1] + " " + dateArr[2] + " " + dateArr[3];
    const user = {
      Date: finalDate,
      FullName: item.FirstName + " " + item.LastName,
      ActionAllowed: numberOfAction,
      MaxActions: 7,
    };
    await userRepo.addNewUser(user);
  });
  return "Users added!";
};

const dailyActionsReset = async (name, time, user) => {
  const newDay = new Date(time).getDate();
  const date = new Date().toString().split(" ");
  const oldDay = user.Date.split(" ")[2];
  if (newDay > oldDay || newDay == 1) {
    const actions = {
      Date: date[0] + " " + date[1] + " " + date[2] + " " + date[3],
      FullName: name,
      ActionAllowed: 10,
      MaxActions: 10,
    };
    await userRepo.resetActions(name, actions);
    return "Actions have been reset!";
  }
  return "No more actions left for today";
};

const useAction = async (name, lname, time) => {
  const user = await userRepo.getUserByName(name, lname);
  if (user.ActionAllowed === 0) {
    return await dailyActionsReset(name + " " + lname, time, user);
  } else {
    const id = user._id;
    const updateObj = {
      ActionAllowed: user.ActionAllowed - 1,
    };
    await userRepo.updateUser(id, updateObj);
    await dailyActionsReset(name + " " + lname, time, user);
    return "You got ore action left!";
  }
};

module.exports = {
  getAllUsres,
  asignUserToEmployee,
  dailyActionsReset,
  useAction,
};
