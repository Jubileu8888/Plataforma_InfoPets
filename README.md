# 🐾 InfoPets API — v2.0

API REST da plataforma InfoPets, refatorada com boas práticas.

## 📁 Estrutura

```
infopets/
├── src/
│   ├── config/
│   │   ├── database.js       # Pool de conexão MySQL
│   │   └── imgur.js          # Upload de imagens
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   └── advertisement.controller.js
│   ├── middlewares/
│   │   ├── auth.js           # Verifica sessão
│   │   └── upload.js         # Multer
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   └── advertisement.routes.js
│   ├── app.js
│   └── server.js
├── .env.example
├── .gitignore
└── package.json
```

## ⚙️ Instalação

```bash
npm install
cp .env.example .env
# preencha o .env com suas credenciais
```

## ▶️ Rodando

```bash
npm run dev   # desenvolvimento
npm start     # produção
```

## 🔌 Endpoints

### Autenticação — `/api/auth`
| Método | Rota               | Descrição           | Auth |
|--------|--------------------|---------------------|------|
| POST   | `/api/auth/register` | Cadastrar conta   | Não  |
| POST   | `/api/auth/login`    | Fazer login       | Não  |
| POST   | `/api/auth/logout`   | Encerrar sessão   | Sim  |

### Usuário — `/api/user`
| Método | Rota                | Descrição              | Auth |
|--------|---------------------|------------------------|------|
| GET    | `/api/user/session` | Dados da sessão atual  | Sim  |
| GET    | `/api/user/profile` | Perfil completo        | Sim  |
| PUT    | `/api/user/profile` | Atualizar perfil       | Sim  |

### Anúncios — `/api/posts`
| Método | Rota            | Descrição              | Auth |
|--------|-----------------|------------------------|------|
| GET    | `/api/posts`    | Listar todos           | Não  |
| GET    | `/api/posts/:id`| Detalhes de um anúncio | Não  |
| POST   | `/api/posts`    | Criar anúncio          | Sim  |
