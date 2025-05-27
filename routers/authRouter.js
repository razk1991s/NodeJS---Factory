const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

const generalService = require("../services/generalService.js");
const employeeService = require("../services/employeeService.js");

// Entry Point: http://localhost:3000/auth

router.post("/login", async (req, res) => {
  try {
    const { username, email, issuedAt } = req.body;
    //check username and email are valid from data in the WS
    const db = await generalService.getData();

    for (let user of db) {
      const name = username.split(" ")[0];
      const lastName = username.split(" ")[1];
      if (
        name === user.FirstName &&
        lastName === user.LastName &&
        email === user.Email
      ) {
        const userId = user._id;

        // Add the time shift into the DB
        await generalService.insertTimeToDB(userId, issuedAt);
        const SECRET_KEY = "raz-key";
        const token = jwt.sign({ id: userId, issuedAt: issuedAt }, SECRET_KEY, {
          expiresIn: "8h",
        });
        res.status(200).json({ token });
      }
    }
  } catch {
    res.status(400).send("No token provided");
  }
});

router.post("/manager", (req, res) => {
  try {
    const token = req.headers["x-access-token"];
    const SECRET_KEY = "raz-key";

    jwt.verify(token, SECRET_KEY, async (err, data) => {
      if (err) {
        console.log("Token not provided" + err);
      }
      // Check who is loged into the system and bring his data from DB
      const employee = await employeeService.getEmployeeById(data.id);
      const department = await generalService.getDepartmentBIyId(
        employee.DepartmentID
      );

      //Authoritize manager permissions
      if (department.ManagerID.toString() === employee._id.toString()) {
        const managerToken = jwt.sign(
          { id: employee._id, departmentID: employee.DepartmentID },
          SECRET_KEY,
          {
            expiresIn: "6h",
          }
        );
        await generalService.updateDepartmentById(employee.DepartmentID, {
          ManagerID: data.id,
        });
        res.status(200).json({ managerToken });
      } else {
        res.status(200).json("not a manager");
      }
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/manager/verified", (req, res) => {
  try {
    const managerToken = req.headers["x-access-token"];
    if (!managerToken) {
      res.status(401).json("No token provided");
    }

    const SECRET_KEY = "raz-key";
    jwt.verify(managerToken, SECRET_KEY, async (err, data) => {
      if (err) {
        res.status(500).json("Failed to authenticate token");
      }
      res.status(200);
    });
  } catch (error) {
    res(500);
  }
});

module.exports = router;
