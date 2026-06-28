const fs = require('fs');

async function upload() {
  try {
    console.log("Starting upload...");
    const apiKey = "69c3a3250b73c9db60b29ce37d9a8c6c";
    
    // Create a dummy image file
    const formData = new FormData();
    // In Node.js, we can use a Blob or just pass a base64 string
    formData.append("image", "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"); 

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: formData,
    });
    
    console.log("Response status:", res.status);
    const data = await res.json();
    console.log("Response data:", data);
  } catch (err) {
    console.error("Error:", err);
  }
}

upload();
