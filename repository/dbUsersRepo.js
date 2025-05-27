const path = require('path');
const jf = require('jsonfile');
const filePath = path.join(__dirname, '../data/users.json');

const User = require("../models/userModel");

//To get the users and json file
const getUsers = async (filter) => {
  const users = await User.find(filter);
  return users;
};

// Get the employee collection data from the DB and adds it to the use collection in the DB
const addNewUser = async (obj) => {
  const user = new User(obj);
  const file = await jf.readFile(filePath);
  const userFile = file.users.push(user);
  await jf.writeFile(filePath, userFile);
  return await user.save();
};

const addNewUserByParm = async (name , lname) => {
  const dateArr = (new Date()).toString().split(' ')
  const date = dateArr[0] + ' ' +  dateArr[1] + ' '  + dateArr[2] + ' '  + dateArr[3]
  const user = {
    Date: date,
    FullName: name + ' ' + lname,
    ActionAllowed: 5,
    MaxActions: 7
  }
  const newUser =  new User(user);
  return await newUser.save();
};


const findUserByName = async (name) => {
  try {
    await User.findOne({ FullName: name });
  } catch (err) {
    console.log(err);
  }
};

const resetActions = async (name, obj) => {
  try {
    return await User.findOneAndUpdate({ FullName: name }, obj);
  } catch (err) {
    console.log(err);
  }
};

const getUserByName = async (fname, lname) => {
  const name = fname + ' ' + lname;
  return await User.findOne({ FullName: name });
};

const updateUser = async (id, obj) => {
    return await User.findByIdAndUpdate(id, obj);
};


module.exports = {
  getUsers,
  addNewUser,
  findUserByName,
  resetActions,
  getUserByName,
  updateUser,
  addNewUserByParm
};
