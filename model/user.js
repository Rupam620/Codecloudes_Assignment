const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    usertype: {type: Boolean},
    username: {type: String , required: true, unique: true},
    password: {type: String , required: true},
    
    long: {type: Number, default:0},
    lat: {type: Number, default:0}
    
},{
    collection: 'users'
});

const userModel = mongoose.model('UserSchema', UserSchema);

module.exports = userModel;