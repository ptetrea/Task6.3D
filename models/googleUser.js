const mongoose = require("mongoose")
const validator = require("validator")

const bcrypt = require('bcrypt-nodejs')

const passportLocalMongoose = require ('passport-local-mongoose')

const userSchemaGoogle = new mongoose.Schema({
    username: String,
    googleId: String
});

userSchemaGoogle.plugin(passportLocalMongoose);
module.exports = mongoose.model("GoogleUser", userSchemaGoogle)