const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const Advisor = require("./models/Advisor");
const Slot = require("./models/Slot");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/thesisbooking")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));


// SEARCH ADVISORS
app.get("/api/advisors/search", async (req, res) => {
    const expertise = req.query.expertise;

    const advisors = await Advisor.find({
        expertise: { $regex: expertise, $options: "i" }
    });

    res.json(advisors);
});


// FILTER SLOTS
app.get("/api/advisors/:id/slots", async (req, res) => {
    try {
        const slots = await Slot.find({
            advisorId: req.params.id,
            status: "Available"
        });

        res.json(slots);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


app.listen(5000, () => {
    console.log("Server Running on Port 5000");
});