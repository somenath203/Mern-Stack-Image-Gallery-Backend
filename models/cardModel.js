const mongoose = require('mongoose');


const cardSchema = new mongoose.Schema({
    title: {
        type: String
    },
    description: {
        type: String
    },
    galleryImage: {
        type: String
    },
    galleryImageId: {
        type: String
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});


module.exports = mongoose.model('card', cardSchema);


