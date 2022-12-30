const mongoose = require('mongoose');

const conenctDB = () => {

    mongoose.set('strictQuery', true);

    mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            console.log('connection to mongoDB is successful...');
        })
        .catch((error) => {
            console.log(error);
        });

};


module.exports = {
    conenctDB
}