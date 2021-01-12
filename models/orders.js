var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var schema = new Schema({
    userId: { type: Number, required: true },
    itemId: { type: Number, required: true }
});