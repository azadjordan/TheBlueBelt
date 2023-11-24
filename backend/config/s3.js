import dotenv from "dotenv";
dotenv.config();
import path from "path";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";



const s3Client = new S3Client({
    region: process.env.AWS_BUCKET_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

const upload = multer({
    storage: multerS3({
        s3: s3Client,
        bucket: process.env.AWS_BUCKET_NAME,
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            const fileName = Date.now().toString() + "-" + file.originalname;
            cb(null, fileName);
        }
    }),
    fileFilter: function (req, file, cb) {
        const filetypes = /jpe?g|png|webp/;
        const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = mimetypes.test(file.mimetype);

        if (extname && mimetype) {
            cb(null, true);
        } else {
            cb(new Error('Images only!'), false);
        }
    }
});

export const deleteImage = async (Key) => {
    try {
        const output = await s3Client.send(
            new DeleteObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key,
            })
        );
        return output;

    } catch (error) {
        throw error;
    }
};

export default upload;