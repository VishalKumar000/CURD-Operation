const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
        validate(val) {
            if(!validator.isEmail(val)) {
                throw new Error('Invalid Email')
            }
        },
    },
    phone : {
        type : String,
        minlength : 10,
        maxlength : 10,
        required : true,
    },
    created : {
        type : Date,
        required : true,
        default : Date.now,
    },
    pan : {
        type: String,
        minlength : 10,
        maxlength : 10,
        required : true,
    },
    dob : {
        type : Date,
        required : true,
        default : Date.now
    },
    unit : {
        type : String,
        required : true,
    },
    paid : {
        type : Boolean,
        required : true,
        default : false,
    }
})

//* collection or model
const Users = new mongoose.model('User', userSchema)

module.exports = Users