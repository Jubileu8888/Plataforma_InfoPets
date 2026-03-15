const autenticado = (req, res, next) => {
  if (req.session && req.session.sessioninfopets) {
    return next();
  }
  res.status(401).json({ sucesso: false, mensagem: 'Não autorizado. Faça login.' });
};

module.exports = { autenticado };
