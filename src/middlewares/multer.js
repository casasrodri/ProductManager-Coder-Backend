import multer from 'multer';
import path from 'path';

const createStorage = (destination) => multer.diskStorage({
    destination: `public/uploads/${destination}`,
    filename: (req, file, callback) => {
        const originalName = path.parse(file.originalname).name;
        const timestamp = Date.now();
        const extension = path.extname(file.originalname);
        callback(null, `${timestamp}_${originalName}${extension}`);
    },
});

export const thumbnailsUploader = multer({ storage: createStorage('thumbnails') });
export const profilesUploader = multer({ storage: createStorage('profiles') });
export const productsUploader = multer({ storage: createStorage('products') });
export const documentsUploader = multer({ storage: createStorage('documents') });

