const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
  {
    Name: String,
    ManagerID: { type: mongoose.Schema.Types.ObjectId, ref: "employee" },
  },
  { versionKey: false }
);

const Department = mongoose.model("department", departmentSchema);

module.exports = Department;
