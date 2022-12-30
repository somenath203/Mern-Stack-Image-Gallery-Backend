const router = require('express').Router();


const { getAllGalleryCards, postNewGalleryCard, deleteGalleryCard, editGalleryCard } = require('../controllers/galleryControllers');

const { auth } = require('./../middlewares/auth');


router.post('/get-all-cards', auth, getAllGalleryCards);

router.post('/post-new-card', auth, postNewGalleryCard);

router.post('/delete-card/:id', auth, deleteGalleryCard);

router.post('/edit-card/:id', auth, editGalleryCard);


module.exports = router;