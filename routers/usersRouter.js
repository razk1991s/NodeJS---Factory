const express = require("express");
const router = express.Router();

const usersService = require("../services/usersService");

// Entry Point: http://localhost:3000/user

router.get("/", async (req, res) => {
  try {
    const users = await usersService.getAllUsres();
    res.status(200).json(users);
  } catch {
    res.json(400);
  }
});

router.post("/", async (req, res) => {
  try {
    const resp = await usersService.asignUserToEmployee();
    res.status(200).json(resp);
  } catch {
    res.status(400);
  }
});

router.patch("/", async (req, res) => {
  try {
    const { name, lname, time } = req.body;
    const resp = await usersService.useAction(name, lname, time);
    res.status(200).json({ message: resp });
  } catch (err) {
    res.status(400).json("User does not exist");
  }
});

module.exports = router;
