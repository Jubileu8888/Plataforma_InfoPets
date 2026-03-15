const express       = require('express');
const router        = express.Router();
const { listar, detalhar, criar } = require('../controllers/advertisement.controller');
const { autenticado } = require('../middlewares/auth');
const upload          = require('../middlewares/upload');

router.get('/',     listar);
router.get('/:id',  detalhar);
router.post('/', autenticado, upload.single('image'), criar);

module.exports = router;
