const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RSVPResponseSchema = new Schema({
    eventId: {
        type: Schema.Types.ObjectId,
        ref: 'employees',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    response: {
        type: String,
        enum: ['going', 'not-going'],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const RSVPResponse = mongoose.model('rsvp_responses', RSVPResponseSchema);
module.exports = RSVPResponse;