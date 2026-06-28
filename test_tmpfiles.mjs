async function upload() {
  try {
    const formData = new FormData();
    // A tiny transparent GIF
    const buffer = Buffer.from("R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", "base64");
    formData.append("file", new Blob([buffer], { type: 'image/gif' }), "test.gif");

    const res = await fetch('https://tmpfiles.org/api/v1/upload', {
      method: "POST",
      body: formData,
    });
    
    const data = await res.json();
    console.log("Response:", data);
    
    if (data && data.data && data.data.url) {
      const directUrl = data.data.url.replace("tmpfiles.org/", "tmpfiles.org/dl/");
      console.log("Direct URL:", directUrl);
    }
  } catch (err) {
    console.error("Error:", err);
  }
}

upload();
