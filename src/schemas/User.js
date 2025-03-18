const mongoose = require("mongoose");
const mongooseLeanVirtuals = require('mongoose-lean-virtuals');

const { Schema } = mongoose;


const UserSchema = new Schema({
    name: String
}, {

    /**
     * Name of the collection
     * 
     * @var string
     */
    collection: "authentication:users",

    /**
     * Enable collection timestampts
     * 
     * @var bool
     */
    timestamps: true,
});

UserSchema.pre('save', function (next) {
    this.wasNew = this.isNew;
    next();
});

UserSchema.plugin(mongooseLeanVirtuals);

module.exports = UserSchema;