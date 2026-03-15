const express       = require('express');
const router        = express.Router();
const { getProfile, updateProfile, getSession } = require('../controllers/user.controller');
const { autenticado } = require('../middlewares/auth');
const upload          = require('../middlewares/upload');

router.get('/session', autenticado, getSession);
router.get('/profile', autenticado, getProfile);
router.put('/profile', autenticado, upload.single('avatar'), updateProfile);

module.exports = router;
