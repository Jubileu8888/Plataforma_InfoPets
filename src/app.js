const express = require('express');
const session = require('express-session');
const cors    = require('cors');
const path    = require('path');

const authRoutes          = require('./routes/auth.routes');
const userRoutes          = require('./routes/user.routes');
const advertisementRoutes = require('./routes/advertisement.routes');

const app = express();

// Middlewares globais
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../../public')));

app.use(session({
  secret:            process.env.SESSION_SECRET || 'infopets_secret',
  resave:            false,
  saveUninitialized: false,
  cookie:            { secure: false, maxAge: 1000 * 60 * 60 * 24 },
}));

// Rotas
app.use('/api/auth',  authRoutes);
app.use('/api/user',  userRoutes);
app.use('/api/posts', advertisementRoutes);

// Rota raiz
app.get('/', (req, res) => {
  res.json({ mensagem: '🐾 InfoPets API no ar!', versao: '2.0.0' });
});

// 404
app.use((req, res) => {
  res.status(404).json({ sucesso: false, mensagem: `Rota '${req.originalUrl}' não encontrada.` });
});

// Erro global
app.use((err, req, res, next) => {
  console.error('❌ Erro:', err.message);
  res.status(err.status || 500).json({ sucesso: false, mensagem: err.message || 'Erro interno no servidor.' });
});

module.exports = app;
