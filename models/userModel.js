const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: Number,
    Date: String,
    FullName: {type: mongoose.Schema.Types.String, ref: 'employee'},
    ActionAllowed: Number,
    MaxActions: Number
}, {versionKey: false}
);

const User = mongoose.model('user', userSchema);

module.exports = User;