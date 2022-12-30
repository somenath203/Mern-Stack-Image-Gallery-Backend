const { StatusCodes } = require('http-status-codes');
const formidable = require('formidable');
const cloudinary = require('cloudinary').v2;

const User = require('./../models/userModel');
const Card = require('./../models/cardModel');


const RegisterUser = (req, res) => {

    try {

        const form = formidable({ multiples: true });


        form.parse(req, async (err, fields, files) => {

            const fullname = fields.fullname;

            const email = fields.email;

            const password = fields.password;

            const profilePic = files.profilePicture;


            if (await User.findOne({ email: fields.email })) {
                return res.status(StatusCodes.BAD_REQUEST).send({
                    success: false,
                    message: 'user with this emailID already exists'
                });
            };


            if (profilePic.size > (1024 * 1024)) {
                return res.status(StatusCodes.BAD_REQUEST).send({
                    success: false,
                    message: 'the size of image should be maximum of 1mb only'
                });
            }


            const uploadProfileImgToCloudinary = await cloudinary.uploader.upload(profilePic.filepath, {
                use_filename: true,
                folder: 'gallery_img_proj_profile_pic'
            });


            const newUser = await User.create({
                fullname: fullname,
                email: email,
                password: password,
                profilePicture: uploadProfileImgToCloudinary.secure_url,
                profilePicId: uploadProfileImgToCloudinary.public_id
            });


            const token = await newUser.generateToken();


            res.status(StatusCodes.CREATED).send({
                success: true,
                message: 'you have created your account successfully',
                data: token
            });

        })


    } catch (error) {

        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            success: false,
            data: error.message
        });

    };

};


const LoginUser = async (req, res) => {

    try {

        const user = await User.findOne({ email: req.body.email })

        if (!user) {
            return res.status(StatusCodes.BAD_REQUEST).send({
                success: false,
                message: 'invalid login credentials'
            });
        };

        const validatePassword = await user.comparePassword(req.body.password);

        if (!validatePassword) {
            return res.status(StatusCodes.BAD_REQUEST).send({
                success: false,
                message: 'invalid login credentials'
            });
        };

        const token = await user.generateToken();


        res.status(StatusCodes.OK).send({
            success: true,
            message: 'you have logged in successfully',
            data: token
        });

    } catch (error) {

        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            success: false,
            message: error.message
        });

    };

};


const getAuthUserInfo = async (req, res) => {

    const user = await User.findById(req.body.userId);

    const userFullName = user.fullname;

    const userEmailAddress = user.email;

    const userProfilePicture = user.profilePicture;

    try {

        res.status(StatusCodes.OK).send({
            success: true,
            message: 'details of user has been fetched successfully',
            userDetails: {
                userId: req.body.userId,
                userFullName,
                userEmailAddress,
                userProfilePicture
            }
        });

    } catch (error) {

        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            success: false,
            message: error.message
        });

    };

};

const deleteUser = async (req, res) => {

    try {

        await User.findByIdAndRemove(req.params.id);

        await Card.deleteMany({ createdBy: req.body.userId });

        res.status(StatusCodes.OK).send({
            success: true,
            message: 'your account has been deleted successfully'
        });

    } catch (error) {

        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            success: false,
            message: error.message
        });

    };

};


const editUser = async (req, res) => {

    try {

        const form = formidable({ multiples: true });

        form.parse(req, async (err, fields, files) => {

            const user = await User.findById(req.params.id);


            const fullname = fields.editFullName;

            const email = fields.editEmail;

            const profilePic = files.editProfilePic;


            if (profilePic.size > (1024 * 1024)) {
                return res.status(StatusCodes.BAD_REQUEST).send({
                    success: false,
                    message: 'the size of image should be maximum of 1mb only'
                });
            }


            await cloudinary.uploader.destroy(user.profilePicId);

            const uploadedPic = await cloudinary.uploader.upload(profilePic.filepath, {
                folder: 'gallery_img_proj_profile_pic'
            });

            const updatedProfileInfo = {
                fullname: fullname,
                email: email,
                profilePicture: uploadedPic.secure_url,
                profilePicId: uploadedPic.public_id
            };


            await User.findByIdAndUpdate({_id: req.params.id}, updatedProfileInfo, { new: true });

            res.status(200).send({
                success: true,
                message: 'your details has been updated successfully. Now, please login with your new emailID',
            });


        })

    } catch (error) {

        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            success: false,
            message: error.message
        });

    }
}


module.exports = {
    RegisterUser,
    LoginUser,
    getAuthUserInfo,
    deleteUser,
    editUser
}