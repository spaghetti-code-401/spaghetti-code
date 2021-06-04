'use strict';

const mongoose = require('mongoose');

const userSchema = {
    username: { type: String, required: true },
    password: { type: String, required: true }
};
const schema = mongoose.Schema(userSchema);

// bcrypt password before save
// userSchema.pre('save', async function() {
//     this.password = await bcrypt.hash(this.password, 10);
// });

const User = mongoose.model('user', schema )

module.exports = User