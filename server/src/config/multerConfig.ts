
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const uploadDir = path.join(__dirname,"..", "uploads", "videos");
    if(!fs.existsSync(uploadDir)){
      fs.mkdirSync(uploadDir, {recursive: true});
    }
    callback(null, uploadDir);
  },
  filename: (req,file:Express.Multer.File,callback) => {
    callback(null, Date.now() + path.extname(file.originalname));
  }
});

const FileFilter = (req:Express.Request, file:Express.Multer.File, callback:FileFilterCallback) => {
  const validTypes = ['video/mp4', 'video/webm']; //TODO ADD SUPPORTED FORMATS
  if(validTypes.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(new Error('Invalid file type.'));
  }
}

export const upload = multer({
  storage: storage,
  fileFilter: FileFilter,
  limits: {fileSize: 200 * 1024*1024} //200MB limit
})