const db             = require('../config/database');
const { uploadToImgur } = require('../config/imgur');

// GET /api/user/profile
const getProfile = async (req, res) => {
  const id = req.session.sessioninfopets.id;
  try {
    const [rows] = await db.query(
      'SELECT name, email, number, image_profille FROM accounts WHERE id = ?',
      [id]
    );
    res.status(200).json({ sucesso: true, dados: rows[0] });
  } catch (err) {
    console.error('[getProfile]', err);
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno no servidor.' });
  }
};

// PUT /api/user/profile
const updateProfile = async (req, res) => {
  const id   = req.session.sessioninfopets.id;
  const { name, email, phone } = req.body;

  try {
    let imgUrl = null;

    if (req.file) {
      imgUrl = await uploadToImgur(req.file.path);
      await db.query(
        'UPDATE accounts SET name = ?, email = ?, number = ?, image_profille = ? WHERE id = ?',
        [name, email, phone, imgUrl, id]
      );
    } else {
      await db.query(
        'UPDATE accounts SET name = ?, email = ?, number = ? WHERE id = ?',
        [name, email, phone, id]
      );
    }

    res.status(200).json({ sucesso: true, mensagem: 'Perfil atualizado com sucesso.' });
  } catch (err) {
    console.error('[updateProfile]', err);
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno no servidor.' });
  }
};

// GET /api/user/session
const getSession = async (req, res) => {
  const id = req.session.sessioninfopets.id;
  try {
    const [rows] = await db.query(
      'SELECT name, image_profille FROM accounts WHERE id = ?',
      [id]
    );
    res.status(200).json({ sucesso: true, dados: rows[0] });
  } catch (err) {
    console.error('[getSession]', err);
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno no servidor.' });
  }
};

module.exports = { getProfile, updateProfile, getSession };
