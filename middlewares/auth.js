const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');

const auth = async (req, res, next) => {

    try {

        const userToken = req.headers.authorization.split(' ')[1];

        const payload = jwt.verify(userToken, process.env.JWT_SECRET);

        req.body.userId = payload.userId;

        next();

    } catch (error) {

        console.log(error);

        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            success: false,
            message: error.message
        });

    }

};


module.exports = {
    auth
}