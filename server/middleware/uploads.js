const multer = require('multer');
const path = require('path');

// This tells multer WHERE to save files and WHAT to name them
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // We are temporarily routing everything to the main uploads folder.
    // Later, we can sort them into 'profiles' or 'companies' if needed!
    cb(null, 'uploads/'); 
  },
  filename: function (req, file, cb) {
    // This gives every uploaded file a unique name using the current time 
    // so that two students uploading "resume.pdf" don't overwrite each other.
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});

// Initialize the multer middleware
const upload = multer({ storage: storage });

module.exports = upload;