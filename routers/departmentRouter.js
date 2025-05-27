const express = require("express");
const router = express.Router();
const generalService = require("../services/generalService");

// Entry Point: http://localhost:3000/department

router.get("/", async (req, res) => {
  try {
    const reqDepartmentName = req.headers["headers-department"];
    const sendData = await generalService.getDepartmentDetail(
      reqDepartmentName
    );
    res.status(200).json(sendData ? sendData : "There is no manager");
  } catch (error) {
    res.status(500).send("There is no manager");
  }
});

router.get("/all", async (req, res) => {
  try {
    const sendData = await generalService.getDepartments();
    res.status(200).json(sendData);
  } catch (error) {
    console.log(error);

    res.status(500);
  }
});

router.get("/detail", async (req, res) => {
  try {
    const sendData = await generalService.getDepartments();
    res.status(200).json(sendData);
  } catch (error) {
    res.status(500).json(console.log(error));
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await generalService.getDepartmentBIyId(id);
    res.status(200).json("Fecthed Department");
  } catch {
    res.status(400);
  }
});

router.post("/", async (req, res) => {
  try {
    const { Name: depName } = req.body;
    const dep = await generalService.addNewDepartment(depName);
    res.status(200).json(dep._id);
  } catch {
    res.status(400);
  }
});

router.put("/", async (req, res) => {
  try {
    const { depId: id, Name: name } = req.body;
    const obj = {
      Name: name,
    };
    await generalService.updateDepartmentById(id, obj);
    res.status(200).json("Updated");
  } catch {
    res.status(400);
  }
});

router.delete("/", (req, res) => {
  try {
    const id = req.headers["x-content-id"];
    generalService.deleteDepartment(id);
    res.status(200).json("Deleted");
  } catch {
    res.status(400).json("Wrong id");
  }
});
module.exports = router;
