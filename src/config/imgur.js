const axios = require('axios');
const fs    = require('fs');
const path  = require('path');

const uploadToImgur = async (filePath) => {
  const imageData = fs.readFileSync(filePath);
  const base64    = imageData.toString('base64');

  const response = await axios.post(
    'https://api.imgur.com/3/image',
    { image: base64 },
    { headers: { Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}` } }
  );

  fs.unlinkSync(filePath);
  return response.data.data.link;
};

module.exports = { uploadToImgur };
