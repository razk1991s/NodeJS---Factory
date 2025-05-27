const mongoose = require('mongoose');

const connectDB = async () =>{
    await mongoose.connect(`mongodb://127.0.0.1:27017/factoryDB`)
    .then(console.log('Connected to mongoose'))
    .catch(err=>console.log(`Failed to connect` + err));
}

module.exports = connectDB;