const db = require('../config/database');

const DEFAULT_AVATAR = 'https://i.imgur.com/Ec85jPb.jpg';

// POST /api/auth/register
const register = async (req, res) => {
  const { name, email, password, confirmpassword, telephone } = req.body;

  if (password !== confirmpassword) {
    return res.status(400).json({ sucesso: false, mensagem: 'As senhas não coincidem.' });
  }

  try {
    const [existing] = await db.query('SELECT id FROM accounts WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ sucesso: false, mensagem: 'E-mail já cadastrado.' });
    }

    await db.query(
      'INSERT INTO accounts (name, email, number, password, image_profille) VALUES (?, ?, ?, ?, ?)',
      [name, email, telephone, password, DEFAULT_AVATAR]
    );

    res.status(201).json({ sucesso: true, mensagem: 'Conta criada com sucesso.' });
  } catch (err) {
    console.error('[register]', err);
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno no servidor.' });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query(
      'SELECT id FROM accounts WHERE email = ? AND password = ?',
      [email, password]
    );

    if (rows.length === 0) {
      return res.status(401).json({ sucesso: false, mensagem: 'Credenciais inválidas.' });
    }

    req.session.sessioninfopets = { id: rows[0].id, email };
    res.status(200).json({ sucesso: true, mensagem: 'Login realizado com sucesso.' });
  } catch (err) {
    console.error('[login]', err);
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno no servidor.' });
  }
};

// POST /api/auth/logout
const logout = (req, res) => {
  req.session.destroy(() => {
    res.status(200).json({ sucesso: true, mensagem: 'Logout realizado.' });
  });
};

module.exports = { register, login, logout };
