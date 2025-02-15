const fs = require("fs");
const https = require("https");
const path = require("path");

const files = [
  {
    url: "https://github.com/justadudewhohacks/face-api.js/raw/master/weights/ssd_mobilenetv1_model-weights_manifest.json",
    filename: "ssd_mobilenetv1_model-weights_manifest.json",
  },
  {
    url: "https://github.com/justadudewhohacks/face-api.js/raw/master/weights/ssd_mobilenetv1_model-shard1",
    filename: "ssd_mobilenetv1_model-shard1",
  },
  {
    url: "https://github.com/justadudewhohacks/face-api.js/raw/master/weights/face_landmark_68_model-weights_manifest.json",
    filename: "face_landmark_68_model-weights_manifest.json",
  },
  {
    url: "https://github.com/justadudewhohacks/face-api.js/raw/master/weights/face_landmark_68_model-shard1",
    filename: "face_landmark_68_model-shard1",
  },
  {
    url: "https://github.com/justadudewhohacks/face-api.js/raw/master/weights/face_recognition_model-weights_manifest.json",
    filename: "face_recognition_model-weights_manifest.json",
  },
  {
    url: "https://github.com/justadudewhohacks/face-api.js/raw/master/weights/face_recognition_model-shard1",
    filename: "face_recognition_model-shard1",
  },
];

const downloadFile = (url, dest) =>
  new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      response.pipe(file);
      file.on("finish", () => {
        file.close(resolve);
      });
    }).on("error", (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });

(async () => {
  const modelPath = path.join(__dirname, "loadmodels");
  if (!fs.existsSync(modelPath)) {
    fs.mkdirSync(modelPath);
  }

  for (const file of files) {
    const dest = path.join(modelPath, file.filename);
    console.log(`Téléchargement de ${file.filename}...`);
    await downloadFile(file.url, dest);
  }
  console.log("Tous les modèles ont été téléchargés avec succès.");
})();
