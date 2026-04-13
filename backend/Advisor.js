const mongoose = require("mongoose");

const advisorSchema = new mongoose.Schema({
    name: String,
    email: String,
    expertise: [String]
});

const Advisor = mongoose.model("Advisor", advisorSchema);

module.exports = Advisor;