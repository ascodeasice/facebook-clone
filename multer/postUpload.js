const multer = require('multer');
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // limit each image to 5 MB
    },
    fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('File must be an image'), false);
        }
        cb(null, true);
    }
});

module.exports = upload;