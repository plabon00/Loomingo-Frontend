const FormData = require('form-data');
const fetch = require('node-fetch'); // we can just use native fetch if node >= 18

async function upload() {
  try {
    const formData = new FormData();
    // A tiny transparent GIF
    formData.append("file", Buffer.from("R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", "base64"), "test.gif");

    const res = await fetch('https://tmpfiles.org/api/v1/upload', {
      method: "POST",
      body: formData,
    });
    
    const data = await res.json();
    console.log("Response:", data);
    
    // The response is like: { data: { url: 'https://tmpfiles.org/12345/test.gif' } }
    // We want the direct link: https://tmpfiles.org/dl/12345/test.gif
    if (data && data.data && data.data.url) {
      const directUrl = data.data.url.replace("tmpfiles.org/", "tmpfiles.org/dl/");
      console.log("Direct URL:", directUrl);
    }
  } catch (err) {
    console.error("Error:", err);
  }
}

upload();
