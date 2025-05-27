const shiftRepo = require("../repository/dbShiftsRepo");
const departmentRepo = require("../repository/dbDepartmentRepo");
const managemaentRepo = require("../repository/dbManagerRepo");


const getAllShiftManagement = async () =>{
  return await managemaentRepo.getShiftManagement();
}

const createManagementShift = async (time) => {
  const shift = await shiftRepo.getShifts();
  const timeStemp = new Date(time).toUTCString();

  const date =
    timeStemp.toString().split(" ")[0] +
    " " +
    timeStemp.toString().split(" ")[2] +
    " " +
    timeStemp.toString().split(" ")[1] +
    " " +
    timeStemp.toString().split(" ")[3];

  const arr = date.split(",");
  const dateForm = arr[0] + arr[1];
  const startHour = new Date(time).getHours();

//Set number of employees in each shift
  if (startHour >=8 && startHour <16) {
    const allMorningShifts = shift.filter((s) => s.Date === dateForm);
    const newShift = {
      DayOrNight: "Morning shift",
      Date: dateForm,
      NumOfEmployees: allMorningShifts.length,
      Start: "08:00",
      End: "16:00",
    };
    return managemaentRepo.createShiftManagement(newShift);
  } else if (startHour >= 16 && startHour <= 22) {
    const allNightShifts = shift.filter((s) => s.Date === dateForm);
    const newShift = {
      DayOrNight: "Night shift",
      Date: dateForm,
      NumOfEmployees: allNightShifts.length,
      Start: "16:00",
      End: "22:00",
    };
    return managemaentRepo.createShiftManagement(newShift);
  }
};

module.exports = { getAllShiftManagement, createManagementShift };
