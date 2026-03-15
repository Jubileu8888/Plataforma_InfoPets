const db                = require('../config/database');
const { uploadToImgur } = require('../config/imgur');

// GET /api/posts
const listar = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, namepet, racapet, email, phone, images, id_profille FROM advertisement'
    );
    res.status(200).json({ sucesso: true, dados: rows });
  } catch (err) {
    console.error('[listar]', err);
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno no servidor.' });
  }
};

// GET /api/posts/:id
const detalhar = async (req, res) => {
  const { id } = req.params;
  try {
    const [adRows] = await db.query(
      'SELECT namepet, racapet, email, phone, images, id_profille FROM advertisement WHERE id = ?',
      [id]
    );

    if (adRows.length === 0) {
      return res.status(404).json({ sucesso: false, mensagem: 'Anúncio não encontrado.' });
    }

    const anuncio = adRows[0];
    const [accRows] = await db.query(
      'SELECT name, image_profille FROM accounts WHERE id = ?',
      [anuncio.id_profille]
    );

    res.status(200).json({
      sucesso: true,
      dados: {
        anuncio,
        dono: accRows[0] || null,
      },
    });
  } catch (err) {
    console.error('[detalhar]', err);
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno no servidor.' });
  }
};

// POST /api/posts
const criar = async (req, res) => {
  const { namepet, racapet, email, phone } = req.body;
  const id = req.session.sessioninfopets.id;

  if (!req.file) {
    return res.status(400).json({ sucesso: false, mensagem: 'Imagem obrigatória.' });
  }

  try {
    const imgUrl = await uploadToImgur(req.file.path);
    await db.query(
      'INSERT INTO advertisement (namepet, racapet, email, phone, images, id_profille) VALUES (?, ?, ?, ?, ?, ?)',
      [namepet, racapet, email, phone, imgUrl, id]
    );
    res.status(201).json({ sucesso: true, mensagem: 'Anúncio criado com sucesso.' });
  } catch (err) {
    console.error('[criar]', err);
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno no servidor.' });
  }
};

module.exports = { listar, detalhar, criar };
