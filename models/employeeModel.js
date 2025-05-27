const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    id: String,
    FirstName: { type: String, required: true, match: /^[a-zA-Z. ]+$/ },
    LastName: String,
    StartWork: Number,
    DepartmentID: { type: mongoose.Schema.Types.ObjectId, ref: "department" },
    Email: { type: String, required: true },
  },
  { versionKey: false }
);

const Employee = mongoose.model("employee", employeeSchema);

module.exports = Employee;
