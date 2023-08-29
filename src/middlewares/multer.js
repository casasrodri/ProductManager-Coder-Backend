import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: 'public/thumbnails',
    filename: (req, file, callback) => {
        const originalName = path.parse(file.originalname).name;
        const timestamp = Date.now();
        const extension = path.extname(file.originalname);
        callback(null, `${originalName}_${timestamp}${extension}`);
    },
});

const thumbnailsUploader = multer({ storage });

export { thumbnailsUploader };
