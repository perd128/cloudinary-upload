const express = require("express");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
const path = require("path");

dotenv.config(); // Wajib di atas cloudinary.config

// Konfigurasi Cloudinary dari file .env
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const app = express();
app.use(fileUpload()); // Tidak gunakan useTempFiles
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.post("/upload", (req, res) => {
  if (!req.files || !req.files.image) {
    return res.status(400).send("Tidak ada file yang diupload.");
  }

  const file = req.files.image;

  const uploadStream = cloudinary.uploader.upload_stream(
    { resource_type: "image" },
    (err, result) => {
      if (err) return res.send("Upload gagal: " + err.message);

      res.send(`
        <div style="text-align: center; padding: 30px; font-family: sans-serif">
          <h2>Gambar berhasil diupload:</h2>
          <img src="${result.secure_url}" alt="Uploaded Image" style="max-width: 90%; border-radius: 12px;" />
          <br/><br/>
          <a href="/" style="text-decoration:none; color:#fff; background:#007bff; padding:10px 20px; border-radius:8px;">Upload Lagi</a>
        </div>
      `);
    }
  );

  // Kirim data buffer gambar ke Cloudinary
  uploadStream.end(file.data);
});

const PORT = process.env.PORT || 3000; // agar bisa diubah Render
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
