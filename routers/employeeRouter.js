const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

const employeeServices = require("../services/employeeService.js");
const generalService = require("../services/generalService.js");
const usersService = require("../services/usersService.js");

// Entry Point: http://localhost:3000/employee

router.get("/", (req, res) => {
  const token = req.headers["x-access-token"];

  if (!token) {
    res.status(401).json("No token provided");
  }

  const SECRET_KEY = "raz-key";
  jwt.verify(token, SECRET_KEY, async (err, data) => {
    if (err) {
      res.status(500).json("Failed to authenticate token");
    }
    const dataFromDB = await generalService.getData(data);
    const departments = await generalService.getDepartments();
    for (let user of dataFromDB) {
      if (user._id.toString() === data.id) {
        const shiftData = await generalService.getShiftByEmployeeId(data.id);
        const Date = shiftData.map((shift) => {
          return {
            Date: shift.Date,
            StartHour: shift.StartHour,
            EndHour: shift.EndHour,
          };
        });
        const deparmentOfEmployee = departments.find(
          (d) => d._id.toString() === user.DepartmentID.toString()
        );
        const employee = [
          {
            name: user.FirstName,
            lastName: user.LastName,
            email: user.Email,
            Department: deparmentOfEmployee.Name,
            StartWork: user.StartWork,
            shiftData: shiftData,
          },
        ];
        res.json(employee);
      }
    }
  });
});

router.get("/info", async (req, res) => {
  try {
    const employees = await employeeServices.getEmployeesDataDB();
    const departments = await generalService.getDepartments();
    const array = [];
    for (let d of departments) {
      const department = employees.filter(
        (e) => e.DepartmentID.toString() === d._id.toString()
      );
      array.push(department);
    }
    res.status(200).json(array);
  } catch (err) {
    res.status(400).json(console.log(err));
  }
});

router.get("/data", async (req, res) => {
  try {
    const employees = await employeeServices.getEmployeesDataDB();
    res.status(200).json(employees);
  } catch (err) {
    res.status(400).json(console.log(err));
  }
});

//Update employee with put
router.put("/", async (req, res) => {
  try {
    const updateLog = req.body;
    const send = await employeeServices.updateEmployeeInDB(
      updateLog.id,
      updateLog.paramater
    );
    console.log(send);
    res.status(200).json({ message: "Employee Updated" });
  } catch {
    res.status(500);
  }
});

//Update employee with patch
router.patch("/", async (req, res) => {
  try {
    const updateLog = req.body;
    const SECRET_KEY = "raz-key";
    jwt.verify(updateLog.token, SECRET_KEY, async (err, data) => {
      await employeeServices.updateEmployeeInDB(data.id, updateLog);
    });
    res.status(200).json({ message: "Updated" });
  } catch {
    res.status(500);
  }
});

//Delete employee
router.delete("/", async (req, res) => {
  try {
    const { name } = req.body;
    await employeeServices.deleteShift(name);
    await employeeServices.deleteEmployeeFromDB(name);
    res.status(200).json("Deleted");
  } catch (error) {
    console.log(error);
    res.status(500);
  }
});

// Get all the employees from the WS
router.get("/ws", async (req, res) => {
  await employeeServices.getEmployeesData();
  res.status(200);
});

// Send all the employees data into the DB
router.post("/ws", async (req, res) => {
  await employeeServices
    .writeEmployeesToDB()
    .then(async () => {
      await usersService.asignUserToEmployee();
      res.status(200).send("DB has been updated!");
    })
    .catch((err) => {
      res.status(400);
      console.log(err);
    });
});

// Create new employee
router.post("/signup", async (req, res) => {
  const emp = req.body;
  employeeServices
    .addNewEmployeToDB(emp)
    .then(() => {
      res.status(200).json("Successefully added new employee");
    })
    .catch((err) => {
      res.status(400).json({ error: "An error occurred", details: err });
      console.log(err);
    });
});

// Update shift clockout
router.put("/logout", async (req, res) => {
  try {
    const { token } = req.body;
    const SECRET_KEY = "raz-key";
    let id = 0;
    let issuedAt = "";
    jwt.verify(token, SECRET_KEY, (err, data) => {
      if (err) {
        console.log(err);
      }
      id = data.id;
      issuedAt = data.issuedAt;
      return;
    });
    generalService.updateShiftClockOut(id, issuedAt);
    res.status(200).json("Clocked Out!");
  } catch {
    res.status(500).json("Clock has not set");
  }
});

module.exports = router;
