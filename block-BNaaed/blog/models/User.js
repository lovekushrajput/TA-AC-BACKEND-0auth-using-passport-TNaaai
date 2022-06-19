let mongoose = require('mongoose')
let Schema = mongoose.Schema

let userSchema = Schema({
    username: { type: String },
    name: { type: String, require: true },
    email: { type: String, require: true, unique: true },
    photo: { type: String }
})


module.exports = mongoose.model('User', userSchema)