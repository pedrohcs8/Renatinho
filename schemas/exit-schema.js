const mongoose = require("mongoose");

const reqString = {
  type: String,
  required: true,
};

const exitSchema = mongoose.Schema({
  _id: reqString,
  channelId: reqString,
});

module.exports = mongoose.model("renato-saída", exitSchema);
