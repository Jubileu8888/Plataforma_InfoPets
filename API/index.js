const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const FormData = require('form-data');
const axios = require('axios');
const KEY = process.env.CHAVE;
const PASSWORD_DATABASE = process.env.PASS_DATA
const CLIENT_ID_IMGUR = process.env.CLIENT_ID

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: `${PASSWORD_DATABASE}`,
    database: 'data_infopets'
});

const app = express();
const port = 3000;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') 
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname) 
  }
});
const upload = multer({ storage: storage });

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: KEY,
  resave: true,
  saveUninitialized: true
})); 

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/home/index.html'), (err) => {
    if (err) {
        console.error('Erro ao enviar arquivo:', err);
        res.status(err.status).end();
      }
  });
})

app.get('/api/verifyprofile', (req, res) => {
    if (req.session.sessioninfopets) {
      const ID = req.session.sessioninfopets.id;
      const QueryName = "SELECT name, image_profille   FROM accounts WHERE id = ?";
      connection.query(QueryName, [ID], (InsertError, insertResults) => {
        if (InsertError) {
          res.send("Erro interno no servidor..")
        } else {
          const resultsArray = [];
          const nome = insertResults[0].name
          const img = insertResults[0].image_profille
          const test = {
            nome: nome,
            img: img
          }
          resultsArray.push(test);
          res.send(resultsArray)
        }
      });
  } else {
      res.send(`NaN`);
  }
});

// Verifica se ta logado e deixa onde o usuario está
app.get('/api/verify', (req, res) => {
  if (req.session.sessioninfopets) {
    return;
  } else {
    res.sendFile(path.join(__dirname, '../public/page_login/login/index.html'), (err) => {
      if (err) {
          console.error('Erro ao enviar arquivo:', err);
          res.status(err.status).end();
        }
    });
  }
});

app.get('/api/verify2', (req, res) => {
  if (req.session.sessioninfopets) {
    res.redirect('/home/index.html')
  } else {
    return;
  }
});

app.post('/api/post', upload.single('image'), async (req, res) => {
  var namepet = req.namepet;
  var racapet = req.racapet;
  var email = req.email;
  var phone = req.telephone;
  var image = req.file;
  var ID = req.session.sessioninfopets.id;

  function readImageFile(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
  }

  function deleteLocalImage(filePath) {
    return new Promise((resolve, reject) => {
        fs.unlink(filePath, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
  }

  async function uploadImageToImgur(imageData) {
    try {
        const response = await axios.post('https://api.imgur.com/3/image', {
            image: imageData.toString('base64')
        }, {
            headers: {
                'Authorization': `Client-ID ${CLIENT_ID_IMGUR}`
            }
        });
        return response.data.data.link;
    } catch (error) {
        console.error('Erro ao fazer upload da imagem para o Imgur:', error);
        throw error;
    }
  }

  var imagePath = __dirname + `/uploads/${image.filename}`;

  (async () => {
    try {
        const imageData = await readImageFile(imagePath);
        const imgUrl = await uploadImageToImgur(imageData);
        console.log('Imagem enviada com sucesso para o Imgur. Link:', imgUrl);
        await deleteLocalImage(imagePath);
        
        const QueryPost = "INSERT INTO advertisement (namepet, racapet, email, phone, images, id_profille) VALUES (?, ?, ?, ?, ?, ?)";
        connection.query(QueryPost, [namepet, racapet, email, phone, imgUrl, ID], (insertError, insertResults) => {
          if (insertError) {
            res.status(500).send("Erro interno no servidor.")
          } else {
            res.send('FOI');
          }
        })
        
    } catch (error) {
      await deleteLocalImage(imagePath);
        console.error('Erro:', error);
    }
})();
});

app.get('/api/srcposts', (req, res) => {
  const QuerySrc = "SELECT id, namepet, racapet, email, phone, images, id_profille FROM advertisement";

  connection.query(QuerySrc, (err, results) => {
    if (err) {
      console.log('erro interno no servidor');
      console.log(err)
    }
    console.log(results)
    res.send(results)
  })
})

app.post('/api/details', (req, res) => {
  const id = req.body.id;
  console.log(`O ID é : ${id}`);

  const QuerySrc = "SELECT title, description, images, id_profille FROM advertisement WHERE id = ?";
  connection.query(QuerySrc, [id], (err, advertisementResults) => {
    if (err) {
      console.log("Erro interno no servidor.");
      console.log(err);
      res.status(500).send("Erro interno no servidor");
      return;
    }

    const advertisement = advertisementResults[0];
    const id_profille = advertisement.id_profille;

    const QueryClient = "SELECT name, image_profille FROM accounts WHERE id = ?";
    connection.query(QueryClient, [id_profille], (err, accountResults) => {
      if (err) {
        console.log(`Erro interno no servidor ${err}`);
        res.status(500).send("Erro interno no servidor");
        return;
      }

      const user = accountResults[0];

      console.log(advertisement)
      console.log(user)
      
      // Agrupa os dados e envia como resposta
      res.json({
        advertisement: advertisement,
        account: user
      });
    });
  });
});


app.post('/api/save', upload.single('avatar'), async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const phone = req.body.phone;
  const avatar = req.file;
  const ID = req.session.sessioninfopets.id;
  var imgno = false;
  
  function readImageFile(filePath) {
      return new Promise((resolve, reject) => {
          fs.readFile(filePath, (err, data) => {
              if (err) {
                  reject(err);
              } else {
                  resolve(data);
              }
          });
      });
  }

  function deleteLocalImage(filePath) {
    return new Promise((resolve, reject) => {
        fs.unlink(filePath, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
  }

  async function uploadImageToImgur(imageData) {
      try {
          const response = await axios.post('https://api.imgur.com/3/image', {
              image: imageData.toString('base64')
          }, {
              headers: {
                  'Authorization': `Client-ID ${CLIENT_ID_IMGUR}`
              }
          });
          return response.data.data.link;
      } catch (error) {
          console.error('Erro ao fazer upload da imagem para o Imgur:', error);
          throw error;
      }
  }
  try {
    var imagePath = __dirname + `/uploads/${avatar.filename}`;
  } catch (error) {
    console.log("sem img");
    imgno = true;
  }

  (async () => {
    try {
          if (imgno == false) {
            const imageData = await readImageFile(imagePath);
            const imgUrl = await uploadImageToImgur(imageData);
            console.log('Imagem enviada com sucesso para o Imgur. Link:', imgUrl);
            await deleteLocalImage(imagePath);
            const Queryupdate = "UPDATE accounts SET name = ?, email = ?, number = ?, image_profille = ? WHERE id = ?";
            connection.query(Queryupdate, [name, email, phone, imgUrl, ID], (err, results) => {
              if (err) {
                console.log(err);
                res.status(500).send("Erro interno no servidor.");
              } else {
                console.log("Foi")
                res.send('foi')
              }
          });
        } else {
          const QueryUpdate = "UPDATE accounts SET name= ?, email = ?, number = ? WHERE id = ?";
          connection.query(QueryUpdate, [name,email,phone,ID], (err, results) => {
            if (err) {
              console.log(err);
              res.status(500).send("Erro interno no servidor.");
            } else {
              console.log("Foi");
              res.send('foi');
            }
          });
        }
      } catch (error) {
        if (imgno == false) { 
          await deleteLocalImage(imagePath);
        }
        console.error('Erro:', error);
      }
  })();
});


app.get('/api/getedit', (req, res) => {
  if (req.session.sessioninfopets) {
    const ID = req.session.sessioninfopets.id;
    const Queryinfo = "SELECT name, image_profille, email, number FROM accounts WHERE id = ?";
    connection.query(Queryinfo, [ID], (InsertError, insertResults) => {
        if (InsertError) {
          res.send("Erro insterno no servidor...");
        } else {
          const resultsArray = [];
          const name = insertResults[0].name;
          const img = insertResults[0].image_profille;
          const email = insertResults[0].email;
          const telephone = insertResults[0].number;
          const results = {
            name: name,
            img: img,
            email: email,
            telephone: telephone
          };
          resultsArray.push(results);
          res.send(resultsArray);
        }
    });
  } else {
    res.send("NaN");
  }
});

app.get('/api/getinfo', (req, res) => {
  if (req.session.sessioninfopets) {
    const ID = req.session.sessioninfopets.id;
    const QueryInfo = "SELECT name, image_profille FROM accounts WHERE id = ?";
    connection.query(QueryInfo, [ID], (InsertError, insertResults) => {
      if (InsertError) {
        res.send("Erro interno no servidor...")
      } else {
        const resultsArray = [];
        const name = insertResults[0].name;
        const avatar = insertResults[0].image_profille;
        const results = {
          name: name,
          img: avatar.toString('base64')
        }
        resultsArray.push(results);
        res.send(resultsArray);
      };
    });
  } else {
    res.send("NaN")
  };
});


app.post('/api/register', (req, res) => {
    const {name, email, password, confirmpassword, telephone} = req.body;
    const CheckExistingQuery = 'SELECT * FROM accounts WHERE email = ?';
    connection.query(CheckExistingQuery, [email], (checkError, checkResults, checkFields) => {
        if(checkError) {
            console.error('Erro ao verificar cadastro existente:', checkError);
            res.status(500).send('Erro interno no servidor.');
        } else {
            if (checkResults.length > 0) {
                res.send('E-mail já cadastrado.');
            } else {
              const img = "https://i.imgur.com/Ec85jPb.jpg"
                const QueryRegister = "INSERT INTO accounts (name, email, number, password, image_profille) VALUES (?, ?, ?, ?, ?)";
                connection.query(QueryRegister, [name, email, telephone, password, img], (insertError, insertResults, insertFields) => {
                    if (insertError) {
                      console.error('Erro ao cadastrar cliente:', insertError);
                      res.status(500).send('Erro interno do servidor');
                    } else {
                      res.redirect('/page_login/login/index.html');
                    };
                });
            };
        };
    });
});

app.post('/api/login', (req, res) => {
    const {email, password} = req.body;
    const CheckExistingAccount = "SELECT id FROM accounts WHERE email = ? AND password = ?"
    connection.query(CheckExistingAccount, [email, password], (insertError, insertResults) => {
        if (insertError) {
          console.error('Erro ao verificar cadastro existente:', checkError);
          res.send('Erro interno no servidor.')
        } else {
          if (insertResults.length > 0) {
            console.log(`LOGOU ID=${insertResults[0].id}`)
            req.session.sessioninfopets = {
              id: insertResults[0].id,
              email: email
            }
            res.redirect('/home/index.html')
          } else {
            res.status(401).send('Credenciais inválidas');
          }
        };
    });
});




app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
