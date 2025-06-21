const mongoose = require('mongoose');

const CardSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    list: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'List'
    },
    board: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Board'
    },
    assignees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    dueDate: {
        type: Date
    },
    labels: [
        {
            type: String
        }
    ],
}, { timestamps: true });


module.exports = mongoose.model('Card', CardSchema);