const fs = require('fs');
const fetch = require('node-fetch');
const FormData = require('form-data');

async function uploadImage() {
  try {
    const filePath = 'C:/Users/tanuj/Code/Torus/Frontend/test.jpg';
    const url = 'https://backend-26ufgpn3sq-uc.a.run.app/api/upload?file';

    const formData = new FormData();
    formData.append('image', fs.createReadStream(filePath), { filename: 'test.jpg' });

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      headers: {
        ...formData.getHeaders(),
      },
    });

    const responseData = await response.json();
    console.log('Response:', responseData);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

uploadImage();
