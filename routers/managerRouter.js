const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const generalService = require("../services/generalService");
const employeeService = require("../services/employeeService");
const managerService = require("../services/managerService");

// Entry Point: http://localhost:3000/manager

router.get("/", async (req, res) => {
  try {
    const shift = await managerService.getAllShiftManagement();
    res.status(200).json(shift);
  } catch {
    res.status(400).json("Cannot find data.");
  }
});

router.post("/", async (req, res) => {
  try {
    const { date } = req.body;
    await managerService.createManagementShift(date);
    res.status(200).json("Shift has created!");
  } catch {
    res.status(400);
  }
});

router.get("/name", async (req, res) => {
  try {
    const name = req.headers["some-content"];
    const employee = await employeeService.getEmployeeInfoByName(name);
    const manager = employee._id;
    await generalService.updateDepartmentById(employee.DepartmentID, {
      ManagerID: manager,
    });
    res.status(200).json(employee);
  } catch {
    res.status(400);
  }
});

router.get("/byName", async (req, res) => {
  try {
    const name = req.headers["some-content"];
    console.log(name);
    const employee = await employeeService.getEmployeeInfoByName(name);
    res.status(200).json(employee);
  } catch {
    res.status(400);
  }
});

router.get("/name/edit", (req, res) => {
  const token = req.headers["x-access-managertoken"];
  if (!token) {
    res.status(401).json("No token provided");
  }
  const SECRET_KEY = "raz-key";
  jwt.verify(token, SECRET_KEY, async (err, data) => {
    if (err) {
      res.status(500).json("Failed to authenticate token");
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

module.exports = router;
