const multer = require('multer');

// file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // file dir
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);  // timestamps for unq fname
  }
});

const upload = multer({ storage });

module.exports = upload;