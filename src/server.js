require('dotenv').config();
const fs  = require('fs');
const app = require('./app');

// Garante que a pasta de uploads exista
if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ InfoPets API rodando em http://localhost:${PORT}`);
  console.log(`📦 Ambiente: ${process.env.NODE_ENV || 'development'}`);
});
