const router = require('express').Router();

const { RegisterUser, LoginUser, getAuthUserInfo, deleteUser, editUser } = require('../controllers/userControllers');
const { auth } = require('./../middlewares/auth');


router.post('/register', RegisterUser);
router.post('/login', LoginUser);
router.post('/get-auth-user-info', auth, getAuthUserInfo);
router.post('/delete-user/:id', auth, deleteUser);
router.post('/edit-user/:id', auth, editUser);



module.exports = router;