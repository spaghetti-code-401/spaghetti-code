const mongoose = require('mongoose');

const challengesSchema = {
    name: { type: String, required: true },
    starterCode: { type: String, required: true },
    description: { type: String, required: true },
    input: { type: Array},
    output: { type: Array},
    difficulty: { type: String }
};
const schema=mongoose.Schema(challengesSchema)
const Challenge = mongoose.model('challenges', schema )



module.exports = Challenge