const axios = require("axios");
const jf = require("jsonfile");
const path = require("path");

const filePath = path.join(__dirname, "../data/employeesInfo.json");

const URL = "https://jsonplaceholder.typicode.com/users";

// Get the employee full data from the WS

const getAllData = async () => {
  const { data } = await axios.get(URL);
  await jf.writeFile(filePath, data);
};

module.exports = { getAllData };
