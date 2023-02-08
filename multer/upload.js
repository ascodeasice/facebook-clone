const multer = require('multer');
const upload = multer({
    limits: {
        //  <1MB
        fileSize: 1000000,
    },
    fileFilter(req, file, cb) {
        // only accepts these extensions
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            cb(new Error('Please upload an image'))
        }
        cb(null, true)
    }
})

module.exports = upload;