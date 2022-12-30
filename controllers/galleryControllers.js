const { StatusCodes } = require('http-status-codes');
const formidable = require('formidable');
const cloudinary = require('cloudinary').v2;


const Card = require('../models/cardModel');


const getAllGalleryCards = async (req, res) => {

    try {

        const allCards = await Card.find({ createdBy: req.body.userId });

        res.status(StatusCodes.OK).send({
            success: true,
            message: 'all gallery cards fetched successfully',
            totalNumberOfCards: allCards.length,
            cards: allCards
        });

    } catch (error) {

        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            success: false,
            message: error.message
        });

    };

};


const postNewGalleryCard = async (req, res) => {

    try {

        const form = formidable({ multiples: true });

        form.parse(req, async (err, fields, files) => {

            const title = fields.title;

            const description = fields.description;

            const galleryUploadedImage = files.image;


            if (galleryUploadedImage.size > (1024 * 1024)) {
                return res.status(StatusCodes.BAD_REQUEST).send({
                    success: false,
                    message: 'the size of image should be maximum of 1mb only'
                });
            };


            const uploadImageToCloudinary = await cloudinary.uploader.upload(galleryUploadedImage.filepath, {
                use_filename: true,
                folder: 'my_gallery_card_project'
            });

            const urlOfUploadedImage = uploadImageToCloudinary.secure_url;

            const newCard = await Card.create({
                title: title,
                description: description,
                galleryImage: urlOfUploadedImage,
                galleryImageId: uploadImageToCloudinary.public_id,
                createdBy: req.body.userId
            });

            res.status(StatusCodes.CREATED).send({
                success: true,
                message: 'added a new card successfully',
                newCard
            });


        });

    } catch (error) {

        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            success: false,
            message: error.message
        });

    };

};


const deleteGalleryCard = async (req, res) => {

    try {

        await Card.findByIdAndRemove(req.params.id);

        res.status(StatusCodes.OK).send({
            success: true,
            message: 'card deleted successfully'
        });

    } catch (error) {

        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            success: false,
            message: error.message
        });

    }

};


const editGalleryCard = (req, res) => {

    try {

        const form = formidable({ multiples: true });

        form.parse(req, async (err, fields, files) => {

            const card = await Card.findById(req.params.id);

            const title = fields.editCardTitle;

            const description = fields.editCardDescription;

            const galleryUploadedImage = files.editCardPhoto;


            if (galleryUploadedImage.size > (1024 * 1024)) {
                return res.status(StatusCodes.BAD_REQUEST).send({
                    success: false,
                    message: 'the size of image should be maximum of 1mb only'
                });
            };

            await cloudinary.uploader.destroy(card.galleryImageId);


            const updatedImage = await cloudinary.uploader.upload(galleryUploadedImage.filepath, {
                use_filename: true,
                folder: 'my_gallery_card_project'
            });


            const urlOfUpdatedImage = updatedImage.secure_url;

            const updatedCard = {
                title: title,
                description: description,
                galleryImage: urlOfUpdatedImage,
                galleryImageId: updatedImage.public_id,
                createdBy: req.body.userId
            };
            

            await Card.findByIdAndUpdate({ _id: req.params.id }, updatedCard, { new: true });

            res.status(StatusCodes.CREATED).send({
                success: true,
                message: 'your card is updated successfully',
            });


        });

    } catch (error) {

        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            success: false,
            message: error.message
        });

    };

};


module.exports = {
    getAllGalleryCards,
    postNewGalleryCard,
    deleteGalleryCard,
    editGalleryCard
};