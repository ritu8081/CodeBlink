const mongoose = require("mongoose");

const SubSectionSchema = new mongoose.Schema({
	title: { type: String },
	timeDuration: { type: String },
	description: { type: String },
	video: { type: String },
});

module.exports = mongoose.model("SubSection", SubSectionSchema);