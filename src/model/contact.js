const mongoose = require('mongoose')
const validator = require('validator')

const contactSchema = mongoose.Schema({
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
        required : true,
    },
    msg : {
        type : String,
        required : true,
    },
})

//* collection or model
const Contacts = new mongoose.model('Contacts', contactSchema)

module.exports = Contacts