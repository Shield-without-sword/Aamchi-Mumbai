const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmployeeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    about: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    Breed: {
        type: String,
        required: true
    },
    profileImage: {
        type: String
    },
    capacity: {
        type: Number,
    },
    production: [
        {
            date: {
                type: Date,
                required: true
            },
            amount: {
                type: Number,
                required: true
            }
        }
    ],
    scale: {
        type: String,
        default: "liter/amount"
    },
    startAt: {
        type: Date,
    },
    endAt: {
        type: Date,      
    }
});

const EmployeeModel = mongoose.model('employees', EmployeeSchema);
module.exports = EmployeeModel;
