const express = require("express");
const cors = require("cors");
const connectDB = require("./config/factoryDB");

const authRouter = require("./routers/authRouter");
const employeeRouter = require("./routers/employeeRouter");
const userRouter = require("./routers/usersRouter");
const departmentRouter = require("./routers/departmentRouter");
const managerRouter = require("./routers/managerRouter");

connectDB();
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/employee", employeeRouter);
app.use("/user", userRouter);
app.use("/department", departmentRouter);
app.use("/manager", managerRouter);

app.listen(PORT, () => {
  console.log(`app listening on http://localhost:${PORT}`);
});
